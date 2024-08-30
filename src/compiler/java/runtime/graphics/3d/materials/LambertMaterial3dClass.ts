import * as THREE from 'three';
import { JRC } from "../../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../../module/libraries/DeclareType";
import { ColorClass } from "../../ColorClass";
import { Material3dClass } from "./Material3dClass";
import { ColorConverter } from '../../ColorConverter';

export class LambertMaterial3dClass extends Material3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "final class LambertMaterial3d extends Material3d", comment: JRC.lambertMaterial3dClassComment},
        {type: "method", signature: "LambertMaterial3d(int color)", native: LambertMaterial3dClass.prototype._lambertMaterialConstructor, comment: JRC.lambertMaterial3dConstructorComment },
        {type: "method", signature: "LambertMaterial3d(string color)", native: LambertMaterial3dClass.prototype._lambertMaterialConstructor, comment: JRC.lambertMaterial3dConstructorComment },
        {type: "method", signature: "LambertMaterial3d(Color color)", native: LambertMaterial3dClass.prototype._lambertMaterialConstructor, comment: JRC.lambertMaterial3dConstructorComment },
        
        {type: "field", signature: "private int emissive", comment: JRC.material3dEmissiveComment },
        {type: "method", signature: "void setEmissive(int color)", native: LambertMaterial3dClass.prototype._setEmissive, comment: JRC.material3dEmissiveComment },
        {type: "method", signature: "void setEmissive(string color)", native: LambertMaterial3dClass.prototype._setEmissive, comment: JRC.material3dEmissiveComment },
        {type: "method", signature: "void setEmissive(Color color)", native: LambertMaterial3dClass.prototype._setEmissive, comment: JRC.material3dEmissiveComment },
        {type: "method", signature: "int getEmissive()", template: "§1.emissive", comment: JRC.material3dEmissiveComment },

        {type: "field", signature: "boolean wireframe", comment: JRC.materialWireframeComment},
        {type: "method", signature: "boolean isWireframe()", template: "§1.material.wireframe", comment: JRC.materialWireframeComment},
        {type: "method", signature: "void setWireframe(boolean value)", template: "§1.material.wireframe = §2", comment: JRC.materialWireframeComment},

    ]

    get wireframe(): boolean {
        return (<THREE.MeshLambertMaterial>this.material).wireframe;
    }


    get emissive(): number {
        let c = (<THREE.MeshLambertMaterial>this.material).emissive;
        if(!c) return 0x000000;
        return Math.round(c.r*0xff0000 + c.g*0xff00 + c.b*0xff);
    }

    _setEmissive(color: number | string | ColorClass){
        (<THREE.MeshLambertMaterial>this.material).emissive = ColorConverter.convertToThreeJsColor(color);
    }

    _lambertMaterialConstructor(color: number | string | ColorClass){
        this.material = new THREE.MeshLambertMaterial({
            color: ColorConverter.convertToThreeJsColor(color)
        })
        return this;
    }

}