
//★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
//
//スイッチを使って、アイテムの使用可能判定をします。
//
//使い方
//アイテムのメモ欄に<ITEM_USE_SWITCH_n>(nはスイッチ番号）と書きます。
//そのスイッチがONの時、そのアイテムは使用出来ません。
//
//★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

//--------------------------------------------------------------------------
// ★ システムワードの登録：使用可能にするスイッチの番号
//--------------------------------------------------------------------------

Game_BattlerBase.prototype.itemUseSwitch = function(item){
	var regex = /<ITEM_USE_SWITCH_(\d+)>/;
	return regex.test(item.note) ? parseInt(item.note.replace(regex, "$1")) : 0;
}

//==============================================================================
// ■ Game_BattlerBase
//------------------------------------------------------------------------------
// 　バトラーを扱う基本のクラスです。主に能力値計算のメソッドを含んでいます。こ
// のクラスは Game_Battler クラスのスーパークラスとして使用されます。
//==============================================================================

Game_BattlerBase.prototype.canUse = function(item) {
	//--------------------------------------------------------------------------
	// ● スキル／アイテムの使用可能判定
	//--------------------------------------------------------------------------
	if (!!item ) {
		if(this.itemUseSwitch(item) != 0){
			if($gameSwitches.value(this.itemUseSwitch(item)) == true){
				return false;
			}

		}
	}
	if (DataManager.isSkill(item)) {
	    return this.meetsSkillConditions(item);
	}
	if (DataManager.isItem(item)) {
	    return this.meetsItemConditions(item);
	}
	return false;
};
