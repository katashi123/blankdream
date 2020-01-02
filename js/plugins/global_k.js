//=============================================================================
// global_k.js
//=============================================================================

/*:ja
 * @plugindesc グローバルスクリプト記述プラグイン k
 * @author 
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 * VX Ace移植の為のグローバルスクリプト記述プラグインです。
 * 
 */

//-----------------------------------------------------------------------------
//	グローバル変数
//-----------------------------------------------------------------------------


//----------------------------------------------------------------------------
//
//タイマーの表示・非表示切り替えスクリプト
//
//----------------------------------------------------------------------------
//タイマー表示
$game_timer_timer_visible = true;
Game_Interpreter.prototype.command118 = function() {

    var labelName = this._params[0];	//ラベル名取得


	if(! (labelName.match(/タイマーの操作：非表示/) == null)){
		$game_timer_timer_visible = false;
	}
	if(! (labelName.match(/タイマーの操作：表示/) == null)){
		$game_timer_timer_visible = true;
	}
//	console.log("ラベルコマンド:"+labelName);
    return true;
};

Game_Timer.prototype.stop = function() {
    this._working = false;
    $game_timer_timer_visible = true; // 終了時点で再表示
};

//フラグによるタイマーウィンドウ不可視化
Sprite_Timer.prototype.updateVisibility = function() {

    this.visible = $gameTimer.isWorking() && $game_timer_timer_visible;
};

