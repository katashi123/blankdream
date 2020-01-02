(function(){
    function traverseSibling(sprite, fn){
        sprite.parent.children.forEach(function(child){
            if(child !== sprite){
                fn(child);
            }
        });
    }

    Sprite_Character.prototype.setCharacterBitmap = function() {
        var found = false;
        var sprite = this;
        traverseSibling(this, function(sibling){
            if(sprite._characterName && sibling._characterName){
                if(sprite._characterName === sibling._characterName){
                    sprite.bitmap = sibling.bitmap;
                    found = true;
                }
            }
        });
        if(!found) this.bitmap = ImageManager.loadCharacter(this._characterName);

        this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
    };
})();