class Game {

    private engine  : BABYLON.Engine;
    public assets   : Array<any>;
    public scene    : BABYLON.Scene;

    constructor(canvasId:string) {
        
        let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById(canvasId);
        this.engine         = new BABYLON.Engine(canvas, true);
        // Contiens l'ensemble des assets du jeu autre que l'environnement
        this.assets         = [];
        // La scène 3D du jeu
        this.scene          = null;
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
        });
    }

     private initGame() {
        // Get weapon
        this.scene.getMeshByName('blaster').position = new BABYLON.Vector3(0.05, -0.1, 0.4);
        this.scene.getMeshByName('blaster').parent = this.scene.activeCamera;
        
        let c = new Character('', this);
        c.position.y = 3;
    }

    ///**
    // * Returns an integer in [min, max[
    // */
    //static randomInt(min, max) {
    //    if (min === max) {
    //        return (min);
    //    }
    //    let random = Math.random();
    //    return Math.floor(((random * (max - min)) + min));
    //}
    //
    //static randomNumber(min, max) {
    //    if (min === max) {
    //        return (min);
    //    }
    //    let random = Math.random();
    //    return (random * (max - min)) + min;
    //}
    //
    ///**
    // * Create an instance model from the given name.
    // */
    //createModel(name, parent) {
    //    if (! this.assets[name]) {
    //        console.warn('No asset corresponding.');
    //    } else {
    //        if (!parent) {
    //            parent = new GameObject(this);
    //        }
    //
    //        let obj = this.assets[name];
    //        //parent._animations = obj.animations;
    //        let meshes = obj.meshes;
    //
    //        for (let i=0; i<meshes.length; i++ ){
    //            // Don't clone mesh without any vertices
    //            if (meshes[i].getTotalVertices() > 0) {
    //
    //                let newmesh = meshes[i].clone(meshes[i].name, null, true);
    //                parent.addChildren(newmesh);
    //
    //                if (meshes[i].skeleton) {
    //                    newmesh.skeleton = meshes[i].skeleton.clone();
    //                    this.scene.stopAnimation(newmesh);
    //                }
    //            }
    //        }
    //    }
    //    return parent;
    //}
}
