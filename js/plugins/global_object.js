//=============================================================================
// global_object.js
//=============================================================================

/*:ja
 * @plugindesc グローバルスクリプト記述プラグイン
 * @author 
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 * VXAce移植の為のグローバルスクリプト記述プラグインです。
 */

function setZIndex(id, index){
    var element = document.getElementById(id);
    if(element)element.style.zIndex = ''+index;
}

function hideSoftwarePad(){
    setZIndex("Dirpad", 0);
    setZIndex("okBtn", 0);
    setZIndex("escapeBtn", 0);
}

function showSoftwarePad(){
    setZIndex("Dirpad", 11);
    setZIndex("okBtn", 11);
    setZIndex("escapeBtn", 11);
}

// 変数
var $POP_DIRECTION = false; //イベントの方向を考慮。

var $CHARPOP_HEIGHT = 112; //キャラポップの高さ

var $THINK_TAIL = 101; //思案型テール判定用スイッチ番号
var $SYSTEM_LINE = 102; //1行目テキスト非表示判定用スイッチ番号

var $DASH_DISABLE = 200; //ダッシュ禁止スイッチ番号

var $ESCAPE_GAME_1 = true; //逃走イベント1処理切り替え(Ep1 - ザックからの逃走1)
var $ESCAPE_GAME_2 = true; //逃走イベント2処理切り替え(Ep1 - ザックからの逃走2)
var $ESCAPE_GAME_3 = true; //逃走イベント3処理切り替え(Ep2 - ザックからの逃走3)
var $ESCAPE_GAME_4 = true; //逃走イベント4処理切り替え(Ep3 - ヘビからの逃走1)
var $ESCAPE_GAME_5 = true; //逃走イベント5処理切り替え(Ep3 - ヘビからの逃走2)
var $ESCAPE_GAME_6 = true; //逃走イベント6処理切り替え(Ep3 - ゾンビからの逃走1)


//iOS端末判定
var $isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;

//===============================================
// rpg_core.js
//===============================================

Window.prototype._refreshCursor = function() {
    var pad = this._padding;
    var x = this._cursorRect.x + pad - this.origin.x;
    var y = this._cursorRect.y + pad - this.origin.y;
    var w = this._cursorRect.width;
    var h = this._cursorRect.height;
    //var m = 4;
    var m = 8; // 切り抜きサイズ変更
    var x2 = Math.max(x, pad);
    var y2 = Math.max(y, pad);
    var ox = x - x2;
    var oy = y - y2;
    var w2 = Math.min(w, this._width - pad - x2);
    var h2 = Math.min(h, this._height - pad - y2);
    var bitmap = new Bitmap(w2, h2);

    this._windowCursorSprite.bitmap = bitmap;
    this._windowCursorSprite.setFrame(0, 0, w2, h2);
    this._windowCursorSprite.move(x2, y2);

    if (w > 0 && h > 0 && this._windowskin) {
        var skin = this._windowskin;
        var p = 96;
        var q = 48;
        bitmap.blt(skin, p+m, p+m, q-m*2, q-m*2, ox+m, oy+m, w-m*2, h-m*2);
        bitmap.blt(skin, p+m, p+0, q-m*2, m, ox+m, oy+0, w-m*2, m);
        bitmap.blt(skin, p+m, p+q-m, q-m*2, m, ox+m, oy+h-m, w-m*2, m);
        bitmap.blt(skin, p+0, p+m, m, q-m*2, ox+0, oy+m, m, h-m*2);
        bitmap.blt(skin, p+q-m, p+m, m, q-m*2, ox+w-m, oy+m, m, h-m*2);
        bitmap.blt(skin, p+0, p+0, m, m, ox+0, oy+0, m, m);
        bitmap.blt(skin, p+q-m, p+0, m, m, ox+w-m, oy+0, m, m);
        bitmap.blt(skin, p+0, p+q-m, m, m, ox+0, oy+h-m, m, m);
        bitmap.blt(skin, p+q-m, p+q-m, m, m, ox+w-m, oy+h-m, m, m);
    }
};

