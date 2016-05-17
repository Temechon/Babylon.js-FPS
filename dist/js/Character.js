var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Target = (function (_super) {
    __extends(Target, _super);
    function Target(name, game, position) {
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
    }
    // Efface ce character de la memoire
    Target.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    return Target;
})(BABYLON.Mesh);
//# sourceMappingURL=Character.js.map