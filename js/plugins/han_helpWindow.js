//******************************************************************************
//
//    ＊ ヘルプウィンドウ
//
//  --------------------------------------------------------------------------
//    バージョン ： 1.1.0
//    対      応 ： RPGツクールVX Ace : RGSS3
//    制  作  者 ： ＣＡＣＡＯ
//    配  布  元 ： http://cacaosoft.webcrow.jp/
//  --------------------------------------------------------------------------
//   == 概    要 ==
//
//    ： 項目の説明を表示するウィンドウを追加します。
//
//  --------------------------------------------------------------------------
//   == 注意事項 ==
//
//    ※ このスクリプトの動作には、Custom Menu Base が必要です。
//
//
//******************************************************************************
function Window_MenuHelp() {
    this.initialize.apply(this, arguments);
}

Window_MenuHelp.prototype = Object.create(Window_Base.prototype);
Window_MenuHelp.prototype.constructor = Window_MenuHelp;
//==============================================================================
// ◆ 設定項目
//==============================================================================
//--------------------------------------------------------------------------
// ◇ ウィンドウの位置とサイズ
//--------------------------------------------------------------------------
Window_MenuHelp.prototype.WINDOW_X = 24;      // ｘ座標
Window_MenuHelp.prototype.WINDOW_Y = 70;      // ｙ座標
Window_MenuHelp.prototype.WINDOW_W = 640;    // 横幅
Window_MenuHelp.prototype.WINDOW_H = 50;     // 縦幅
//--------------------------------------------------------------------------
// ◇ テキストの最大表示行数
//--------------------------------------------------------------------------
Window_MenuHelp.prototype.ROW_MAX = 1;
//--------------------------------------------------------------------------
// ◇ ウィンドウの可視状態
//--------------------------------------------------------------------------
Window_MenuHelp.prototype.VISIBLE_BACKWINDOW = false;
/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                下記のスクリプトを変更する必要はありません。                             //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------------------------------
// ● オブジェクト初期化
//--------------------------------------------------------------------------
Window_MenuHelp.prototype.initialize = function(){
	Window_Base.prototype.initialize.call(this, this.WINDOW_X,this.WINDOW_Y,this.WINDOW_W,this.WINDOW_H);
	this.padding = 8;
	this.opacity = this.VISIBLE_BACKWINDOW ? 255 : 0;
	this._canvas = new CAO_CM_Canvas(this);
}
//--------------------------------------------------------------------------
// ● 行の高さを取得
//--------------------------------------------------------------------------
Window_MenuHelp.prototype.lineHeight = function(){
	return this.contentsHeight() / this.ROW_MAX;
}
Window_MenuHelp.prototype.fittingHeight = function(numLines) {
    return numLines * this.lineHeight();
};

Window_MenuHelp.prototype.contentsWidth = function() {
    return this.width;
};

Window_MenuHelp.prototype.contentsHeight = function() {
    return this.height;
};

//--------------------------------------------------------------------------
// ● テキスト設定
//--------------------------------------------------------------------------
Window_MenuHelp.prototype.setText = function(text){
	if (this._text !== text) {
		this._text = text;
		this.refresh();
	}
}
//--------------------------------------------------------------------------
// ● クリア
//--------------------------------------------------------------------------
Window_MenuHelp.prototype.clear = function() {
    this.setText('');
};
//--------------------------------------------------------------------------
// ● アイテム設定
//     item : スキル、アイテム等
//--------------------------------------------------------------------------
Window_MenuHelp.prototype.setItem = function(item) {
    this.setText(item ? item.description() : '');
};
//--------------------------------------------------------------------------
// ● リフレッシュ
//--------------------------------------------------------------------------
Window_MenuHelp.prototype.refresh = function() {
    this.contents.clear();
    this._canvas.drawTextEx(this._text, 0, 0);
};
//--------------------------------------------------------------------------
// ○ オプションウィンドウの作成
//--------------------------------------------------------------------------
var _CAO_CM_HELP_CREATE_OPTION_WINDOW = Scene_Menu.prototype.createOptionsWindow;
Scene_Menu.prototype.createOptionsWindow = function() {
    _CAO_CM_HELP_CREATE_OPTION_WINDOW.call(this);
	this._helpWindow = new Window_MenuHelp();
    this.addWindow(this._helpWindow);
};
//--------------------------------------------------------------------------
// ○ オプションウィンドウの更新
//--------------------------------------------------------------------------
var _CAO_CM_HELP_UPDATE_OPTION_WINDOW = Scene_Menu.prototype.updateOptionsWindow;
Scene_Menu.prototype.updateOptionsWindow = function() {
    _CAO_CM_HELP_UPDATE_OPTION_WINDOW.call(this);
	if(!(this._statusWindow && this._statusWindow.active)){
		this._helpWindow.setItem(this._commandWindow.currentData());
		if(this._subcommandWindow && this._subcommandWindow.active)
			this._helpWindow.setItem(this._subcommandWindow.currentData());
	}
};
var _CAO_CM_HELP_POST_TERMINATE = Scene_Menu.prototype.postTerminate;
Scene_Menu.prototype.postTerminate = function(){
	_CAO_CM_HELP_POST_TERMINATE.call(this);
	if(this.currentConsole().currentData()._refreshItems.findIndex(function(i){return "help" == i}) > -1){
		this._canvas.refresh();
	}
}