//===============================================
// rpg_managers.js
//===============================================

DataManager.maxSavefiles = function() {
    // セーブファイル数変更
    //return 20;
    return 40;
};

/*
// 音声ファイル、強制小文字読み込み
AudioManager.createBuffer = function(folder, name) {
    name = name.toLowerCase(); 
    var ext = this.audioFileExt();
    var url = this._path + folder + '/' + encodeURIComponent(name) + ext;
    if (this.shouldUseHtml5Audio() && folder === 'bgm') {
        Html5Audio.setup(url);
        return Html5Audio;
    } else {
        return new WebAudio(url);
    }
};

// 画像ファイル、強制小文字読み込み
ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
    filename = filename.toLowerCase(); 
    if (filename) {
    	//folder = "main_expansion/" + folder; //拡張ファイルテスト
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.loadNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};
*/

//===============================================
// rpg_windows.js
//===============================================

//-----------------------------------------------------------------------------
// Window_Base

Window_Base.prototype.standardBackOpacity = function() {
//  return 192;
    return 255;
};



//-----------------------------------------------------------------------------
// Window_Message
//

Window_Message.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    Window_Base.prototype.initialize.call(this, x, 0, width, height);
    this.openness = 0;
    this.initMembers();
    this.createSubWindows();
    this.updatePlacement();
    
    this.pop_character = null;
    this.texts = null;
    
    this.mes_id = null;
    this.tail = null;
    this.tail_x = null;
    this.tail_y = null;

};


Window_Message.prototype.newPage = function(textState) {
    this.contents.clear();
    this.resetFontSettings();
    this.clearFlags();
    this.loadMessageFace();
    textState.x = this.newLineX();
//    textState.y = 0;

	if($gameSwitches.value($SYSTEM_LINE) == true){
		// 最初の一行を表示しない
	    var lineHeight = this.lineHeight();
	    textState.y = 0 - lineHeight;
	}else{
		textState.y = 0;
	}
	
    textState.left = this.newLineX();
    textState.height = this.calcTextHeight(textState, false);
};


//テキスト処理開始
Window_Message.prototype.startMessage = function() {
    this._textState = {};
    this._textState.index = 0;
    this._textState.text = this.convertEscapeCharacters($gameMessage.allText());
    this.newPage(this._textState);
//    this.updatePlacement();
    this.updateBackground();

    if(!this.visible){
    	this.visible = true;
    }
    this.open();
    
    /*
    var Parameters = PluginManager.parameters('UCHU_MobileOperation');
    if (Utils.isMobileDevice() || Parameters["PC BtnDisplay"] == "true"){
	    //ソフトウェアパッド非表示
	    document.getElementById("Dirpad").zIndex = '0';
		document.getElementById("okBtn").style.zIndex = '0';
		document.getElementById("escapeBtn").style.zIndex = '0';
	}
	*/
};


Window_Message.prototype.updateMessage = function() {
	//this.updateWindow_pop(1);
    if (this._textState) {
    	//console.log("updateMessage-----------------------:" + Object.keys(this._textState));
    	//console.log("updateMessage-----------------------:" + this._textState.text);
        while (!this.isEndOfText(this._textState)) {
            if (this.needsNewPage(this._textState)) {
                this.newPage(this._textState);
            }
            this.updateShowFast();
            this.processCharacter(this._textState);
            if (!this._showFast && !this._lineShowFast) {
                break;
            }
            if (this.pause || this._waitCount > 0) {
                break;
            }
        }
        if (this.isEndOfText(this._textState)) {
        	//console.log("this.isEndOfText-----------------------:");
            this.onEndOfText();
        }
        return true;
    } else {
        return false;
    }
};

Window_Message.prototype.onEndOfText = function() {
    if (!this.startInput()) {
        if (!this._pauseSkip) {
            this.startPause();
        } else {
        	this.visible = false;
            this.terminateMessage();
        }
    }
    this._textState = null;
};

