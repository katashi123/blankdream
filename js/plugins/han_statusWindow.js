//******************************************************************************
//
//    ＊ ステータスウィンドウ
//
//  --------------------------------------------------------------------------
//    バージョン ： 1.1.0
//    対      応 ： RPGツクールVX Ace : RGSS3
//    制  作  者 ： ＣＡＣＡＯ
//    配  布  元 ： http://cacaosoft.webcrow.jp/
//  --------------------------------------------------------------------------
//   == 概    要 ==
//
//    ： デフォルトっぽいステータスです。
//
//  --------------------------------------------------------------------------
//   == 注意事項 ==
//
//    ※ このスクリプトの動作には、Custom Menu Base が必要です。
//    ※ 横１列のみの場合は左右に、それ以外は上下のみスクロールします。
//
//
//******************************************************************************
//==============================================================================
// ◆ 設定項目
//==============================================================================
//--------------------------------------------------------------------------
// ◇ ウィンドウの位置・サイズ
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.WINDOW_X = 0;  // ｘ座標
Window_MenuStatus.prototype.WINDOW_Y = 170;    // ｙ座標
Window_MenuStatus.prototype.WINDOW_W = 640;  // 横幅
Window_MenuStatus.prototype.WINDOW_H = 380;  // 縦幅
//--------------------------------------------------------------------------
// ◇ １アクターのサイズ
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.ITEM_W = 200;
Window_MenuStatus.prototype.ITEM_H = 350;
//--------------------------------------------------------------------------
// ◇ 項目を横に並べる数
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.COLUMN_MAX = 3;
//--------------------------------------------------------------------------
// ◇ 表示項目の設定
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.ITEM_PARAMS = [];
//ITEM_PARAMS << [:face,    2,  2, 94]
//ITEM_PARAMS << [:fill,    2,  2, 94, 94, 128, '!actor.battle_member?']
Window_MenuStatus.prototype.ITEM_PARAMS.push(["name",  80, 345]);
Window_MenuStatus.prototype.ITEM_PARAMS.push(["bust",  -30, 40]);
//ITEM_PARAMS << [:level, 104, 37]
//ITEM_PARAMS << [:state, 104, 67, 124]
//ITEM_PARAMS << [:class, 232,  7]
//ITEM_PARAMS << [:hp,    232, 37]
//ITEM_PARAMS << [:mp,    232, 67]
//--------------------------------------------------------------------------
// ◇ 戦闘メンバーのみ表示
//--------------------------------------------------------------------------
var BATTLER_ONLY = false;
//--------------------------------------------------------------------------
// ◇ ウィンドウの可視状態
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.VISIBLE_BACKWINDOW = false;
/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                下記のスクリプトを変更する必要はありません。                              //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------------------------------
// ○ オブジェクト初期化
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.initialize = function(x,y){
    Window_Selectable.prototype.initialize.call(this, this.WINDOW_X, this.WINDOW_Y, this.windowWidth(), this.windowHeight());
    this.padding = 0;
    this.opacity = this.VISIBLE_BACKWINDOW ? 255 : 0
    this._canvas = new CAO_CM_Canvas(this);
    this._pendingIndex = -1;
    this.refresh();
}
//--------------------------------------------------------------------------
// ○ 横に項目が並ぶときの空白の幅を取得
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.spacing = function() {
	return 0;
};
//--------------------------------------------------------------------------
// ● ウィンドウ幅の取得
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.windowWidth  = function() { return this.WINDOW_W;};
//--------------------------------------------------------------------------
// ● ウィンドウ高さの取得
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.windowHeight = function() { return this.WINDOW_H;};
//--------------------------------------------------------------------------
// ○ ウィンドウ内容の幅を計算
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.contentsWidth = function() {
    return (this.itemWidth() + this.spacing()) * this.maxCols() - this.spacing();
};
Window_MenuStatus.prototype.contentsHeight = function() {
    return this.height
};
//--------------------------------------------------------------------------
// ● 項目数の取得
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.maxItems = function() { return $gameParty.members().length; };
//--------------------------------------------------------------------------
// ● 桁数の取得
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.maxCols = function() { return this.COLUMN_MAX;};
//--------------------------------------------------------------------------
// ○ 項目の幅を取得
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.itemWidth = function() { return this.ITEM_W;};
//--------------------------------------------------------------------------
// ○ 項目の高さを取得
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.itemHeight = function() { return this.ITEM_H;};
//--------------------------------------------------------------------------
// ● 項目の描画
//--------------------------------------------------------------------------
Window_MenuStatus.prototype.drawItem = function(index) {
    this.drawItemBackground(index);
    var actor = $gameParty.members()[index];
    var rect  = this.itemRect(index);
    this._canvas.drawActorItems(actor, rect.x, rect.y, this.ITEM_PARAMS)
};
Window_MenuStatus.prototype.drawAllItems = function() {
	for(var i = 0 ; i < this.maxItems() ; i++){
		this.drawItem(i)
	}
};
Window_MenuStatus.prototype.updateBackOpacity = function(value) {
    this.backOpacity = new Number(value);
};

 //--------------------------------------------------------------------------
 // ● カーソルを下に移動
 //--------------------------------------------------------------------------
 Window_MenuStatus.prototype.cursorDown = function(wrap) {
     warp = warp || false;
     var index = this.index();
     var maxItems = this.maxItems();
     var maxCols = this.maxCols();
     if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
         this.select((index + maxCols) % maxItems);
     }else if(maxCols != 1 && index < parseInt(parseFloat(maxItems) / maxCols) * maxCols - maxCols){
        this.select(maxItems - 1);
     }
 };
 //--------------------------------------------------------------------------
 // ● ステータスウィンドウの作成
 //--------------------------------------------------------------------------
