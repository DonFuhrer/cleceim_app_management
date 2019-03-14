// Copyright (c) 2018, vazdan and contributors
// For license information, please see license.txt

frappe.ui.form.on('Textil', {

	/* Each time we click any of this fields
	 * to change them, the path to the file image
	 * is updated with the value of the fields
	 */

	customer_name: function (frm)
	{
		cleceim_app_management.set_file_path(frm);
	},

	main_work_ref: function (frm)
	{
		cleceim_app_management.set_file_path(frm);
	},

	optional_work_ref: function (frm)
	{
		cleceim_app_management.set_file_path(frm);
	},

	production_item: function (frm)
	{
		cleceim_app_management.set_file_path(frm);
	}
});


cleceim_app_management = {

	set_file_path (frm)
	{
		if (frm.doc.customer_name) {
			var filePathValue;

			filePath = frm.doc.customer_name.toUpperCase();

			filePath += (frm.doc.main_work_ref ? " / "+frm.doc.main_work_ref.toUpperCase() : "");
			filePath += (frm.doc.optional_work_ref ? " / "+frm.doc.optional_work_ref.toUpperCase() : "");
			filePath += (frm.doc.production_item ? " / "+frm.doc.production_item.toUpperCase() : "");

			frm.set_value("remain_file_path", filePath);
		}
	}
};