Window_Message.prototype.getPopChara = function() {
    return this.pop_character;
};

Window_Message.prototype.setPopChara = function(index) {
    this.pop_character = index;
    this.mes_id = index;
};

Window_Message.prototype.getMesId = function() {
    return this.mes_id;
};

Window_Message.prototype.resizeWindow_pop = function() {  
	//console.log("--- resizeWindow_pop ---");
	//console.log("this.getPopChara() = " + this.getPopChara());
	if( this.getPopChara() != null ){
    	var n = 32;　// フォントサイズは28
    	n += $gameMessage.faceName() === '' ? 0 : 200;
    	var m = $gameMessage.faceName() === '' ? 0 : 168;
    	//var widthList = [220,300,375,400];
    	var widthList = [330,450,562,600];// 1.5
    	//var widthList = [362,482,594,632];// 1.5(+32)
    	this.width = 0;
    	var tmp_maxw = this.getMaxWidth();
    	for(var i = 0; i < widthList.length; i++){
    		if(widthList[i] > tmp_maxw + n){
    			this.width = widthList[i];
    			break;
    		}
    	}
    	if(this.width == 0){
    		this.width = tmp_maxw + n;
    		if(this.width >= 800){
    			this.width = 800;
    		}
    	}
    	this.height = 0;
    	var lineHeight = this.lineHeight();
    	var tmp_height = this.texts.length * lineHeight;
    	if(tmp_height > m){
    		this.height = tmp_height +32;
    	}else{
    		this.height = m +32;
    	}
    	
    	if($gameSwitches.value($SYSTEM_LINE) == true){ 
    		this.height -= lineHeight;
		}
		
    	this.updateWindow_pop(0)

    	//console.log("this._positionType = " + this._positionType);
    	this._background = $gameMessage.background();
    	/*if(this._background == 1){
	    	if(this._positionType == 1){
	    		this.updatePlacement();
	    	}
	    }*/
   	
    }else{
    	//console.log("--- resizeWindow_pop else ---");
    	var lineHeight = this.lineHeight();
    	this.width = this.windowWidth();
    	this.height = this.numVisibleRows() * lineHeight + 32;
    	this.x = (Graphics.boxWidth - this.width) / 2;
    	this._background = $gameMessage.background();
    	this.updatePlacement();
    }
};


Window_Message.prototype.updateWindow_pop = function(index) {
//	console.log("--- updateWindow_pop --- index = " + index);

	if(index >= 1){
		this._background = $gameMessage.background();
		if(this._background > 0){
			return;
		}
	}
	
	if( this.getPopChara() != null ){
    	var character = this.getCharacter(this.getPopChara());
    	
    	if(character == null){
    		return false;
    	}
    	
    	var chara_x = 0;
    	var chara_y = 0;
    	chara_x = character.screenX();
    	chara_y = character.screenY();
    	
    	//x座標
    	var tmp_n = this.width / 2;
    	var tmp_x = 0;
    	if(tmp_n > (this.width-48)){
    		tmp_x = chara_x - (this.width-48);
    	}else{
    		tmp_x = chara_x - tmp_n;
    	}
    	
    	//y座標
    	this._positionType = $gameMessage.positionType();
    	if(this.getPopChara() == 0  && $POP_DIRECTION){
    		if(character.direction() == 2){
    			this._positionType = 0; // 上にポップ
    		}else if(character.direction() == 8){
    			this._positionType = 2; // 下にポップ
    		}
    	}
    	var tmp_y = 0;
    	if(this._positionType == 0){
    		tmp_y = chara_y - $CHARPOP_HEIGHT - this.height;
    	}else{
    		tmp_y = chara_y + 16;
    	}
    	
    	var x_max = Graphics.boxWidth -4 -this.width;
    	var x_min = 4;
    	var y_max = Graphics.boxHeight -this.height;
    	var y_min = 4;
		
    	if(tmp_x < x_max){
			if(tmp_x > x_min){
				this.x = tmp_x;
			}else{
				this.x = x_min;
			}
		}else{
			if(x_max > x_min){
				this.x = x_max;
			}else{
				this.x = x_min;
			}
		}
		if(tmp_y < y_max){
			if(tmp_y > y_min){
				this.y = tmp_y;
			}else{
				this.y = y_min;
			}
		}else{
			if(y_max > y_min){
				this.y = y_max;
			}else{
				this.y = y_min;
			}
		}
    	
    }
};

