'use strict';

module.exports = function (oAppData) {
	var
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		
		bNormalUser = App.getUserRole() === window.Enums.UserRole.NormalUser
	;

	if (bNormalUser)
	{
		return {
			start: function (ModulesManager) {
				App.subscribeEvent('Files::ChangeItemsView', function (oParams) {
					oParams.ViewName = '%ModuleName%_ItemsView';
				});
			}
		};
	}
	
	return null;
};
