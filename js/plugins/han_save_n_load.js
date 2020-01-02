//==============================================================================
// ■ セーブ＆ロード画面をカスタマイズするスクリプト
//    Ver 0.02　2012/01/21　Sceneクラス関連を修正、イベントコマンド「セーブ画面を
//                          開く」に未対応だった不具合を修正
//    Ver 0.01　2011/12/25
//    http://fweb.midi.co.jp/~mikagami/atelier/
//------------------------------------------------------------------------------
//
// セーブ画面とロード画面の見た目を少し変更します。
// セーブファイルに「セーブした場所（マップの表示名）」とゲーム画面の
// スクリーンショットを追加します。
// また、セーブファイルを「Save」フォルダへ保存するようにします。
//
// ※注意！
// ・スクリプト導入前に使用していたセーブファイルは使用できなくなります。
//  -> 構わず使用できます。by HAN
// ・他にセーブ＆ロード画面をカスタマイズするスクリプトを導入している場合、
// 　競合が起こる可能性は高いと思います。
// ・ゲーム画面のスクリーンショットを変換して保存している関係上、セーブファイルの
// 　ファイルサイズが比較的大きくなります。また、プレビューの表示速度が遅いです。
// ・ひととおりの動作確認はしていますが、不具合ゼロを保障するものではありません。
// ・このスクリプトの著作権は著者にあります。
// 　ですがスクリプトの利用や改造・再配布に著者の許可は必要ありません。
// 　著者には未完成な部分の補完や改造依頼に対する対応義務はありません。
// 　他者に改造依頼するより、あなた自身が改造すれば、みんなが幸せになります。
//
//==============================================================================
//--------------------------------------------------------------------------
// ◎ セーブファイルの最大数（上書き定義）
//--------------------------------------------------------------------------
DataManager.maxSavefiles = function() {
    return 20; // 大きすぎないこと！
};
//--------------------------------------------------------------------------
// ● プレビュー用ビットマップをセーブ可能なbase64/imageUrl形式に変換してセーブ
//     bitmap : ビットマップ
//--------------------------------------------------------------------------
DataManager.makeSavefileInfo = function() {
    var info = {};
    info.globalId       = this._globalId;
    info.title          = $dataSystem.gameTitle;
    info.characters     = $gameParty.charactersForSavefile();
    info.faces          = $gameParty.facesForSavefile();
    info.playtime       = $gameSystem.playtimeText();
    info.timestamp      = Date.now();
    info.saveTitle      = $gameMap.displayName();
    return info;
};
DataManager.makeSavefilePreviewUrl = function() {
    return  $gameTemp.savePreviewUrl;
};

