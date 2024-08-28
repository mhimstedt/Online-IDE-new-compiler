import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "../../system/javalang/ObjectClassStringClass";
import { ActorClass } from "../ActorClass";
import { Vector3Class } from "./Vector3Class";
import { World3dClass } from "./World3dClass";
import * as Three from 'three';

export class Object3dClass extends ActorClass {

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "abstract class Object3d extends Actor", comment: JRC.Object3dClassComment },
        { type: "method", signature: "Object3d()", java: Object3dClass.prototype._cj$_constructor_$Object3d$ },
        
        { type: "method", signature: "abstract void move(double x,double y,double z)", native:Object3dClass.prototype.move },
        { type: "method", signature: "final void move(Vector3 v)", native: Object3dClass.prototype.vmove },
        
        { type: "method", signature: "abstract void moveTo(double x,double y,double z)", native: Object3dClass.prototype.moveTo},
        { type: "method", signature: "final void moveTo(Vector3 p)", native: Object3dClass.prototype.vmoveTo },
        
        { type: "method", signature: "abstract void rotateX(double angleDeg)",native: Object3dClass.prototype.rotateX },
        { type: "method", signature: "abstract void rotateY(double angleDeg)",native: Object3dClass.prototype.rotateY },
        { type: "method", signature: "abstract void rotateZ(double angleDeg)",native: Object3dClass.prototype.rotateZ },
        
        { type: "method", signature: "abstract void scaleX(double angleDeg)",native: Object3dClass.prototype.scaleX },
        { type: "method", signature: "abstract void scaleY(double angleDeg)",native: Object3dClass.prototype.scaleY },
        { type: "method", signature: "abstract void scaleZ(double angleDeg)",native: Object3dClass.prototype.scaleZ },
        { type: "method", signature: "abstract void scale(Vector3 v)", native: Object3dClass.prototype.vscale },
        { type: "method", signature: "abstract void scale(double d)", native: Object3dClass.prototype.scaleDouble },
        { type: "method", signature: "abstract void destroy()", native: Object3dClass.prototype.destroy },
    ];

    static type: NonPrimitiveType;
    world3d!: World3dClass;


    _cj$_constructor_$Object3d$(t: Thread, callback: CallbackParameter) {

        
        t.s.push(this);
        this.world3d = t.scheduler.interpreter.retrieveObject("World3dClass");
        if (!this.world3d) {
            this.world3d = new World3dClass();
            this.world3d._cj$_constructor_$World$(t, () => {
                t.s.pop(); // constructor of world3d pushed it's this-object
                if(callback) callback();
                this.world3d.objects.push(this);
            })
            return;
        }
        if(callback)callback();
        this.world3d.objects.push(this);
        return;
    }

    private constructorHelper() {

    }

    rotateX(angleDeg:number): void{}
    rotateY(angleDeg:number): void{}
    rotateZ(angleDeg:number): void{}

    scaleX(factor:number): void{} 
    scaleY(factor:number): void{}
    scaleZ(factor:number): void{}

    scaleDouble(factor: number): void{};

    vscale(v: Vector3Class) {
        this.scaleX(v.v.x);
        this.scaleY(v.v.y);
        this.scaleZ(v.v.z);
    }

    move(x: number, y: number, z: number): void{}
    moveTo(x: number, y: number, z: number): void {}

    vmove(v: Vector3Class) {
        this.move(v.v.x, v.v.y, v.v.z);
    }


    vmoveTo(p: Vector3Class) {
        this.moveTo(p.v.x, p.v.y, p.v.z);
    }
    destroy(){
        super.destroy();
        this.world3d.objects.splice(this.world3d.objects.indexOf(this), 1);
    }
}