//文字の長さを取得
Window_Message.prototype.getTextWidth_noEscape = function(line,text_o) {
    var add = 10; // 補正値
    
    var tmp_text = text_o;
    
    tmp_text = tmp_text.replace(/\\/g, '\x1b');
    if(tmp_text.match(/\x1bh\[-1\]/i)){
    	tmp_text = tmp_text.replace(/\x1bh\[-1\]/gi, '');
    }else if(tmp_text.match(/\x1bh\[([0-9]+)\]/i)){
    	tmp_text = tmp_text.replace(/\x1bh\[([0-9]+)\]/g, '');
	}else if(tmp_text.match(/\x1bh/i)){
    	tmp_text = tmp_text.replace(/\x1bh/gi, '');
	}
	//tmp_text = this.convertEscapeCharacters(tmp_text);
	
	var basic_width = this.textWidth(tmp_text) + add;
	return basic_width;
};

//最長の長さを取得
Window_Message.prototype.getMaxWidth = function() {
    var tmp_text = null;
    var tmp_max = 0;
    for(var i = 0; i < this.texts.length; i++){
    	var tmp_w = this.getTextWidth_noEscape(this.texts[i],this.texts[i]) +20;
    	if(tmp_max < tmp_w){
    		tmp_max = tmp_w;
    	}
    }
    return tmp_max;
};

Window_Message.prototype.getCharacter = function(param) {
    switch(param){
    	case -1: // プレイヤー
    		return $gamePlayer;
    	case 0: // アクティブなイベント
    	{
    		var id = $gameMap._interpreter.eventId();
    		if($gameMap.event(id) != null){
    			return $gameMap.event(id);
    		}else{
    			return null;
    		}
    	}
    	default: // 特定のイベント
    	{
    		var event_param = $gameMap.event(param);
    		if($gameMap.event(param) != null){
    			return $gameMap.event(param);
    		}else{
    			return null;
    		}
    	}
    }
};

Window_Message.prototype.convertEscapeCharacters = function(text) {

	var tmp_str = text.replace(/\\/g, '\x1b');
	this.texts = tmp_str.split("\n");
	
	text = this.convertEscapeCharacters_easy(text);

	//キャラポップモード
	this.setPopChara(null);
    if(text.match(/\\h\[-1\]/i)){
		text = text.replace(/\\h\[-1\]/gi, '');
		this.setPopChara(-1);
    }else if(text.match(/\\h\[([0-9]+)\]/)){
    	var res = text.match(/\\h\[([0-9]+)\]/);
		text = text.replace(/\\h\[([0-9]+)\]/g, '');
		this.setPopChara(parseInt(res[1]));
	}else if(text.match(/\\h/i)){
		text = text.replace(/\\h/gi, '');
		this.setPopChara(0);
	}else{
		this.setPopChara(null);
	}
	text = text.replace(/\\/g, '\x1b');
	text = text.replace(/\x1b\x1b/g, '\\');
	
	
	//キャラポップウィンドウリサイズ
	this.resizeWindow_pop();
	
	this.tail = null;
	
	if(this.mes_id != null){
    	if(this._background == 0){
    		this.createTail();
    		this.updateTail();
    	}
	}
	
	return text;
};

Window_Message.prototype.convertEscapeCharacters_easy = function(text) {
//	text = text.replace(/\\/g, '\x1b');
//    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    
    return text;
};

Window_Message.prototype.standardBackOpacity = function() {
  return 192;
};


