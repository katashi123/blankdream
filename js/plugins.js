// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"AltMenuScreen","status":false,"description":"メニュー画面のレイアウトを変更します。","parameters":{}},
{"name":"AltSaveScreen","status":false,"description":"セーブ／ロード画面のレイアウトを変更します。","parameters":{}},
{"name":"Community_Basic","status":false,"description":"基本的なパラメーターを設定するプラグインです。","parameters":{"cacheLimit":"10","screenWidth":"816","screenHeight":"624","changeWindowWidthTo":"","changeWindowHeightTo":"","renderingMode":"auto","alwaysDash":"off"}},
{"name":"liply_onBitmapLoad_patch","status":false,"description":"","parameters":{}},
{"name":"liply_preferAutoDetect","status":false,"description":"","parameters":{}},
{"name":"global_object","status":true,"description":"グローバルスクリプト記述プラグイン","parameters":{}},
{"name":"global_k","status":true,"description":"グローバルスクリプト記述プラグイン k","parameters":{}},
{"name":"liply_ShareChip","status":false,"description":"","parameters":{}},
{"name":"liply_ZoomChip","status":false,"description":"","parameters":{}},
{"name":"BMSP","status":true,"description":"BMSPベースプラグインです。","parameters":{}},
{"name":"BMSP_MapFog","status":true,"description":"マップにフォグを表示します。","parameters":{"Label":"フォグ"}},
{"name":"HalfMove","status":false,"description":"半歩移動プラグイン","parameters":{"8方向移動":"true","8方向移動スイッチ":"0","イベントすり抜け":"true","強制中無効":"false","角回避":"true","斜め移動中減速":"false","トリガー拡大":"false","実歩数調整":"false","上半分移動不可地形":"0","上半分移動不可Region":"0","下半分移動不可地形":"0","下半分移動不可Region":"0","右半分移動不可地形":"0","右半分移動不可Region":"0","左半分移動不可地形":"0","左半分移動不可Region":"0","全方向移動不可地形":"0","全方向移動不可Region":"0","イベント複数起動防止":"false","イベント位置重複OK":"false","イベント探索深度":"12"}},
{"name":"CustomizeConfigDefault","status":true,"description":"オプションデフォルト値設定プラグイン","parameters":{"常時ダッシュ":"OFF","コマンド記憶":"OFF","BGM音量":"100","BGS音量":"100","ME音量":"100","SE音量":"100","常時ダッシュ消去":"OFF","コマンド記憶消去":"OFF","BGM音量消去":"OFF","BGS音量消去":"OFF","ME音量消去":"OFF","SE音量消去":"OFF"}},
{"name":"LoadComSim","status":true,"description":"ver1.00 メニューコマンドにロードを追加します。","parameters":{"loadtext":"ロード"}},
{"name":"MKR_PlayerMoveForbid","status":true,"description":"(v1.0.5) プレイヤー移動禁止プラグイン","parameters":{"Default_Move_Flag":"230","Default_Menu_Flag":"false","Enter Flag":"false"}},
{"name":"YEP_RegionRestrictions","status":true,"description":"v1.04 Use regions to block out Events and/or the player from\nbeing able to venture into those spots.","parameters":{"Player Restrict":"254","Event Restrict":"0","All Restrict":"0","Player Allow":"255","Event Allow":"0","All Allow":"0"}},
{"name":"MKR_PlayerSensor","status":false,"description":"(v2.3.4) プレイヤー探索プラグイン","parameters":{"探索設定":"====================================","Sensor_Switch":"60","Lost_Sensor_Switch":"","Both_Sensor":"OFF","Terrain_Decision":"ON","Auto_Sensor":"true","Event_Decision":"OFF","Region_Decision":"[]","Real_Range_X":"0.000","Real_Range_Y":"0.000","視界設定":"====================================","Range_Visible":"ON","Range_Color":"white","Range_Opacity":"80","Player_Found":"{\"Ballon\":\"0\",\"Se\":\"{\\\"Name\\\":\\\"\\\",\\\"Volume\\\":\\\"90\\\",\\\"Pitch\\\":\\\"100\\\",\\\"Pan\\\":\\\"0\\\"}\",\"Common_Event\":\"0\",\"Delay\":\"0\"}","Player_Lost":"{\"Ballon\":\"0\",\"Se\":\"{\\\"Name\\\":\\\"\\\",\\\"Volume\\\":\\\"90\\\",\\\"Pitch\\\":\\\"100\\\",\\\"Pan\\\":\\\"0\\\"}\",\"Common_Event\":\"0\",\"Delay\":\"0\"}"}},
{"name":"BattleSplashFade","status":true,"description":"戦闘開始時のフェードをスプラッシュに変更します。","parameters":{"Apply FadeOut":"1","FadeOut Frames":"100","Apply FadeIn":"0","FadeIn Frames":"80"}},
{"name":"han_itemChoiceProcessor","status":true,"description":"","parameters":{}},
{"name":"han_customMenuBase","status":true,"description":"","parameters":{}},
{"name":"han_commandWindow","status":true,"description":"","parameters":{}},
{"name":"han_statusWindow","status":true,"description":"","parameters":{}},
{"name":"han_helpWindow","status":true,"description":"","parameters":{}},
{"name":"han_itemCategoryDetailizer","status":true,"description":"","parameters":{}},
{"name":"han_itemSwitchManage","status":true,"description":"","parameters":{}},
{"name":"han_save_n_load","status":true,"description":"","parameters":{}},
{"name":"dsBattleStartMessage","status":false,"description":"戦闘開始時のメッセージ表示を変更するプラグイン ver1.00","parameters":{"Max Lines":"0","Line Space":"2","Show Count":"0","Show Wait":"0"}},
{"name":"MOG_TitlePictureCom","status":true,"description":"(v1.1) Adiciona comandos em imagens no lugar da janela.","parameters":{"New Game X-Axis":"-180","New Game Y-Axis":"-30","Continue X-Axis":"-180","Continue Y-Axis":"40","Options X-Axis":"-1800","Options Y-Axis":"130","Title Sprite":"false","Title Sprite X-Axis":"0","Title Sprite Y-Axis":"0"}},
{"name":"liply_Trigger","status":true,"description":"視線、聴覚トリガを実現します。","parameters":{}},
{"name":"UCHU_MobileOperation","status":true,"description":"スマホ操作用プラグイン。横持ち/縦持ちに対応した仮想ボタン、\r\nタッチ操作の方法を追加拡張し、スマホプレイを快適にします。","parameters":{"---PC Option---":"","PC BtnDisplay":"false","PC TouchExtend":"true","---File Path---":"","DPad Image":"./img/system/DirPad.png","ActionBtn Image":"./img/system/ActionButton.png","CancelBtn Image":"./img/system/CancelButton.png","---Button Customize---":"","Button Opacity":"0.7","Vertical BtnZoom":"1.7","Tablet BtnZoom":"0.8","TabVertical BtnZoom":"1.1","HideButton OnMessage":"true","DPad Visible":"true","DPad Size":"200","DPad Margin":"10; 10","DPad Orientation":"left; bottom","DPad OpelationRange":"1.3","DPad DiagonalRange":"0.3","ActionBtn Visible":"true","ActionBtn Size":"100","ActionBtn Margin":"10; 90","ActionBtn Orientation":"right; bottom","CancelBtn Visible":"true","CancelBtn Size":"100","CancelBtn Margin":"110; 10","CancelBtn Orientation":"right; bottom","---TouchInput Extend---":"","Flick PageUp-PageDown":"true","HoldCanvas ActionBtn":"true","OutCanvas CancelBtn":"false","OutCanvas ActionBtn":"false"}},
{"name":"liply_Save28","status":true,"description":"","parameters":{}}
];