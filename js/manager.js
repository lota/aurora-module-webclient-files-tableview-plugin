'use strict';

module.exports = function (oAppData) {
	var
		_ = require('underscore'),
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
		
		App = require('%PathToCoreWebclientModule%/js/App.js'),
				
		Settings = require('modules/%ModuleName%/js/Settings.js'),
		oSettings = _.extend({}, oAppData[Settings.ServerModuleName] || {}, oAppData['%ModuleName%'] || {}),
		
		bNormalUser = App.getUserRole() === window.Enums.UserRole.NormalUser
	;

	Settings.init(oSettings);
	
	if (bNormalUser)
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () { return require('modules/%ModuleName%/js/views/SettingsPaneView.js'); }, Settings.HashModuleName, TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')]);
				if (Settings.enableModule())
				{
					App.subscribeEvent('Files::ChangeItemsView', function (oParams) {
						oParams.ViewName = '%ModuleName%_ItemsView';
					});
				}
			}
		};
	}
	
	return null;
};
