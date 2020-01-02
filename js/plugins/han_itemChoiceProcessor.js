//******************************************************************************
//
//    ＊ アイテム選択の処理
//
//  --------------------------------------------------------------------------
//    バージョン ： 1.2.0
//    対      応 ： RPGツクールVX Ace : RGSS3
//    制  作  者 ： ＣＡＣＡＯ
//    配  布  元 ： http://cacaosoft.webcrow.jp/
//  --------------------------------------------------------------------------
//   == 概    要 ==
//
//   ： キーアイテム以外のものも選べるようにします。
//   ： ヘルプウィンドウを表示する機能を追加します。
//
//  --------------------------------------------------------------------------
//   == 注意事項 ==
//
//    ※ 変数には、ＩＤではなくアイテムのデータが代入されます。
//    ※ 選択しなかった場合は 0 が代入されます。
//
//  --------------------------------------------------------------------------
//   == 使用方法 ==
//
//    ★ 選択アイテムの設定する
//     $game_message.item_choice_category にキーワードを代入してください。
//     :all      .. すべての所持品
//     :all_item .. すべてのアイテム
//     :item     .. キーアイテム以外のアイテム
//     :weapon   .. すべての武器
//     :armor    .. すべての防具
//     :equip    .. 武器と防具
//     :sell     .. キーアイテム以外で価格が０でないもの
//     "keyword" .. メモ欄に <keyword> と書かれているもの
//
//    ★ ショップアイテムから選択する
//     $game_message.item_choice_from_goods = true
//     このスクリプトを実行後、ショップの処理でアイテムを設定してください。
//
//    ★ 所持数を非表示にする
//     $game_message.item_choice_hide_number = true
//
//    ★ キャンセルを無効にする
//     $game_message.item_choice_cancel_disabled = true
//
//    ★ 未所持アイテムも表示する
//     $game_message.item_choice_show_nothing = true
//
//    ※ 上記４つの設定は、アイテム選択の処理後に初期化されます。
//
//    ★ アイテム選択ウィンドウの行数を変更する
//     $game_message.item_choice_line = 行数
//
//    ★ ヘルプウィンドウの行数を変更する
//     $game_message.item_choice_help_line = 行数
//     ※ 0 のときは、ヘルプウィンドウが非表示になります。
//
//    ★ カテゴリのアイテム所持数を取得する
//     $game_party.item_count(category)
//     category は、$game_message.item_choice_category と同じものです。
//
//
//******************************************************************************

//==============================================================================
// ◆ 設定項目
//==============================================================================
if(typeof CAO === 'undefined'){
	function CAO(){
		throw new Error('This is a static class');
	}
}
if(typeof CAO_ItemChoice === 'undefined'){
	function CAO_ItemChoice(){
		throw new Error('This is a static class');
	}
}
//--------------------------------------------------------------------------
// ◇ 種類によるＩＤの増加値
//--------------------------------------------------------------------------
CAO_ItemChoice.PLUS_ID = 1000;
//--------------------------------------------------------------------------
// ◇ 行数の設定 (初期値)
//--------------------------------------------------------------------------
CAO_ItemChoice.ITEM_LINE = 3	;       // アイテム選択ウィンドウ
CAO_ItemChoice.HELP_LINE = 1;       // ヘルプウィンドウ ( 0 のとき非表示)
//--------------------------------------------------------------------------
// ◇ 表示位置の設定
//--------------------------------------------------------------------------
CAO_ItemChoice.POS_TOP = true;
/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                下記のスクリプトを変更する必要はありません。                 			 //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////

//--------------------------------------------------------------------------
// ● メソッド定義の取り消し
//--------------------------------------------------------------------------
CAO.DummyItemList = function(){
    this.initialize.apply(this, arguments);
}
CAO.DummyItemList.prototype = Object.create(Window_ItemList.prototype);
CAO.DummyItemList.prototype.constructor = CAO.DummyItemList;
CAO.DummyItemList.prototype.initialize = function(){
	this._category = "none";
}
//--------------------------------------------------------------------------
// ● カテゴリのアイテム所持数を取得
//--------------------------------------------------------------------------
CAO.DummyItemList.prototype.count = function(category){
	this._category = category;
	return $gameParty.allItems.filter(function(item){
		return this.includes(item);
	}).length;
}
//--------------------------------------------------------------------------
// ● カテゴリのアイテム所持数を取得
//--------------------------------------------------------------------------

