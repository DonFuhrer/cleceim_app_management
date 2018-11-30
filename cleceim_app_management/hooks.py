# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "cleceim_app_management"
app_title = "CLECEIM App Management"
app_publisher = "DonFuhrer"
app_description = "An application to manage work orders, invoices and delivery notes."
app_icon = "octicon octicon-tools"
app_color = "green"
app_email = "don@fuhrer.com"
app_license = "GNU General Public License"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/cleceim_app_management/css/cleceim_app_management.css"
# app_include_js = "/assets/cleceim_app_management/js/cleceim_app_management.js"

# include js, css files in header of web template
# web_include_css = "/assets/cleceim_app_management/css/cleceim_app_management.css"
# web_include_js = "/assets/cleceim_app_management/js/cleceim_app_management.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "cleceim_app_management.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "cleceim_app_management.install.before_install"
# after_install = "cleceim_app_management.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "cleceim_app_management.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"cleceim_app_management.tasks.all"
# 	],
# 	"daily": [
# 		"cleceim_app_management.tasks.daily"
# 	],
# 	"hourly": [
# 		"cleceim_app_management.tasks.hourly"
# 	],
# 	"weekly": [
# 		"cleceim_app_management.tasks.weekly"
# 	]
# 	"monthly": [
# 		"cleceim_app_management.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "cleceim_app_management.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "cleceim_app_management.event.get_events"
# }

