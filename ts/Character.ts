class Character extends BABYLON.Mesh {
    
    // L'instance du jeu et du joueur
    private game : Game;
    
    // Le radius dans lequel le Character va activer une mission pour le joueur
    private radius : number;
    
    // Fonction appelee a chaque frame pour voir si le joueur 
    private _checkPlayer : () => void;
    
    constructor (name, game) {
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
        
        // radius definition
        this.radius = 5;
        
        // On check la position du joueur par rapport à ce character
        this._checkPlayer = () => {
            
        }
        scene.registerBeforeRender(this._checkPlayer);   
    }
    
    // Efface ce character de la memoire
    dispose () {
        this.unregisterBeforeRender(this._checkPlayer);
        super.dispose();
    }
    
    
}