Game_Party.prototype.itemCount = function(category){
	return (new CAO.DummyItemList()).count(category)
}
//--------------------------------------------------------------------------
// ● 公開インスタンス変数
//--------------------------------------------------------------------------
Game_Message.prototype.itemChoiceCategory       = "";        // アイテム選択 カテゴリ
Game_Message.prototype.itemChoiceFromGoods      = false;     // アイテム選択 商品から選択
Game_Message.prototype.itemChoiceGoods          = [];       // アイテム選択 選択アイテム
Game_Message.prototype.itemChoiceHideNumber     = false;      // アイテム選択 所持数非表示
Game_Message.prototype.itemChoiceCancelDisabled = false;  // アイテム選択 キャンセル無効
Game_Message.prototype.itemChoiceShowNothing    = false;     // アイテム選択 未所持でも表示
Game_Message.prototype.itemChoiceLine           = 0;     // アイテム選択 行数
Game_Message.prototype.itemChoiceHelpLine       = 0;   // アイテム選択 ヘルプの行数

Game_Message.prototype.clearItemChoice = function(){
  this.itemChoiceCategory = "keyItem";
  this.itemChoiceFromGoods = false;
  this.itemChoiceGoods = [];
  this.itemChoiceHideNumber = false;
  this.itemChoiceCancelDisabled = false;
  this.itemChoiceShowNothing = false;
}
var _CAO_itemChoice_comand302 = Game_Interpreter.prototype.comand302;
Game_Interpreter.prototype.comand302 = function(){
	//_CAO_itemChoice_comand302
	if($gameMessage.itemChoiceFromGoods){
		var goods = [this._params];
		while (this.nextEventCode() === 605) {
			this._index++;
			goods.push(this.currentCommand().parameters);
		}
		$gameMessage.itemChoiceGoods = [];
		goods.forEach(function(param){
			var item;
			switch (param) {
				case 0:
					item = $dataItems[param[1]];
				break;
				case 1:
					item = $dataWeapons[param[1]];
				break;
				case 2:
					item = $dataArmors[param[1]];
				break;
				default:
				break;
			}
			if(item !== undefined){
				$gameMessage.itemChoiceGoods.push(item);
			}
		})
	}else{
		_CAO_itemChoice_comand302.call(this);
	}
}
//-------------------------------------------------------------------------
// ○ アイテムをリストに含めるかどうか
//--------------------------------------------------------------------------
var _CAO_itemChoice_includes = Window_ItemList.prototype.includes;
Window_ItemList.prototype.includes = function(item){
	if(this._category === 'all'){
		return item != null || item != undefined;
	}else if(this._category === 'all_item'){
 		return DataManager.isItem(item);
	}else if(this._category === 'equip'){
		return DataManager.isWeapon(item) || DataManager.isArmor(item);
	}else if(this._category === 'item'){
		return DataManager.isItem(item) && item.itypeId === 1 && this.includeKeyword(item);
	}else if(this._category === 'sell'){
		if(item != null || item != undefined) return false;
		if(item.price == 0) return false;
		if(DataManager.isItem(item) && item.itypeId === 2 ) return false;
		return true;
	}else if((typeof this._category === "string")){
		return item && (item.note.indexOf("<"+this._category+">") > -1)
	}else{
		_CAO_itemChoice_includes.call(this, item);
	}
}
Window_ItemList.prototype.maxCols = function() {
    return 1;
};
/*
//--------------------------------------------------------------------------
// ◎ オブジェクト解放 ->???
//--------------------------------------------------------------------------
Window_EventItem.prototype.dispose = function(){
	if(this._helpWindow != null && this._helpWindow != undefined)
		this._helpWindow.dispose();
	Window_ItemList.prototype.dispose.call(this);
}*/
//--------------------------------------------------------------------------
// ◎ ウィンドウを開く
//--------------------------------------------------------------------------
Window_EventItem.prototype.open = function(){
	if(this._messageWindow._helpWindow != null && this._messageWindow._helpWindow != undefined)
		this._messageWindow._helpWindow.open();
	Window_ItemList.prototype.open.call(this);
}

