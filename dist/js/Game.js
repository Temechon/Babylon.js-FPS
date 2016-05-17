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
        // Change camera controls
        var cam = this.scene.activeCamera;
        cam.attachControl(this.engine.getRenderingCanvas());
        cam.keysUp.push(90);
        cam.keysDown.push(83);
        cam.keysLeft.push(81);
        cam.keysRight.push(68);
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
            _this.scene.debugLayer.show();
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
        // Rotation infinie de toutes les cibles
        this.scene.registerBeforeRender(function () {
            _this.targets.forEach(function (target) {
                target.rotation.y += 0.1;
            });
        });
        // Active le tir
        this.scene.onPointerDown = function (evt, pr) {
            if (pr.hit) {
                _this.destroyTarget(pr.pickedMesh);
            }
        };
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