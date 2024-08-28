import * as THREE from "three"

import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "../../system/javalang/ObjectClassStringClass";
import { ColorClass } from "../ColorClass";
import { ColorHelper } from "../../../lexer/ColorHelper";

export class Material3dClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Material3d extends Object" },
        { type: "method", signature: "void setColor(Color color)", native: Material3dClass.prototype.setColorColor },
        { type: "method", signature: "void setColor(int color)", native: Material3dClass.prototype.setColorInt },
        { type: "method", signature: "void setColor(String color)", native: Material3dClass.prototype.setColorString },
    ]

    static type: NonPrimitiveType;

    material: THREE.Material;
    constructor(material: THREE.Material) {
        super();
        this.material = material;
    }
    setColorColor(color: ColorClass) {
        if (this.material["color"]!==undefined) {
            this.material["color"]?.set(color.red, color.green, color.blue);
        }
    }

    setColorInt(color: number) {
        if (this.material["color"]!==undefined) {
            this.material["color"]?.set(color);
        }
    }

    setColorString(color: string) {
        if (this.material["color"]!==undefined) {
            let c = ColorHelper.parseColorToOpenGL(color);
            this.material["color"]?.set(c.color);
        }
    }

}