//--------------------------------------------------------------------------
// ◎ ウィンドウを閉じる
//--------------------------------------------------------------------------
Window_EventItem.prototype.close = function(){
	if(this._messageWindow._helpWindow != null && this._messageWindow._helpWindow != undefined)
		this._messageWindow._helpWindow.close();
	Window_ItemList.prototype.close.call(this);
}
//--------------------------------------------------------------------------
// ◎ アイテムリストの作成
//--------------------------------------------------------------------------
//alias _cao_itemchoice_make_item_list make_item_list unless $!
var _CAO_itemChoice_makeItemList  = Window_EventItem.prototype.makeItemList;
Window_EventItem.prototype.makeItemList = function(){
	if($gameMessage.itemChoiceShowNothing){
		if($gameMessage.itemChoiceFromGoods){
			this._data = $gameMessage.itemChoiceGoods;
		}else{
			var items = $dataItems.concat($dataWeapons).concat($dataArmors);
			this._data = $dataItems.filter(function(item){
				return this.includes(item);
			}, this);
		}
	}else{
		if($gameMessage.itemChoiceFromGoods){
			this._data = $gameParty.allItems().reduce(function(acc, allItem){
				var sameIdx = $gameMessage.itemChoiceGoods.findIndex(function(element){
					return element.id === allItem.id
				});
				if(sameIdx > -1) acc.push(allItem);
				return acc;
			},[])
		}else{
			_CAO_itemChoice_makeItemList.call(this);
		}
	}
	//this.createHelpWindow();
	this.height = this.fittingHeight($gameMessage.itemChoiceLine);
	this.updatePlacement();
}

//--------------------------------------------------------------------------
// ●
//--------------------------------------------------------------------------
/*Window_EventItem.prototype.createHelpWindow = function(){
	console.log("Window_EventItem.prototype.createHelpWindow")
	console.log(this._messageWindow._helpWindow);
	if(this._messageWindow._helpWindow != null) this._messageWindow._helpWindow.hide();
	if($gameMessage.itemChoiceHelpLine != 0){
		///this.setHelpWindow (new Window_Help($gameMessage.itemChoiceHelpLine));
	}
	this.height = this.fittingHeight($gameMessage.itemChoiceLine);
	this.updatePlacement();
}*/
//--------------------------------------------------------------------------
// ○ アイテムを許可状態で表示するかどうか
//--------------------------------------------------------------------------
// not need
//--------------------------------------------------------------------------
// ●
//--------------------------------------------------------------------------
Window_EventItem.prototype.setVariable = function(value){
	$gameVariables.setValue($gameMessage.itemChoiceVariableId(), value);
}
Window_EventItem.prototype.getVariable = function(){
	return $gameVariables.value($gameMessage.itemChoiceVariableId());
}
//--------------------------------------------------------------------------
// ○ 決定時の処理
//--------------------------------------------------------------------------
Window_EventItem.prototype.onOk = function(value){
	var item = this.item();
	if(item == null || item == undefined){
		this.setVariable(0);
	}else if(CAO_ItemChoice.PLUS_ID > 0){
		this.setVariable(item.id);
		if(DataManager.isWeapon(item)){
			this.setVariable(this.getVariable() + CAO_ItemChoice.PLUS_ID);
		}else if(DataManager.isArmor(item)){
			this.setVariable(this.getVariable() + CAO_ItemChoice.PLUS_ID * 2);
		}
	}else{
		this.setVariable(item);
	}
	this._messageWindow.terminateMessage();
	this.close();
}

