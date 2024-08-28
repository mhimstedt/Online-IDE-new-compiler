import * as THREE from "three"

import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "../../system/javalang/ObjectClassStringClass";

export class Material3dClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Material3d extends Object" }
    ]

    static type: NonPrimitiveType;

    material: THREE.Material;


    
}