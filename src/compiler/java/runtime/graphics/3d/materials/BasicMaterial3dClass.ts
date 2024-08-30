import * as THREE from 'three';
import { JRC } from "../../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../../module/libraries/DeclareType";
import { ColorClass } from "../../ColorClass";
import { Material3dClass } from "./Material3dClass";
import { ColorConverter } from '../../ColorConverter';

export class BasicMaterial3dClass extends Material3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "final class BasicMaterial3d extends Material3d", comment: JRC.basicMaterial3dClassComment},
        {type: "method", signature: "BasicMaterial3d(int color)", native: BasicMaterial3dClass.prototype._basicMaterialConstructor, comment: JRC.basicMaterial3dConstructorComment },
        {type: "method", signature: "BasicMaterial3d(int color, boolean wireframe)", native: BasicMaterial3dClass.prototype._basicMaterialConstructor, comment: JRC.basicMaterial3dConstructorComment },
        {type: "method", signature: "BasicMaterial3d(string color, boolean wireframe)", native: BasicMaterial3dClass.prototype._basicMaterialConstructor, comment: JRC.basicMaterial3dConstructorComment },
        {type: "method", signature: "BasicMaterial3d(Color color, boolean wireframe)", native: BasicMaterial3dClass.prototype._basicMaterialConstructor, comment: JRC.basicMaterial3dConstructorComment },

        {type: "field", signature: "boolean wireframe", comment: JRC.materialWireframeComment},
        {type: "method", signature: "boolean isWireframe()", template: "§1.material.wireframe", comment: JRC.materialWireframeComment},
        {type: "method", signature: "void setWireframe(boolean value)", template: "§1.material.wireframe = §2", comment: JRC.materialWireframeComment},

    ]

    get wireframe(): boolean {
        return (<THREE.MeshBasicMaterial>this.material).wireframe;
    }

    _basicMaterialConstructor(color: number | string | ColorClass, wireframe: boolean = false){
        this.material = new THREE.MeshBasicMaterial({
            color: ColorConverter.convertToThreeJsColor(color),
            wireframe: wireframe
        })

        return this;
    }

}