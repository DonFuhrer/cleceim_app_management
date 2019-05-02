# -*- coding: utf-8 -*-
# Copyright (c) 2018, vazdan and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Textil(Document):
	pass

@frappe.whitelist()
def get_default_warehouse():
	wip_warehouse = frappe.db.get_single_value("Ajustes", "default_wip_warehouse")
	fg_warehouse = frappe.db.get_single_value("Ajustes", "default_fg_warehouse")
	return {"wip_warehouse": wip_warehouse, "fg_warehouse": fg_warehouse}

@frappe.whitelist()
def get_default_root_file_path():
	root_file_path = frappe.db.get_single_value("Ajustes", "default_root_file_path")
	return {"root_file_path": root_file_path}