//--------------------------------------------------------------------------
// ○ キャンセル処理の有効状態を取得
//--------------------------------------------------------------------------
Window_EventItem.prototype.isCancelEnabled = function(){
	return false;
}
//--------------------------------------------------------------------------
// ◎ フレーム更新
//--------------------------------------------------------------------------
//alias _cao_itemchoice_update update unless $!  ???
//if open? && self.active && Input.trigger?(:B)  ???
var _CAO_itemChoice_update = Window_EventItem.prototype.update;
Window_EventItem.prototype.update = function(){
		_CAO_itemChoice_update.call(this);
		if(this._messageWindow._helpWindow != null){
			this._messageWindow._helpWindow.setItem(this.item());	
			this._messageWindow._helpWindow.update();
		}
		if( this.isOpen() && this.active && Input.isTriggered("cancel")){
			Input.update();
			if($gameMessage.itemChoiceCancelDisabled){
				SoundManager.playBuzzer();
			}else{
				SoundManager.playCancel();
				this.deactivate();
				this.onCancel();
			}
		}
}
//--------------------------------------------------------------------------
// ○ ウィンドウ位置の更新
//--------------------------------------------------------------------------
Window_EventItem.prototype.updatePlacement = function(){
	var helpHeight = 0;
	if($gameMessage.itemChoiceHelpLine != 0){
		helpHeight = this._messageWindow._helpWindow.height;
	}
	if(CAO_ItemChoice.POS_TOP){
		if(this._messageWindow.isClosed()){
			this.y = helpHeight;
		}else if((this.height + helpHeight) < this._messageWindow.y){
			this.y = helpHeight;
		}else{
			this.y = this._messageWindow.y + this._messageWindow.height+ helpHeight;
		}
	}else{
		var mbh = Graphics.height - (this._messageWindow.y + this._messageWindow.height);
		if(this._messageWindow.isClosed()){
			this.y = Graphics.height - this.height;
		}else if(this.height + helpHeight < mbh){
			this.y = Graphics.height - this.height;
		}else{
			this.y = this._messageWindow.y - this.height;
		}
	}
	if($gameMessage.itemChoiceHelpLine != 0){
		this._messageWindow._helpWindow.y = this.y - this._messageWindow._helpWindow.height
	}
}
//--------------------------------------------------------------------------
// ○ アイテムの個数を描画
//--------------------------------------------------------------------------
var _CAO_itemChoice_drawItemNumber = Window_EventItem.prototype.drawItemNumber;
Window_EventItem.prototype.drawItemNumber = function(item, x, y, width){
	if(!$gameMessage.itemChoiceHideNumber) _CAO_itemChoice_drawItemNumber.call(this, item, x, y, width);
}
//--------------------------------------------------------------------------
// ○ アイテムの選択処理
//--------------------------------------------------------------------------

Window_Message.prototype.subWindows = function() {
	if(!this._helpWindow){
	    return [this._goldWindow, this._choiceWindow,
	            this._numberWindow, this._itemWindow];
	}else{
		return [this._goldWindow, this._choiceWindow,
	            this._numberWindow, this._itemWindow, this._helpWindow];
	}
};

Window_Message.prototype.createSubWindows = function() {

    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new Window_ChoiceList(this);
    this._numberWindow = new Window_NumberInput(this);
    this._itemWindow = new Window_EventItem(this);

	$gameMessage.itemChoiceLine     = $gameMessage.itemChoiceLine || CAO_ItemChoice.ITEM_LINE;
	$gameMessage.itemChoiceHelpLine = $gameMessage.itemChoiceHelpLine || CAO_ItemChoice.HELP_LINE;
	if($gameMessage.itemChoiceHelpLine != 0){
		this._helpWindow = new Window_Help($gameMessage.itemChoiceHelpLine);
		this._helpWindow.openness = 0;
		this._helpWindow.deactivate();
	}

};

Window_Message.prototype.startInput = function() {
    if ($gameMessage.isChoice()) {
        this._choiceWindow.start();
        return true;
    } else if ($gameMessage.isNumberInput()) {
        this._numberWindow.start();
        return true;
    } else if ($gameMessage.isItemChoice()) {
        this._itemWindow.start();
		this._itemWindow._category = $gameMessage.itemChoiceCategory || 'keyItem';
		$gameMessage.clearItemChoice();
        return true;
    } else {
        return false;
    }
};
/*
class Window_Message
  def input_item
    @item_window.start
    @item_window.category = ($game_message.item_choice_category || :key_item)
    Fiber.yield while @item_window.active
    $game_message.clear_item_choice
  end
end
*/
