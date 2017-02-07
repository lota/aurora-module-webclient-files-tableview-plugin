'use strict';

module.exports = function (oAppData) {
	var
		_ = require('underscore'),
		$ = require('jquery'),
		ko = require('knockout'),
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
					if (Settings.enablePreviewPane())
					{
						App.subscribeEvent('FilesWebclient::ShowView::after', function (oParams) {
							var 
								data = {
									'displayName': ko.observable('')
								},
								oItem = null;
								
//							var $oRightPannel = $('<div id="files_right_panel" style="width: 480px; border-left: 1px solid #eee;" data-bind="text: displayName"></div>');
							var $oRightPannel = $('<div id="files_right_panel" style="width: 640px; border-left: 1px solid #eee;"><form action="?/Api/" method="post" id="view_form" target="view_iframe" style="display: none;"></form><iframe id="view_iframe" name="view_iframe" style="width: 100%; height: 100%; border: none;"></iframe></div>');
							$("#files_center_panel").after($oRightPannel);
							var oForm = $('#view_form');
							$('<input type="hidden" name="Format" />').val('Raw').appendTo(oForm);
							$('<input type="submit" />').val('submit').appendTo(oForm);
							
							oParams.View.firstSelectedFile.subscribe(function(newValue) {
								$('#view_iframe').attr('src', "");								
								if (newValue !== undefined && oItem !== newValue)
								{
									newValue.createFormFields(oForm, 'ViewFile');
									oForm.submit();									
							
//									data.displayName(newValue.displayName());
								}
							});
							
							ko.applyBindings(data, $oRightPannel.get(0));
						});
					}
				}
			}
		};
	}
	
	return null;
};
