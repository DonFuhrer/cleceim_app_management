// Copyright (c) 2018, vazdan and contributors
// For license information, please see license.txt

frappe.ui.form.on('Digital',
{
	validate: function (frm)
	{
		if (frm.doc.item_type == "Papel") {
			if (!frm.doc.print_size && !frm.doc.cus_print_size)
				frappe.prompt([
					{
						'fieldname': 'cus_width',
						'fieldtype': 'Int',
						'label': 'Ancho',
						'reqd': 1
					},
					{
						'fieldname': 'column_break',
						'fieldtype': 'Column Break',
					},
					{
						'fieldname': 'cus_height',
						'fieldtype': 'Int',
						'label': 'Alto',
						'reqd': 1
					}
				],
				function (data) {
					frappe.model.set_value(
						frm.doctype, frm.docname,
						'cus_print_size',
						data.cus_width + " x " + data.cus_height,
						'Data'
					);
				}, 'Establecer dimensiones personalizadas', 'Aceptar');
		}
	},


	item_type: function (frm)
	{
		var selected_item = frm.doc.item_type;

		if (selected_item != "Papel") {
			if (frm.doc.paper_material == "Papel COLORES")
				frm.set_value({
					"color_paper_green": false,
					"color_paper_pink": false,
					"color_paper_lightblue": false,
					"color_paper_yellow": false,
					"color_paper_pistachio": false,
					"color_paper_gold": false
				});
			else
			if (frm.doc.paper_material == "Papel COPIATIVO")
				frm.set_value({
					"paper_1white": false,
					"paper_2pink": false,
					"paper_2green": false,
					"paper_2yellow": false,
					"paper_2blue": false
				});
			else
			if (frm.doc.paper_material == "CARTULINA")
				frm.set_value("cardboard_type", null);

			frm.set_value({
				"paper_material": "",
				"printing_option": "",
				"print_size": "",
				"cus_print_size": "",
				"laminate": "",
				"quantity_paper": 0,
				"paper_cleft_finish": false,
				"paper_creased_finish": false,
				"paper_perforated_finish": false,
				"paper_stapling_finish": false,
				"paper_glued_finish": false,
				"paper_numbered_finish": false
			});
		}

		if (selected_item != "Sello")
			frm.set_value({
				"stamp_model": "",
				"stamp_color": "",
				"quantity_stamp": null
			});

		if (selected_item != "Taza")
			frm.set_value({
				"mug_printing_option": "",
				"quantity_mug": null
			});
	},


	paper_material: function (frm)
	{
		var selected_paper = frm.doc.paper_material;

		if (selected_paper == "Papel COLORES")
			frm.set_value({
				"color_paper_green": false,
				"color_paper_pink": false,
				"color_paper_lightblue": false,
				"color_paper_yellow": false,
				"color_paper_pistachio": false,
				"color_paper_gold": false
			});
		else
		if (selected_paper == "Papel COPIATIVO")
			frm.set_value({
				"paper_1white": false,
				"paper_2pink": false,
				"paper_2green": false,
				"paper_2yellow": false,
				"paper_2blue": false
			});
		else
		if (selected_paper == "CARTULINA")
			frm.set_value("cardboard_type", "");
		else {
			frm.set_value("paper_grammage", null);

			if (selected_paper == "Papel OFFSET")
				frm.set_df_property('paper_grammage', 'options',
					["90g", "120g"]);
			else
			if (selected_paper == "Papel estucado BRILLO")
				frm.set_df_property('paper_grammage', 'options',
					["115g", "135g", "170g", "250g", "350g"]);
			else
			if (selected_paper == "Papel estucado MATE") {
				frm.set_df_property('paper_grammage', 'options', ["350g"]);
				frm.set_value("paper_grammage", "350g");
			}
			// by default paper grammage is 90g
			else frm.set_df_property('paper_grammage', 'options', ["90g"]);

			frm.refresh_field('paper_grammage');
		}
	},


	refresh: function (frm)
	{
		if (frm.doc.paper_material == "Papel estucado MATE") {
			frm.set_df_property('paper_grammage', 'options', ["350g"]);
			frm.set_value("paper_grammage", "350g");
		}
	}
});
