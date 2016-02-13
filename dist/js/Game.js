var Game = (function () {
    function Game(canvasId) {
        var _this = this;
        var canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true);
        // Contains all loaded assets needed for this state
        this.assets = [];
        // The state scene
        this.scene = null;
        // Resize window event
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
        this.run();
    }
    Game.prototype.initScene = function () {
        // Hemispheric light to light the scene
        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), this.scene);
        h.intensity = 0.4;
        // let camera = new BABYLON.FreeCamera("camera",new BABYLON.Vector3(0,100,-10), this.scene);
        //  camera.setTarget(BABYLON.Vector3.Zero())
        this.scene.activeCamera.attachControl(this.engine.getRenderingCanvas());
        // Rotating cube
        var cube = BABYLON.Mesh.CreateBox('box', 1, this.scene);
        cube.registerBeforeRender(function () {
            cube.rotation.x += 0.1;
            cube.rotation.y += 0.05;
        });
    };
    Game.prototype.run = function () {
        var _this = this;
        BABYLON.SceneLoader.Load('assets/', 'map.babylon', this.engine, function (scene) {
            _this.scene = scene;
            _this.initScene();
            _this.scene.executeWhenReady(function () {
                _this.engine.runRenderLoop(function () {
                    _this.scene.render();
                });
            });
            _this.initGame();
        });
    };
    Game.prototype.initGame = function () {
        // Get weapon
        this.scene.getMeshByName('blaster').position.x = +0.05;
        this.scene.getMeshByName('blaster').position.y = -0.1;
        this.scene.getMeshByName('blaster').parent = this.scene.activeCamera;
    };
    return Game;
})();
//# sourceMappingURL=Game.js.map