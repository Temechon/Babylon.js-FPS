/**
 * A GameObject is a set of meshes, relative to a base mesh (without any geometry).
 * It can be used to group a set of meshes (several objects composing a character for example),
 * that can be manipulated by its base mesh.
 */
class GameObject extends BABYLON.Mesh {

    public game : Game;

    // All elements composing this game objec
    public children : Array<BABYLON.Mesh>;

    constructor(game : Game) {
        super("__go__", game.scene);
        this.game = game;

        // The game object is not visible
        this.isVisible = false;

        // A game object can have several children
        this.children = [];

        // tag
        BABYLON.Tags.AddTagsTo(this, "__go__");
    }

    public setReady() {
        this.computeWorldMatrix(true);
        this.children.forEach(function(child) {
            child.computeWorldMatrix(true);
        });
    }

    /**
     * Add a mesh to this game object
     * @param child
     */
    public addChildren(child) {
        child.parent = this;
        this.children.push(child);
    }

    /**
     * Check if the given object collides with this gameobject
     * @param other
     * @returns {boolean}
     */
    public isCollidingWith(other : GameObject | BABYLON.Mesh) {
        // If other is a gameobject, collide each children
        if (BABYLON.Tags.MatchesQuery(other, "__go__")) {
            // Cast in Gameobject
            let otherGo = <GameObject> other;
            // Browse each children
            for (let i=0; i<this.children.length; i++) {
                for (let j=0; j<otherGo.children.length; j++) {
                    if (this.children[i].intersectsMesh(otherGo.children[j], true)) {
                        return true;
                    }
                }
            }
        } else {
            // Otherwise, collide each children with the other mesh
            for (let i=0; i<this.children.length; i++) {
                if (this.children[i].intersectsMesh(other, true)) {
                    return true;
                }
            }
        }
    }

    /**
     * Overload mesh dispose() by removing all children first
     */
    public dispose() {
        for (let c of this.children) {
            c.dispose()
        }
        super.dispose();
    }

    /**
     * Each children will play the given animation.
     * The callback function is called when all children animation are finished
     * @param options
     * @param callback
     */
    public runAnim(options, callback) {

        // If animation exists
        let counter         = 0;
        let counterMax      = 0;
        let check = function() {
            counter++;
            if (counter === counterMax) {
                callback();
            }
        };

        let speed = options.speed || 1;
        let loop = options.loop || false;
        let _this = this;
        this.children.forEach(function(child) {
            if (child.skeleton || child.animations.length != 0) {
                counterMax++;
                if (typeof callback === 'undefined') {
                    _this.getScene().beginAnimation(child, options.start, options.end, loop, speed);
                } else {
                    _this.getScene().beginAnimation(child, options.start, options.end, loop, speed, check);
                }
            }
        });
    }
}