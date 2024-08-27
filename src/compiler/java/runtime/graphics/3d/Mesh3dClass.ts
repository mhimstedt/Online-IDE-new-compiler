import * as THREE from 'three';
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { Object3dClass } from "./Object3dClass";

export class Mesh3dClass extends Object3dClass {

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Mesh3d extends Object3d", comment: JRC.Mesh3dClassComment },
        { type: "method", signature: "Mesh3d()", java: Mesh3dClass.prototype._cj$_constructor_$Mesh3d$ },
        { type: "method", signature: "abstract void move(double x,double y,double z)"},
        { type: "method", signature: "final void move(Vector3 v)", native:Mesh3dClass.prototype.vmove},
        { type: "method", signature: "abstract void moveTo(double x,double y,double z)"},
        { type: "method", signature: "final void moveTo(Vector3 p)", native:Mesh3dClass.prototype.vmoveTo},
    ];

    static type: NonPrimitiveType;

    mesh: THREE.Mesh;

    _cj$_constructor_$Mesh3d$(t: Thread, callback: CallbackParameter){
        super._cj$_constructor_$Object3d$(t, callback);
    }    

    move(x:number,y:number,z:number):void{

    }
    
    moveTo(x:number,y:number,z:number):void{
        
    }
    
    getBasicMaterial(): THREE.Material {
        return new THREE.MeshStandardMaterial( {color: 0x00ff00, roughness: 0.7, metalness: 0.8, emissive: 0x104010 } ); 
    }
}