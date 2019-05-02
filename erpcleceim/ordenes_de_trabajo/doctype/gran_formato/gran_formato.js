// Copyright (c) 2018, vazdan and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gran Formato', {

    setup: function (frm)
    {
	frm.set_query('bom_no', function() {
	    if (frm.doc.production_item && frm.doc.item_type == 'Compuesto') {
		return {
		    query: 'erpnext.controllers.queries.bom',
		    filters: {item: cstr(frm.doc.production_item)}
		};
	    } else msgprint('Primero debes seleccionar el art\xEDculo a manufactura.');
	});
    },

    refresh: function (frm)
    {
	frm.set_intro('');
	if (!frm.doc.docstatus && !frm.doc.__islocal)
	    frm.set_intro('Valida la \xF3rden de trabajo para procesarla.');

	if (frm.doc.docstatus) {
	    /*cleceim_app_management.set_custom_buttons(frm, frm.doc.status);*/
	    erpcleceim.set_custom_buttons(frm, frm.doc.status);
	    frm.trigger('show_progress');
	}
    },

    validate: function (frm)
    {
	if (frm.doc.stock_uom)
	    frm.doc.required_items[0].stock_uom = frm.doc.stock_uom;
	
	/* Correct the abbreviation
	 * of a unit of measurement
	 * if it has been entered.
	 */
	/*frm.set_value("work_finish", frm.doc.work_finish.toUpperCase());
	
	var unfixed = frm.doc.work_finish;
	var regexp = /\d+[a-z]+/gi;

	match = regex.execc(unfixed);
	while (match !== null) {
	    if (match[0] == match[0].toUpperCase())
		match[0] = match[0].toLowerCase();

	    var fixed = str.substring(0, (str.length - match[0].length)) + match[0];
	    frm.set_value("work_finish", fixed);
	    match = regexp.exec(str);
	}*/
    },

    onload: function (frm)
    {
	/*cleceim_app_management.set_default_item_type(frm);
	cleceim_app_management.set_default_stock_uom(frm);
	cleceim_app_management.set_default_warehouse(frm);
	cleceim_app_management.set_default_root_file_path(frm);*/
	erpcleceim.set_default_item_type(frm);
	erpcleceim.set_default_stock_uom(frm);
	erpcleceim.set_default_warehouse(frm);
	erpcleceim.set_default_root_file_path(frm);
    },

    show_progress: function (frm)
    {
	var bars = [];
	var message = '';
	var added_min = false;
	var title = '';

	// produced qty
	switch (frm.doc.produced_qty) {
	    case 0: title = 'Ning\xFAn art\xEDculo producido';
	            break;

	    case 1: title = '1 art\xEDculo producido';
	            break;

	    default: title = '{0} art\xEDculos producidos', [frm.doc.produced_qty];
	}

	bars.push({
	    'title': title,
	    'width': (frm.doc.produced_qty / frm.doc.qty * 100) + '%',
	    'progress_class': 'progress-bar-success'
	});

	if (bars[0].width == '0%') {
	    bars[0].width = '0.5%';
	    added_min = 0.5;
	}
	message = title;

	// pending qty
	var pending_complete = frm.doc.material_transferred_for_manufacturing - frm.doc.produced_qty;

	if (pending_complete) {
	    switch (pending_complete) {
	        case 0: title = 'No hay art\xEDculos en progreso';
		        break;

	        case 1: title = '1 art\xEDculo en progreso';
		        break;

	        default: title = '{0} art\xEDculos en progreso', [pending_complete];
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

    /* Each time we click any of this fields to
     * change them, the path to the fiel image
     * is updated with the value of the fields
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
    },

    item_type: function (frm)
    {
	if (frm.doc.item_type) {	    
	    frm.doc.item_type == 'Compuesto' ?
		frm.set_value('fg_warehouse', 'Compuestos') :
		frm.set_value('fg_warehouse', 'Materia prima');

	    frm.set_query('production_item', function() {
		return {
		    query: 'erpnext.controllers.queries.item_query',
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
	if (frm.doc.item_type == 'Compuesto') {
	    frappe.model.with_doc('BOM', frm.doc.bom_no, function() {
		var tabletransfer = frappe.model.get_doc('BOM', frm.doc.bom_no);

		if (frm.doc.required_items)
		    frm.clear_table('required_items');

		$.each(tabletransfer.items, function (i, field) {
		    d = frm.add_child('required_items');

		    d.item_code = field.item_code;
		    d.item_name = field.item_name;
		    d.source_warehouse = field.source_warehouse;
		    d.stock_uom = field.stock_uom;
		    d.required_qty = (field.qty * frm.doc.qty);
		    d.transferred_qty = frm.doc.materil_transferred_for_manufacturing;
		    d.available_qty_at_source_warehouse = field.stock_qty;
		});

		frm.refresh_field('required_items');
	    });
	}
    },

    qty: function (frm)
    {
	if (frm.doc.item_type == 'Compuesto')
	    frm.trigger('bom_no');
    }
});


/*cleceim_app_management = {*/
erpcleceim = {

    set_default_item_type: function (frm)
    {
	frappe.call({
	    method: 'erpcleceim.ordenes_de_trabajo.doctype.gran_formato.gran_formato.get_default_item_type',
	    /*method: 'cleceim_app_management.ordenes_de_trabajo.doctype.gran_formato.gran_formato.get_default_item_type',*/
	    callback: function (r) {
		if (!r.exe)
		    frm.set_value('item_type', r.message.item_type);
	    }
	});
    },

    set_default_stock_uom: function (frm)
    {
	frappe.call({
	    method: 'erpcleceim.ordenes_de_trabajo.doctype.gran_formato.gran_formato.get_default_stock_uom',
	    /*method: 'cleceim_app_management.ordenes_de_trabajo.doctype.gran_formato.gran_formato.get_default_stock_uom',*/
	    callback: function (r) {
		if (!r.exe)
		    frm.set_value('stock_uom', r.message.stock_uom);
	    }
	});
    },

    set_default_warehouse: function (frm)
    {
	frappe.call({
	    method: 'erpcleceim.ordenes_de_trabajo.doctype.gran_formato.gran_formato.get_default_warehouse',
	    /*method: 'cleceim_app_management.ordenes_de_trabajo.doctype.gran_formato.gran_formato.get_default_warehouse',*/
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

    set_default_root_file_path: function (frm)
    {
	frappe.call({
	    method: 'erpcleceim.ordenes_de_trabajo.doctype.gran_formato.gran_formato.get_default_root_file_path',
	    /*method: 'cleceim_app_management.ordenes_de_trabajo.doctype.gran_formato.gran_formato.get_default_root_file_path',*/
	    callback: function (r) {
		if (!r.exe)
		    frm.set_value('root_file_path', r.message.root_file_path);
	    }
	});
    },

    set_additional_file_path: function (frm)
    {
	if (frm.doc.link_to_customer || frm.doc.user_defined_customer) {
	    var filePath = (!frm.doc.unregistered_customer ?
			    frm.doc.link_to_customer : frm.doc.user_defined_customer);

	    filePath += frm.doc.main_work_ref ? ' / ' + frm.doc.main_work_ref : '';
	    filePath += frm.doc.optional_work_ref ? ' / ' + frm.doc.optional_work_ref : '';
	    filePath += frm.doc.production_item ? ' / ' + frm.doc.production_item : '';

	    // string compression if the length of the string exceeds the size of its field
	    if (filePath.length > 75)
		/*cleceim_app_management.string_compression(frm, 'remain_file_path', filePath, 75);*/
		erpcleceim.string_compression(frm, 'remain_file_path', filePath, 75);
	    else frm.set_value('remain_file_path', filePath.toUpperCase());
	}
    },

    string_compression: function (frm, field, str, limit)
    {
	str = str.substring(0, (str.length - (str.length - limit)) - 3) + '...';
	frm.set_value(field, str.toUpperCase());
    },

    set_custom_buttons: function (frm)
    {
	if (frm.doc.docstatus) {
	    if (frm.doc.status != 'Stopped' && frm.doc.status != 'Completed')
		frm.add_custom_button(__('Stop'), function() {
		    /*cleceim_app_management.stop_production_order(frm, 'Stopped');*/
		    erpcleceim.stop_production_order(frm, 'Stopped');
		}, __('Status'));
	    else
	    if (frm.doc.status == 'Stopped')
		frm.add_custom_button(__('Re-open'), function() {
		    /*cleceim_app_management.stop_production_order(frm, 'Resumed');*/
		    erpcleceim.stop_production_order(frm, 'Resumed');
		}, __('Status'));

	    if ((flt(frm.doc.material_transferred_for_manufacturing) < flt(frm.doc.qty)) && frm.doc.status != 'Stopped') {
		frm.has_start_btn = true;
		var start_btn = frm.add_custom_button(__('Start'), function() {
		    /*cleceim_app_management.make_se(frm, 'Material Transfer for Manufacture');*/
		    erpcleceim.make_se(frm, 'Material Transfer for Manufacture');
		});
		start_btn.addClass('btn-primary');
	    }

	    if ((flt(frm.doc.produced_qty) < flt(frm.doc.material_transferred_for_manufacturing)) && frm.doc.status != 'Stopped') {
		frm.has_finish_btn = true;
		var finish_btn = frm.add_custom_button(__('Finish'), function() {
		    /*cleceim_app_management.make_se(frm, "Manufacture");*/
		    erpcleceim.make_se(frm, 'Manufacture');
		});
		if (frm.doc.material_transferred_for_manufacturing == frm.doc.qty)
		    finish_btn.addClass('btn-primary');
	    }

	    if (frm.doc.status == 'Completed') {
		frm.has_custom_button = true;
		var invoice_btn = frm.add_custom_button('Crear factura', function() {
		    frappe.msgprint('Funci\xF3n no disponible', 'Llamada a la funci\xF3n CREAT_FILE_DESCRIPTOR');
		});
		invoice_btn.addClass('btn-primary');
	    }
	}
    },

    make_se: function (frm, purpose)
    {
	var max = (purpose == 'Manufacture') ?
	    flt(frm.doc.material_transferred_for_manufacturing) - flt(frm.doc.produced_qty) :
	    flt(frm.doc.qty) - flt(frm.doc.material_transferred_for_manufacturing);

	max = flt(max, precision('qty'));

	frappe.prompt(
	    {
		fieldtype: 'Float',
		label: ('Cantidad para {0}', [purpose]),
		fieldname: 'qty',
		description: ('M\xE1x: {0}', [max]),
		'default': max
	    },
	    function (data) {
		if (data.qty > max) {
		    frappe.msgprint('La cantidad no debe ser superior a {0}', [max]);
		    return 0;
		}

		frappe.call({
		    type: 'POST',
		    method: 'erpcleceim.ordenes_de_trabajo.doctype.gran_formato.gran_formato.make_stock_entry',
		    /*method: 'cleceim_app_management.ordenes_de_trabajo.doctype.gran_formato.gran_formato.make_stock_entry',*/
		    args: {
			production_order_id: frm.doc.name,
			purpose: purpose,
			qty: (data.qty ? data.qty : 0)
		    },
		    callback: function (r) {
			var doclist = frappe.model.sync(r.message);
			frappe.set_route('Form', doclist[0].doctype, doclist[0].name);
		    }
		});
	    }, 'Selecciona la cantidad', 'Crear');
    },

    stop_production_order: function (frm, status)
    {
	frappe.call({
	    type: 'POST',
	    method: 'erpcleceim.ordenes_de_trabajo.doctype.gran_formato.gran_formato.stop_unstop',
	    /*method: 'cleceim_app_management.ordenes_de_trabajo.doctype.gran_formato.gran_formato.stop_unstop',*/
	    args: {
		production_order: frm.doc.name,
		status: status
	    },
	    callback: function (r) {
		if (r.message) {
		    frm.set_value('status', r.message);
		    frm.reload_doc();
		}
	    }
	});
    }
};
