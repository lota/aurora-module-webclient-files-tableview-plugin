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
		
		bNormalUser = App.getUserRole() === window.Enums.UserRole.NormalUser,
		bShow = false,
		TemplateName = '%ModuleName%_ItemsView'
	;

	Settings.init(oSettings);
	
	if (bNormalUser)
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () { return require('modules/%ModuleName%/js/views/SettingsPaneView.js'); }, Settings.HashModuleName, TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')]);
				{
					App.subscribeEvent('Files::ChangeItemsView', function (oParam) {
						console.log(oParam.View.bInPopup);
						if (Settings.enableModule())
						{
							oParam.View.itemsViewTemplate(TemplateName);
						}
						Settings.enableModule.subscribe(function(newValue){
							oParam.View.itemsViewTemplate(newValue ? TemplateName : oParam.TemplateName);
						});
					});
				}
				App.subscribeEvent('FilesWebclient::ShowView::after', function (oParams) {
					var 
						data = {
							'displayName': ko.observable(''),
							'enablePreviewPane': Settings.enablePreviewPane
						},
						oItem = null,
						$RightPannel = $("<!-- ko template: {name: '%ModuleName%_PaneView'} --><!-- /ko -->")
					;
					

					if (!bShow)
					{
						bShow = true;

						$("#files_center_panel").after($RightPannel);

						ko.applyBindings(data, $RightPannel.get(0));
	
						var 
							$Form = $('#view_form'),
							$Iframe = $("#view_iframe")
						;
						$Iframe.load(function(){
							$Iframe.contents().find('img').css({'max-width':'100%', 'max-height':'100%'});							
						});
						
						oParams.View.firstSelectedFile.subscribe(function(newValue) {
							$Iframe.attr('src', "");	
							if (newValue !== undefined && oItem !== newValue)
							{
								newValue.createFormFields($Form, 'ViewFile');
								$Form.submit();									
								data.displayName(newValue.displayName());
							}
						});
					}
				});
			}
		};
	}
	
	return null;
};
