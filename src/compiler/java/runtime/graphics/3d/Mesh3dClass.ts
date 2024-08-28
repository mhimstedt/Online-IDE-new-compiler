import * as THREE from 'three';
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { Object3dClass } from "./Object3dClass";
import { Vector3Class } from './Vector3Class';

export class Mesh3dClass extends Object3dClass {

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Mesh3d extends Object3d", comment: JRC.Mesh3dClassComment },
        { type: "method", signature: "Mesh3d()", java: Mesh3dClass.prototype._cj$_constructor_$Mesh3d$ },
        
        { type: "method", signature: "void move(double x,double y,double z)"},
        { type: "method", signature: "final void move(Vector3 v)", native:Mesh3dClass.prototype.vmove},
        { type: "method", signature: "void moveTo(double x,double y,double z)"},
        { type: "method", signature: "final void moveTo(Vector3 p)", native:Mesh3dClass.prototype.vmoveTo},
        
        { type: "method", signature: "void rotateX(double angleDeg)",native: Mesh3dClass.prototype.rotateX },
        { type: "method", signature: "void rotateY(double angleDeg)",native: Mesh3dClass.prototype.rotateY },
        { type: "method", signature: "void rotateZ(double angleDeg)",native: Mesh3dClass.prototype.rotateZ },

        { type: "method", signature: "final void scaleX(double angleDeg)",native: Mesh3dClass.prototype.scaleX },
        { type: "method", signature: "final void scaleY(double angleDeg)",native: Mesh3dClass.prototype.scaleY },
        { type: "method", signature: "final void scaleZ(double angleDeg)",native: Mesh3dClass.prototype.scaleZ },
        { type: "method", signature: "final void scale(Vector3 v)", native: Mesh3dClass.prototype.vscale },

    ];

    static type: NonPrimitiveType;

    mesh: THREE.Mesh;

    _cj$_constructor_$Mesh3d$(t: Thread, callback: CallbackParameter){
        super._cj$_constructor_$Object3d$(t, callback);
    }    

    move(x:number,y:number,z:number):void{
        // this.mesh.position.add(new THREE.Vector3(x,y,z));
        this.mesh.position.set(this.mesh.position.x+x,this.mesh.position.y+y,this.mesh.position.z+z)
    }
    moveTo(x:number,y:number,z:number):void{
        this.mesh.position.set(x,y,z);
    }

    rotateX(angleDeg: number): void {
        this.mesh.rotateX(angleDeg/180*Math.PI);
    }
    rotateY(angleDeg: number): void {
        this.mesh.rotateY(angleDeg/180*Math.PI);
    }
    rotateZ(angleDeg: number): void {
        this.mesh.rotateZ(angleDeg/180*Math.PI);
    }

    scaleX(factor:number): void{
        this.mesh.scale.setX(this.mesh.scale.x * factor);
    }

    scaleY(factor:number): void{
        this.mesh.scale.setY(this.mesh.scale.y * factor);
    }

    scaleZ(factor:number): void{
        this.mesh.scale.setZ(this.mesh.scale.z * factor);
    }

    vscale(factor: Vector3Class) {
        let scale = this.mesh.scale;
        scale.setX(scale.x * factor.x);
        scale.setY(scale.y * factor.y);
        scale.setZ(scale.z * factor.z);
    }

    
    getBasicMaterial(): THREE.Material {
        return new THREE.MeshStandardMaterial( {color: 0x00ff00 } ); 
    }
}