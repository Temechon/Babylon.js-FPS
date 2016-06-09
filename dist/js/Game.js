var Game = (function () {
    function Game(canvasId) {
        var _this = this;
        this.time = 0;
        var canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true);
        // Contiens l'ensemble des assets du jeu autre que l'environnement
        this.assets = [];
        this.targets = [];
        // La scène 3D du jeu
        this.scene = null;
        this.timeGui = document.getElementById('time');
        this.targetGui = document.getElementById('targets');
        // On resize le jeu en fonction de la taille de la fenetre
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
        this.run();
    }
    Game.prototype.initScene = function () {
        var _this = this;
        // Change camera controls
        var cam = this.scene.activeCamera;
        cam.attachControl(this.engine.getRenderingCanvas());
        cam.keysUp.push(90);
        cam.keysDown.push(83);
        cam.keysLeft.push(81);
        cam.keysRight.push(68);
        // Set full screen
        var setFullScreen = function () {
            _this.engine.isPointerLock = true;
            window.removeEventListener('click', setFullScreen);
        };
        window.addEventListener('click', setFullScreen);
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
        skybox.layerMask = 2; // 010 in binary
        // Gestion des ombres portees
        var defaultLight = this.scene.getLightByName('Default light');
        defaultLight.intensity = 0.5;
        var dir = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-0.5, -1, -0.5), this.scene);
        dir.position = new BABYLON.Vector3(40, 60, 40);
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, dir);
        shadowGenerator.useBlurVarianceShadowMap = true;
        // Application des ombres aux maisons et arbre
        this.scene.meshes.forEach(function (m) {
            if (m.name.indexOf('maison') !== -1 || m.name.indexOf('arbre') !== -1) {
                shadowGenerator.getShadowMap().renderList.push(m);
                m.receiveShadows = false;
            }
            else {
                m.receiveShadows = true;
            }
        });
        // Le son de l'arme
        var gunshot = new BABYLON.Sound("gunshot", "assets/sounds/shot.wav", this.scene, null, { loop: false, autoplay: false });
        this.assets['gunshot'] = gunshot;
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
            // this.scene.debugLayer.show();
        });
    };
    Game.prototype.initGame = function () {
        var _this = this;
        // Get weapon
        this.scene.getMeshByName('blaster').position = new BABYLON.Vector3(0.05, -0.1, 0.4);
        this.scene.getMeshByName('blaster').parent = this.scene.activeCamera;
        // Active toutes les cibles de la scène
        this.scene.meshes.forEach(function (m) {
            if (m.name.indexOf('target') !== -1) {
                m.isPickable = true; // Pour pouvoir les détruire
                m.rotationQuaternion = null;
                _this.targets.push(m);
            }
        });
        var soleil = BABYLON.Mesh.CreateSphere('soleil', 16, 10, this.scene);
        soleil.position = new BABYLON.Vector3(0, 100, 0);
        var soleilMaterial = new BABYLON.StandardMaterial('soleilMaterial', this.scene);
        soleilMaterial.emissiveColor = BABYLON.Color3.Yellow();
        soleilMaterial.specularColor = BABYLON.Color3.Black();
        soleil.material = soleilMaterial;
        // Rotation infinie de toutes les cibles
        this.scene.registerBeforeRender(function () {
            _this.targets.forEach(function (target) {
                target.rotation.y += 0.1 * _this.scene.getAnimationRatio();
            });
        });
        // Active le tir
        this.scene.onPointerDown = function (evt, pr) {
            var width = _this.scene.getEngine().getRenderWidth();
            var height = _this.scene.getEngine().getRenderHeight();
            var pickInfo = _this.scene.pick(width / 2, height / 2);
            // Effet sonore
            _this.assets['gunshot'].play();
            if (pickInfo.hit) {
                _this.destroyTarget(pickInfo.pickedMesh);
            }
        };
        // Minimap
        var mm = new BABYLON.FreeCamera("minimap", new BABYLON.Vector3(0, 100, 0), this.scene);
        mm.setTarget(new BABYLON.Vector3(0, 0, 0));
        // Activate the orthographic projection
        mm.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        //These values are required for using an orthographic mode,
        // and represents the coordinates of the square containing all the camera view.
        // this.size is the size of our arena
        mm.orthoLeft = -500 / 2;
        mm.orthoRight = 500 / 2;
        mm.orthoTop = 500 / 2;
        mm.orthoBottom = -500 / 2;
        mm.rotation.x = Math.PI / 2;
        // Viewport definition
        var xstart = 0.8, // 80% from the left
        ystart = 0.75; // 75% from the bottom
        var width = 0.99 - xstart, // Almost until the right edge of the screen
        height = 1 - ystart; // Until the top edge of the screen
        mm.viewport = new BABYLON.Viewport(xstart, ystart, width, height);
        mm.layerMask = 1; // 001 in binary
        this.scene.activeCamera.layerMask = 2;
        // The representation of player in the minimap
        var s = BABYLON.Mesh.CreateSphere("player2", 16, 25, this.scene);
        s.position.y = 50;
        // The sphere position will be displayed accordingly to the player position
        this.scene.registerBeforeRender(function () {
            if (_this.scene.activeCameras[0]) {
                s.position.x = _this.scene.activeCameras[0].position.x;
                s.position.z = _this.scene.activeCameras[0].position.z;
            }
        });
        var red = new BABYLON.StandardMaterial("red", this.scene);
        red.diffuseColor = BABYLON.Color3.Red();
        red.specularColor = BABYLON.Color3.Black();
        s.material = red;
        s.layerMask = 1; // 001 in binary : won't be displayed on the player camera, only in the minimap
        // Add the camera to the list of active cameras of the game
        this.scene.activeCameras.push(this.scene.activeCamera);
        this.scene.activeCameras.push(mm);
        // Lance le timer
        setInterval(this.updateTime.bind(this), 1000);
    };
    /**
     * Efface la cible donnée en paramètre.
     */
    Game.prototype.destroyTarget = function (target) {
        var index = this.targets.indexOf(target);
        if (index > -1) {
            this.targets.splice(index, 1);
            target.dispose();
            // Mise à jour de l'interface
            this.targetGui.innerHTML = String(this.targets.length);
            if (this.targets.length == 0) {
            }
        }
    };
    Game.prototype.updateTime = function () {
        this.time++;
        this.timeGui.innerHTML = String(this.time);
    };
    return Game;
})();
//# sourceMappingURL=Game.js.map