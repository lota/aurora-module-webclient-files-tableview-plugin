<?php
/**
 * @copyright Copyright (c) 2017, Afterlogic Corp.
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 */

namespace Aurora\Modules\FilesTableviewWebclientPlugin;

/**
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
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