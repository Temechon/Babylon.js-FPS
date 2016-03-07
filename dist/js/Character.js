var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Character = (function (_super) {
    __extends(Character, _super);
    function Character(name, game) {
        _super.call(this, name, game.scene);
        this.game = game;
        // Character mesh
        var scene = game.scene;
        var redSphere = BABYLON.Mesh.CreateIcoSphere('', { radius: 1, flat: true }, scene);
        redSphere.parent = this;
        var redMat = scene.getMaterialByName('red');
        if (!redMat) {
            redMat = new BABYLON.StandardMaterial('red', scene);
            redMat.diffuseColor = BABYLON.Color3.Red();
        }
        redSphere.material = redMat;
        // radius definition
        this.radius = 5;
        // On check la position du joueur par rapport à ce character
        this._checkPlayer = function () {
        };
        scene.registerBeforeRender(this._checkPlayer);
    }
    // Efface ce character de la memoire
    Character.prototype.dispose = function () {
        this.unregisterBeforeRender(this._checkPlayer);
        _super.prototype.dispose.call(this);
    };
    return Character;
})(BABYLON.Mesh);
//# sourceMappingURL=Character.js.map