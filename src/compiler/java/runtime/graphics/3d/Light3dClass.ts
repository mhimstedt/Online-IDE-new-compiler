import * as THREE from 'three';
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { Object3dClass } from "./Object3dClass";
import { Material3dClass } from './Material3dClass';
import { Vector3Class } from './Vector3Class';

export class Light3dClass extends Object3dClass {

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Light3d extends Object3d" },
        { type: "method", signature: "Light3d()", java: Light3dClass.prototype._cj$_constructor_$Light3d$ },
        { type: "field", signature: "public Material3d material"},

        
        { type: "method", signature: "void move(double x,double y,double z)"},
        { type: "method", signature: "final void move(Vector3 v)", native:Light3dClass.prototype.vmove},
        { type: "method", signature: "void moveTo(double x,double y,double z)"},
        { type: "method", signature: "final void moveTo(Vector3 p)", native:Light3dClass.prototype.vmoveTo},
        { type: "method", signature: "void destroy()", java: Light3dClass.prototype.destroy },
        { type: "method", signature: "void rotateX(double angleDeg)",native: Light3dClass.prototype.rotateX },
        { type: "method", signature: "void rotateY(double angleDeg)",native: Light3dClass.prototype.rotateY },
        { type: "method", signature: "void rotateZ(double angleDeg)",native: Light3dClass.prototype.rotateZ },

        { type: "method", signature: "final void scaleX(double angleDeg)",native: Light3dClass.prototype.scaleX },
        { type: "method", signature: "final void scaleY(double angleDeg)",native: Light3dClass.prototype.scaleY },
        { type: "method", signature: "final void scaleZ(double angleDeg)",native: Light3dClass.prototype.scaleZ },
        { type: "method", signature: "final void scale(Vector3 v)", native: Light3dClass.prototype.vscale },
        { type: "method", signature: "final void scale(double d)", native: Light3dClass.prototype.scaleDouble },

    ];

    static type: NonPrimitiveType;

    light: THREE.Light;

    _cj$_constructor_$Light3d$(t: Thread, callback: CallbackParameter){
        super._cj$_constructor_$Object3d$(t, callback);
    }    

    move(x:number,y:number,z:number):void{
        // this.light.position.add(new THREE.Vector3(x,y,z));
        this.light.position.set(this.light.position.x+x,this.light.position.y+y,this.light.position.z+z)
    }
    moveTo(x:number,y:number,z:number):void{
        this.light.position.set(x,y,z);
    }

    rotateX(angleDeg: number): void {
        this.light.rotateX(angleDeg/180*Math.PI);
    }
    rotateY(angleDeg: number): void {
        this.light.rotateY(angleDeg/180*Math.PI);
    }
    rotateZ(angleDeg: number): void {
        this.light.rotateZ(angleDeg/180*Math.PI);
    }

    scaleX(factor:number): void{
        this.light.scale.setX(this.light.scale.x * factor);
    }

    scaleY(factor:number): void{
        this.light.scale.setY(this.light.scale.y * factor);
    }

    scaleZ(factor:number): void{
        this.light.scale.setZ(this.light.scale.z * factor);
    }

    vscale(factor: Vector3Class) {
        let scale = this.light.scale;
        scale.setX(scale.x * factor.v.x);
        scale.setY(scale.y * factor.v.y);
        scale.setZ(scale.z * factor.v.z);
    }

    scaleDouble(factor: number) {
        let scale = this.light.scale;
        scale.setX(scale.x * factor);
        scale.setY(scale.y * factor);
        scale.setZ(scale.z * factor);
    }

    destroy(){
        super.destroy();
        this.world3d.scene.remove(this.light);
        this.light.dispose();
    }
}