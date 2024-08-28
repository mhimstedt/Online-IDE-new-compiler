import * as THREE from 'three';
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { Mesh3dClass } from "./Mesh3dClass";

export class Sphere3dClass extends Mesh3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Sphere3d extends Mesh3d"},
        { type: "method", signature: "Sphere3d(double x, double y, double z, double radius)", java: Sphere3dClass.prototype._cj$_constructor_$Sphere3d$double$double$double$double},
        { type: "method", signature: "Sphere3d(double x, double y, double z)", java: Sphere3dClass.prototype._cj$_constructor_$Sphere3d$double$double$double},
        { type: "method", signature: "Sphere3d()", java: Sphere3dClass.prototype._cj$_constructor_$Sphere3d$ }
    ];

    _cj$_constructor_$Sphere3d$double$double$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, z: number,r:number) {
        this._cj$_constructor_$Sphere3d$(t, () => {
            this.moveTo(x, y, z);
            this.mesh.scale.set(2*r,2*r,2*r);
        })

    }
    _cj$_constructor_$Sphere3d$double$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, z: number) {
        this._cj$_constructor_$Sphere3d$(t, () => {
            this.moveTo(x, y, z);
        })

    }

    _cj$_constructor_$Sphere3d$(t: Thread, callback: CallbackParameter) {
        super._cj$_constructor_$Mesh3d$(t, ()=>{
            const geometry = new THREE.SphereGeometry(0.5);
        
            this.mesh = new THREE.Mesh(geometry, this.getBasicMaterial());
            this.world3d.scene.add(this.mesh);
            if(callback)callback();
        });
    }

}