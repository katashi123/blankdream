//******************************************************************************
//
//    ＊ Custom Menu Base
//
//  --------------------------------------------------------------------------
//    バージョン ： 1.1.1
//    対      応 ： RPGツクールVX Ace : RGSS3
//    制  作  者 ： ＣＡＣＡＯ
//    配  布  元 ： http://cacaosoft.webcrow.jp/
//  --------------------------------------------------------------------------
//   == 概    要 ==
//
//    ： カスタムメニューのベーススクリプトです。
//
//  --------------------------------------------------------------------------
//   == 注意事項 ==
//
//    ※ このスクリプトは、なるべく下のほうのに導入してください。
//    ※ カスタムメニュー関連のスクリプトより上に導入してください。
//
//
//******************************************************************************
//==============================================================================
// ◆ ユーザー設定
//==============================================================================

 function CAO_CM(){
	throw new Error('This is a static class');
}
//--------------------------------------------------------------------------
// ◇ メニュー項目の設定
//--------------------------------------------------------------------------
CAO_CM.COMMAND_ITEMS = {};
CAO_CM.COMMAND_ITEMS.item = {
	"name"     : "アイテム",
    "command"  : Scene_Item,
    "icon" 	   : 385,
    "help"     : '所持しているアイテムを確認します。'
}
CAO_CM.COMMAND_ITEMS.load = {
	"name"     : "ロード",
    "command"  : Scene_Load,
    "icon" 	   : 337,
	"enable"   : "DataManager.isAnySavefileExists();",
    "help"     : 'セーブデータをロードします。'
}
CAO_CM.COMMAND = {};// <= 消さない！
// メインコマンド 必須
CAO_CM.COMMAND.main = ["item", "load"];
// サブコマンド
CAO_CM.COMMAND.file = ["save", "load"];
CAO_CM.COMMAND.sub  = ["item", "status", "sw", "script", "common", "common2", "common3"];
//--------------------------------------------------------------------------
// ◇ コマンドウィンドウの文字サイズ
//--------------------------------------------------------------------------
CAO_CM.COMMAND_SIZE = 32;
//--------------------------------------------------------------------------
// ◇ コマンドウィンドウの一行の縦幅
//--------------------------------------------------------------------------
//     0 で文字サイズを基準に自動調整
//--------------------------------------------------------------------------
CAO_CM.COMMAND_HEIGHT = 0;
//--------------------------------------------------------------------------
// ◇ 残りＨＰで顔グラを変化させる
//--------------------------------------------------------------------------
CAO_CM.EXPRESSIVE_RATE = [50, 25, 0];
CAO_CM.EXPRESSIVE_RATE = [];
//--------------------------------------------------------------------------
// ◇ 立ち絵のファイル名
//--------------------------------------------------------------------------
CAO_CM.PORTRAIT_NAME = "MActor%1";
//--------------------------------------------------------------------------
// ◇ コモンイベントの自動実行
//--------------------------------------------------------------------------
CAO_CM.START_COMMON_ID     = 0;     // 開始前処理
CAO_CM.TERMINATE_COMMON_ID = 0;     // 終了前処理

//--------------------------------------------------------------------------
// ◇ 背景画像
//--------------------------------------------------------------------------
// 前景画像（最前面に表示されます。）
CAO_CM.FILE_FOREGROUND = null;
// 背景画像（デフォルトのマップ画像と入れ替えます。）
CAO_CM.FILE_BACKGROUND = null;
// アニメ画像 ["ファイル名", vx, vy, 最背面？]
CAO_CM.BACKIMAGE = null;
//--------------------------------------------------------------------------
// ◇ システム文字の有無
//--------------------------------------------------------------------------
CAO_CM.VISIBLE_SYSTEM = true;
//--------------------------------------------------------------------------
// ◇ 用語設定
//--------------------------------------------------------------------------
CAO_CM.VOCABS = {};
CAO_CM.VOCABS.gold  = "所持金";
CAO_CM.VOCABS.exp   = "経験値";
CAO_CM.VOCABS.expA  = "LvUP";

////////////////////////////////////////////////////////////////////////////////
//                                                                             /
//                下記のスクリプトを変更する必要はありません。                 			 /
//                                                                             /
////////////////////////////////////////////////////////////////////////////////
if(Array.prototype.findIndex == undefined){
	Array.prototype.findIndex = function(f){
		var _len = this.length;
		for(var i = 0; i < _len ; i++){
			if(f(this[i])){
				return i
			}
		}
		return -1;
	}
}


var CustomizeError = SceneManager.catchException;

function Game_MenuItem() {
    this.initialize.apply(this, arguments);
}
Game_MenuItem.prototype.contructor = Game_MenuItem;
Game_MenuItem.prototype.initialize = function(symbol, params) {
	this._symbol = symbol                          // 項目の識別子
	this._name   = params.name   || "";           // 項目名
	this._help   = params.help   || "";           // ヘルプ
	this._icon   = params.icon;                   // アイコン番号
	this._enable = params.enable || true;         // 選択の可否
	this._hidden   = params.hidden   || false;        // 非表示の有無

	this._scene    = params.scene;                // 項目処理 シーン遷移
	this._command  = params.command;              // 項目処理 コマンド実行
	this._personal = params.personal;             // 項目処理 アクター選択
	this._sub      = params.sub;                  // 項目処理 サブコマンド

	var commandCount = [this._scene, this._command, this._personal, this._sub].filter(function(item){
		return item != undefined;
	}).length;

	switch(commandCount){
		case 0 :
			throw new Error("項目処理が設定されていません。");
		case 1 :
			break;
		default :
			throw new Error("複数の項目処理が設定されています。");
	}
	this._refreshItems = params.refresh    || [];     // 項目処理後に再描画
	this._autoClose    = params.autoClose  || false;  // アクター選択時コマンドを閉じる
	this._continue     = params.continue   || false;  // アクター選択継続
	this._swSub        = params.swSub      || false;  // サブ表示時にメインを非表示
};
Game_MenuItem.prototype._convertValue = function(obj) {
	if(Array.isArray(obj)){
		if(typeof obj[0] === 'string'){
			var result = eval(obj[0]);
			if(obj.length === 1 )return result;
			if(result == !!result) return obj[result ? 1 : 2];
			return obj[result+1];
		}else if(typeof obj[0] === 'Number'){
			if(obj.length === 3)
				return obj[$gameSwitches[obj[0]] ? 1 : 2];
			else
				return obj[$gameSwitches[obj[0]]];
		}else{
			throw Error("must not happen");
		}
	}else{
		return obj;
	}
};

Game_MenuItem.prototype.name = function(){
	return this._convertValue(this._name);
}
Game_MenuItem.prototype.help = function(){
	return this._convertValue(this._help);
}
Game_MenuItem.prototype.description = function(){
	return this._convertValue(this._help);
}
Game_MenuItem.prototype.iconIndex = function(){
	return this._convertValue(this._icon);
}
//--------------------------------------------------------------------------
// ●
//--------------------------------------------------------------------------
Game_MenuItem.prototype.handler = function(){
	if(this._scene) return "commandOk";
	//if(this._command && this._command.is_a?(Symbol)) return this._command;
	if(this._command) return "commandOk"//this._command;//"commandOk"
	//if(this._personal && this._personal.is_a?(Symbol)) return this._command;
	if(this._personal) return this._personal;//"commandPersonal";
	if(this._sub) return this._sub;//"commandSub"
	throw Error("must not happen");

}
//--------------------------------------------------------------------------
// ●
//--------------------------------------------------------------------------
Game_MenuItem.prototype.exec = function(){
    // ここでエラーが発生した場合、項目の設定が間違っている可能性があります。
    // 項目処理の設定を確認してください。
    //
    // エラーメッセージを確認の上、設定を修正してください。
    // つづり間違いや文法が間違っている可能性があります。
	if(this._scene){
		if (this._scene instanceof Function){
			return SceneManager.push(this._scene);
		}
		// after
		/*if (this._scene instanceof String){
			return SceneManager.push(this._scene.untaint);
		}*/
	}else{
		var command = this._command || this._personal;
		if (command instanceof Function){
			return SceneManager.push(command);
		}else if (command instanceof String){
			return SceneManager._scene[command];
		}
	}
	throw new Error("must not happen");
};
Game_MenuItem.prototype.isHidden = function(){
	// ここでエラーが発生した場合、項目の設定が間違っている可能性があります。
	// オプションの hidden の設定を確認してください。
	if(this._hidden === true || this._hidden === false){
		return this._hidden;
	}else if(this._hidden instanceof String){
		return eval(this._hidden);
	}else{
		throw new Error("must not happen");
	}
}
Game_MenuItem.prototype.isPersonal = function(){
	return this._personal && true;
}
Game_MenuItem.prototype.isRefresh = function(){
	return !(this._refreshItems.length === 0)
}
Game_MenuItem.prototype.isSwitch = function(){
	return this._swSub;
}
Game_MenuItem.prototype.isAutoClose = function(){
	return this._autoClose;
}
Game_MenuItem.prototype.isContinue = function(){
	return this._isContinue;
}
function Game_Interpreter_ForCMB() {
    this.initialize.apply(this, arguments);
}
Game_Interpreter_ForCMB.prototype = Object.create(Game_Interpreter.prototype);
delete Game_Interpreter_ForCMB.prototype.command101         // 文章の表示
delete Game_Interpreter_ForCMB.prototype.command102         // 選択肢の表示
delete Game_Interpreter_ForCMB.prototype.command103         // 数値入力の処理
delete Game_Interpreter_ForCMB.prototype.command104         // アイテム選択の処理
delete Game_Interpreter_ForCMB.prototype.command105         // スクロール文章の表示
delete Game_Interpreter_ForCMB.prototype.command201         // 場所移動
delete Game_Interpreter_ForCMB.prototype.command204         // マップのスクロール
delete Game_Interpreter_ForCMB.prototype.command205         // 移動ルートの設定
delete Game_Interpreter_ForCMB.prototype.command217         // 隊列メンバーの集合
delete Game_Interpreter_ForCMB.prototype.command261         // ムービーの再生
delete Game_Interpreter_ForCMB.prototype.command301         // バトルの処理
delete Game_Interpreter_ForCMB.prototype.command351         // メニュー画面を開く
//--------------------------------------------------------------------------
// ○ 開始処理
//--------------------------------------------------------------------------

