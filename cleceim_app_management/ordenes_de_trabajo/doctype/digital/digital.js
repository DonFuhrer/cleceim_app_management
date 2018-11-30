// Copyright (c) 2018, vazdan and contributors
// For license information, please see license.txt

frappe.ui.form.on('Digital',
{
	validate: function (frm)
	{
		if (!frm.doc.paper_print_size && !frm.doc.cus_paper_print_size)
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
					'cus_paper_print_size',
					data.cus_width + "x" + data.cus_height,
					'Data'
				);
			}, 'Establecer dimensiones personalizadas', 'Aceptar');
		
	},

	item_type: function (frm)
	{
		var selected_item = frm.doc.item_type;

		if (selected_item!="Papel") {
			if (frm.doc.paper_material=="Papel COLORES") {
				frm.set_value({
					"paper_color_green":	 false,
					"paper_color_pink":      false,
					"paper_color_lightblue": false,
					"paper_color_yellow":    false,
					"paper_color_pistachio": false,
					"paper_color_gold":      false
				});
			} else
			if (frm.doc.paper_material=="Papel COPIATIVO") {
				frm.set_value({
					"paper_type1white":  false,
					"paper_type2pink":   false,
					"paper_type2green":  false,
					"paper_type2yellow": false,
					"paper_type2blue":   false
				});
			} else
			if (frm.doc.paper_material=="CARTULINA") {
				frm.set_value("paper_type", null);
			}

			frm.set_value({
				"paper_material":       "",
				"paper_print":          "",
				"paper_print_size":     "",
				"cus_paper_print_size": "",
				"laminate":             "",
				"paper_qty":             0,
				"paper_finish1":     false,
				"paper_finish2":     false,
				"paper_finish3":     false,
				"paper_finish4":     false,
				"paper_finish5":     false,
				"paper_finish6":     false
			});
		}

		if (selected_item!="Sello") {
			frm.set_value({
				"stamp_model": "",
				"stamp_color": "",
				"stamp_qty":  null
			});
		}

		if (selected_item!="Taza") {
			frm.set_value({
				"mug_print": "",
				"mug_qty":  null
			});
		}
	},

	paper_material: function (frm)
	{
		var selected_paper = frm.doc.paper_material;

		if (selected_paper=="Papel COLORES") {
			frm.set_value({
				"paper_color_green":     false,
				"paper_color_pink":      false,
				"paper_color_lightblue": false,
				"paper_color_yellow":    false,
				"paper_color_pistachio": false,
				"paper_color_gold":      false
			});
		} else
		if (selected_paper=="Papel COPIATIVO") {
			frm.set_value({
				"paper_type1white":  false,
				"paper_type2pink":   false,
				"paper_type2green":  false,
				"paper_type2yellow": false,
				"paper_type2blue":   false
			});
		} else
		if (selected_paper=="CARTULINA")
			frm.set_value("paper_type", "");
		else {
			frm.set_value("paper_grammage", null);

			if (selected_paper=="Papel OFFSET")
				frm.set_df_property('paper_grammage', 'options',
					["90g", "120g"]);
			else
			if (selected_paper=="Papel estucado BRILLO")
				frm.set_df_property('paper_grammage', 'options',
					["115g", "135g", "170g", "250g", "350g"]);
			else
			if (selected_paper=="Papel estucado MATE") {
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
		if (frm.doc.paper_material=="Papel estucado MATE") {
			frm.set_df_property('paper_grammage', 'options', ["350g"]);
			frm.set_value("paper_grammage", "350g");
		}
	}
});
