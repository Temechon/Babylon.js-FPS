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
        var scene = new BABYLON.Scene(this.engine);
        // Hemispheric light to light the scene
        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
        h.intensity = 0.4;
        var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(this.engine.getRenderingCanvas());
        return scene;
    };
    Game.prototype.run = function () {
        var _this = this;
        this.scene = this.initScene();
        // The loader
        var loader = new BABYLON.AssetsManager(this.scene);
        var meshTask = loader.addMeshTask("map", "", "./assets/", "map.babylon");
        meshTask.onSuccess = function (t) {
            //for (var m of t.loadedMeshes) {
            //    m.setEnabled (false);
            //}
            //this.assets['cube'] = {
            //    meshes : t.loadedMeshes
            //}
        };
        loader.onFinish = function () {
            _this.scene.executeWhenReady(function () {
                _this.engine.runRenderLoop(function () {
                    _this.scene.render();
                });
            });
            // Load first level
            _this.initGame();
        };
        loader.load();
    };
    Game.prototype.initGame = function () {
        var sphere = BABYLON.Mesh.CreateSphere('', 16, 1, this.scene);
    };
    return Game;
})();
//# sourceMappingURL=Game.js.map