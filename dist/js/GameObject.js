var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * A GameObject is a set of meshes, relative to a base mesh (without any geometry).
 * It can be used to group a set of meshes (several objects composing a character for example),
 * that can be manipulated by its base mesh.
 */
var GameObject = (function (_super) {
    __extends(GameObject, _super);
    function GameObject(game) {
        _super.call(this, "__go__", game.scene);
        this.game = game;
        // The game object is not visible
        this.isVisible = false;
        // A game object can have several children
        this.children = [];
        // tag
        BABYLON.Tags.AddTagsTo(this, "__go__");
    }
    GameObject.prototype.setReady = function () {
        this.computeWorldMatrix(true);
        this.children.forEach(function (child) {
            child.computeWorldMatrix(true);
        });
    };
    /**
     * Add a mesh to this game object
     * @param child
     */
    GameObject.prototype.addChildren = function (child) {
        child.parent = this;
        this.children.push(child);
    };
    /**
     * Check if the given object collides with this gameobject
     * @param other
     * @returns {boolean}
     */
    GameObject.prototype.isCollidingWith = function (other) {
        // If other is a gameobject, collide each children
        if (BABYLON.Tags.MatchesQuery(other, "__go__")) {
            // Cast in Gameobject
            var otherGo = other;
            // Browse each children
            for (var i = 0; i < this.children.length; i++) {
                for (var j = 0; j < otherGo.children.length; j++) {
                    if (this.children[i].intersectsMesh(otherGo.children[j], true)) {
                        return true;
                    }
                }
            }
        }
        else {
            // Otherwise, collide each children with the other mesh
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].intersectsMesh(other, true)) {
                    return true;
                }
            }
        }
    };
    /**
     * Overload mesh dispose() by removing all children first
     */
    GameObject.prototype.dispose = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var c = _a[_i];
            c.dispose();
        }
        _super.prototype.dispose.call(this);
    };
    /**
     * Each children will play the given animation.
     * The callback function is called when all children animation are finished
     * @param options
     * @param callback
     */
    GameObject.prototype.runAnim = function (options, callback) {
        // If animation exists
        var counter = 0;
        var counterMax = 0;
        var check = function () {
            counter++;
            if (counter === counterMax) {
                callback();
            }
        };
        var speed = options.speed || 1;
        var loop = options.loop || false;
        var _this = this;
        this.children.forEach(function (child) {
            if (child.skeleton || child.animations.length != 0) {
                counterMax++;
                if (typeof callback === 'undefined') {
                    _this.getScene().beginAnimation(child, options.start, options.end, loop, speed);
                }
                else {
                    _this.getScene().beginAnimation(child, options.start, options.end, loop, speed, check);
                }
            }
        });
    };
    return GameObject;
})(BABYLON.Mesh);
//# sourceMappingURL=GameObject.js.map