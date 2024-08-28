import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { Light3dClass } from "./Light3dClass";

export class PointLight3dClass extends Light3dClass{
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Light3d extends Object3d" },
        { type: "method", signature: "Light3d()", java: PointLight3dClass.prototype._cj$_constructor_$Light3d$ },
        { type: "field", signature: "public Material3d material"},
    ];

    static type: NonPrimitiveType;


}