Scene_Menu.prototype.create = function(){
	Scene_MenuBase.prototype.create.call(this);
	if(CAO_CM.START_COMMON_ID > 0){
		this.startCommonEvent(CAO_CM.START_COMMON_ID);
	}
	this._caller = [];
	this.createCommandWindow();
	this.createStatusWindow();
	this.createOptionsWindow();
}
Scene_Menu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.refresh();
	this._commandWindow.refresh();
	this._helpWindow.refresh();
};
//--------------------------------------------------------------------------
// ○ フレーム更新
//--------------------------------------------------------------------------
Scene_Menu.prototype.update = function(){
	Scene_MenuBase.prototype.update.call(this);
	this._caller = [];
	this.updateBackImage();
	this.updateCommandWindow();
	this.updateStatusWindow();
	this.updateOptionsWindow();

}
//--------------------------------------------------------------------------
// ○ 終了前処理
//--------------------------------------------------------------------------
Scene_Menu.prototype.terminate = function(){
	Scene_MenuBase.prototype.terminate.call(this);
	if(CAO_CM.TERMINATE_COMMON_ID > 0){
		this.startCommonEvent(CAO_CM.TERMINATE_COMMON_ID);
		this.disposeCommandWindow();
		this.disposeStatusWindow();
		this.disposeOptionWindow();
	}
}
//--------------------------------------------------------------------------
// ○ 背景の作成
//--------------------------------------------------------------------------
Scene_Menu.prototype.createBackground = function(){
	if(CAO_CM.FILE_BACKGROUND){
		this._backgroundSprite = new Sprite();
		this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
		this.addChild(this._backgroundSprite);
	}else{
		this._backgroundSprite = new Sprite();
		this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
		this.addChild(this._backgroundSprite);
		this.setBackgroundOpacity(160);
	}
	if(CAO_CM.BACKIMAGE){
		//now need now
	}
	if(CAO_CM.FILE_FOREGROUND){
		/*this._foregroundSprite = new Sprite();
		this._foregroundSprite.bitmap = SceneManager.backgroundBitmap();
		this.addChild(this._foregroundSprite);*/
		//now need now
	}else{

	}

}
/*
//--------------------------------------------------------------------------
// ○ 背景の作成
//--------------------------------------------------------------------------
def create_background
  if CAO::CM::FILE_BACKGROUND
	@background_sprite = Sprite.new
	@background_sprite.bitmap = Cache.system(CAO::CM::FILE_BACKGROUND)
  else
	super
  end
  if CAO::CM::BACKIMAGE
	@backimage_sprite = Plane.new
	@backimage_sprite.bitmap = Cache.system(CAO::CM::BACKIMAGE[0])
	@backimage_sprite.z = -1 if CAO::CM::BACKIMAGE[3]
  end
  if CAO::CM::FILE_FOREGROUND
	@foreground_sprite = Sprite.new
	@foreground_sprite.z = 1000
	@foreground_sprite.bitmap = Cache.system(CAO::CM::FILE_FOREGROUND)
  end
end
//--------------------------------------------------------------------------
// ○ 背景の解放
//--------------------------------------------------------------------------
def dispose_background
  super
  @backimage_sprite.dispose if @backimage_sprite
  @foreground_sprite.dispose if @foreground_sprite
end
def update_backimage
  return unless @backimage_sprite
  return unless CAO::CM::BACKIMAGE[1] && CAO::CM::BACKIMAGE[2]
  @backimage_sprite.ox = (@backimage_sprite.ox - CAO::CM::BACKIMAGE[1]) % 999
  @backimage_sprite.oy = (@backimage_sprite.oy - CAO::CM::BACKIMAGE[2]) % 999
end
*/
Scene_Menu.prototype.updateBackImage = function(){} // not need
//--------------------------------------------------------------------------
// ● コマンドウィンドウの作成,更新,解放
//--------------------------------------------------------------------------
Scene_Menu.prototype.createCommandWindow = function(){}
Scene_Menu.prototype.updateCommandWindow = function(){}
Scene_Menu.prototype.disposeCommandWindow = function(){}
//--------------------------------------------------------------------------
// ● ステータスウィンドウの作成,更新,解放
//--------------------------------------------------------------------------
Scene_Menu.prototype.createStatusWindow = function(){}
Scene_Menu.prototype.updateStatusWindow = function(){}
Scene_Menu.prototype.disposeStatusWindow = function(){}
//--------------------------------------------------------------------------
// ● オプションウィンドウの作成,更新,解放
//--------------------------------------------------------------------------
Scene_Menu.prototype.createOptionsWindow = function(){}
Scene_Menu.prototype.updateOptionsWindow = function(){}
Scene_Menu.prototype.disposeOptionWindow = function(){}

//--------------------------------------------------------------------------
// ● コモンイベント予約判定
//    イベントの呼び出しが予約されているならマップ画面へ遷移する。
//--------------------------------------------------------------------------
Scene_Menu.prototype.checkCommonEvent = function(){
	if($gameTemp.isCommonEventReserved())
		SceneManager.goto(Scene_Map);
}
//--------------------------------------------------------------------------
// ● コモンベントの実行
//--------------------------------------------------------------------------
Scene_Menu.prototype.startCommonEvent = function(){
	if(this._statusWindow && this._statusWindow.index >= 0)
		$gameParty.menuActor = $gameParty.members()[this._statusWindow.index];
	this._interpreter = new Game_Interpreter_ForCMB();
	this._interpreter.setup($dataCommonEvents[this._commonEventId]);
	this._interpreter.update();
}
//--------------------------------------------------------------------------
// ● 現在アクティブなコマンドウィンドウ
//--------------------------------------------------------------------------
Scene_Menu.prototype.currentConsole = function(){
	return this._caller[this._caller.length - 1] || this._commandWindow;
}
//--------------------------------------------------------------------------
// ● 以前操作していたコマンドウィンドウ
//--------------------------------------------------------------------------
Scene_Menu.prototype.previousConsole = function(){
	return this._caller[this._caller.length - 2] ||  this._commandWindow;
}
//--------------------------------------------------------------------------
// ●
//--------------------------------------------------------------------------
Scene_Menu.prototype.changeConsole = function(pConsole){
	return this._caller.push(pConsole)
}
Scene_Menu.prototype.returnConsole = function(pConsole){
	this.currentConsole().deactivate().close();
	this.previousConsole().activate().open();
	return this._caller.pop();
}
//--------------------------------------------------------------------------
// ● コマンド実行後の処理
//--------------------------------------------------------------------------
Scene_Menu.prototype.postTerminate = function(){
	var item = this.currentConsole().currentData();
	if (this.currentConsole().isLocked()) {
		return this.currentConsole().activate();
	}
}
//--------------------------------------------------------------------------
// ● コマンド [決定]
//--------------------------------------------------------------------------
Scene_Menu.prototype.commandOk = function(){
	this.currentConsole().currentExec();
	this.postTerminate();
	this.checkCommonEvent();
}
//--------------------------------------------------------------------------
// ●
//--------------------------------------------------------------------------
Scene_Menu.prototype.commandSub = function(){
	if(this.currentConsole() == this._subcommandWindow){
		throw new Error("サブコマンドからは呼び出せません。");
	}
	if(this._commandWindow.currentData().isSwitched())
		this._commandWindow.close();
	var symbol = this._commandWindow.currentData()._sub;
	this._subcommandWindow.initCommand(symbol);
	this._subcommandWindow.clearHandler();
	this._subcommandWindow.setHandler('cancel', this.returnConsole.bine(this));
	//@subcommand_window.set_handlers(self)
	this.changeConsole(this._subcommandWindow);
	this.openSubCommand();
}
//--------------------------------------------------------------------------
// ○ コマンド［スキル］［装備］［ステータス］
//--------------------------------------------------------------------------
Scene_Menu.prototype.commandPersonal = function(){
	this._statusWindow.selectLast();
	this._statusWindow.activate();
	this._statusWindow.setHandler('ok',     this.onPersonalOk.bind(this));
	this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
	if(this.currentConsole().currentData().isAutoClose())
		this.currentConsole().close();
}
//--------------------------------------------------------------------------
// ○ 個人コマンド [決定]
//--------------------------------------------------------------------------
Scene_Menu.prototype.onPersonalOk = function(){
	this.commandOk();
	if(this.currentConsole().currentData().isContinue()){
		this.currentConsole().deactivate();
		this._statusWindow.activate();
	}
}
//--------------------------------------------------------------------------
// ○ 個人コマンド［終了］
//--------------------------------------------------------------------------
Scene_Menu.prototype.onPersonalCancel = function(){
	this._statusWindow.deselect();
	this.currentConsole().activate().open();
}
//--------------------------------------------------------------------------
// ○ 並び替え［キャンセル］
//--------------------------------------------------------------------------
Scene_Menu.prototype.onFormationCancel = function() {
    if (this._statusWindow.pendingIndex() >= 0) {
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.activate();
    } else {
        this._statusWindow.deselect();
        this.currentConsole().activate().open();
    }
};
//--------------------------------------------------------------------------
// ● サブコマンドウィンドウを開く
//--------------------------------------------------------------------------
Scene_Menu.prototype.openSubCommand = function() {
	if(SceneManager.isSceneChanging()) return;
	this._subcommandWindow.activate().open();
}
//--------------------------------------------------------------------------
// ● サブコマンドウィンドウを閉じる
//--------------------------------------------------------------------------
Scene_Menu.prototype.closeSubCommand = function() {
	this._subcommandWindow.deactivate().close();
}
if(typeof CustomMenuCommand === 'undefined'){
	function CustomMenuCommand(){
		throw new Error('This is a static class');
	}
}
if(typeof CAO.CM === 'undefined'){
	CAO.CM = function(){
		throw new Error('This is a static class');
	}
}

//no INCLUDE like ruby so the Function is needed to merge prototype
function includer(moduleClassPrototype, targetClassPrototype){
	Object.getOwnPropertyNames(moduleClassPrototype).forEach(function(method){
		targetClassPrototype[method] = moduleClassPrototype[method];
	})
}

function CustomMenuCommand() {
    throw new Error('This is a static class');
}
//--------------------------------------------------------------------------
// ● オブジェクト初期化
//--------------------------------------------------------------------------
//CustomMenuCommand.prototype.constructor = CustomMenuCommand;
CustomMenuCommand.prototype.initialize = function(ident) {
	this._ident = ident;
	//superFunc.call(this);
	this.unlock();
};


