(function(){
    SceneManager.preferableRendererType = function() {
        if (Utils.isOptionValid('canvas')) {
            return 'canvas';
        } else {
            return 'auto';
        }
    };
})();