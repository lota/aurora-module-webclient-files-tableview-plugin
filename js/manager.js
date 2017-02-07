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
				}
				if (Settings.enablePreviewPane())
				{
					App.subscribeEvent('FilesWebclient::ShowView::after', function (oParams) {
						var 
							data = {
								'displayName': ko.observable('')
							},
							oItem = null,
							$RightPannel = $('<div id="files_right_panel" style="width: 640px; border-left: 1px solid #eee;"></div>'),
							$Form = $('<form action="?/Api/" method="post" id="view_form" target="view_iframe" style="display: none;"></form>'),
							$Iframe = $('<iframe id="view_iframe" name="view_iframe" style="width: 100%; height: 100%; border: none;"></iframe>')
						;
						
						$Iframe.load(function(){
							$('iframe').contents().find('img').css({'max-width':'100%', 'max-height':'100%'});							
						});

//							var $oRightPannel = $('<div id="files_right_panel" style="width: 480px; border-left: 1px solid #eee;" data-bind="text: displayName"></div>');
						
						$RightPannel.append($Form);
						$RightPannel.append($Iframe);
						
						$('<input type="hidden" name="Format" />').val('Raw').appendTo($Form);
						$('<input type="submit" />').val('submit').appendTo($Form);
						$("#files_center_panel").after($RightPannel);

						oParams.View.firstSelectedFile.subscribe(function(newValue) {
							$Iframe.attr('src', "");								
							if (newValue !== undefined && oItem !== newValue)
							{
								newValue.createFormFields($Form, 'ViewFile');
								$Form.submit();									
//									data.displayName(newValue.displayName());
							}
						});

						ko.applyBindings(data, $RightPannel.get(0));
					});
				}

			}
		};
	}
	
	return null;
};