CustomMenuCommand.prototype.initCommand = function(ident) {
	this._ident = ident;
};
//--------------------------------------------------------------------------
// ● 項目数の取得
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.itemMax = function(ident) {
	return this._list.length;
};
//--------------------------------------------------------------------------
// ● コマンドリストのクリア
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.clearCommandList = function(ident) {
	this._list = [];
};
//--------------------------------------------------------------------------
// ● コマンドリストの作成
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.makeCommandList = function() {
	if(!this._ident) return;
	if(!CAO_CM.COMMAND[this._ident]){
		throw new Error("識別子 : "+this._ident+"+ のメニューコマンドの設定がありません。(COMMANDS)");
	}
	CAO_CM.COMMAND[this._ident].forEach(function(key){
		if(!CAO_CM.COMMAND_ITEMS[key]){
			//console.log("識別子 : "+key+"+ の項目の設定がありません。(COMMAND_ITEMS)");
			return;
		}
		var item = new Game_MenuItem(key, CAO_CM.COMMAND_ITEMS[key]);
		if(!item.isHidden())
			this._list.push(item)
	}.bind(this));
};
CustomMenuCommand.prototype.lock = function() {
	this._locked = true;
	return this;
}
CustomMenuCommand.prototype.unlock = function() {
	this._locked = false;
	return this;
}
CustomMenuCommand.prototype.isLocked = function() {
	return this._locked;
}
//--------------------------------------------------------------------------
// ● コマンドの有効状態を取得
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.isCommandEnabled = function(index) {
	var param = this._list[index]._enable;
	if(this._list[index].isPersonal() && !$gameParty.exists()) return false;
	if(param == true) return true;
	if(param == false) return false;
	if(typeof param === 'string') return eval(param);
	throw new Error("must not happen");
}
//--------------------------------------------------------------------------
// ● コマンド名の取得
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.commandName = function(index) {
	return this._list[index].name();
}
//--------------------------------------------------------------------------
// ● コマンドアイコン番号の取得
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.commandIconIndex = function(index) {
	return this._list[index].iconIndex();
}
//--------------------------------------------------------------------------
// ● 選択項目のコマンドデータを取得
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.currentData = function() {
	return this.index() >= 0 ? this._list[this.index()] : null;
}
//--------------------------------------------------------------------------
// ● 選択項目の有効状態を取得
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.isCurrentItemEnabled = function() {
	return this.index() >= 0 ? this.isCommandEnabled(this.index()) : false;
}
//--------------------------------------------------------------------------
// ● 選択項目のシンボルを取得
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.currentSymbol = function() {
	return this.currentData() ? this.currentData()._symbol : null;
}
//--------------------------------------------------------------------------
// ● 選択項目のインデックスを取得
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.currentIndex = function() {
	return this._list.findIndex(function(item){
		return item._symbol == this.currentSymbol();
	})
}
//--------------------------------------------------------------------------
// ● 選択項目の実行
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.currentExec = function() {
	this.currentData().exec();
}
//--------------------------------------------------------------------------
// ● 指定されたシンボルを持つコマンドにカーソルを移動
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.selectSymbol = function(symbol) {
	return this._list.map(function(item, idx){
		if(item._symbol === symbol) this.select(idx);
	}.bind(this));
}
//--------------------------------------------------------------------------
// ● ハンドラのクリア
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.clearHandler = function(symbol) {
	this._handler = {};
}
//--------------------------------------------------------------------------
// ● 動作に対応するハンドラの設定
//--------------------------------------------------------------------------
CustomMenuCommand.prototype.setHandlers = function(obj) {
	// ここでエラーが発生した場合、項目の設定が間違っている可能性があります。
	// 項目処理の設定を確認してください。
	//
	// NameError : undefined method `○○' for class `Scene_Menu'
	//   つづりが間違っていないか確認してください。
	//
	// NameError : undefined method `command_sub' for class `Scene_Menu'
	//  『サブコマンド』スクリプトが未導入の可能性があります。

	this._list.forEach(function(cmd){
		this._handlers[cmd._symbol] = obj[cmd.handler()].bind(obj);
	}.bind(this));
}

function Window_CustomMenuCommand() {
    this.initialize.apply(this, arguments);
}

Window_CustomMenuCommand.prototype = Object.create(Window_MenuCommand.prototype);
Window_CustomMenuCommand.prototype.constructor = Window_CustomMenuCommand;

includer(CustomMenuCommand.prototype, Window_CustomMenuCommand.prototype);

Window_CustomMenuCommand.prototype.initialize = function(ident) {
	this._ident = ident;
	Window_MenuCommand.prototype.initialize.call(this);
	this.unlock();
};
//--------------------------------------------------------------------------
// ● ウィンドウ内容の幅を計算
//--------------------------------------------------------------------------
Window_CustomMenuCommand.prototype.contentsWidth = function(ident) {
	return (this.itemWidth() + this.spacing()) * this.maxCols() - this.spacing();
}
Window_Base.prototype.contentsHeight = function() {
    return this.height + this.padding * 2;
};

//--------------------------------------------------------------------------
// ● 行の高さを取得
//--------------------------------------------------------------------------
Window_CustomMenuCommand.prototype.lineHeight = function(ident) {
	if(CAO_CM.COMMAND_HEIGHT == 0 ){
		return this.defaultFontSize()
	}else{
		return CAO_CM.COMMAND_HEIGHT;
	}
}
//--------------------------------------------------------------------------
// ● 横に項目が並ぶときの空白の幅を取得
//--------------------------------------------------------------------------
Window_CustomMenuCommand.prototype.spacing = function(){
	return 8;
}
//--------------------------------------------------------------------------
// ● 初期フォントサイズ
//--------------------------------------------------------------------------
Window_CustomMenuCommand.prototype.defaultFontSize = function(){
	if(CAO_CM.COMMAND_SIZE == 0) return this.standardFontSize();
	return CAO_CM.COMMAND_SIZE;
}
//--------------------------------------------------------------------------
// ● フォントサイズのリセット
//--------------------------------------------------------------------------
Window_CustomMenuCommand.prototype.resetFontSize = function(){
	this.contents.fontSize = this.standardFontSize();
}
//--------------------------------------------------------------------------
// ● カーソルを下に移動
//--------------------------------------------------------------------------
Window_CustomMenuCommand.prototype.cursorDown = function(wrap){
	var index = this.index();
	var maxItems = this.maxItems();
	var maxCols = this.maxCols();
	if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
		this.select((index + maxCols) % maxItems);
	}else if( maxCols != 1 && (index < parseInt((parseFloat(maxItems) / maxCols)) * maxCols - maxCols)){
		this.select(maxItems - 1);
	}
}
//--------------------------------------------------------------------------
// ● 項目の描画
//--------------------------------------------------------------------------
Window_CustomMenuCommand.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
	var enabled = this.isCommandEnabled(index);
	var align = this.itemTextAlign();
	if(this.commandIconIndex(index)){
		this.drawIcon(this.commandIconIndex(index), rect.x, rect.y, enabled);
		rect.x += 32;
		rect.width -= 36;
	}else{
		rect.x += 4;
		rect.width -=8;
	}
	this.resetTextColor();
	this.changePaintOpacity(enabled);
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_CustomMenuCommand.prototype.drawIcon = function(iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y+4, 24, 24);
};
//--------------------------------------------------------------------------
// ● リフレッシュ
//--------------------------------------------------------------------------
Window_CustomMenuCommand.prototype.refresh = function(index) {
	this.contents.clear();
	this.resetFontSize();
	this.drawAllItems();
};

Window_CustomMenuCommand.prototype.drawAllItems = function() {
	for(var i = 0 ; i < this.maxItems() ; i++){
		this.drawItem(i)
	}
};

function Sprite_CustomMenuCursor() {
    this.initialize.apply(this, arguments);
}

Sprite_CustomMenuCursor.prototype = Object.create(Sprite.prototype);
Sprite_CustomMenuCursor.prototype.constructor = Sprite_CustomMenuCursor;

function Sprite_CustomMenuCursor() {
    this.initialize.apply(this, arguments);
}

Sprite_CustomMenuCursor.prototype = Object.create(Sprite.prototype);
Sprite_CustomMenuCursor.prototype.constructor = Sprite_CustomMenuCursor;

Sprite_CustomMenuCursor.prototype.initialize = function(data) {
    Sprite.prototype.initialize.call(this);

    this._filename    = data[0];
    this._distanceX   = data[1] || 1;
    this._distanceY   = data[2] || 1;
    this._viewBehind = data[3] || data[3] == undefined;
    this._flashAmount = data[4] || 0;

	this.bitmap = ImageManager.loadSystem('GameOver');
	this.z = this._viewBehind ? -1 : 1;
	this.ox = this.bitmap.width / 2;
	this.oy = this.bitmap.height / 2;
	this._opacity = 0;
	this._animationSprites = [];
    this._effectTarget = this;
    this._hiding = false;
};
Sprite_CustomMenuCursor.prototype.update = function(){
	Sprite.prototype.update.call(this);
	this.updateFlash()
}
Sprite_CustomMenuCursor.prototype.updateFlash = function(){
	if(this._flashAmount == 0) return;
	var lastOpacity = this._opacity;
	this._opacity += this._flashAmount;
	if( lastOpacity ==  this._opacity) this._flashAmount *= -1;
}

