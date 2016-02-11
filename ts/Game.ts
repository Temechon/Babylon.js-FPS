class Game {

    private engine  : BABYLON.Engine;
    public assets   : Array<any>;
    public scene    : BABYLON.Scene;

    constructor(canvasId:string) {

        let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById(canvasId);
        this.engine         = new BABYLON.Engine(canvas, true);

        // Contains all loaded assets needed for this state
        this.assets         = [];

        // The state scene
        this.scene          = null;

        // Resize window event
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this.run();

    }

     private initScene() {
        let scene = new BABYLON.Scene(this.engine);

        // Hemispheric light to light the scene
        let h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), scene);
        h.intensity = 0.4;

        let camera = new BABYLON.FreeCamera("camera",new BABYLON.Vector3(0,0,-10), scene);
         camera.setTarget(BABYLON.Vector3.Zero())
        camera.attachControl(this.engine.getRenderingCanvas());
        
        let cube = BABYLON.Mesh.CreateBox('box', 1, scene);
        cube.registerBeforeRender(() => {
            cube.rotation.x += 0.1;
            cube.rotation.y += 0.05;
        }) 
        
        return scene;
    }

    private run() {

        this.scene = this.initScene();

        // The loader
        var loader =  new BABYLON.AssetsManager(this.scene);

        var meshTask = loader.addMeshTask("map", "", "./assets/", "map.babylon");
        meshTask.onSuccess = (t) => {
            //for (var m of t.loadedMeshes) {
            //    m.setEnabled (false);
            //}
            //this.assets['cube'] = {
            //    meshes : t.loadedMeshes
            //}
        };

        loader.onFinish = () => {

            this.scene.executeWhenReady(() => {

                this.engine.runRenderLoop(() => {
                    this.scene.render();
                });
            });

            // Load first level
            this.initGame();

        };

        loader.load();
    }

     private initGame() {
        var sphere = BABYLON.Mesh.CreateSphere('', 16, 1, this.scene);
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
