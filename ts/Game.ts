class Game {

    private engine  : BABYLON.Engine;
    public assets   : Array<any>;
    public scene    : BABYLON.Scene;
    private time    : number = 0;
    private timeGui : HTMLElement;
    private targetGui : HTMLElement;
    
    // Contient toutes les cibles à détruire
    public targets  : Array<BABYLON.AbstractMesh>;

    constructor(canvasId:string) {
        
        let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById(canvasId);
        this.engine         = new BABYLON.Engine(canvas, true);
        // Contiens l'ensemble des assets du jeu autre que l'environnement
        this.assets         = [];
        this.targets        = [];
        // La scène 3D du jeu
        this.scene          = null;
        this.timeGui        = document.getElementById('time');
        this.targetGui        = document.getElementById('targets');
        // On resize le jeu en fonction de la taille de la fenetre
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.run();
    }

     private initScene() { 
        // Change camera controls
        let cam = <BABYLON.FreeCamera> this.scene.activeCamera;
        cam.attachControl(this.engine.getRenderingCanvas());        
        cam.keysUp.push(90);      
        cam.keysDown.push(83);      
        cam.keysLeft.push(81);      
        cam.keysRight.push(68);
        
        // Set full screen
        let setFullScreen = () => {
            this.engine.isPointerLock = true;
            window.removeEventListener('click', setFullScreen);
        }        
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
        
        // Gestion des ombres portees
        let defaultLight = this.scene.getLightByName('Default light');
        defaultLight.intensity = 0.5;        
        
        let dir = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-0.5,-1,-0.5), this.scene);          
        dir.position = new BABYLON.Vector3(40, 60, 40);
        
        let shadowGenerator = new BABYLON.ShadowGenerator(1024, dir); 
        shadowGenerator.useBlurVarianceShadowMap = true;
       
        // Application des ombres aux maisons et arbre
        this.scene.meshes.forEach((m) => {
            if (m.name.indexOf('maison') !== -1 || m.name.indexOf('arbre') !== -1) {
                shadowGenerator.getShadowMap().renderList.push(m);
                m.receiveShadows = false;
            } else {
                m.receiveShadows = true;
            }
        });
        
        // Le son de l'arme
        var gunshot = new BABYLON.Sound("gunshot", "assets/sounds/shot.wav", this.scene, null, { loop: false, autoplay: false });
        this.assets['gunshot'] = gunshot;
    }

    private run() {
        BABYLON.SceneLoader.Load('assets/', 'map.babylon', this.engine, (scene) => { 
            this.scene = scene;
            this.initScene(); 
            this.scene.executeWhenReady(() => {

                this.engine.runRenderLoop(() => {
                    this.scene.render();
                });
            });
            
            this.initGame();
            
            // this.scene.debugLayer.show();
        });
    }

     private initGame() {
        // Get weapon
        this.scene.getMeshByName('blaster').position = new BABYLON.Vector3(0.05, -0.1, 0.4);
        this.scene.getMeshByName('blaster').parent = this.scene.activeCamera;
        
        // Active toutes les cibles de la scène
        this.scene.meshes.forEach((m) => {
            if (m.name.indexOf('target') !== -1) {
                m.isPickable = true; // Pour pouvoir les détruire
                m.rotationQuaternion = null;
                this.targets.push(m);
            }
        });
        
        var soleil = BABYLON.Mesh.CreateSphere('soleil', 16, 10, this.scene);
        soleil.position = new BABYLON.Vector3(0, 100, 0);
        let soleilMaterial = new BABYLON.StandardMaterial('soleilMaterial', this.scene);
        soleilMaterial.emissiveColor = BABYLON.Color3.Yellow();
        soleilMaterial.specularColor = BABYLON.Color3.Black();
        soleil.material = soleilMaterial; 
        
        // Rotation infinie de toutes les cibles
        this.scene.registerBeforeRender(() => {
            this.targets.forEach((target) => {
                target.rotation.y += 0.1*this.scene.getAnimationRatio();
            })
        })
        
        // Active le tir
        this.scene.onPointerDown = (evt, pr) => {
            var width = this.scene.getEngine().getRenderWidth();
            var height = this.scene.getEngine().getRenderHeight(); 
            var pickInfo = this.scene.pick(width/2, height/2);
            // Effet sonore
            this.assets['gunshot'].play();
            if (pickInfo.hit) {
                this.destroyTarget(pickInfo.pickedMesh);
            }
        }        
        
        // Lance le timer
        setInterval(this.updateTime.bind(this), 1000);
        
    }
    
    /**
     * Efface la cible donnée en paramètre.
     */
    private destroyTarget(target) {
        var index = this.targets.indexOf(target);
        if (index > -1) {
            this.targets.splice(index, 1);
            target.dispose();
            // Mise à jour de l'interface
            this.targetGui.innerHTML = String(this.targets.length);
            if (this.targets.length == 0) {
                // Le jeu est fini !
            }
        }
    }
    
    private updateTime() {
        this.time ++;
        this.timeGui.innerHTML = String(this.time);
    }
}