function Spriteset_CustomMenuCommand() {
    this.initialize.apply(this, arguments);
}
Spriteset_CustomMenuCommand.prototype.constructor = Spriteset_CustomMenuCommand;
//--------------------------------------------------------------------------
// ● オブジェクト初期化
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.initialize = function() {
	this._handler = {};
	this._index = -1;
	this._x = 0;
	this._y = 0;

	this._visible = true;
	this._active = false;

	this._openness = 255;     // 変更は self.openness で行なう
	this._opening = false;
	this._closing = false;
};
//--------------------------------------------------------------------------
// ● 定数
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.OPEN_SPEED = 16;
//--------------------------------------------------------------------------
// ● クラスインスタンス変数
//--------------------------------------------------------------------------
Object.defineProperty(Spriteset_CustomMenuCommand.prototype, 'lastCommandSymbol', {
    get: function() {
        return Spriteset_CustomMenuCommand.prototype.LAST_COMMAND_SYMBOL || null;
    },
	set : function(symbol){
		Spriteset_CustomMenuCommand.prototype.LAST_COMMAND_SYMBOL = symbol;
	},
    configurable: true
});
//--------------------------------------------------------------------------
// ● 項目数の取得 (要再定義)
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.itemMax = function(){
	return 0;
}
//--------------------------------------------------------------------------
// ● コマンド名の取得 (要再定義)
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.commandName = function(index){
	return "";
}
//--------------------------------------------------------------------------
// ●  (要再定義)
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.commandFilename = function(){
	return "";
}
//--------------------------------------------------------------------------
// ● コマンド総数の取得 (要再定義)
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.commandMax = function(){
	return 0;
}
//--------------------------------------------------------------------------
// ● カーソルデータの取得
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.cursorData = function(){
	return null;
}
//--------------------------------------------------------------------------
// ● スプライトの表示
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.show = function(){
	this._visible = true;
	return this;
}
//--------------------------------------------------------------------------
// ● スプライトの非表示
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.hide = function(){
	this._visible = false;
	return this;
}
//--------------------------------------------------------------------------
// ● スプライトのアクティブ化
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.activate = function(){
	this._active = true;
	return this;
}
//--------------------------------------------------------------------------
// ● スプライトの非アクティブ化
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.deactivate = function(){
	this._active = false;
	return this;
}
//--------------------------------------------------------------------------
// ●
//--------------------------------------------------------------------------
Object.defineProperty(Spriteset_CustomMenuCommand.prototype, 'openness', {
    get: function() {
        return this._openness;
    },
    set: function(value) {
        if (this._openness !== value) {
            this._openness = value.clamp(0, 255);
			this.updateOpenness();
        }
    },
    configurable: true
});
//--------------------------------------------------------------------------
// ● ウィンドウを開く
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.open = function(){
	if(this.isOpen()) this._opening = true;
	this._closing = false;
	return this;
}
//--------------------------------------------------------------------------
// ● ウィンドウを閉じる
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.close = function(){
	if(!this.isClosed()) this._closing = true;
	this._opening = false;
	return this;
}
Spriteset_CustomMenuCommand.prototype.isOpen = function(){
	this._openness.clamp(0,255);
	return this._openness == 255;
}
Spriteset_CustomMenuCommand.prototype.isClosed = function(){
	this._openness.clamp(0,255);
	return this._openness == 0;
}
//--------------------------------------------------------------------------
// ● 開く処理の更新
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.updateOpen = function(){
	this._openness += this.OPEN_SPEED;
	if(this.isOpen()) this._opening = true;
}
//--------------------------------------------------------------------------
// ● 閉じる処理の更新
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.updateClose = function(){
	this._openness -= this.OPEN_SPEED;
	if(!this.isClosed()) this._closing = true;
}
Object.defineProperty(Spriteset_CustomMenuCommand.prototype, 'visible', {
    get: function() {
        return this._visible;
    },
    set: function(value) {
		this._visible = value;
        if (this._cursorSprite) {
			this._cursorSprite.visible = value;
		}
    },
    configurable: true
});
//--------------------------------------------------------------------------
// ● カーソル位置の設定
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.index = function(){
	return this._index;
}
Spriteset_CustomMenuCommand.prototype.setIndex = function(){
	this._index = index;
	this.refresh();
	this.callUpdateHelp();
}
//--------------------------------------------------------------------------
// ● 項目の選択
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.select = function(index){
	if(index && this._index != index) this.setIndex(index);
}
//--------------------------------------------------------------------------
// ● 項目の選択解除
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.deselect = function(){
	this.setIndex(-1);
}
//--------------------------------------------------------------------------
// ● 前回の選択位置を復帰
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.selectLast = function(){
	this.selectSymbol(this.lastCommandSymbol)
}
//--------------------------------------------------------------------------
// ● 項目の選択位置を記憶
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.saveCommandPosition = function(){
	this.lastCommandSymbol = this.currentSymbol();
}
//--------------------------------------------------------------------------
// ● 前回の選択位置を削除
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.initCommandPosition = function(){
	this.lastCommandSymbol = null;
}
//--------------------------------------------------------------------------
// ● 動作に対応するハンドラの設定
//     method : ハンドラとして設定するメソッド (Method オブジェクト)
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.setHandler = function(symbol, method){
	this._handlers[symbol] = method;
}
//--------------------------------------------------------------------------
// ● ハンドラの存在確認
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.isHandled = function(symbol) {
    return !!this._handlers[symbol];
};
//--------------------------------------------------------------------------
// ● ハンドラの呼び出し
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.isHandled = function(symbol) {
    if(this.isHandled(symble)) this._handlers[symbol].call(this);
};
//--------------------------------------------------------------------------
// ● フレーム更新
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.update = function(){
	this.updateCursorSprite();
	this.updateCommandSprites();
	this.updateOpenness();
	this.processCursorMove();
	this.processHandling();
}
//--------------------------------------------------------------------------
// ● 開閉更新
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.updateOpenness = function(){
	if(!this._commandSprites) return;
	if(this._opening) this.updateOpen();
	if(this._closing) this.updateClose();
	this._commandSprites.forEach(function(sp){
		sp._opacity = this._openness;
	}.bind(this))
}
//--------------------------------------------------------------------------
// ● カーソルの移動処理
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.processCursorMove = function(){
    if (this.isCursorMovable()) {
        var lastIndex = this.index();
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (Input.isRepeated('right')) {
            this.cursorRight(Input.isTriggered('right'));
        }
        if (Input.isRepeated('left')) {
            this.cursorLeft(Input.isTriggered('left'));
        }
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
}
//--------------------------------------------------------------------------
// ● 決定やキャンセルなどのハンドリング処理
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.processHandling = function(){
	if (this._active) {
        if (Input.isTriggered('on')) {
            this.processOk();
        } else if (Input.isTriggered('cancel')) {
            this.processCancel();
        }
    }
}
//--------------------------------------------------------------------------
// ● カーソルの移動可能判定
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.isCursorMovable = function(){
	return this._active && this.itemMax() > 0;
}
//--------------------------------------------------------------------------
// ● カーソルを下に移動
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.cursorDown = function(warp){
	var index = this.index();
	var maxItems = this.itemMax();
	if (index + this.cursorDy() >= 0 && index + this.cursorDy() <= maxItems || wrap ) {
		this.select((index + this.cursorDy()) % maxItems);
	}
}
//--------------------------------------------------------------------------
// ● カーソルを上に移動
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.cursorUp = function(warp){
	var index = this.index();
	var maxItems = this.itemMax();
	if (index - this.cursorDy() >= 0 && index - this.cursorDy() < maxItems || wrap ) {
		this.select((index - this.cursorDy()) % maxItems);
	}
}
//--------------------------------------------------------------------------
// ● カーソルを右に移動
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.cursorRight = function(warp){
	var index = this.index();
	var maxItems = this.itemMax();
	if (index + this.cursorDx() >= 0 && index + this.cursorDx() <= maxItems || wrap ) {
		this.select((index + this.cursorDx()) % maxItems);
	}
}
//--------------------------------------------------------------------------
// ● カーソルを左に移動
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.cursorLeft = function(warp){
	var index = this.index();
	var maxItems = this.itemMax();
	if (index - this.cursorDx() >= 0 && index - this.cursorDx() < maxItems || wrap ) {
		this.select((index - this.cursorDx()) % maxItems);
	}
}
//--------------------------------------------------------------------------
// ● カーソルを 1 ページ後ろに移動
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.cursorPagedown = function(){}
//--------------------------------------------------------------------------
// ● カーソルを 1 ページ前に移動
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.cursorPageup = function(){}
//--------------------------------------------------------------------------
// ● 決定ボタンが押されたときの処理
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.processOk = function() {
	this.saveCommandPosition();
	if (this.isCurrentItemEnabled()) {
		SoundManager.playOk();
		Input.update();
		TouchInput.update();
		this.deactivate();
		if(this.isHandled(this.currentSymbol())){
			this.callHandler(this.currentSymbol());
		}else if(this.isHandled('ok')){
			this.callHandler('ok');
		}else{
			this.activate();
		}

	} else {
		SoundManager.playBuzzer();
	}
}
//--------------------------------------------------------------------------
// ● キャンセルボタンが押されたときの処理
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.processCancel = function() {
	SoundManager.playCancel();
	Input.update();
	TouchInput.update();
	this.deactivate();
	this.callHandler('cancel');
}
//--------------------------------------------------------------------------
// ● ヘルプウィンドウの設定
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.setHelpWindow = function(helpWindow) {
	this._helpWindow = helpWindow;
	this.callUpdateHelp();
}
//--------------------------------------------------------------------------
// ● ヘルプウィンドウ更新メソッドの呼び出し
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.callUpdateHelp = function() {
	if(this._active && this._helpWindow) this.updateHelp();
}
//--------------------------------------------------------------------------
// ● ヘルプウィンドウの更新
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.updateHelp = function() {
	this._helpWindow.clear();
}
//--------------------------------------------------------------------------
// ● 主要コマンドの有効状態を取得
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.areMainCommandsEnabled = function() {
	return $gameParty.exists();
}
//--------------------------------------------------------------------------
// ● 並び替えの有効状態を取得
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.isFormationEnabled = function() {
    return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
};
//--------------------------------------------------------------------------
// ● セーブの有効状態を取得
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.isSaveEnabled = function() {
    return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
};
//--------------------------------------------------------------------------
// ●
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.createCursorSprite = function() {
	var cursorData = this.cursorData();
	if(!cursorData) throw new Error('カーソルの情報が設定されていません。');
	if(!cursorData[0]) return;
	if(cursorData[0].length == 0) return;
	this._cursorSprite = new Sprite_CustomMenuCursor(cursorData);
	this.updateCursorSprite();
};
Spriteset_CustomMenuCommand.prototype.updateCursorSprite = function() {
	if (this._cursorSprite) {
		if(!this.isOpen() || !this._visible){
			this._cursorSprite.visible = false;
		}
		if(this._active){
			if(this._index < 0){
				this._cursorSprite.visible = false;
			}else{
				this._cursorSprite.visible = true;
				this._cursorSprite.x = this._commandSprites[this._index].x;
				this._cursorSprite.y = this._commandSprites[this._index].y;
				this._cursorSprite.update();
			}
		}
	}
};
//--------------------------------------------------------------------------
// ● カーソル画像の取得
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.cursorBitmap = function() {
	var cursorData = this.cursorData();
	if(!cursorData) return;
	if(!cursorData[0].length == 0) return;
	return ImageManager.loadSystem(cursorData[0]);
};
//--------------------------------------------------------------------------
// ● カーソルの移動量
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.cursorDx = function() {
	return this.cursorData()[1];
}
//--------------------------------------------------------------------------
// ● カーソルの移動量
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.cursorDy = function() {
	return this.cursorData()[2];
}
Spriteset_CustomMenuCommand.prototype.cursorDy = function() {
	return this.cursorData()[2];
}
//--------------------------------------------------------------------------
// ●
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.itemRect = function(index) {
    var rect = new Rectangle();
	rect.x = this._commandSprites[index].x;
	rect.y = this._commandSprites[index].y;
	rect.width = this._commandSprites[index].bitmap.width;
    rect.height = this._commandSprites[index].bitmap.height;
    return rect;
};
Spriteset_CustomMenuCommand.prototype.createCommandSprites = function(index) {
	this._commandSprites = new Array(6).map(function(val, idx){
		var sp = new Sprite();
		sp.bitmap = new Bitmap(this.imageWidth(idx), this.imageHeight(idx));
		sp.ox = sp.bitmap.width/2;
		sp.oy = sp.bitmap.height/2;
		//yield(sp, i) if defined? yield -> do not have to do
		return sp;
	})
};
//--------------------------------------------------------------------------
// ● フレーム更新
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.updateCommandSprites = function(index) {
	if(this._commandSprites){
		this._commandSprites.forEach(function(sp){
			sp.update();
		}.bind(this));
	}
};
Spriteset_CustomMenuCommand.prototype.imageIndex = function(index) {
	var result = 0;
	if(this._index == index) result += 1;
	if(!this.isCommandEnabled(index)) result += 2;
	return result;
};
//--------------------------------------------------------------------------
// ● src_rect
//--------------------------------------------------------------------------
Spriteset_CustomMenuCommand.prototype.imageRect = function(index) {
	var indexBitmap = this._commandSprites[index].bitmap;
    var rect = indexBitmap.rect;
	if(this.isMultImage()){
		rect.x = indexBitmap.width * this.imageIndex(index);
		rect.y = indexBitmap.height * index;
	}else{
		rect.x = 0;
		rect.y = indexBitmap.height * this.imageIndex(index);
	}
	return rect;
};
Spriteset_CustomMenuCommand.prototype.refreshCommand = function(index) {
	var bitmap = this._commandSprites[index].bitmap;
	var imgRect = this.imageRect(index);
	bitmap.clear();
	bitmap.blt(this.commandImage(index), imgRect.x, imgRect.y, imgRect.width, imgRect.height,
	 							 	     bitmap.x,  bitmap.y,  bitmap.width,  bitmap.height);
};
Spriteset_CustomMenuCommand.prototype.refreshCommands = function(index) {
	this._commandSprites.forEach(function(sp, i){
		refreshCommand(i);
		//yield(sp, i) if defined? yield
	})
};
Spriteset_CustomMenuCommand.prototype.commandImage = function(index) {
	if(this.isMultiImage()){
		return ImageManager.loadSystem(this.commandFilename);
	}else{
		return ImageManager.loadSystem(this.commandName(index));
	}
};
Spriteset_CustomMenuCommand.prototype.isMultiImage = function(index) {
	return this.commandFilename.length > 0;
};
Spriteset_CustomMenuCommand.prototype.imageWidth = function(index) {
	if(this.isMultiImage()){
		return this.commandImage(index).width / 4;
	}else{
		return this.commandImage(index).width;
	}
};
Spriteset_CustomMenuCommand.prototype.imageHeight = function(index) {
	if(this.isMultiImage()){
		return this.commandImage(index).height / this.commandMax();
	}else{
		return this.commandImage(index).height / 4;;
	}
};
//--------------------------------------------------------------------------
// ● 立ち絵のファイル名を取得
//--------------------------------------------------------------------------
Game_Actor.prototype.portraitName = function() {
    var filename = this._portraitName ? this._portraitName : CAO_CM.PORTRAIT_NAME;
	return filename.format(this._actorId);
};
//--------------------------------------------------------------------------
// ● 表情のインデックス
//--------------------------------------------------------------------------
Game_Actor.prototype.expressionIndex = function() {
	var rate = parseInt(this.hpRate() * 100);
	var index = CAO_CM.EXPRESSIVE_RATE.findIndex(function(r){ return r < rate});
	return index > -1 ? index : CAO_CM.EXPRESSIVE_RATE.length;
};
//--------------------------------------------------------------------------
// ● 経験値の割合を取得
//--------------------------------------------------------------------------
Game_Actor.prototype.cmExpRate = function() {
	if(this.isMaxLevel()) return 1.0;
	return this.cmAccumulatedExp() / parseFloat(this.cmRequisiteExp());
};
//--------------------------------------------------------------------------
// ● レベルアップに必要な経験値を取得
//--------------------------------------------------------------------------
Game_Actor.prototype.cmRequisiteExp = function() {
	if(this.isMaxLevel()) return 0;
	return this.nextLevelExp() - this.currentLevelExp();
};
//--------------------------------------------------------------------------
// ● 獲得した経験値を取得 (現レベル)
//--------------------------------------------------------------------------
Game_Actor.prototype.cmAccumulatedExp = function() {
	return this.currentExp() - this.currentLevelExp();
};
//--------------------------------------------------------------------------
// ● レベルアップに必要な残りの経験値を取得
//--------------------------------------------------------------------------
Game_Actor.prototype.cmRemainingExp = function() {
	if(this.isMaxLevel()) return 0;
	return this.currentLevelExp() - this.currentExp();
};

function CAO_CM_Canvas() {
    this.initialize.apply(this, arguments);
}
CAO_CM_Canvas.prototype.constructor = CAO_CM_Canvas;
//include CAO_CM.
CAO_CM_Canvas.prototype.COMMAND_ITEMS = {};
CAO_CM_Canvas.prototype.COMMAND_ITEMS.item = {
	"name"     : "アイテム",
    "command"  : Scene_Item,
    "icon" 	   : 96,
    "help"     : '所持しているアイテムを確認します。'
}
CAO_CM_Canvas.prototype.COMMAND_ITEMS.load = {
	"name"     : "ロード",
    "command"  : Scene_Load,
    "icon" 	   : 225,
	"enable"   : "DataManager.isAnySavefileExists();",
    "help"     : 'セーブデータをロードします。'
}
CAO_CM_Canvas.prototype.COMMAND = {};// <= 消さない！
// メインコマンド 必須
CAO_CM_Canvas.prototype.COMMAND.main = ["item", "load"];
// サブコマンド
CAO_CM_Canvas.prototype.COMMAND.file = ["save", "load"];
CAO_CM_Canvas.prototype.COMMAND.sub  = ["item", "status", "sw", "script", "common", "common2", "common3"];
//--------------------------------------------------------------------------
// ◇ コマンドウィンドウの文字サイズ
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.COMMAND_SIZE = 24;
//--------------------------------------------------------------------------
// ◇ コマンドウィンドウの一行の縦幅
//--------------------------------------------------------------------------
//     0 で文字サイズを基準に自動調整
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.COMMAND_HEIGHT = 24;
//--------------------------------------------------------------------------
// ◇ 残りＨＰで顔グラを変化させる
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.EXPRESSIVE_RATE = [50, 25, 0];
CAO_CM_Canvas.prototype.EXPRESSIVE_RATE = [];
//--------------------------------------------------------------------------
// ◇ 立ち絵のファイル名
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.PORTRAIT_NAME = "MActor%1";
//--------------------------------------------------------------------------
// ◇ コモンイベントの自動実行
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.START_COMMON_ID     = 0;     // 開始前処理
CAO_CM_Canvas.prototype.TERMINATE_COMMON_ID = 0;     // 終了前処理

//--------------------------------------------------------------------------
// ◇ 背景画像
//--------------------------------------------------------------------------
// 前景画像（最前面に表示されます。）
CAO_CM_Canvas.prototype.FILE_FOREGROUND = null;
// 背景画像（デフォルトのマップ画像と入れ替えます。）
CAO_CM_Canvas.prototype.FILE_BACKGROUND = null;
// アニメ画像 ["ファイル名", vx, vy, 最背面？]
CAO_CM_Canvas.prototype.BACKIMAGE = null;
//--------------------------------------------------------------------------
// ◇ システム文字の有無
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.VISIBLE_SYSTEM = true;
//--------------------------------------------------------------------------
// ◇ 用語設定
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.VOCABS = {};
CAO_CM_Canvas.prototype.VOCABS.gold  = "所持金";
CAO_CM_Canvas.prototype.VOCABS.exp   = "経験値";
CAO_CM_Canvas.prototype.VOCABS.expA  = "LvUP";
//--------------------------------------------------------------------------
// ● オブジェクト初期化
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.initialize = function(obj) {
	if(obj instanceof Window){
		this._window = obj;
		this.bitmap = obj.contents;
	}else if(obj instanceof Bitmap){
		this._window = null;
		this.bitmap = obj;
	}else{
		throw new Error("wrong argument type (expected Bitmap or Window)");
	}
	Window_Base.prototype.loadWindowskin.call(this);
};
Object.defineProperty(CAO_CM_Canvas.prototype, 'contents', {
    get: function() {
        return this._window ? this._window.contents : this.bitmap;
    },
    set: function(value) {
		this._window.contents = value;
    },
    configurable: true
});
CAO_CM_Canvas.prototype.drawActorItems = function(actor, x, y, list) {
	//
	// メニューステータスの設定が間違っている可能性があります。
	// 表示項目の設定を確認してください。
	//
	// TypeError
	//   引数の型(数値や文字列など)が間違っています。
	//   設定がずれているかもしれません。
	//   設定は必ず [シンボル, 数値, 数値, ... ] の形で始まります。
	//   識別子とｘ座標とｙ座標の設定は省略できません。
	//
	// ArgumentError : wrong number of arguments
	//   引数の数が間違っています。
	//   オプション部分の設定に間違いがないか確認してください。
	//
	list.forEach(function(params){
		var symbol = params[0];
		var argv   = params.slice(1,params.length);
		var xx     = argv[0];
		var yy     = argv[1];
		if(!this.METHODS_NAME[symbol]){
			console.error("識別子 :"+symbol+" の処理は定義されていません。");
			return;
		}
		if(!(xx && yy)){
			throw new Error("描画する座標が設定されていません。");
		}
		try{
			var opt = (argv.length <= 2) ? [] : argv.slice(2, argv.length - 2);
				//console.log(this.METHODS_NAME[symbol], eval(this.METHODS_NAME[symbol]));
	        	eval(this.METHODS_NAME[symbol]+".apply(this,[actor, x + xx, y + yy].concat(opt))");
		}catch(e){
			console.error(e.name);
			console.error(e.message);
			console.error("Actor : "+actor.actorId ? actor.actorId() : "no actorId() "+" | "+"Symbol : "+symbol + " | Method : "+this.METHODS_NAME[symbol]+"\n");
		}
	}.bind(this))
};
//--------------------------------------------------------------------------
// ●
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.METHODS_NAME = {};
CAO_CM_Canvas.prototype.METHODS_NAME.wChara = 'this._window.drawActorGraphics';
CAO_CM_Canvas.prototype.METHODS_NAME.wface  = 'this._window.drawActorFace';
CAO_CM_Canvas.prototype.METHODS_NAME.wName  = 'this._window.drawActorName';
CAO_CM_Canvas.prototype.METHODS_NAME.wClass = 'this._window.drawActorClass';
CAO_CM_Canvas.prototype.METHODS_NAME.wNick  = 'this._window.drawActorNickname';
CAO_CM_Canvas.prototype.METHODS_NAME.wLevel = 'this._window.drawActorLevel';
CAO_CM_Canvas.prototype.METHODS_NAME.wState = 'this._window.drawActorIcons';
CAO_CM_Canvas.prototype.METHODS_NAME.wHp    = 'this._window.drawActorHp';
CAO_CM_Canvas.prototype.METHODS_NAME.wMp    = 'this._window.drawActorMp';
CAO_CM_Canvas.prototype.METHODS_NAME.wTp    = 'this._window.drawActorTp';

if (CAO_CM.EXPRESSIVE_RATE.length == 0)
  CAO_CM_Canvas.prototype.METHODS_NAME.face = "this.drawActorFace";
else
  CAO_CM_Canvas.prototype.METHODS_NAME.face = "this.drawActorExpression";
CAO_CM_Canvas.prototype.METHODS_NAME.chara  = "this.drawActorGraphics";
CAO_CM_Canvas.prototype.METHODS_NAME.name   = "this.drawActorName";
CAO_CM_Canvas.prototype.METHODS_NAME.class  = "this.drawActorClass";
CAO_CM_Canvas.prototype.METHODS_NAME.nick   = "this.drawActorNickname";
CAO_CM_Canvas.prototype.METHODS_NAME.level  = "this.drawActorLevel";
CAO_CM_Canvas.prototype.METHODS_NAME.lvG    = "this.drawActorLevelG";
CAO_CM_Canvas.prototype.METHODS_NAME.state  = "this.drawActorIcons";
CAO_CM_Canvas.prototype.METHODS_NAME.hp     = "this.drawActorHp";
CAO_CM_Canvas.prototype.METHODS_NAME.mp     = "this.drawActorMp";
CAO_CM_Canvas.prototype.METHODS_NAME.tp     = "this.drawActorTp";
CAO_CM_Canvas.prototype.METHODS_NAME.exp    = "this.drawActorExp";
CAO_CM_Canvas.prototype.METHODS_NAME.param  = "this.drawActorParam";
CAO_CM_Canvas.prototype.METHODS_NAME.icon   = "this.drawActorIcon";
CAO_CM_Canvas.prototype.METHODS_NAME.bust   = "this.drawActorPortrait";
CAO_CM_Canvas.prototype.METHODS_NAME.fill   = "this.drawActorRect";
CAO_CM_Canvas.prototype.METHODS_NAME.pict   = "this.drawActorPicture";
CAO_CM_Canvas.prototype.METHODS_NAME.text   = "this.drawActorText";
CAO_CM_Canvas.prototype.METHODS_NAME.num    = "this.drawActorNumber";
//--------------------------------------------------------------------------
// ● 定数
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.COLOR_AIB_1 = 'rgb(0, 0, 0)';           // アクターアイコンの縁の色
CAO_CM_Canvas.prototype.COLOR_AIB_2 = 'rgb(255, 255, 255)';     // アクターアイコンの背景色
//--------------------------------------------------------------------------
// ● 行の高さを取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.lineHeight = function(){
	return 24;
}
//--------------------------------------------------------------------------
// ● 半透明描画用のアルファ値を取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.translucentOpacity = function(){
	return 160;
}
CAO_CM_Canvas.prototype.str2color = function(value){
	var num;
	if(Array.isArray(value)){
		return 'rgb(%1)'.format(value.join(','));
	}else if(value instanceof Number){
		num = value;
	}else if( value instanceof String ){
		var text = value.replace(/^(0x|x)/, "");
		switch(text.length){
			case 1 :
				text = text + text + text + text + text + text + 'FF';
			break;
			case 2 :
				text = text[0] + text[0] + text[0] + text[0] + text[0] + text[0] + text[1] + text[1];
			break;
			case 3 :
				text = text[0] + text[0] + text[1] + text[1] + text[2] + text[2] + 'FF';
			break;
			case 4 :
				text = text[0] + text[0] + text[1] + text[1] + text[2] + text[2] + text[3] + text[3];
			break;
			case 6 :
				text = text.slice(0,6) + 'FF';
			break;
		}
		num = eval('0x'+text);
	}
	return 'rgba(%1,%2,%3,%4)'.format(num >> 24, num >> 16 & 255, num >> 8 & 255, num & 255);
}
//--------------------------------------------------------------------------
// ● 文字色取得
//     n : 文字色番号（0..29）
//--------------------------------------------------------------------------

