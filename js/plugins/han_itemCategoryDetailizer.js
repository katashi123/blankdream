//******************************************************************************
//
//    ＊ アイテム分類の細分化
//
//  --------------------------------------------------------------------------
//    バージョン ： 1.0.1
//    対      応 ： RPGツクールVX Ace : RGSS3
//    制  作  者 ： ＣＡＣＡＯ
//    配  布  元 ： http://cacaosoft.webcrow.jp/
//  --------------------------------------------------------------------------
//   == 概    要 ==
//
//   ： アイテム画面での分類を細かく設定できるようにします。
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
if(typeof CAO.CategorizeItem === 'undefined'){
	CAO.CategorizeItem = function(){
		throw new Error('This is a static class');
	}
}
//--------------------------------------------------------------------------
// ◇ カテゴリの設定
//--------------------------------------------------------------------------
CAO.CategorizeItem.COMMANDS = ["keyItem","item"];
//--------------------------------------------------------------------------
// ◇ カテゴリ名の設定
//--------------------------------------------------------------------------
CAO.CategorizeItem.VOCAB_COMMANDS = {};
CAO.CategorizeItem.VOCAB_COMMANDS.item = [531, "鍵"];
CAO.CategorizeItem.VOCAB_COMMANDS.equip = [433, "装備品"];
CAO.CategorizeItem.VOCAB_COMMANDS.keyItem = [337, "アイテム"];
CAO.CategorizeItem.VOCAB_COMMANDS.weapon = "武器";
CAO.CategorizeItem.VOCAB_COMMANDS.armor  = "防具";
CAO.CategorizeItem.VOCAB_COMMANDS.etype1 = "盾";
CAO.CategorizeItem.VOCAB_COMMANDS.etype2 = "頭";
CAO.CategorizeItem.VOCAB_COMMANDS.etype3 = "身体";
CAO.CategorizeItem.VOCAB_COMMANDS.etype4 = "装飾";
//--------------------------------------------------------------------------
// ◇ アイテムにキーワードアイテムを含める
//--------------------------------------------------------------------------
CAO.CategorizeItem.INCLUDE_KEYWORD = true;
//--------------------------------------------------------------------------
// ◇ カーソルの可視状態
//--------------------------------------------------------------------------
CAO.CategorizeItem.VISIBLE_CURSOR  = true;

/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                下記のスクリプトを変更する必要はありません。               				 //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////

//--------------------------------------------------------------------------
// ○ 桁数の取得
//--------------------------------------------------------------------------
Window_ItemCategory.prototype.maxCols = function(){
	return CAO.CategorizeItem.COMMANDS.length;
}
//--------------------------------------------------------------------------
// ○ コマンドリストの作成
//--------------------------------------------------------------------------
Window_ItemCategory.prototype.makeCommandList = function(){
	CAO.CategorizeItem.COMMANDS.map(function(command){
		this.addCommand(CAO.CategorizeItem.VOCAB_COMMANDS[command], command);
	}.bind(this))
}
//--------------------------------------------------------------------------
// ○ 項目の描画
//--------------------------------------------------------------------------
Window_ItemCategory.prototype.drawAllItems = function() {
	for(var i = 0 ; i < this.maxItems() ; i++){
		this.drawItem(i)
	}
};
Window_ItemCategory.prototype.drawItem = function(index){
	var rect = this.itemRectForText(index);
	var param = this.commandName(index);
	if(Array.isArray(param) && (typeof param[1] === "string")) {
		var ww = (rect.width - this.contents.measureTextWidth(param[1]) - 24)
		var temp_ww = ww-20;
		ww = 0 < temp_ww ? temp_ww : 0;
		rect.x += ww / 2;
		this.drawIcon(param[0], rect.x, rect.y + 2);
		rect.x += 24;
		rect.width -= ww + 24;
		this.changeTextColor(this.normalColor());
		this.drawText(param[1], rect.x, rect.y, rect.width, this.itemTextAlign());
	}else if(typeof param === "string"){
		this.changeTextColor(this.normalColor());
		this.drawText(param, rect.x, rect.y, rect.width, this.itemTextAlign());
	}else{
		var iconIndex = 0;
		rect.x += (rect.width - 24) / 2;
		if(Array.isArray(param)){
			iconIndex = param[(param[1] && this.index === index) ? 1 : 0];
		}else{
			iconIndex = param;
		}
		this.drawIcon(iconIndex, rect.x, rect.y);
	}
}


