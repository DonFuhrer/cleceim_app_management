// Copyright (c) 2018, vazdan and contributors
// For license information, please see license.txt

frappe.ui.form.on('Digital', {

    refresh: function (frm)
    {
	if (frm.doc.item_type == "Papel") {
	    if (frm.doc.paper_material == "Papel estucado MATE") {
		frm.set_df_property('paper_grammage', 'options', ["350g"]);
		frm.set_value('paper_grammage', '350g');
	    }
	}
    },

    onload: function (frm)
    {
	/*cleceim_app_management.set_default_item_type(frm);
	cleceim_app_management.set_default_warehouse(frm);
	cleceim_app_management.set_default_root_file_path(frm);*/
	erpcleceim.set_default_item_type(frm);
	erpcleceim.set_default_warehouse(frm);
	erpcleceim.set_defaut_root_file_path(frm);
    },
    
    /* Each time we click any of this fields
     * to change them, the path to the file
     * image is updated with the field's value.
     */
    link_to_customer: function (frm)
    {
	/*cleceim_app_management.set_additional_file_path(frm);*/
	erpcleceim.set_additional_file_path(frm);
    },

    user_defined_customer: function (frm)
    {
	/*cleceim_app_management.set_additional_file_path(frm);*/
	erpcleceim.set_additional_file_path(frm);
    },

    main_work_ref: function (frm)
    {
	/*cleceim_app_management.set_additional_file_path(frm);*/
	erpcleceim.set_additional_file_path(frm);
    },

    optional_work_ref: function (frm)
    {
	/*cleceim_app_management.set_additional_file_path(frm);*/
	erpcleceim.set_additional_file_path(frm);
    },

    work_description: function (frm)
    {
	/*cleceim_app_management.set_additional_file_path(frm);*/
	erpcleceim.set_additional_file_path(frm);
    },
    
    print_size: function (frm)
    {
	if (frm.doc.print_size == "Otro" && !frm.doc.cus_print_size)
	    frappe.prompt([
		{
		    'fieldname': 'cus_width',
		    'fieldtype': 'Float',
		    'label': 'Ancho',
		    'reqd': 1
		},
		{
		    'fieldname': 'column_break',
		    'fieldtype': 'Column Break'
		},
		{
		    'fieldname': 'cus_height',
		    'fieldtype': 'Float',
		    'label': 'Alto',
		    'reqd': 1
		}
	    ], function (data) {
		frappe.model.set_value(
		    frm.doctype, frm.docname,
		    'cus_print_size',
		    data.cus_width + " x " + data.cus_height,
		    'Data'
		);
	    }, 'Establecer dimensiones personalizadas', 'Aceptar');
    },

    item_type: function (frm)
    {
	var itemSelected = frm.doc.item_type;

	if (itemSelected != "Papel") {
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
		"cus_print_size:": "",
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

	if (itemSelected != "Sello")
	    frm.set_value({
		"stamp_model": "",
		"stamp_color": "",
		"quantity_stamp": null
	    });

	if (itemSelected != "Taza")
	    frm.set_value({
		"mug_printing_option": "",
		"quantity_mug": null
	    });
    },

    paper_material: function (frm)
    {
	var paperSelected = frm.doc.paper_material;

	if (paperSelected == "Papel COLORES")
	    frm.set_value({
		"color_paper_green": false,
		"color_paper_pink": false,
		"color_paper_cyan": false,
		"color_paper_yellow": false,
		"color_paper_pistachio": false,
		"color_paper_gold": false
	    });

	if (paperSelected == "Papel COPIATIVO")
	    frm.set_value({
		"paper_1white": false,
		"paper_2pink": false,
		"paper_2green": false,
		"paper_2yellow": false,
		"paper_2gold": false
	    });

	if (paperSelected == "CARTULINA")
	    frm.set_value('cardboard_type', '');
	else {
	    frm.set_value('paper_grammage', null);

	    if (paperSelected == "Papel OFFSET")
		frm.set_df_property('paper_grammage', 'options',
				    ["90g", "120g"]);
	    else
	    if (paperSelected == "Papel estucado BRILLO")
		frm.set_df_property('paper_grammage', 'options',
				    ["115g", "135g", "170g", "250g", "350g"]);
	    else
	    if (paperSelected == "Papel estucado MATE") {
		frm.set_df_property('paper_grammage', 'options', ["350g"]);
		frm.set_value('paper_grammage', '350g');
	    }
	    // by default paper grammage is 90g
	    else frm.set_df_property('paper_grammage', 'options', ["90g"]);

	    frm.refresh_field('paper_grammage');
	}
    }
});


/*cleceim_app_management = {*/
erpcleceim = {

    set_default_item_type: function (frm)
    {
	frappe.call({
	    method: 'erpcleceim.ordenes_de_trabajo.doctype.digital.digital.get_default_item_type',
	    /*method: "cleceim_app_management.ordenes_de_trabajo.doctype.digital.digital.get_default_item_type",*/
	    callback: function (r) {
		if (!r.exe) {
		    frm.set_value('item_type', r.message.item_type);
		}
	    }
	});
    },

    set_default_warehouse: function (frm)
    {
	frappe.call({
	    method: 'erpcleceim.ordenes_de_trabajo.doctype.digital.digital.get_default_warehouse',
	    /*method: "cleceim_app_management.ordenes_de_trabajo.doctype.digital.digital.get_default_warehouse",*/
	    callback: function (r) {
		if (!r.exe) {
		    if (!frm.doc.wip_warehouse)
			frm.set_value('wip_warehouse', r.message.wip_warehouse);
		    if (!frm.doc.fg_warehouse)
			frm.set_value('fg_warehouse', r.message.fg_warehouse);
		}
	    }
	});
    },

    set_additional_file_path: function (frm)
    {
	if (frm.doc.link_to_customer || frm.doc.user_defined_customer) {
	    var filePath = (!frm.doc.unregistered_customer ?
			    frm.doc.link_to_customer : frm.doc.user_defined_customer);

	    filePath += (frm.doc.main_work_ref ? " / " + frm.doc.main_work_ref : "");
	    filePath += (frm.doc.optional_work_ref ? " / " + frm.doc.optional_work_ref : "");
	    filePath += (frm.doc.work_description ? " / " + frm.doc.work_description : "");

	    // string compression if the length of the string exceeds the size of its field
	    if (filePath.length > 78)
		erpcleceim.string_compression(frm, 'remain_file_path', filePath, 78);
		/*cleceim_app_management.string_compression(frm, 'remain_file_path', filePath, 78);*/
	    else frm.set_value('remain_file_path', filePath.toUpperCase());
	}
    },

    set_default_root_file_path: function (frm)
    {
	frappe.call({
	    method: 'erpcleceim.ordenes_de_trabajo.doctype.digital.digital.get_default_root_file_path',
	    /*method: "cleceim_app_management.ordenes_de_trabajo.doctype.digital.digital.get_default_root_file_path",*/
	    callback: function (r) {
		if (!r.exe)
		    frm.set_value('root_file_path', r.message.root_file_path);
	    }
	});
    },

    string_compression: function (frm, field, str, limit)
    {
	str = str.substring(0, (str.length - (str.length - limit)) - 3) + "...";
	frm.set_value(field, str.toUpperCase());
    }
};