CAO_CM_Canvas.prototype.textColor = function(n) {
    var px = 96 + (n % 8) * 12 + 6;
    var py = 144 + Math.floor(n / 8) * 12 + 6;
    return this.windowskin.getPixel(px, py);
};

CAO_CM_Canvas.prototype.textColor = function(n) {
    var px = 96 + (n % 8) * 12 + 6;
    var py = 144 + Math.floor(n / 8) * 12 + 6;
    return this.windowskin.getPixel(px, py);
};

CAO_CM_Canvas.prototype.normalColor = function() {
    return this.textColor(0);
};

CAO_CM_Canvas.prototype.systemColor = function() {
    return this.textColor(16);
};

CAO_CM_Canvas.prototype.crisisColor = function() {
    return this.textColor(17);
};

CAO_CM_Canvas.prototype.deathColor = function() {
    return this.textColor(18);
};

CAO_CM_Canvas.prototype.gaugeBackColor = function() {
    return this.textColor(19);
};

CAO_CM_Canvas.prototype.hpGaugeColor1 = function() {
    return this.textColor(20);
};

CAO_CM_Canvas.prototype.hpGaugeColor2 = function() {
    return this.textColor(21);
};

CAO_CM_Canvas.prototype.mpGaugeColor1 = function() {
    return this.textColor(22);
};