Window_Message.prototype.terminateMessage = function() {
	if(this.tail != null){
    	this.tail.visible = false;
    	this.tail = null;
    	this.removeChild(this.tail);
    }
    this.close();
    this._goldWindow.close();
    $gameMessage.clear();
    
    var Parameters = PluginManager.parameters('UCHU_MobileOperation');
    if ((Utils.isMobileDevice() || Parameters["PC BtnDisplay"] == "true")) {
	    // //ソフトウェアパッド表示
	    // document.getElementById("Dirpad").style.zIndex = '11';
		// document.getElementById("okBtn").style.zIndex = '11';
		// document.getElementById("escapeBtn").style.zIndex = '11';
        showSoftwarePad();

        //console.log(" window_message terminateMessage ");
	}
};

Window_Message.prototype.getTailPos = function() {
	var pos_x = 0;
	var pos_y = 0;
	var img_w = 48;
	var img_h = 48;
    if(this.mes_id == -2){
    	if(this.x != null){
    		if(this.x > 0){
    			pos_x = this.x + img_w/2;
    			pos_y = this.y + this.height/2 - img_h/2;
    		}else if(this.x < 0){
    			pos_x = this.width - img_w/2;
    			pos_y = this.y + this.height/2 - img_h/2;
    		}else{
    			pos_x = 0;
    			pos_y = 0;
    		}
    	}else{
    		pos_x = 0;
    		pos_y = 0;
    	}
    }else if(this.mes_id <= -3){
    	if(this.x != null){
    		if(this.x > 0){
    			pos_x = this.x - img_w/2;
    			pos_y = this.y + this.height/2;
    		}else if(this.x < 0){
    			pos_x = this.width - img_w/2;
    			pos_y = this.y + this.height/2;
    		}else{
    			pos_x = 0;
    			pos_y = 0;
    		}
    	}else{
    		pos_x = 0;
    		pos_y = 0;
    	}
    }else{
    	var character = this.getCharacter(this.mes_id);
    	
//    	if(character == null) return null;
    	var chara_x = 0;
    	var chara_y = 0;
    	chara_x = character.screenX();
    	chara_y = character.screenY();
    	
    	if((chara_x -24) > this.x){
    		if((chara_x -24) > (this.x + this.witdh -48)){
    			//pos_x = (this.x + this.witdh -48);
    			pos_x = (this.witdh -48);
    		}else{
    			pos_x = (chara_x -24)-this.x;
    		}
    	}else{
    		if(this.x > (this.x + this.witdh -96)){
    			//pos_x = (this.x + this.witdh -96);
    			pos_x = (this.witdh -96);
    		}else{
    			pos_x = this.x;
    		}
    	}
    	pos_y = this.getTailPos_updown();
    }
    var res = [pos_x,pos_y];
    return res;
};

Window_Message.prototype.getTailPos_updown = function() {
	var tmp_y = 0;
	var img_h = 48;
	if(this._positionType == 0){
		//tmp_y = this.y + this.height - img_h/2;
		//tmp_y = this.height - img_h/2;
		tmp_y = this.height - img_h/2 -2;
	}else{
		//tmp_y = this.y - img_h/2;
		//tmp_y = - img_h/2;
		tmp_y = - img_h/2 +1;
	}
	return tmp_y;
};

Window_Message.prototype.createTail = function() {
//	console.log("createTail");
	var tmp_pos = this.getTailPos();
	if(this._positionType == 0){ //上
		this.tail = new Sprite(ImageManager.loadSystem("Window-top"));
		this.tail.x = tmp_pos[0];
		this.tail.y = tmp_pos[1];
		this.tail.visible = false;
		this.addChild(this.tail);
	}else if(this._positionType == 2){ //下
		this.tail = new Sprite(ImageManager.loadSystem("Window-under"));
		this.tail.x = tmp_pos[0];
		this.tail.y = tmp_pos[1];
		this.tail.visible = false;
		this.addChild(this.tail);
	}
};

