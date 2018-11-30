# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		# module icon 'Ordenes de trabajo'
		{
			"module_name": "Ordenes de trabajo",
			"color": "green",
			"icon": "octicon octicon-versions",
			"type": "module",
			"label": _("\xd3rdenes de trabajo")
		},

		# doctype icon 'Gran Formato'
		{
			"module_name": "Gran Formato",
			"color": "green",
			"icon": "octicon octicon-tools",
			"type": "list",
			"link": "List/Gran Formato",
			"doctype": "Gran Formato",
			"label": "Gran Formato"
		},

		# doctype icon 'Digital'
		{
			"module_name": "Digital",
			"color": "green",
			"icon": "octicon octicon-paintcan",
			"type": "list",
			"link": "List/Digital",
			"doctype": "Digital",
			"label": "Digital"
		},

		# doctype icon 'Textil'
		{
			"module_name": "Textil",
			"color": "green",
			"icon": "octicon octicon-jersey",
			"type": "list",
			"link": "List/Textil",
			"doctype": "Textil",
			"label": "Textil"
		}
	]