CAO_CM_Canvas.prototype.mpGaugeColor2 = function() {
    return this.textColor(23);
};

CAO_CM_Canvas.prototype.mpCostColor = function() {
    return this.textColor(23);
};

CAO_CM_Canvas.prototype.powerUpColor = function() {
    return this.textColor(24);
};

CAO_CM_Canvas.prototype.powerDownColor = function() {
    return this.textColor(25);
};

CAO_CM_Canvas.prototype.tpGaugeColor1 = function() {
    return this.textColor(28);
};

CAO_CM_Canvas.prototype.tpGaugeColor2 = function() {
    return this.textColor(29);
};

CAO_CM_Canvas.prototype.tpCostColor = function() {
    return this.textColor(29);
};
CAO_CM_Canvas.prototype.expGaugeColor1 = function() {
    return this.textColor(30);
};

CAO_CM_Canvas.prototype.expGaugeColor2 = function() {
    return this.textColor(31);
};
//--------------------------------------------------------------------------
// ● 保留項目の背景色を取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.pendingColor = function() {
    return this.windowskin.getPixel(120, 120);
};
//--------------------------------------------------------------------------
// ● テキスト描画色の変更
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.changeTextColor = function(color, enabled) {
    this.contents.textColor = color;
	enabled = enabled || true;
	if(enabled){
		this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
	}
};
//--------------------------------------------------------------------------
// ● テキストサイズの変更
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.changeTextSize = function(size) {
    this.contents.fontSize = size;
};
//--------------------------------------------------------------------------
// ● テキストの描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawText = function() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	  args[_key] = arguments[_key];
	}
	var _drawText;
	(_drawText = this.contents.drawText).apply(this, args);
};
//--------------------------------------------------------------------------
// ● テキストサイズの取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.textWidth = function(text) {
    return this.contents.measureTextWidth(text);
};
//--------------------------------------------------------------------------
// ● 制御文字つきテキストの描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawTextEx = function(text, x, y) {
    if (text) {
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
        this.resetFontSettings();
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState.x - x;
    } else {
        return 0;
    }
};
//--------------------------------------------------------------------------
// ● フォント設定のリセット
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.resetFontSettings = function() {
    this.contents.fontFace = Window_Base.prototype.standardFontFace();
    this.contents.fontSize = Window_Base.prototype.standardFontSize();
    this.resetTextColor();
};
CAO_CM_Canvas.prototype.resetTextColor = function() {
    this.changeTextColor(this.normalColor());
};
//--------------------------------------------------------------------------
// ● 制御文字の事前変換
//    実際の描画を始める前に、原則として文字列に変わるものだけを置き換える。
//    文字「\」はエスケープ文字（\e）に変換。
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1b({+)/g, function() {
		var result = "";
		for(var i = 0 ; i < (arguments[1].match(/{/g) || []).length ;i++){
			result += '\x1b{';
		}
        return result;
    }.bind(this));
	text = text.replace(/\x1b(}+)/g, function() {
		var result = "";
		for(var i = 0 ; i < (arguments[1].match(/}/g) || []).length ;i++){
			result += '\x1b}';
		}
        return result;
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
	ext = text.replace(/\x1bS\[(\d+),(.*?),(.*?)\]/gi, function() {
        return $gameSwitches.value(parseInt(arguments[1])) ? arguments[2]: arguments[3];
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    text = text.replace(/\x1b\$/gi, $gameParty.gold);
    text = text.replace(/\x1bW/gi, $gameParty.steps);
    text = text.replace(/\x1bT\[(.+?)\]/gi, function() {
        return this.playTime(arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bT/i, function() {
        return this.playTime();
    }.bind(this));
	text = text.replace(/\x1bn/g, '\n');
	text = text.replace(/<%(.*?)%>/g, function() {
        return eval(arguments[1]);
    }.bind(this));
    return text;
};
//--------------------------------------------------------------------------
// ● アクター n 番の名前を取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.actorName = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.name() : '';
};
//--------------------------------------------------------------------------
// ● パーティメンバー n 番の名前を取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.partyMemberName = function(n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.name() : '';
};
//--------------------------------------------------------------------------
// ● を取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.playTime = function(format) {
	var total = $gameSystem.playTime();
	return format ? format.format(total/3600, total / 60 % 60, total % 60, total / 60, total) : $gameSystem.playtimeText();
};
//--------------------------------------------------------------------------
// ● 文字の処理
//     c    : 文字
//     text : 描画処理中の文字列バッファ（必要なら破壊的に変更）
//     pos  : 描画位置 {:x, :y, :new_x, :height}
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.processCharacter = function(textState) {
    switch (textState.text[textState.index]) {
    case '\n':
        this.processNewLine(textState);
        break;
    case '\f':
        this.processNewPage(textState);
        break;
    case '\x1b':
        this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
        break;
    default:
        this.processNormalCharacter(textState);
        break;
    }
};
//--------------------------------------------------------------------------
// ● 通常文字の処理
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
    textState.x += w;
};
//--------------------------------------------------------------------------
// ● 改行文字の処理
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.processNewLine = function(textState) {
    textState.x = textState.left;
    textState.y += textState.height;
    textState.height = this.calcTextHeight(textState, false);
    textState.index++;
};