DataManager.saveGameWithoutRescue = function(savefileId) {
    var json = JsonEx.stringify(this.makeSaveContents());
    if (json.length >= 200000) {
        console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
    this._lastAccessedId = savefileId;
    var globalInfo = this.loadGlobalInfo() || [];
    var previewInfo = this.loadPreviewInfo() || [];
    globalInfo[savefileId] = this.makeSavefileInfo();
    previewInfo[savefileId] = this.makeSavefilePreviewUrl();
    this.saveGlobalInfo(globalInfo);
    this.savePreviewInfo(previewInfo);
    return true;
};
DataManager.savePreviewInfo = function(info) {
    StorageManager.save(65535, JSON.stringify(info));
    DataManager.previewInfo = DataManager.loadPreviewInfo();
};
DataManager.loadPreviewInfo = function() {
    var json;
    try {
        json = StorageManager.load(65535);
    } catch (e) {
        console.error(e);
        return [];
    }
    if (json) {
        var previewInfo = JSON.parse(json);
        for (var i = 1; i <= this.maxSavefiles(); i++) {
            if (!StorageManager.exists(i)) {
                delete previewInfo[i];
            }
        }
        return previewInfo;
    } else {
        return [];
    }
};
DataManager.previewInfo = DataManager.loadPreviewInfo() || [];
//--------------------------------------------------------------------------
// ◎ セーブファイル表示用のキャラクター画像情報（上書き定義）
//--------------------------------------------------------------------------
//[actor.character_name, actor.character_index, actor.level, actor.name]
Game_Party.prototype.charactersForSavefile = function() {
    return this.battleMembers().map(function(actor) {
        return [actor.characterName(), actor.characterIndex(), actor.level, actor.name()];
    });
};
//--------------------------------------------------------------------------
// ● セーブプレビュー用BMP
//--------------------------------------------------------------------------
Game_Temp.prototype.savePreviewUrl = undefined;
Game_Temp.prototype.createSavePreview = function(){
    var previewBitmap = new Bitmap(224,160);
    previewBitmap.blt(SceneManager.snap(), $gamePlayer.screenX() - 112, $gamePlayer.screenY()-96, 224,160, 0, 0, 224, 160);
    this.savePreviewUrl = previewBitmap.canvas.toDataURL();
    delete previewBitmap;
}


//==============================================================================
// ■ Window_SaveFileList
//------------------------------------------------------------------------------
// 　セーブ＆ロード画面で表示する、セーブファイル一覧のウィンドウです。
//==============================================================================
function Window_SaveFileWithPreviewList() {
    this.initialize.apply(this, arguments);
}

Window_SaveFileWithPreviewList.prototype = Object.create(Window_Selectable.prototype);
Window_SaveFileWithPreviewList.prototype.constructor = Window_SaveFileWithPreviewList;
//--------------------------------------------------------------------------
// ● オブジェクト初期化
//--------------------------------------------------------------------------
Window_SaveFileWithPreviewList.prototype.initialize = function(x, y) {
    Window_Selectable.prototype.initialize.call(this, x, y, (Graphics.width - x) / 2, (Graphics.height - y));
    this.refresh();
    this.activate();
};
//--------------------------------------------------------------------------
// ● 項目数の取得
//--------------------------------------------------------------------------
Window_SaveFileWithPreviewList.prototype.maxItems = function() {
    return DataManager.maxSavefiles();
};

Window_SaveFileWithPreviewList.prototype.maxVisibleItems = function() {
    return 5;
};
//--------------------------------------------------------------------------
// ● 項目の高さを取得
//--------------------------------------------------------------------------
Window_SaveFileWithPreviewList.prototype.itemHeight = function() {
    var innerHeight = this.height - this.padding * 2;
    return Math.floor(innerHeight / this.maxVisibleItems());
};
//--------------------------------------------------------------------------
// ● 項目の描画
//--------------------------------------------------------------------------
Window_SaveFileWithPreviewList.prototype.drawItem = function(index) {
    var id = index + 1;
    var valid = DataManager.isThisGameFile(id);
    var info = DataManager.loadSavefileInfo(id);
    var rect = this.itemRectForText(index);
    var text_h = rect.y + (rect.height - this.lineHeight() * 2) / 2;
    this.changeTextColor(this.systemColor());
    this.drawFileId(id, rect.x, text_h);
    if (info) {
        //this.changePaintOpacity(valid);
        this.drawContents(info, rect, valid, text_h);
        //this.changePaintOpacity(true);
    }
};
Window_SaveFileWithPreviewList.prototype.drawFileId = function(id, x, y) {
    this.drawText(TextManager.file + ' ' + id, x, y, 180);
};
Window_SaveFileWithPreviewList.prototype.processOk = function(index) {
    this.callOkHandler();
}
Window_SaveFileWithPreviewList.prototype.drawContents = function(info, rect, valid, text_h) {
    this.resetTextColor();
    //draw playtime
    this.drawText(info.playtime, rect.x, text_h, rect.width, 'right');
    //draw saveTitle
    var title = info.saveTitle || "< NO TITLE >";
    this.drawText(title, rect.x, text_h + this.lineHeight(), rect.width);
}

function Window_SaveFilePreview() {
    this.initialize.apply(this, arguments);
}

Window_SaveFilePreview.prototype = Object.create(Window_Selectable.prototype);
Window_SaveFilePreview.prototype.constructor = Window_SaveFilePreview;
//--------------------------------------------------------------------------
// ● オブジェクト初期化
//--------------------------------------------------------------------------
Window_SaveFilePreview.prototype.initialize = function(x, y) {
    Window_Selectable.prototype.initialize.call(this, x, y, Graphics.width - x, Graphics.height - y);
    this._fileNo = -1;
};
//--------------------------------------------------------------------------
// ● 解放 =?
//--------------------------------------------------------------------------

//--------------------------------------------------------------------------
// ● セーブファイルをロードしてプレビューを表示
//     file_no : セーブファイル番号
//--------------------------------------------------------------------------
Window_SaveFilePreview.prototype.setPreview = function(fileNo) {
    if(this._fileNo === fileNo){
        return;
    }
    this._fileNo = fileNo;
    this.refresh();
}
//--------------------------------------------------------------------------
// ● リフレッシュ
//--------------------------------------------------------------------------
Window_SaveFilePreview.prototype.refresh = function() {
    this.contents.clear();
    var id = this._fileNo + 1;
    //var valid = DataManager.isThisGameFile(id);
    var info = DataManager.loadSavefileInfo(id);
    if(info){
        var bitmap = new Bitmap(224,160);
        var previewImg = new Image();
        var startX = (this.contents.width - bitmap.width) / 2;
        previewImg.src = DataManager.previewInfo[id] || "";
        previewImg.onload = function(){
            bitmap.context.drawImage(previewImg,0,0);
            this.contents.fillRect(startX - 1, 7, bitmap.width +2 , bitmap.height, 'rgba(0, 0, 0, 1)');
            this.contents.blt(bitmap, 0, 0, 224,160, startX, 8, bitmap.width, bitmap.height)
        }.bind(this);
        info.characters.map(function(data, i){
            if(i >=4) return;
            var characterY = bitmap.height + 70 + i * 60;
            this.drawCharacter(data[0], data[1], startX+16, characterY + 28);
            this.resetTextColor();
            this.drawText(data[3], startX+80, characterY, bitmap.width - startX - 0);
        }.bind(this));
    }
}
//--------------------------------------------------------------------------
// ◎ 開始処理（上書き定義）
//--------------------------------------------------------------------------
Scene_File.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this._listWindow = new Window_SaveFileWithPreviewList(0, this._helpWindow.height);
    this._listWindow.setHandler('ok', this.onSavefileOk.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this._previewWindow = new Window_SaveFilePreview(this._listWindow.width, this._helpWindow.height);
    this.addWindow(this._listWindow);
    this.addWindow(this._previewWindow);
    this.initSelection();
};
Scene_File.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._previewWindow.refresh();
}
//--------------------------------------------------------------------------
// ◎ 終了処理（上書き定義）
//--------------------------------------------------------------------------
Scene_File.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
}
//--------------------------------------------------------------------------
// ◎ 選択状態の初期化（上書き定義）
//--------------------------------------------------------------------------
Scene_File.prototype.initSelection = function() {
    this._listWindow.select(this.firstSavefileIndex())
    this._previewWindow.setPreview(this.firstSavefileIndex())
}
//--------------------------------------------------------------------------
// ◎ フレーム更新（上書き定義）
//--------------------------------------------------------------------------
Scene_File.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    this._previewWindow.setPreview(this._listWindow._index)
}
var _old_scene_map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function(){
    $gameTemp.createSavePreview();
    _old_scene_map_terminate.call(this);
}
