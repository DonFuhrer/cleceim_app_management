// Copyright (c) 2018, vazdan and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gran Formato',
{
	setup: function (frm)
	{
		frm.set_query("bom_no", function() {
			if (frm.doc.production_item && frm.doc.item_type == "Compuesto")`{
				return {
					query: "erpnext.controllers.queries.bom",
					filters: {item: cstr(frm.doc.production_item)}
				};
			} else msgprint("Primero debes introducir el art\xEDculo a manufacturar");
		});
	},

	refresh: function (frm)
	{
		frm.set_intro("");
		if (frm.doc.docstatus === 0 && !frm.doc.__islocal)
			frm.set_intro("Valida la \xF3rden de trabajo para procesarla.");

		if (frm.doc.docstatus === 1) {
			cleceim_app_management.set_custom_buttons(frm, frm.doc.status);
			frm.trigger('show_progress');
		}
	},

	show_progress: function (frm)
	{
		var bars = [];
		var message = '';
		var added_min = false;
		var title = '';

		// produced qty
		switch (frm.doc.produced_qty) {
			case 0: 
				title = 'Ning\xFAn art\xEDculo producido';
				break;
			case 1: 
				title = '1 art\xEDculo producido';
				break;
			default:
				title = '{0} art\xEDculos producidos', [frm.doc.produced_qty];
		}

		bars.push({
			'title': title,
			'width': (frm.doc.produced_qty / frm.doc.qty * 100) + '%',
			'progress_class': 'progress-bar-success'
		});

		if (bars[0].width == '0%') {
			bars[0].width = '0.5%';
			added_min = 0.5;
		} message = title;


		// pending qty
		var pending_complete = frm.doc.material_transferred_for_manufacturing - frm.doc.produced_qty;

		if (pending_complete) {
			switch (pending_complete) {
				case 0: 
					title = 'No hay art\xEDculos en progreso';
					break;
				case 1: 
					title = 'Hay 1 art\xEDculo en progreso';
					break;
				default:
					title = 'Hay {0} art\xEDculos en progreso', [pending_complete];
			}

			bars.push({
				'title': title,
				'width': ((pending_complete / frm.doc.qty * 100) - added_min) + '%',
				'progress_class': 'progress-bar-warning'
			});
			message = message + '. ' + title;
		}

		frm.dashboard.add_progress(__('Status'), bars, message);
	},

	validate: function (frm)
	{
		if (!frm.doc.uom)
			frm.doc.uom = frm.doc.required_items[0].uom;
		else
		if (frm.doc.uom)
			frm.doc.required_items[0].uom = frm.doc.uom;
	},

	item_type: function (frm)
	{
		if (frm.doc.item_type) {
			frm.set_value("wip_warehouse", "Trabajo en proceso");
			(frm.doc.item_type == "Compuesto") ?
				(frm.set_value("fg_warehouse", "Compuestos")) : (frm.set_value("fg_warehouse", "Materia prima"));

			frm.set_query("production_item", function() {
				return {
					query: "erpnext.controllers.queries.item_query",
					filters: {
						'is_stock_item': 1,
						'item_group': frm.doc.fg_warehouse
					}
				};
			});
		}
	},

	bom_no: function (frm)
	{
		if (frm.doc.item_type == "Compuesto") {
			frappe.model.with_doc("BOM", frm.doc.bom_no, function()
				{
					var tabletransfer = frappe.model.get_doc("BOM", frm.doc.bom_no);

					if (frm.doc.required_items) {
						frm.clear_table("required_items");
						frm.refresh_field("required_items");
					}

					$.each(tabletransfer.items, function (i, field)
						{
							d = frm.add_child("required_items");

							d.item_code = field.item_code;
							d.item_name = field.item_name;
							d.source_warehouse = field.source_warehouse;
							d.uom = field.uom;
							d.required_qty = (field.qty * frm.doc.qty);
							d.transferred_qty = frm.doc.material_transferred_for_manufacturing;
							d.available_qty_at_source_warehouse = field.stock_qty;

							frm.refresh_field("required_items");
						});
				});
		}
	},

	qty: function (frm)
	{
		if (frm.doc.item_type == "Compuesto")
			frm.trigger('bom_no');
	}
});


cleceim_app_management = {

	set_custom_buttons: function (frm)
	{
		if (frm.doc.docstatus === 1) {
			if (frm.doc.status != 'Stopped' && frm.doc.status != 'Completed')
				frm.add_custom_button(__('Stop'), function() {
					cleceim_app_management.stop_production_order(frm, "Stopped");
				}, __('Status'));
			else
			if (frm.doc.status == 'Stopped')
				frm.add_custom_button(__('Re-open'), function() {
					cleceim_app_management.stop_production_order(frm, "Resumed");
				}, __('Status'));

			if ((flt(frm.doc.material_transferred_for_manufacturing) < flt(frm.doc.qty)) && frm.doc.status != 'Stopped') {
				frm.has_start_btn = true;
				var start_btn = frm.add_custom_button(__('Start'), function() {
					cleceim_app_management.make_se(frm, "Material Transfer for Manufacture");
				});
				start_btn.addClass('btn-primary');
			}

			if ((flt(frm.doc.produced_qty) < flt(frm.doc.material_transferred_for_manufacturing)) & frm.doc.status != 'Stopped') {
				frm.has_finish_btn = true;
				var finish_btn = frm.add_custom_button(__('Finish'), function() {
					cleceim_app_management.make_se(frm, "Manufacture");
				});
				if (frm.doc.material_transferred_for_manufacturing == frm.doc.qty)
					finish_btn.addClass('btn-primary');
			}

			if (frm.doc.status == 'Completed') {
				frm.has_custom_btn = true;
				var inv_btn = frm.add_custom_button('Crear factura', function() {
					frappe.msgprint("Funci\xF3n no disponible", "Llamada a la funci\xF3n CREAT_FILE_DESCRIPTOR");
				});
				inv_btn.addClass('btn-primary');
			}
		}
	},

	make_se: function (frm, purpose)
	{
		var max = (purpose === "Manufacture") ?
		flt(frm.doc.material_transferred_for_manufacturing) - flt(frm.doc.produced_qty) :
		flt(frm.doc.produced_qty) - flt(frm.doc.material_transferred_for_manufacturing);

		max = flt(max, precision("qty"));
		frappe.prompt(
			{
				fieldtype: "Float",
				label: __("Qty for {0}", [purpose]),
				fieldname: "qty",
				description: __("Max: {0}", [max]),
				'default': max
			},
			function (data) {
				if (data.qty > max) {
					frappe.msgprint(__("Quantity must not be more than {0}", [max]));
					return 0;
				}
				frappe.call({
					type: "POST",
					method: "cleceim_app_management.ordenes_de_trabajo.doctype.gran_formato.gran_formato.make_stock_entry",
					args: {
						"production_order_id": frm.doc.docname,
						"purpose": purpose,
						"qty": data.qty
					},
					callback: function (r) {
						var doclist = frappe.model.sync(r.message);
						frappe.set_route("Form",
							doclist[0].doctype, doclist[0].name);
					}
				});
			}, __("Select Quantity"), __("Make"));
	},

	stop_production_order: function (frm, status)
	{
		frappe.call({
			type: "POST",
			method: "cleceim_app_management.ordenes_de_trabajo.doctype.gran_formato.gran_formato.stop_unstop",
			args: {
				production_order: frm.doc.name,
				status: status
			},
			callback: function (r) {
				if (r.message) {
					frm.set_value("status", r.message);
					frm.reload_doc();
				}
			}
		});
	}
};