//--------------------------------------------------------------------------
// ○ カーソル位置の設定
//--------------------------------------------------------------------------
/*def index=(index)
  last_index = @index
  super
  refresh if @index != last_index
end*/
Window_ItemCategory.prototype.index = function(index){
	return this._index;
}
/*
var lastIndex = this._index;
Window_Selectable.prototype.index.call(this);
if(this._index != lastIndex){
	this.refresh();
}
*/
//--------------------------------------------------------------------------
// ○ カーソルの更新
//--------------------------------------------------------------------------
Window_ItemCategory.prototype.updateArrows = function(){
	Window_Selectable.prototype.updateArrows.call(this);
	if(!CAO.CategorizeItem.VISIBLE_CURSOR){
		this.setCursorRect(0, 0, 0, 0);
	}
}

//--------------------------------------------------------------------------
// ● 正規表現
//--------------------------------------------------------------------------
Window_ItemList.prototype.REGEXP_ETYPE = /etype(\d+)/;
Window_ItemList.prototype.REGEXP_WTYPE = /wtype(\d+)/;
Window_ItemList.prototype.REGEXP_ATYPE = /atype(\d+)/;
//--------------------------------------------------------------------------
// ○ アイテムをリストに含めるかどうか
//--------------------------------------------------------------------------
Window_ItemList.prototype.includes = function(item) {
	if(this._category === 'all'){
		return item != null || item != undefined;
	}else if(this._category === 'all_item'){
 		return DataManager.isItem(item) && this.includeKeyword(item);
	}else if(this._category === 'item'){
		return DataManager.isItem(item) && item.itypeId === 1 && this.includeKeyword(item);
	}else if(this._category === 'equip'){
		return DataManager.isWeapon(item) || DataManager.isArmor(item);
	}else if(this._category === 'weapon'){
		return DataManager.isWeapon(item);
	}else if(this._category === 'armor'){
		return DataManager.isArmor(item);
	}else if(this._category === 'keyItem'){
		return DataManager.isItem(item) && item.itypeId === 2 && this.includeKeyword(item);
	}else if((typeof this._category === "string")){
		return item && (item.note.indexOf("<"+this._category+">") > -1)
	}else{
		if(this.REGEXP_ETYPE.exec(this._category)){
			return (DataManager.isWeapon(item) || DataManager.isArmor(item))
			       && item.wtypeId == parseInt(this._category.replace(REGEXP_WTYPE, '$1'), 10);
		}else if(this.REGEXP_WTYPE.exec(this._category)){
			return DataManager.isWeapon(item)
			       && item.wtypeId == parseInt(this._category.replace(REGEXP_WTYPE, '$1'), 10);
		}else if(this.REGEXP_ATYPE.exec(this._category)){
			return DataManager.isArmor(item)
			       && item.wtypeId == parseInt(this._category.replace(REGEXP_ATYPE, '$1'), 10);
		}else{
			return false;
		}
	}
};
//--------------------------------------------------------------------------
// ● アイテムにキーワードアイテムを含めるか
//--------------------------------------------------------------------------
Window_ItemList.prototype.includeKeyword = function(item) {
	if(CAO.CategorizeItem.INCLUDE_KEYWORD){
		return true;
	}else{
		return !(item && /<.+?>/.exec(item.note))
	}
}
Scene_Item.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(1);
    this.addWindow(this._helpWindow);
};
