import * as THREE from 'three';
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { Mesh3dClass } from "./Mesh3dClass";

export class Cylinder3dClass extends Mesh3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Cylinder3d extends Mesh3d"},
        { type: "method", signature: "Cylinder3d(double x, double y, double z, double radiusTop, double radiusBottom, double height)", java: Cylinder3dClass.prototype._cj$_constructor_$Cylinder3d$double$double$double$double$double$double},
        { type: "method", signature: "Cylinder3d()", java: Cylinder3dClass.prototype._cj$_constructor_$Cylinder3d$ }
    ];

    _cj$_constructor_$Cylinder3d$double$double$double$double$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, z: number,
        rTop:number, rBottom: number, h: number) {
        super._cj$_constructor_$Mesh3d$(t, ()=>{
            const geometry = new THREE.CylinderGeometry(rTop, rBottom, h);

            this.mesh = new THREE.Mesh(geometry, this.getInitialMaterial().getMaterialAndIncreaseUsageCounter());
            this.world3d.scene.add(this.mesh);
            this.moveTo(x, y, z);
            if(callback)callback();
        });

    }

    _cj$_constructor_$Cylinder3d$(t: Thread, callback: CallbackParameter) {
        super._cj$_constructor_$Mesh3d$(t, ()=>{
            const geometry = new THREE.CylinderGeometry(1, 1);

            this.mesh = new THREE.Mesh(geometry, this.getInitialMaterial().getMaterialAndIncreaseUsageCounter());
            this.world3d.scene.add(this.mesh);
            if(callback)callback();
        });
    }

}