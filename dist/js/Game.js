var Game = (function () {
    function Game(canvasId) {
        var _this = this;
        var canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true);
        // Contiens l'ensemble des assets du jeu autre que l'environnement
        this.assets = [];
        // La scène 3D du jeu
        this.scene = null;
        // On resize le jeu en fonction de la taille de la fenetre
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
        this.run();
    }
    Game.prototype.initScene = function () {
        // Rotating cube
        var cube = BABYLON.Mesh.CreateBox('box', 1, this.scene);
        cube.registerBeforeRender(function () {
            cube.rotation.x += 0.1;
            cube.rotation.y += 0.05;
        });
        // Hemispheric light to light the scene
        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), this.scene);
        h.intensity = 0.4;
        // Change camera controls
        var cam = this.scene.activeCamera;
        cam.attachControl(this.engine.getRenderingCanvas());
        cam.keysUp.push(90);
        cam.keysDown.push(83);
        cam.keysLeft.push(81);
        cam.keysRight.push(68);
        // Set full screen
        // let setFullScreen = () => {
        //     this.engine.switchFullscreen(true);
        //     window.removeEventListener('click', setFullScreen);
        // }        
        // window.addEventListener('click', setFullScreen);
        // Skybox
        var skybox = BABYLON.Mesh.CreateSphere("skyBox", 32, 1000.0, this.scene);
        skybox.position.y = 50;
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/TropicalSunnyDay", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
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
        this.scene.getMeshByName('blaster').position.x = 0.05;
        this.scene.getMeshByName('blaster').position.y = -0.1;
        this.scene.getMeshByName('blaster').position.z = 0.4;
        this.scene.getMeshByName('blaster').parent = this.scene.activeCamera;
        var c = new Character('', this.scene);
        c.position.y = 3;
    };
    return Game;
})();
//# sourceMappingURL=Game.js.map