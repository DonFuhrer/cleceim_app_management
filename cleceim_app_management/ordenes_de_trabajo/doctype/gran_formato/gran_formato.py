# -*- coding: utf-8 -*-
# Copyright (c) 2018, vazdan and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import json
from frappe import _
from frappe.utils import flt, cint
from frappe.model.document import Document
from erpnext.stock.stock_balance import get_planned_qty, update_bin_qty
from erpnext.stock.utils import get_bin, validate_warehouse_company, get_latest_stock_qty

class GranFormato(Document):
	def update_planned_qty(self):
		update_bin_qty(self.production_item, self.fg_warehouse, {
			"planned_qty": get_planned_qty(self.production_item, self.fg_warehouse)
		})

	def update_status(self, status=None):
		'''Update status of production order if unknown'''
		if status != "Stopped":
			status = self.get_status(status)

		if status != self.status:
			self.db_set("status", status)

		self.update_required_items()

		return status

	def get_status(self, status=None):
		'''Return the status based on stock entries against this production_order'''
		if not status:
			status = self.status

		if self.docstatus==0:
			status = 'Draft'
		elif self.docstatus==1:
			if status != 'Stopped':
				stock_entries = frappe._dict("""
					select purpose, sum(fg_completed_qty) from `tabStock Entry`
					where production_order=%s and docstatus=1
					group by purpose
				""", self.name)

				status = "Not started"
				if stock_entries:
					status = "In Process"
					produced_qty = stock_entries.get("Manufacture")
					if flt(produced_qty)==flt(self.qty):
						status = "Completed"
		else:
			status = 'Cancelled'

			return status

	def update_required_items(self):
		'''
		update bin reserved_qty_for_production
		called from Stock Entry for production, after submit, cancel
		'''

		if self.docstatus==1:
			# calculate transferred qty based on submitted stock entries
			self.update_transferred_qty_for_required_items()

			# update in bin
			self.update_reserved_qty_for_production()

	def update_reserved_qty_for_production(self, items=None):
		'''update reserved_qty_for_production in bins'''
		for d in self.required_items:
			if d.source_warehouse:
				stock_bin = get_bin(d.item_code, d.source_warehouse)
				stock_bin.update_reserved_qty_for_production()

	def update_transferred_qty_for_required_items(self):
		'''update transferred qty from submitted stock entries for that item against
				the production order'''

		for d in self.required_items:
			transferred_qty = frappe.db.sql("""
				select sum(qty)
				from `tabStock Entry` entry, `tabStock Entry Detail` detail
				where
					entry.production_order=%s
					and entry.purpose="Material Transfer for Manufacture"
					and entry.docstatus=1
					and detail.parent=entry.name
					and detail.item_code=%s
			""", (self.name, d.item_code))[0][0]

			d.db_set('transferred_qty', flt(transferred_qty), update_modified=False)

@frappe.whitelist()
def stop_unstop(production_order, status):
	"""Called from client side on Stop/Unstop event"""

	if not frappe.has_permission("Gran Formato", "write"):
		frappe.throw(_("Not permitted"), frappe.PermissionError)

	w_order = frappe.get_doc("Gran Formato", production_order)
	w_order.update_status(status)
	w_order.update_planned_qty()

	if status=='Stopped':
		frappe.msgprint("La \xF3rden de trabajo ha sido detenida", "Actualizaci\xF3n de \xF3rden de trabajo")
	elif status=='Resumed':
		frappe.msgprint("La \xF3rden de trabajo ha sido reanudada", "Actualizaci\xF3n de \xF3rden de trabajo")

	w_order.notify_update()

	return w_order.status

@frappe.whitelist()
def get_item_details(item, project=None):
	res = frappe.db.sql("""
		select stock_uom, description from `tabItem`
		where disabled=0
			and (end_of_life is null or end_of_life='0000-00-00' or end_of_life > %s)
			and name=%s
	""", (nowdate(), item), as_dict=1)

	if not res:
		return {}

	res = res[0]

	filters = {"item": item, "is_default": 1}

	if project:
		filters = {"item": item, "project": project}

	res["bom_no"] = frappe.db.get_value("BOM", filters = filters)

	if not res["bom_no"]:
		variant_of = frappe.db.get_value("Item", item, "variant_of")

		if variant_of:
			res["bom_no"] = frappe.db.get_value("BOM", filters={"item": variant_of, "is_default": 1})

	if not res["bom_no"]:
		if project:
			res = get_item_details(item)
			frappe.msgprint(_("Default BOM not found for Item {0} and Project {1}").format(item, project))
		else:
			frappe.throw(_("Default BOM for {0} not found").format(item))

	res['project'] = project or frappe.db.get_value('BOM', res['bom_no'], 'project')
	res.update(check_if_scrap_warehouse_mandatory(res["bom_no"]))

	return res

@frappe.whitelist()
def check_if_scrap_warehouse_mandatory(bom_no):
	res = {"set_scrap_wh_mandatory": False}

	if bom_no:
		bom = frappe.get_doc("BOM", bom_no)

		if len(bom.scrap_item) > 0:
			res["set_scrap_wh_mandatory"] = True

	return res

@frappe.whitelist()
def make_stock_entry(production_order_id, purpose, qty=0):
	production_order = frappe.get_doc("Gran Formato", production_order_id);

	if not frappe.db.get_value("Warehouse", production_order.wip_warehouse, "is_group"):
		wip_warehouse = production_order.wip_warehouse
	else:
		wip_warehouse = None

	stock_entry = frappe.new_doc("Stock Entry")
	stock_entry.purpose = purpose
	stock_entry.production_order = production_order_id
	#stock_entry.company = production_order.company
	stock_entry.from_bom = 1
	stock_entry.bom_no = production_order.bom_no
	stock_entry.fg_completed_qty = qty or (flt(production_order.qty) - flt(production_order.produced_qty))

	if purpose=="Material Transfer for Manufacture":
		stock_entry.to_warehouse = wip_warehouse
	else:
		stock_entry.from_warehouse = production_order.wip_warehouse
		stock_entry.to_warehouse = production_order.fg_warehouse
		#additional_costs = get_additional_costs(production_order, fg_qty=stock_entry.fg_completed_qty)
		#stock_entry.set("additional_costs", additional_costs)

	stock_entry.get_items()
	return stock_entry.as_dict()

@frappe.whitelist()
def get_default_warehouse():
	wip_warehouse = frappe.db.get_single_value("Manufacturing Settings", "default_wip_warehouse")
	fg_warehouse  = frappe.db.get_single_value("Manufacturing Settings", "default_fg_warehouse")
	return {"wip_warehouse": wip_warehouse, "fg_warehouse": fg_warehouse} 
