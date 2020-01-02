(function (exports) {
'use strict';

function wrapPrototype(klass, method, fn){
    var oldMethod = klass.prototype[method];
    var newMethod = fn(oldMethod);

    klass.prototype[method] = newMethod;
}

/*:
 * @plugindesc 視線、聴覚トリガを実現します。
 *
 * @author liply
 *
 * @help
 * トリガを設定したいページで、コメント欄に以下のコマンドを記述します。
 *
 * triggerHear
 * 聴覚を実現します。指定された半径の円状に当たり判定を展開します。
 *
 * 例
 * triggerHear 3
 * 半径３のプレイヤーに判定
 *
 * triggerSee
 *
 * 視覚を実現します。指定された半径、角度の扇状に当たり判定を展開します。
 * その際、イベントの向きを考慮します。
 *
 * 例
 * triggerSee 3 90
 * 半径３、角度９０度のプレイヤーに判定
 *
 * triggerSquare
 * 視界長方形上に当たり判定を展開します。
 *
 * 例
 * triggerSquare 3 10
 * 幅３、長さ１０のプレイヤーに判定
 *
 */

var ISQ2 = 1 / Math.sqrt(2);

function toXy(d){
    switch(d){
        case 1:
            return {x: -ISQ2, y: ISQ2};
        case 2:
            return {x: 0, y: 1};
        case 3:
            return {x: ISQ2, y: ISQ2};
        case 4:
            return {x:-1, y: 0};
        case 5:
            return {x: 0,y: 0};
        case 6:
            return {x: 1, y: 0};
        case 7:
            return {x: -ISQ2, y: -ISQ2};
        case 8:
            return {x: 0, y: -1};
        case 9:
            return {x: ISQ2, y: -ISQ2};
    }

    return {x:0,y:0};
}

function isEventReady(event){
    return !$gameMap.isEventRunning() && !event._erased;
}

wrapPrototype(Game_Event, 'setupPageSettings', function (old){ return function(){
    old.call(this);
    var triggers = readTrigger(this.page());
    this._triggerHear = triggers.hear;
    this._triggerSee = triggers.see;
    this._triggerSquare = triggers.square;
}; });

wrapPrototype(Game_Event, 'update', function (old){ return function(){
    old.call(this);
    if(this._triggerHear){
        checkTriggerHear(this, this._triggerHear);
    }
    if(this._triggerSee){
        checkTriggerSee(this, this._triggerSee);
    }
    if(this._triggerSquare){
        checkTriggerSquare(this, this._triggerSquare);
    }
}; });

//triggerHear 3
//triggerSee 3 360
function readTrigger(page){
    var trigger = {};
    page.list.forEach(function (cmd){
        if(cmd.code === 108 || cmd.code === 408){
            var p = cmd.parameters[0];
            var splat = p.split(' ');
            var triggerName = splat[0].toLowerCase();
            if(triggerName === 'triggerhear'){
                trigger.hear = {range: +splat[1]};
            }else if(triggerName === 'triggersee'){
                trigger.see = {range: +splat[1], angle: +splat[2]};
            }else if(triggerName === 'triggersquare'){
                trigger.square = {width: +splat[1], height: +splat[2]};
            }
        }
    });

    return trigger;
}

function checkTriggerHear(event, param){
    var dx =  $gamePlayer._realX - event._realX;
    var dy =  $gamePlayer._realY - event._realY;

    var l = Math.sqrt(dx*dx+dy*dy);
    if(l <= param.range && isEventReady(event)){
        event.start();
    }
}

function checkTriggerSee(event, param){
    var dx = $gamePlayer._realX - event._realX;
    var dy = $gamePlayer._realY - event._realY;
    var l = Math.sqrt(dx*dx+dy*dy);

    if(l < param.range && isEventReady(event)){
        var nx = dx / l;
        var ny = dy / l;

        var dir = toXy(event.direction());
        var cos = nx * dir.x + ny * dir.y;
        if(!isNaN(cos)){
            var theta = Math.acos(cos);
            var angleRad = param.angle * Math.PI / 180 / 2;
            if(theta < angleRad){
                event.start();
            }
        }
    }
}

function checkTriggerSquare(event, param){
    var cx = event._realX + 0.5;
    var cy = event._realY + 0.5;
    var left, top, right, bottom;

    switch(event.direction()){
        case 2:
            left = cx - param.width / 2;
            top = cy;
            right = cx + param.width / 2;
            bottom = cy + param.height;
            break;

        case 4:
            left = cx - param.height;
            top = cy - param.width / 2;
            right = cx;
            bottom = cy + param.width / 2;
            break;

        case 6:
            left = cx;
            top = cy - param.width / 2;
            right = cx + param.height;
            bottom = cy + param.width / 2;
            break;

        case 8:
            left = cx - param.width / 2;
            top = cy - param.height;
            right = cx + param.width / 2;
            bottom = cy;
            break;
    }

    var x = $gamePlayer._realX + 0.5;
    var y = $gamePlayer._realY + 0.5;

    if(left <= x && x <= right &&
        top <= y && y <= bottom && isEventReady(event)){
        event.start();
    }
}

exports.toXy = toXy;

}((this.liply = this.liply || {})));