CAO_CM_Canvas.prototype.processNewPage = function(textState) {
    textState.index++;
};
//--------------------------------------------------------------------------
// ● 制御文字の本体を破壊的に取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.obtainEscapeCode = function(textState) {
    textState.index++;
    var regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i;
    var arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return arr[0].toUpperCase();
    } else {
        return '';
    }
};
//--------------------------------------------------------------------------
// ● 制御文字の引数を破壊的に取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.obtainEscapeParam = function(textState) {
    var arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return parseInt(arr[0].slice(1));
    } else {
        return '';
    }
};

CAO_CM_Canvas.prototype.obtainEscapeValue = function(textState, value) {
  var arr = /^\[([+-]?)(\d+)\]/i.exec(textState.text.slice(textState.index));
  if (arr) {
	  textState.index += arr[0].length;
	  if(arr[1] == '+')
      	return value + parseInt(arr[2]);
	  if(arr[1] == '-')
      	return value - parseInt(arr[2]);
	  return parseInt(arr[2]);
  } else {
      return '';
  }
};

CAO_CM_Canvas.prototype.obtainEscapePicparam = function(textState, value) {
  var arr = /^\[(.+?)\]/.exec(textState.text.slice(textState.index));
  if (arr) {
	  textState.index += arr[0].length;
	  var params = arr[1].split(',');
	  return parmas.map(function(s){ return s.trim()});
  } else {
      return [];
  }
};

//--------------------------------------------------------------------------
// ● 制御文字の処理
//     code : 制御文字の本体部分（「\C[1]」なら「C」）
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'C':
        this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
        break;
    case 'I':
		if(/^\[\d+\]/.test(textState.text.slice(textState.index)))
        	this.processDrawIcon(this.obtainEscapeParam(textState), textState);
		else
			this.processDrawPicture(this.obtainEscapePicparam(textState), textState);
        break;
    case '{':
        this.makeFontBigger();
        break;
    case '}':
        this.makeFontSmaller();
        break;
    case 'X':
		textState.x = this.obtainEscapeValue(textState, textStatus.x);
        break;
    case 'Y':
        textState.y = this.obtainEscapeValue(textState, textStatus.y);
        break;
    case 'L':
        this.processDrawLine(textState);
        break;
    }
};
//--------------------------------------------------------------------------
// ● 制御文字によるライン描画の処理
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.processDrawLine = function() {
	if(/^\[(\d+)\s*,\s*(\d+)(?:\s*,\s*([AFHTMBXS]+))?\]/i.test(textState.text.slice(textState.index))){
		var arr = /^\[(\d+)\s*,\s*(\d+)(?:\s*,\s*([AFHTMBXS]+))?\]/i.exec(textState.text.slice(textState.index));
		var x = textState.x;
		var y = textState.y;
		var w = parseInt(arr[1]);
		var h = parseInt(arr[2]);
		var params = arr[3] || "";
		// 描画幅を文字サイズから (A:自動,F:全角,H:半角)
		if(/A/i.test(params)) w = this.textWidth(text.slice(0, w));
		if(/F/i.test(params)) {
			var text = "";
			for(var i = 0 ; i < w ; i++){
				text += "　";
			}
			w = this.textWidth(text);
		}
		if(/H/i.test(params)) {
			var text = "";
			for(var i = 0 ; i < w ; i++){
				text += " ";
			}
			w = this.textWidth(text);
		}
		// 線の描画位置 (t:上,m:中,b:下, デフォルトは下)
		if(!(/T/i.test(params))){
			if(/M/i.test(params)){
				y += (textState.height + h) / 2
			}else{
				y += (textState.height + h) / 2
			}
		}
		// 影の描画
		if((/S/i.test(params))){
			w -= 1;
			this.contents.fillRect(x + 1, y + 1, w, h, this.gaugeBackColor())
			this.contents.paintOpacity = this.translucentOpacity();
		}
		// 線の描画
        this.contents.fill_rect(x, y, w, h, this.contents.textColor);
        // ｘ座標を進める
		if((/X/i.test(params))) x += w ;
	}else if(/^\[([0-9, ]+?)(0x[0-9A-F]+)?\]/i.test(textState.text.slice(textState.index))){
		var _drawFillRect;
		var _fillRect;

		var arr = /^\[([0-9, ]+?)(0x[0-9A-F]+)?\]/i.exec(textState.text.slice(textState.index));
		var color = arr[2];
		var param = arr[1].replace(/, *$/i,'').split(',').map(function(a){return parseInt(a)});
		if(Array.isArray(param) && param.length == 4){
			if(color)
				(_drawFillRect = this.drawFillRect).apply(_drawFillRect, param.concat([this.str2color(color)]));
			else
				(_fillRect = this.contents.fillRect).apply(_drawFillRect, param.concat([color]));
		}
	}
};
//--------------------------------------------------------------------------
// ● 制御文字によるアイコン描画の処理
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.processDrawIcon = function(iconIndex, textState) {
    this.drawIcon(iconIndex, textState.x, textState.y + (textState.height - 24 ) / 2);
    //textState.x += Window_Base._iconWidth + 4;
	textState.x += 4;//pos[:x] += 24
};
//--------------------------------------------------------------------------
// ● 制御文字によるピクチャ描画の処理
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.processDrawPicture = function(params, textStatus) {
	if(params.length > 0){
		var bitmap  = ImageManager.loadPicture(params[0] || "");
		var x       = parseInt(params[1] ? params[1] : 0);
		var y       = parseInt(params[2] ? params[1] : 0);
		var opacity = parseInt(params[3] ? params[1] : 255);
		var hue     = parseInt(params[4] ? params[1] : 0);
		if(hue != 0){
			//bitmap = bitmap.dup; should i do?
			bitmap.rotateHue(hue)
		}
		bitmap.paintOpacity = opacity;
		this.contents.blt(bitmap, x,y, bitmap.width, bitmap.height, x, y);

	}
};

//--------------------------------------------------------------------------
// ● フォントを大きくする
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.makeFontBigger = function() {
    if (this.contents.fontSize <= 96) {
        this.contents.fontSize += 12;
    }
};
//--------------------------------------------------------------------------
// ● フォントを小さくする
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.makeFontSmaller = function() {
    if (this.contents.fontSize >= 24) {
        this.contents.fontSize -= 12;
    }
};
//--------------------------------------------------------------------------
// ● 行の高さを計算
//     restore_font_size : 計算後にフォントサイズを元に戻す
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.calcTextHeight = function(textState, all) {
    var lastFontSize = this.contents.fontSize;
    var textHeight = 0;
    var lines = textState.text.slice(textState.index).split('\n');
    var maxLines = all ? lines.length : 1;

    for (var i = 0; i < maxLines; i++) {
        var maxFontSize = this.contents.fontSize;
        var regExp = /\x1b[\{\}]/g;
        for (;;) {
            var array = regExp.exec(lines[i]);
            if (array) {
                if (array[0] === '\x1b{') {
                    this.makeFontBigger();
                }
                if (array[0] === '\x1b}') {
                    this.makeFontSmaller();
                }
                if (maxFontSize < this.contents.fontSize) {
                    maxFontSize = this.contents.fontSize;
                }
            } else {
                break;
            }
        }
        textHeight += maxFontSize + 8;
    }

    this.contents.fontSize = lastFontSize;
    return textHeight;
};
CAO_CM_Canvas.prototype.drawFillRect = function(x, y, width, height, color) {
	var bitmap = new Bitmap(x,y);
	bitmap.fillRect(x, y, width, height, color)
	this.contents.blt(bitmap, x,y, bitmap.width, bitmap.height, x,y);
};
//--------------------------------------------------------------------------
// ● ゲージの描画
//     rate   : 割合（1.0 で満タン）
//     color1 : グラデーション 左端
//     color2 : グラデーション 右端
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 8;
    this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};
//--------------------------------------------------------------------------
// ● アイコンの描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawIcon = function(iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};
//--------------------------------------------------------------------------
// ● 顔グラフィックの描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawFace = function(faceName, faceIndex, x, y, /*width, height*/size, enabled) {
    var bitmap = ImageManager.loadFace(faceName);
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
	size = size || Window_Base._faceWidth;
	enabled = !! enabled ? 255 : this.translucentOpacity();
	var opacity = enabled ? 255 : this.translucentOpacity();
	var sw = Math.min(size, pw);
	var sh = Math.min(size, ph);
	var dx = Math.floor(x + Math.max(size - pw, 0) / 2);
	var dy = Math.floor(y + Math.max(size - ph, 0) / 2);
	var sx = faceIndex % 4 * pw + (pw - sw) / 2;
	var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
	var dw = 0;
    var dh = 0;

	if(size instanceof Number){
		sx += (Window_Base._faceWidth  - size) / 2;
		sy += (Window_Base._faceHeight - size) / 2;
		sw = Math.min(size, pw);
		sh = Math.min(size, ph);
		bitmap.paintOpacity = opacity;
		this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
	}else if(size instanceof Number){
		switch (size.length) {
			case 1 :
				dw = size[0];
				dh = size[0];
				break;
			case 2 :
				dw = size[0];
				dh = size[1];
				break;
			case 4 :
				sw = size[2];
				sh = size[3];
				dw = size[2];
				dh = size[3];
				sx += size[0];
				sy += size[1];
				break;
			default:
				throw new Error("wrong number of elements ("+size.length+" of 2)")
		}
		bitmap.paintOpacity = opacity;
		this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
	}
};

