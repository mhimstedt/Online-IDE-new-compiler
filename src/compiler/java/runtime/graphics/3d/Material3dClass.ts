import * as THREE from "three"

import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "../../system/javalang/ObjectClassStringClass";
import { ColorClass } from "../ColorClass";
import { ColorHelper } from "../../../lexer/ColorHelper";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { NullPointerExceptionClass } from "../../system/javalang/NullPointerExceptionClass";

export class Material3dClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Material3d extends Object" },
        { type: "method", signature: "void setColor(Color color)", native: Material3dClass.prototype.setColorColor },
        { type: "method", signature: "void setColor(int color)", native: Material3dClass.prototype.setColorInt },
        { type: "method", signature: "void setColor(String color)", native: Material3dClass.prototype.setColorString },
    ]

    static type: NonPrimitiveType;

    private material: THREE.Material;
    private usageCounter: number = 0;


    constructor(material: THREE.Material) {
        super();
        this.material = material;
    }

    setColorColor(color: ColorClass) {
        if(color===null){
            throw new NullPointerExceptionClass(JRC.world3dColorNull())
        }
        if (this.material["color"]!==undefined) {
            this.material["color"]?.set(color.red/255, color.green/255, color.blue/255);
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

    attachToMesh(mesh: THREE.Mesh){
        mesh.material = this.material;
        this.usageCounter++;
    }

    destroyIfNotUsedByOtherMesh(){
        if(--this.usageCounter == 0){
            let texture = this.material["map"];
            if(texture){
                if(texture["isPartOfSpritesheet"]) return;
                texture.dispose();
            }
        }
    }

}