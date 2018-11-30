// Copyright (c) 2018, vazdan and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gran Formato',
{
	setup: function (frm)
	{
		frm.set_query("bom_no", function() {
			if (frm.doc.production_item && frm.doc.item_type=="Compuesto") {
				return {
					query: "erpnext.controllers.queries.bom",
					filters: {item: cstr(frm.doc.production_item)}
				};
			} else frappe.msgprint("Primero debes introducir el articulo a manufacturar");
		});
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
			(frm.doc.item_type=="Compuesto") ?
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
		if (frm.doc.item_type=="Compuesto") {
			frappe.model.with_doc("BOM", frm.doc.bom_no, function()
			{
				var tabletransfer = frappe.model.get_doc("BOM", frm.doc.bom_no);

				if (frm.doc.required_items) {
					frm.clear_table("required_items");
					frm.refresh_field("required_items");
				}

				$.each(tabletransfer.items, function (i, field) {
					d = frm.add_child("required_items");

					d.item_code = field.item_code;
					d.item_name = field.item_name;
					d.source_warehouse = field.source_warehouse;
					d.uom = field.uom;
					d.required_qty = (field.qty*frm.doc.qty)
					d.transferred_qty = frm.doc.material_transferred_for_manufacturing;
					d.available_qty_at_source_warehouse = field.stock_qty;

					frm.refresh_field("required_items");
				});
			});
		}
	},

	qty: function (frm)
	{
		if (frm.doc.item_type=="Compuesto")
			frm.trigger('bom_no');
	}
});