CAO_CM_Canvas.prototype.drawCharacter = function(characterName, characterIndex, x, y) {
	if(characterName){
		var bitmap = ImageManager.loadCharacter(characterName);
		var big = ImageManager.isBigCharacter(characterName);
		var pw = bitmap.width / (big ? 3 : 12);
		var ph = bitmap.height / (big ? 4 : 8);
		var n = characterIndex;
		var sx = (n % 4 * 3 + 1) * pw;
		var sy = (Math.floor(n / 4) * 4) * ph;
		this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
	}
};
//--------------------------------------------------------------------------
// ● HP の文字色を取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.hpColor = function(actor) {
    if (actor.isDead()) {
        return this.deathColor();
    } else if (actor.isDying()) {
        return this.crisisColor();
    } else {
        return this.normalColor();
    }
};
//--------------------------------------------------------------------------
// ● MP の文字色を取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.mpColor = function(actor) {
	if (actor.mp < actor.mmp / 4) {
        return this.crisisColor();
    } else {
        return this.normalColor();
    }
};
//--------------------------------------------------------------------------
// ● TP の文字色を取得
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.tpColor = function(actor) {
    return this.normalColor();
};
//--------------------------------------------------------------------------
// ● アクターの歩行グラフィック描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorCharacter = function(actor, x, y) {
    this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
};
//--------------------------------------------------------------------------
// ● アクターの顔グラフィック描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorFace = function(actor, x, y, width, height) {
    this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
};
//--------------------------------------------------------------------------
// ● アクターの表情グラフィック描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorExpression = function(actor, x, y, width, height) {
    this.drawFace(actor.faceName(), actor.expressionIndex(), x, y, width, height);
};
//--------------------------------------------------------------------------
// ● 歩行アイコンの描画
//     enabled : 有効フラグ。false のとき半透明で描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorIcon = function(actor, x, y, width, enabled) {
	if(actor){
		this.contents.fillRect(x, y, Window_Base._iconWidth, Window_Base._iconWidth, this.COLOR_AIB_1);
		this.contents.fillRect(x + 1, y + 1, Window_Base._iconWidth - 2 , Window_Base._iconWidth -2, this.COLOR_AIB_2);
		if(!actor.characterName() || actor.characterName().length == 0){
			return ;
		}
		var bitmap = ImageManager.loadCharacter(actor.characterName());
		var big = ImageManager.isBigCharacter(characterName);
		var pw = bitmap.width / (big ? 3 : 12);
		var ph = bitmap.height / (big ? 4 : 8);
		var n = characterIndex;
		var sx = (n % 4 * 3 + 1) * pw;
		var sy = (Math.floor(n / 4) * 4) * ph;
		sx += (pw - 20) / 2;
		sy += (ph - 20) / 2;
		enabled = !!enabled ? 255 : this.translucentOpacity();
		bitmap.paintOpacity = enable;
		this.contents.blt(bitmap, sx, sy, 20, 20, x + 2, y + 2);
	}

};
//--------------------------------------------------------------------------
// ● 立ち絵の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorPortrait = function(actor, x, y, enabled) {
	if(actor){
		var bitmap = ImageManager.loadPicture(actor.portraitName())
		enabled = !!enabled ? 255 : this.translucentOpacity();
		bitmap.paintOpacity = enabled;
		this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
	}
};
//--------------------------------------------------------------------------
// ● の描画
//     [:pict, x, y, "file", "script"]
//     [:pict, x, y, ["file","file"], "script"]
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorPicture = function(actor, x, y, file, script) {
	if(actor){
		var battler   = Array.isArray(file) ? file[0] : file;
		var alternate = Array.isArray(file) ? file[1] : undefined;
		if(script){
			filename = eval(script) ? battler : alternate;
		}else{
			filename = (actor.isBattleMember() ? battler : alternate) || battler;
		}
		if(filename && filename.length > 0){
			var bitmap = ImageManager.loadPicture(filename);
			this.contents.blt(bitmap, bitmap.x, bitmap.y, bitmap.width, bitmap.height, x, y)
		}
	}
};
//--------------------------------------------------------------------------
// ● の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorText = function(actor, x, y, text, script) {
	if(script && !eval(script)) return ;
	text = text.replace(/\\{(\w+?)}/g, function() {
		return arguments[1];//actor.__send__($1)
    }.bind(this));
	this.drawTextEx(x, y, text);
};
//--------------------------------------------------------------------------
// ● の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorNumber = function(actor, x, y, num, file) {
	var bitmap = ImageManager.loadPicture(file);
	var sx = 0;
	var sy = 0;
	var sw = bitmap.width / 13;
	var sh = bitmap.height;

	var param = num instanceof String ? eval(num) : num;
	param.split("").forEach(function(c, i){
		if(c == ' ') return;
		else if(c == '+') index = 10;
		else if(c == '+') index = 11;
		else if(/\d/.test(c)) index = parseInt(c);
		else index = 12;

		dx = dx * index;
	})
	this.contents.blt(bitmap, sx, sy, sw, sh, x + sw, y);
};
//--------------------------------------------------------------------------
// ● 名前の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorName = function(actor, x, y, width) {
    width = width || 168;
    this.changeTextColor(this.hpColor(actor));
    this.drawTextEx( actor.name(),x, y);
};
//--------------------------------------------------------------------------
// ● 職業の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorClass = function(actor, x, y, width) {
    width = width || 168;
    this.resetTextColor();
    this.drawText(actor.currentClass().name, x, y, width);
};
//--------------------------------------------------------------------------
// ● 二つ名の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorNickname = function(actor, x, y, width) {
    width = width || 270;
    this.resetTextColor();
    this.drawText(actor.nickname(), x, y, width);
};
//--------------------------------------------------------------------------
// ● レベルの描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorLevel = function(actor, x, y) {
	if(this.VISIBLE_SYSTEM){
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.levelA, x, y, 48);
	}
    this.resetTextColor();
    this.drawText(actor.level, x + 84, y, 36, 'right');
};
//--------------------------------------------------------------------------
// ● レベルの描画 (経験値ゲージ付)
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorLevelG = function(actor, x, y, width) {
	this.draw_gauge(x,y,width,actor.cm_exp_rate,this.expGaugeColor1(),this.expGaugeColor2());
	if(this.VISIBLE_SYSTEM){
		this.changeTextColor(this.systemColor());
		this.drawText(TextManager.levelA, x, y, 48);
	}
	this.changeTextColor(this.tpColor());
	this.drawText(actor.level, x + 84, y, 36, 'right');
}
//--------------------------------------------------------------------------
// ● ステートおよび強化／弱体のアイコンを描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
    for (var i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
		//icons.each_with_index {|n, i| draw_icon(n, x + left + 24 * i, y) }
    }
};
//--------------------------------------------------------------------------
// ● 現在値／最大値を分数形式で描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawCurrentAndMax = function(current, max, x, y,
                                                   width, color1, color2) {
    var labelWidth = this.textWidth('HP');
    var valueWidth = this.textWidth('0000');
    var slashWidth = this.textWidth('/');

    var x1 = x + width - valueWidth;
    var x2 = x1 - slashWidth;
    var x3 = x2 - valueWidth;
    if (x3 >= x + labelWidth) {
        this.changeTextColor(color1);
        this.drawText(current, x3, y, valueWidth, 'right');
        this.changeTextColor(color2);
        this.drawText('/', x2, y, slashWidth, 'right');
        this.drawText(max, x1, y, valueWidth, 'right');
    } else {
        this.changeTextColor(color1);
        this.drawText(current, x1, y, valueWidth, 'right');
    }
};
//--------------------------------------------------------------------------
// ● HP の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
	if(this.VISIBLE_SYSTEM){
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.hpA, x, y, 44);
	}
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};
//--------------------------------------------------------------------------
// ● MP の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorMp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
	if(this.VISIBLE_SYSTEM){
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.mpA, x, y, 44);
	}
    this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
                           this.mpColor(actor), this.normalColor());
};
//--------------------------------------------------------------------------
// ● TP の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorTp = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
	if(this.VISIBLE_SYSTEM){
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.tpA, x, y, 44);
	}
    this.changeTextColor(this.tpColor(actor));
    this.drawText(actor.tp, x + width - 64, y, 64, 'right');
};
//--------------------------------------------------------------------------
// ● 経験値の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorExp = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.expGaugeColor1();
    var color2 = this.expGaugeColor2();
    this.drawGauge(x, y, width, actor.cmExpRate(), color1, color2);
	if(this.VISIBLE_SYSTEM){
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.expA, x, y, 44);
	}
    this.resetTextColor();
    this.drawText(actor.cmRemainingExp(), x + width - 64, y, 64, 'right');
};
//--------------------------------------------------------------------------
// ● 経験値情報の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorExpInfo = function(actor, x, y, width) {
    width = width || 96;
	var value1 = actor.isMaxLevel() ? "-------" : actor.currentExp();
	var value2 = actor.isMaxLevel() ? "-------" : actor.cmRemainingExp();
	var expTotal = TextManager.expTotal.format(TextManager.exp);
    var expNext = TextManager.expNext.format(TextManager.level);
    this.drawGauge(x, y, width, actor.cmExpRate(), color1, color2);
	this.changeTextColor(this.systemColor());
    this.drawText(expTotal, x, y + lineHeight * 0, 270);
    this.drawText(expNext, x, y + lineHeight * 2, 270);
    this.resetTextColor();
    this.drawText(value1, x, y + lineHeight * 1, 270, 'right');
    this.drawText(value2, x, y + lineHeight * 3, 270, 'right');
}
//--------------------------------------------------------------------------
// ● 能力値の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorExp = function(actor, x, y, paramId,width) {
    width = width || 96;
	if(paramId < 0 || paramId > 7){
		throw new Error("能力値の ID は 0 から 7 までの数値です。");
	}

	if(this.VISIBLE_SYSTEM){
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.param(paramId), x, y, 44);
	}
    this.resetTextColor();
	this.drawText(actor.param(paramId), x, y, 48, 'right');
};
//--------------------------------------------------------------------------
// ● 矩形の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawActorHp = function(actor, x, y, width, height, color, script) {
	if(script && !eval(script)) return ;
	this.drawFillRect(x, y, width, height, color);
};
//--------------------------------------------------------------------------
// ● アイテム名の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
		this.drawIcon(item.iconIndex, x + 2, y + 2);
		this.resetTextColor();
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
    }
};
//--------------------------------------------------------------------------
// ● 通貨単位つき数値（所持金など）の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawCurrencyValue = function(value, unit, x, y, width) {
    var unitWidth = Math.min(80, this.textWidth(unit));
    this.resetTextColor();
    this.drawText(value, x, y, width - unitWidth - 6, 'right');
	if(this.VISIBLE_SYSTEM){
		this.changeTextColor(this.systemColor());
	    this.drawText(unit, x + width - unitWidth, y, unitWidth, 'right');
	}
};

//--------------------------------------------------------------------------
// ● 通貨単位つき数値（所持金など）の描画
//--------------------------------------------------------------------------
CAO_CM_Canvas.prototype.drawCurrencyValue = function(x, y, width) {
    this.drawCurrencyValue($gameParty.gold(), TextManager.gold, TextManager.currencyUnit, x, y, width);
};
