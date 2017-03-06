<?php

namespace Aurora\Modules\FilesTableviewWebclientPlugin;

class Module extends \Aurora\System\Module\AbstractModule
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
		\Aurora\System\Api::checkUserRoleIsAtLeast(\EUserRole::Anonymous);
		
		$oUser = \Aurora\System\Api::getAuthenticatedUser();
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
		\Aurora\System\Api::checkUserRoleIsAtLeast(\EUserRole::NormalUser);
		
		$iUserId = \Aurora\System\Api::getAuthenticatedUserId();
		if (0 < $iUserId)
		{
			$oCoreDecorator = \Aurora\System\Api::GetModuleDecorator('Core');
			$oUser = $oCoreDecorator->GetUser($iUserId);
			$oUser->{$this->GetName().'::EnableModule'} = $EnableModule;
			$oUser->{$this->GetName().'::EnablePreviewPane'} = $EnablePreviewPane;
			$oCoreDecorator->UpdateUserObject($oUser);
		}
		return true;
	}	
	
}