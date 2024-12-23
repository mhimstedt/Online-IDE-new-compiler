import * as THREE from 'three';
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { Mesh3dClass } from "./Mesh3dClass";

export class Circle3dClass extends Mesh3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Circle3d extends Mesh3d"},
        { type: "method", signature: "Circle3d(double radius, int numberOfSegments)", java: Circle3dClass.prototype._cj$_constructor_$Circle3d$double$int},
        { type: "method", signature: "Circle3d()", java: Circle3dClass.prototype._cj$_constructor_$Circle3d$ }
    ];

    _cj$_constructor_$Circle3d$double$int(t: Thread, callback: CallbackParameter, radius: number, segments: number) {
        super._cj$_constructor_$Mesh3d$(t, ()=>{
            const geometry = new THREE.CircleGeometry(radius, segments);

            this.mesh = new THREE.Mesh(geometry, this.getInitialMaterial().getMaterialAndIncreaseUsageCounter());
            this.world3d.scene.add(this.mesh);

            if(callback)callback();
        });

    }

    _cj$_constructor_$Circle3d$(t: Thread, callback: CallbackParameter) {
        super._cj$_constructor_$Mesh3d$(t, ()=>{
            const geometry = new THREE.CircleGeometry(1);

            this.mesh = new THREE.Mesh(geometry, this.getInitialMaterial().getMaterialAndIncreaseUsageCounter());
            this.world3d.scene.add(this.mesh);
            if(callback)callback();
        });
    }

}