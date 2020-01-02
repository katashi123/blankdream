//******************************************************************************
//
//    ＊ コマンドウィンドウ
//
//  --------------------------------------------------------------------------
//    バージョン ： 1.1.0
//    対      応 ： RPGツクールVX Ace : RGSS3
//    制  作  者 ： ＣＡＣＡＯ
//    配  布  元 ： http://cacaosoft.webcrow.jp/
//  --------------------------------------------------------------------------
//   == 概    要 ==
//
//    ： ウィンドウをベースとしたメニュー項目です。
//
//  --------------------------------------------------------------------------
//   == 注意事項 ==
//
//    ※ このスクリプトの動作には、Custom Menu Base が必要です。
//    ※ 項目の設定は、Custom Menu Base で行ってください。
//
//
//******************************************************************************
function Window_MenuMainCommand() {
    this.initialize.apply(this, arguments);
}

Window_MenuMainCommand.prototype = Object.create(Window_CustomMenuCommand.prototype);
Window_MenuMainCommand.prototype.constructor = Window_MenuMainCommand;

//==============================================================================
// ◆ 設定項目
//==============================================================================
//--------------------------------------------------------------------------
// ◇ ウィンドウの位置・サイズ
//--------------------------------------------------------------------------
//     縦幅を nil にすると項目数に合わせます。
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.WINDOW_X = 24;           // ｘ座標
Window_MenuMainCommand.prototype.WINDOW_Y = 120;           // ｙ座標
Window_MenuMainCommand.prototype.WINDOW_W = 320;          // 横幅
Window_MenuMainCommand.prototype.WINDOW_H = 50;    // 縦幅
//--------------------------------------------------------------------------
// ◇ 項目を横に並べる数
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.COLUMN_MAX = 2;
//--------------------------------------------------------------------------
// ◇ 横に項目が並ぶときの空白の幅
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.SPACING = 8;
//--------------------------------------------------------------------------
// ◇ 項目の表示位置
//--------------------------------------------------------------------------
//     value : アラインメント ('left'..左揃え、'center'..中央揃え、'right'..右揃え)
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.ALIGNMENT = 'left';
//--------------------------------------------------------------------------
// ◇ ウィンドウの可視状態
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.VISIBLE_BACKWINDOW = false;
/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                下記のスクリプトを変更する必要はありません。                             //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------------------------------
// ● オブジェクト初期化
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.initialize = function(x, y) {
    Window_CustomMenuCommand.prototype.initialize.call(this, "main");
    this.x = this.WINDOW_X;
    this.y = this.WINDOW_Y;
    this.opacity = this.VISIBLE_BACKWINDOW ? 255 : 0;
    this.padding = 8;
};
//--------------------------------------------------------------------------
// ● ウィンドウ幅の取得
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.windowWidth  = function() { return this.WINDOW_W;};
//--------------------------------------------------------------------------
// ● ウィンドウ高さの取得
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.windowHeight = function() { return this.WINDOW_H;};
//--------------------------------------------------------------------------
// ● 桁数の取得
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.maxCols = function() {
	return this.COLUMN_MAX < 0 ? this.maxItems() : this.COLUMN_MAX;
};
//--------------------------------------------------------------------------
// ● 横に項目が並ぶときの空白の幅を取得
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.spacing = function() {
	return this.SPACING;
};
//--------------------------------------------------------------------------
// ● アライメントの取得
//--------------------------------------------------------------------------
Window_MenuMainCommand.prototype.itemTextAlign = function() {
	return this.ALIGNMENT;
};
//--------------------------------------------------------------------------
// ○ コマンドウィンドウの作成
//--------------------------------------------------------------------------
Scene_Menu.prototype.createCommandWindow = function() {
	this._commandWindow = new Window_MenuMainCommand(0, 0);
	this._commandWindow.setHandler('cancel', this.popScene.bind(this));
	this._commandWindow.setHandlers(this);
	this.addWindow(this._commandWindow);
}
//--------------------------------------------------------------------------
// ○ コマンド実行後の処理
//--------------------------------------------------------------------------
var _CAO_CM_COMMAND_POST_TERMINATE = Scene_Menu.prototype.postTerminate
Scene_Menu.prototype.postTerminate = function(){
	_CAO_CM_COMMAND_POST_TERMINATE.call(this);
	if(this.currentConsole().currentData()._refreshItems.findIndex(function(i){return "command" == i}) > -1){
		this._commandWindow.refresh();
	}
}
