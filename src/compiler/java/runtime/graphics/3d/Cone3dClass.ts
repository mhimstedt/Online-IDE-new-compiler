import * as THREE from 'three';
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { Mesh3dClass } from "./Mesh3dClass";

export class Cone3dClass extends Mesh3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Cone3d extends Mesh3d"},
        { type: "method", signature: "Cone3d(double x, double y, double z, double radius, double height)", java: Cone3dClass.prototype._cj$_constructor_$Cone3d$double$double$double$double$double},
        { type: "method", signature: "Cone3d(double x, double y, double z)", java: Cone3dClass.prototype._cj$_constructor_$Cone3d$double$double$double},
        { type: "method", signature: "Cone3d()", java: Cone3dClass.prototype._cj$_constructor_$Cone3d$ }
    ];

    _cj$_constructor_$Cone3d$double$double$double$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, z: number,r:number, h: number) {
        this._cj$_constructor_$Cone3d$(t, () => {
            this.moveTo(x, y, z);
            this.mesh.scale.set(r,h,r);
        })

    }
    _cj$_constructor_$Cone3d$double$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, z: number) {
        this._cj$_constructor_$Cone3d$(t, () => {
            this.moveTo(x, y, z);
        })

    }

    _cj$_constructor_$Cone3d$(t: Thread, callback: CallbackParameter) {
        super._cj$_constructor_$Mesh3d$(t, ()=>{
            const geometry = new THREE.ConeGeometry(1, 1);

            this.mesh = new THREE.Mesh(geometry, this.getInitialMaterial().getMaterialAndIncreaseUsageCounter());
            this.world3d.scene.add(this.mesh);
            if(callback)callback();
        });
    }

}