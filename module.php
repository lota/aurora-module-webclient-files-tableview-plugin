<?php

class FilesTableviewWebclientPluginModule extends AApiModule
{
	public function init() 
	{
		$this->extendObject('CUser', array(
				'EnableModule' => array('bool', false),
				'EnablePreviewPane' => array('bool', false),
			)
		);
	}
	
	/**
	 * Obtains list of module settings for authenticated user.
	 * 
	 * @return array
	 */
	public function GetSettings()
	{
		\CApi::checkUserRoleIsAtLeast(\EUserRole::Anonymous);
		
		$oUser = \CApi::getAuthenticatedUser();
		if (!empty($oUser) && $oUser->Role === \EUserRole::NormalUser)
		{
			return array(
				'EnableModule' => $oUser->{$this->GetName().'::EnableModule'},
				'EnablePreviewPane' => $oUser->{$this->GetName().'::EnablePreviewPane'}
			);
		}
		
		return null;
	}	
	
	/**
	 * Updates settings of the Simple Chat Module.
	 * 
	 * @param boolean $EnableModule indicates if user turned on Simple Chat Module.
	 * @return boolean
	 */
	public function UpdateSettings($EnableModule, $EnablePreviewPane)
	{
		\CApi::checkUserRoleIsAtLeast(\EUserRole::NormalUser);
		
		$iUserId = \CApi::getAuthenticatedUserId();
		if (0 < $iUserId)
		{
			$oCoreDecorator = \CApi::GetModuleDecorator('Core');
			$oUser = $oCoreDecorator->GetUser($iUserId);
			$oUser->{$this->GetName().'::EnableModule'} = $EnableModule;
			$oUser->{$this->GetName().'::EnablePreviewPane'} = $EnablePreviewPane;
			$oCoreDecorator->UpdateUserObject($oUser);
		}
		return true;
	}	
	
}