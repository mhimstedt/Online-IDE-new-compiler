import * as THREE from 'three';

import { CallbackParameter } from "../../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../../common/interpreter/Thread";
import { JRC } from "../../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../../module/libraries/DeclareType";
import { SpriteMaterial3dClass } from "../materials/SpriteMaterial3dClass";
import { Matrix4Class } from "../Matrix4Class";
import { Object3dClass } from "../Object3dClass";
import { SpriteLibraryEnum } from '../../SpriteLibraryEnum';
import { FastSprite } from './FastSpriteManager3d';
import { ActorClass } from '../../ActorClass';
import { World3dClass } from '../World3dClass';

export class FastSprite3dClass extends ActorClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class FastSprite3d extends Actor"},
        { type: "method", signature: "FastSprite3d(double width, SpriteLibrary spriteLibrary, int index)", java: FastSprite3dClass.prototype._cj$_constructor_$FastSprite3d$double$SpriteLibrary$int,  },

        { type: "method", signature: "void move(double x,double y,double z)", native: FastSprite3dClass.prototype.move },
        { type: "method", signature: "double getX()", native: FastSprite3dClass.prototype.getX },
        { type: "method", signature: "double getY()", native: FastSprite3dClass.prototype.getY },
        { type: "method", signature: "double getZ()", native: FastSprite3dClass.prototype.getZ },




        // { type: "method", signature: "final void move(Vector3 v)", native: FastSprite3dClass.prototype.vmove },
        // { type: "method", signature: "void moveTo(double x,double y,double z)", native: FastSprite3dClass.prototype.moveTo },
        // { type: "method", signature: "final void moveTo(Vector3 p)", native: FastSprite3dClass.prototype.vmoveTo },

        // { type: "method", signature: "final void scale(double d)", native: FastSprite3dClass.prototype.scaleDouble },

        // { type: "method", signature: "final void applyMatrix4(Matrix4 matrix)", native: FastSprite3dClass.prototype.applyMatrix4 },

        // { type: "method", signature: "void destroy()", java: FastSprite3dClass.prototype.destroy },


    ];

    fastSprite: FastSprite;
    world3d!: World3dClass;

    _cj$_constructor_$FastSprite3d$double$SpriteLibrary$int(t: Thread, callback: CallbackParameter, width: number, library: SpriteLibraryEnum, index: number) {

        t.s.push(this);
        this.world3d = t.scheduler.interpreter.retrieveObject("World3dClass");
        if (!this.world3d) {
            this.world3d = new World3dClass();
            this.world3d._cj$_constructor_$World3d$(t, () => {
                t.s.pop(); // constructor of world3d pushed it's this-object
                this.init(width, library, index);
                if(callback) callback();
            })
            return;
        }
        this.init(width, library, index);
        if(callback)callback();
        return;
        
    }
    
    init(width: number, library: SpriteLibraryEnum, index: number){
        this.fastSprite = this.world3d.fastSpriteManager.getSprite(width, library, index);
    }

    destroy(): void {
        super.destroy();
        this.world3d.fastSpriteManager.removeSprite(this.fastSprite);
    }

    move(x: number, y: number, z: number): void {
        this.world3d.fastSpriteManager.moveSprite(this.fastSprite, x, y, z);
    }
    moveTo(x: number, y: number, z: number): void {
        this.world3d.fastSpriteManager.moveSprite(this.fastSprite, x, y, z);
    }

    getX(): number {
        return this.world3d.fastSpriteManager.getX(this.fastSprite);
    }

    getY(): number {
        return this.world3d.fastSpriteManager.getY(this.fastSprite);
    }

    getZ(): number {
        return this.world3d.fastSpriteManager.getZ(this.fastSprite);
    }

    // applyMatrix4(matrix4: Matrix4Class) {

    //     // a vector v local to this mesh is transformed via
    //     // W * L * v to world coordinates. W is World matrix of parent, L is local matrix.
    //     // We want to achieve an additional global transformation of v which corresponds to
    //     // A * W * L * v, but we only can alter matrix L. As
    //     // A * W * L * v = W * (W^-1 * A * W) * L * v, we have to premultiply L by W^-1 * A * W.

    //     if (this.sprite.parent) {
    //         const helperMatrix = this.sprite.parent.matrixWorld.clone().invert();
    //         helperMatrix.multiply(matrix4.m);
    //         helperMatrix.multiply(this.sprite.parent.matrixWorld);
    //         this.sprite.applyMatrix4(helperMatrix);
    //     } else {
    //         this.sprite.applyMatrix4(matrix4.m);
    //     }

    // }

    // scaleDouble(factor: number) {
    //     let scale = this.sprite.scale;
    //     scale.setX(scale.x * factor);
    //     scale.setY(scale.y * factor);
    //     scale.setZ(scale.z * factor);
    // }
}