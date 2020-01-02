(function(){
    var x2_3 = ["!doors1.png","!MDDoorsD.png","!_doors.png","!_gasu.png","!_secrets.png","!_secretstsuika.png","cars1.png","cars2.png"];
    var x4_3 = ["$ookinahonoo.png","$ookinaro-purei.png"];
    var x2_4 = ["!doors1.png","!doors12.png","!MDDoorsD.png","!_doors.png","!_gasu.png","!_secrets.png","!_secretstsuika.png","$ookinahonoo3heyanoakari.png","$ookinahonoo3heyanoakarigatsudayo!.png","$raiteingu.png","cars1.png","cars2.png"];
    var x4_4 = ["$ookinahonoo.png","$ookinahonoo2.png","$ookinahonoo3.png","$ookinahonoo3kemuri.png","$ookinahonoo3patoka.png","$ookinaro-purei.png","cars2-2.png"];

    var Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
    Sprite_Character.prototype.setCharacterBitmap = function(){
        Sprite_Character_setCharacterBitmap.apply(this, arguments);

        var fileName = this._characterName + '.png';
        if(x2_3.contains(fileName) || x2_4.contains(fileName)){
            this.scale.set(2, 2);
        }else if(x4_3.contains(fileName) || x4_4.contains(fileName)){
            this.scale.set(4, 4);
        }else{
            this.scale.set(1, 1);
        }
    }
})();