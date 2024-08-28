import * as THREE from 'three';
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { Mesh3dClass } from "./Mesh3dClass";

export class Box3dClass extends Mesh3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Box3d extends Mesh3d", comment: JRC.box3dClassComment },
        { type: "method", signature: "Box3d(double x, double y, double z, double width, double height, double depth)", java: Box3dClass.prototype._cj$_constructor_$Box3d$double$double$double$double$double$double, comment: JRC.box3dConstructorXYZComment },
        { type: "method", signature: "Box3d(double x, double y, double z)", java: Box3dClass.prototype._cj$_constructor_$Box3d$double$double$double, comment: JRC.box3dConstructorXYZComment },
        { type: "method", signature: "Box3d()", java: Box3dClass.prototype._cj$_constructor_$Box3d$, comment: JRC.box3dConstructorComment }
    ];

    _cj$_constructor_$Box3d$double$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, z: number) {
        this._cj$_constructor_$Box3d$(t, () => {
            this.moveTo(x, y, z);
        })

    }
    _cj$_constructor_$Box3d$double$double$double$double$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, z: number, sx: number, sy: number, sz: number) {
        this._cj$_constructor_$Box3d$(t, () => {
            this.moveTo(x, y, z);
            this.mesh.scale.set(sx, sy, sz);
        })

    }

    _cj$_constructor_$Box3d$(t: Thread, callback: CallbackParameter) {
        super._cj$_constructor_$Mesh3d$(t, ()=>{
            const geometry = new THREE.BoxGeometry();
        
            this.mesh = new THREE.Mesh(geometry, this.getBasicMaterial());
            this.world3d.scene.add(this.mesh);
            if(callback)callback();
        });
    }

}