Window_Message.prototype.updateTail = function() {
    if (this.mes_id != null && this.tail != null){
    	var tail_pos = this.getTailPos();
    	this.tail.x = tail_pos[0];
		this.tail.y = tail_pos[1];
//		this.updateTailBitmap();
    }
};
/*
Window_Message.prototype.updateTailBitmap = function() {
	if(this._positionType == 0){ //上
		this.tail = ImageManager.loadSystem("Window-top");
	}else if(this._positionType == 2){ //下
		this.tail = ImageManager.loadSystem("Window-under");
	}
};
*/

Window_Message.prototype.update = function() {
    this.checkToNotClose();
    Window_Base.prototype.update.call(this);
    while (!this.isOpening() && !this.isClosing()) {
        if (this.updateWait()) {
        	return;
        } else if (this.updateLoading()) {
            return;
        } else if (this.updateInput()) {
        	return;
        } else if (this.updateMessage()) {
        	this.updateWindow_pop(1);
        	this.updateTail();
        	if (this.isOpen()) {
            	this._opening = false;
	            //ウィンドウが表示しきったタイミングでテイル表示
	            if(this.tail != null){
		            if(this.tail.visible == false){
						this.tail.visible = true;
					}
				}
	        }
            return;
        } else if (this.canStart()) {
            this.startMessage();
        } else {
        	this.updateWindow_pop(2);
        	this.updateTail();
            this.startInput();
            return;
        }
    }
};

Window_Message.prototype.updateInput = function() {
    if (this.isAnySubWindowActive()) {
    	this.updateWindow_pop(3);
    	this.updateTail();
    	return true;
    }
    if (this.pause) {
    	this.updateWindow_pop(3);
    	this.updateTail();
        if (this.isTriggered()) {
        	Input.update();
            this.pause = false;
            if (!this._textState) {
                this.terminateMessage();
            }
        }
        return true;
    }
    return false;
};


Window_Message.prototype.refreshDimmerBitmap = function() {
    if (this._dimmerSprite) {
        var bitmap = this._dimmerSprite.bitmap;
        var mes_w = this.width;
        //var h = this.height;
        var w = this.windowWidth();
        var h = this.windowHeight();
        
        var m = this.padding;
        var c1 = this.dimColor1();
        var c2 = this.dimColor2();
        bitmap.resize(w, h);
        bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
        bitmap.fillRect(0, m, w, h - m * 2, c1);
        bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
        this._dimmerSprite.setFrame(0, 0, w, h);
        
        //背景表示位置を設定
        //console.log("this._dimmerSprite.x = " + this._dimmerSprite.x);
        //console.log("this.x = " + this.x);
        if(this.x != 0){
	    //    this._dimmerSprite.x = (mes_w-w)/2;
	    	this._dimmerSprite.x = -this.x;
	    }
	    /*console.log("mes_w = " + mes_w);
	    console.log("this._dimmerSprite.x = " + this._dimmerSprite.x);
	    console.log("this._dimmerSprite.w = " + this._dimmerSprite.width);
	    console.log("this._dimmerSprite.h = " + this._dimmerSprite.height);
	    */
    }
};



//-----------------------------------------------------------------------------
// Window_ChoiceList
//

Window_ChoiceList.prototype.start = function() {
    this.updatePlacement();
    this.updateBackground();
    this.refresh();
    this.selectDefault();
    this.open();
    this.activate();
    
    var Parameters = PluginManager.parameters('UCHU_MobileOperation');
    if (Utils.isMobileDevice() || Parameters["PC BtnDisplay"] == "true"){
	    // //ソフトウェアパッド非表示
	    // document.getElementById("Dirpad").zIndex = '0';
		// document.getElementById("okBtn").style.zIndex = '0';
		// document.getElementById("escapeBtn").style.zIndex = '0';
        hideSoftwarePad();

        //console.log(" Window_ChoiceList start ");
	}
};

