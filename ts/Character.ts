class Target extends BABYLON.Mesh {
    
    // L'instance du jeu et du joueur
    private game : Game;
        
    constructor (name, game, position) {
        super(name, game.scene);
        this.game = game;
        
        // Character mesh
        let scene = game.scene;
        let redSphere = BABYLON.Mesh.CreateIcoSphere('', {radius:1, flat:true}, scene);
        redSphere.parent = this;
        let redMat = scene.getMaterialByName('red');
        if (! redMat) {
            redMat = new BABYLON.StandardMaterial('red', scene);
            redMat.diffuseColor = BABYLON.Color3.Red();
        }
        redSphere.material = redMat;
        
    }
    
    // Efface ce character de la memoire
    dispose () {
        super.dispose();
    }
    
    
}