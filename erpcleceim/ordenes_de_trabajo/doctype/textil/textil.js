
// Copyright (c) 2018, vazdan and contributors
// For license information, please see license.txt

frappe.ui.form.on('Textil', {

    // we set a limit for the rows within the child table
    refresh: function (frm)
    {
	document.getElementsByClassName('grid-add-row')[0]
	    .style.display = (frm.doc.required_items.length == 8 ? 'none' : 'inline-block');
    },

    // we set default values for some fields if they are empty
    onload: function (frm)
    {
	/*cleceim_app_management.set_default_warehouse(frm);
	  cleceim_app_management.set_default_root_file_path(frm);*/
	erpcleceim.set_default_warehouse(frm);
	erpcleceim.set_default_root_file_path(frm);
    },
    
    /* Each time we click any of this fields
     * to change them, the path to the file
     * image is updated with the field's value
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

    production_item: function (frm)
    {
	/*cleceim_app_management.set_additional_file_path(frm);*/
	erpcleceim.set_additional_file_path(frm);
    }
});


erpcleceim = {
/*cleceim_app_management = {*/

    set_default_warehouse: function (frm)
    {
	frappe.call({
	    method: 'erpcleceim.ordenes_de_trabajo.doctype.textil.textil.get_default_warehouse',
	    /*method: "cleceim_app_management.ordenes_de_trabajo.doctype.textil.textil.get_default_warehouse",*/
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
	    filePath += (frm.doc.production_item ? " / " + frm.doc.production_item : "");

	    // string compression if the length of the string exceeds the size of its field
	    if (filePath.length > 80)
		//cleceim_app_management.string_compression(frm, 'remain_file_path', filePath, 80);
		erpcleceim.string_compression(frm, 'remain_file_path', filePath, 80);
	    else frm.set_value('remain_file_path', filePath.toUpperCase());
	}
    },

    set_default_root_file_path: function (frm)
    {
	frappe.call({
	    method: 'erpcleceim.ordenes_de_trabajo.doctype.textil.textil.get_default_root_file_path',
	    /*method: "cleceim_app_management.ordenes_de_trabajo.doctype.textil.textil.get_default_root_file_path",*/
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