Window_ChoiceList.prototype.updatePlacement = function() {
    var positionType = $gameMessage.choicePositionType();
    var messageY = this._messageWindow.y;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    switch (positionType) {
    case 0:
        this.x = 0;
        break;
    case 1:
        this.x = (Graphics.boxWidth - this.width) / 2;
        break;
    case 2:
        this.x = Graphics.boxWidth - this.width;
        break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height;
    } else {
        //this.y = messageY + this._messageWindow.height;
        if(this._messageWindow._dimmerSprite != null ){
        	this.y = messageY + this._messageWindow._dimmerSprite.height;
        }else{
        	this.y = messageY + this._messageWindow.height;
        }
    }
};

//-----------------------------------------------------------------------------
// Window_Selectable

//-----------------------------------------------------------------------------
// Window_EventItem

Window_EventItem.prototype.start = function() {
    this.refresh();
    this.updatePlacement();
    this.select(0);
    this.open();
    this.activate();

    var Parameters = PluginManager.parameters('UCHU_MobileOperation');
    if (Utils.isMobileDevice() || Parameters["PC BtnDisplay"] == "true"){
        // //ソフトウェアパッド非表示
        // document.getElementById("Dirpad").style.zIndex = '0';
        // document.getElementById("okBtn").style.zIndex = '0';
        // document.getElementById("escapeBtn").style.zIndex = '0';
        hideSoftwarePad();

        //console.log(" Window_EventItem start ");
    }
};

//----------------------------------------------------
// Window_SavefileList


Window_SavefileList.prototype.maxVisibleItems = function() {
//    return 5;
    return 3;
};

Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
    var bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        //タイトル非表示
        //this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
        if (valid) {
            //キャラクター非表示
            //this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
			//console.log("info = " + Object.keys(info));
			//顔グラフィック表示
            if (info.characters) {
            	for (var i = 0; i < info.characters.length; i++) {
                	var data = info.faces[i];
					this.drawFace(data[0], data[1], rect.x + 220 + i*(144+18), rect.y + 14);
            	}
            }
        }
    }
    var lineHeight = this.lineHeight();
    var y2 = bottom - lineHeight;
    if (y2 >= lineHeight) {
        this.drawPlaytime(info, rect.x, y2, rect.width);
    }
};


//-----------------------------------------------------------------------------
// Window_Gold

Window_Gold.prototype.windowWidth = function() {
//    return 240;
    return 0;
};

Window_Gold.prototype.windowHeight = function() {
//    return this.fittingHeight(1);
    return 0;
};


//-----------------------------------------------------------------------------
// Window_MenuCommand

Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addFormationCommand();
    this.addOriginalCommands();
    //this.addOptionsCommand(); //オプション非表示
    this.addSaveCommand();
    this.addGameEndCommand();
};


//-----------------------------------------------------------------------------
// Window_MenuStatus


//-----------------------------------------------------------------------------
// Window_MenuActor
//

//-----------------------------------------------------------------------------
// Window_ItemCategory
//

Window_ItemCategory.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item,    'item');
//    this.addCommand(TextManager.weapon,  'weapon');
//    this.addCommand(TextManager.armor,   'armor');
//    this.addCommand(TextManager.keyItem, 'keyItem');
};

//-----------------------------------------------------------------------------
// Window_ItemList
//

Window_ItemList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var numberWidth = this.numberWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
//        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};

//-----------------------------------------------------------------------------
// Window_Status
//


//-----------------------------------------------------------------------------
// Window_TitleCommand
//

Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.newGame,   'newGame');
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
    if(!Utils.isMobileDevice()){
        this.addCommand("Exit",   'gameend');
    }
};

//-----------------------------------------------------------------------------
// Window_GameEnd
//

Window_GameEnd.prototype.makeCommandList = function() {
    this.addCommand(TextManager.toTitle, 'toTitle');
    if(!Utils.isMobileDevice()){
        this.addCommand("終了する", 'gameend');
    }
    this.addCommand(TextManager.cancel,  'cancel');
};