Scene_Menu.prototype.createStatusWindow = function() {
	this._statusWindow = new Window_MenuStatus(0, 0);
	this.addWindow(this._statusWindow);
}
//--------------------------------------------------------------------------
// ● ステータスウィンドウの更新
//--------------------------------------------------------------------------
Scene_Menu.prototype.updateStatusWindow = function() {
	if(!this._statusWindow.active) this._statusWindow.deselect();
}
//--------------------------------------------------------------------------
// ○ コマンド実行後の処理
//--------------------------------------------------------------------------
var _CAO_CM_STATUS_POST_TERMINATE = Scene_Menu.prototype.postTerminate;
Scene_Menu.prototype.postTerminate = function(){
	_CAO_CM_STATUS_POST_TERMINATE.call(this);
	if(this.currentConsole().currentData()._refreshItems.findIndex(function(i){return "status" == i}) > -1){
		this._statusWindow.refresh();
	}
}
Game_Party.prototype.inMenu = function(){
    if(SceneManager._scene.constructor === Scene_Menu) return true;
    return false;
    /*do not need to..
    return true if SceneManager.scene_is?(Scene_Menu)
    return SceneManager.instance_variable_get(:@stack).any? do |obj|
      obj.is_a?(Scene_Menu)
    end*/
}
//--------------------------------------------------------------------------
// ○ メンバーの取得
//--------------------------------------------------------------------------
Game_Party.prototype.members = function() {
    return this.inBattle() ? this.battleMembers() :
           BATTLER_ONLY && this.inMenu() ? this.battleMembers() :
           this.allMembers();
};
//--------------------------------------------------------------------------
// ○ サブウィンドウの表示
//--------------------------------------------------------------------------
Scene_ItemBase.prototype.showSubWindow = function(window) {
    window.x = this.isCursorLeft() ? Graphics.boxWidth - window.width : 0;
    window.y = this.isCursorLeft() ? Graphics.boxHeight - window.height : 0;
    window.show();
    window.activate();
};
//--------------------------------------------------------------------------
// ○ サブウィンドウの非表示
//--------------------------------------------------------------------------
Scene_ItemBase.prototype.hideSubWindow = function(window) {
    window.hide();
    window.deactivate();
    this.activateItemWindow();
};
