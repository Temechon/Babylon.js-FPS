var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Character = (function (_super) {
    __extends(Character, _super);
    function Character(name, scene) {
        _super.call(this, name, scene);
        var redSphere = BABYLON.Mesh.CreateIcoSphere('', { radius: 1, flat: true }, scene);
        redSphere.parent = this;
        var redMat = scene.getMaterialByName('red');
        if (!redMat) {
            redMat = new BABYLON.StandardMaterial('red', scene);
            redMat.diffuseColor = BABYLON.Color3.Red();
        }
        redSphere.material = redMat;
    }
    return Character;
})(BABYLON.Mesh);
//# sourceMappingURL=Character.js.map