Window_Base.prototype.standardBackOpacity = function() {
    return 255;
};


//===============================================
// rpg_scenes.js
//===============================================

//-----------------------------------------------------------------------------
// Scene_Title
//
Scene_Title.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TitleCommand();
	this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('gameend',  this.commandShotDown.bind(this));
    
//    this._commandWindow.visible = false;
    
    this.addWindow(this._commandWindow);
    
};


//-----------------------------------------------------------------------------
// ゲーム終了処理（追加）
//-----------------------------------------------------------------------------
Scene_Title.prototype.commandShotDown = function() {
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.exit();
};

//-----------------------------------------------------------------------------
// Scene_Map
//

Scene_Map.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this._waitCount = 0;
    this._encounterEffectDuration = 0;
    this._mapLoaded = false;
    this._touchCount = 0;
    //console.log("Scene_map init");

    //画面色調初期化
    //$gameScreen.startTint([0,0,0,0], 1);
};

/*Scene_Map.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this._transfer = $gamePlayer.isTransferring();
    var mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
    DataManager.loadMapData(mapId);
    console.log("Scene_map create");
};*/


//-----------------------------------------------------------------------------
// Scene_GameEnd
//

Scene_GameEnd.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_GameEnd();
    this._commandWindow.setHandler('toTitle',  this.commandToTitle.bind(this));
    this._commandWindow.setHandler('gameend',  this.commandShotDown.bind(this));
    this._commandWindow.setHandler('cancel',   this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_GameEnd.prototype.createBackground = function() {
    Scene_MenuBase.prototype.createBackground.call(this);
//    this.setBackgroundOpacity(128);
	this.setBackgroundOpacity(0);
};

Scene_GameEnd.prototype.commandShotDown = function() {
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.exit();
};


//-----------------------------------------------------------------------------
// Scene_MenuBase
//

Scene_MenuBase.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
    
    //背景は不透明
    this.setBackgroundOpacity(0);
};


//-----------------------------------------------------------------------------
// Scene_Menu
//

Scene_Menu.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_MenuStatus(this._commandWindow.width, 0);
    this.addWindow(this._statusWindow);
    this._statusWindow.opacity = 0;  //ステータスウィンドウ透明
    
};


//-----------------------------------------------------------------------------
// Scene_Item
//



//===============================================
// rpg_objects.js
//===============================================

//-----------------------------------------------------------------------------
// Game_CharacterBase

Game_CharacterBase.prototype.distancePerFrame = function() {
//    return Math.pow(2, this.realMoveSpeed()) / 256;
//	return Math.pow(2, this.realMoveSpeed()*1.4) / 384;
    return Math.pow(2, this.realMoveSpeed()) / 180;
};

//移動時のアニメーション速度
Game_CharacterBase.prototype.animationWait = function() {
//      return (9 - this.realMoveSpeed()) * 3;
    return Math.round((9 - this.realMoveSpeed()) * 1.8);
};


//-----------------------------------------------------------------------------
// Game_Interpreter
//

// Tint Screen
Game_Interpreter.prototype.command223 = function() {
    //MV上ではグレーとなっているグレースケールフィルター値を0とする(ios上での表示がおかしくなる為)
    if($isIOS){
        //iOS系端末のみグレースケールフィルター値を0に。
        this._params[0][3] = 0;
    }else{
        //this._params[0][1] = 100;
    }
    
    $gameScreen.startTint(this._params[0], this._params[1]);

    if (this._params[2]) {
        this.wait(this._params[1]);
    }
    return true;
};


//-----------------------------------------------------------------------------
// Game_Player
//

//ダッシュ禁止判定
Game_Player.prototype.updateDashing = function() {
    if (this.isMoving()) {
        return;
    }
    //フラグによる判定追加
    //if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
    if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled() && !$gameSwitches.value($DASH_DISABLE)) {
        this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
    } else {
        this._dashing = false;
    }
};
