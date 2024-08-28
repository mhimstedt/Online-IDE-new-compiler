import * as THREE from 'three';
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { Mesh3dClass } from "./Mesh3dClass";

export class Cube3dClass extends Mesh3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Cube3d extends Mesh3d", comment: JRC.cube3dClassComment },
        { type: "method", signature: "Cube3d(double x, double y, double z)", java: Cube3dClass.prototype._cj$_constructor_$Cube3d$double$double$double, comment: JRC.cube3dConstructorXYZComment },
        { type: "method", signature: "Cube3d()", java: Cube3dClass.prototype._cj$_constructor_$Cube3d$, comment: JRC.cube3dConstructorComment }
    ];

    _cj$_constructor_$Cube3d$double$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, z: number) {
        this._cj$_constructor_$Cube3d$(t, () => {
            this.moveTo(x, y, z);
        })

    }

    _cj$_constructor_$Cube3d$(t: Thread, callback: CallbackParameter) {
        super._cj$_constructor_$Mesh3d$(t, ()=>{
            const geometry = new THREE.BoxGeometry();
        
            this.mesh = new THREE.Mesh(geometry, this.getBasicMaterial());
            this.world3d.scene.add(this.mesh);
            if(callback)callback();
        });
    }

}