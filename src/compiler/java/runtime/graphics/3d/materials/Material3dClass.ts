import * as THREE from "three"

import { LibraryDeclarations } from "../../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { ObjectClass } from "../../../system/javalang/ObjectClassStringClass";
import { ColorClass } from "../../ColorClass";
import { ColorConverter } from "../../ColorConverter";
import { JRC } from "../../../../language/JavaRuntimeLibraryComments";

export class Material3dClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "abstract final class Material3d extends Object", comment: JRC.material3dClassComment },
        { type: "method", signature: "void setColor(Color color)", native: Material3dClass.prototype.setColor, comment: JRC.material3dSetColorComment },
        { type: "method", signature: "void setColor(int color)", native: Material3dClass.prototype.setColor, comment: JRC.material3dSetColorComment },
        { type: "method", signature: "void setColor(String color)", native: Material3dClass.prototype.setColor, comment: JRC.material3dSetColorComment },

        { type: "method", signature: "int getColor()", native: Material3dClass.prototype.getColor, comment: JRC.material3dGetColorComment },


        { type: "field", signature: "private boolean transparent", comment: JRC.material3dSetTransparentComment },
        { type: "method", signature: "boolean isTransparent()", template: "§1.material.transparent", comment: JRC.material3dIsTransparentComment },
        { type: "method", signature: "void setTransparent(boolean value)", template: "§1.material.transparent = §2", comment: JRC.material3dSetTransparentComment },

        { type: "field", signature: "private boolean flatShading", comment: JRC.material3dFlatShadingComment },
        { type: "method", signature: "boolean isFlatShading()", template: "§1.material.flatShading", comment: JRC.material3dFlatShadingComment },
        { type: "method", signature: "void setFlatShading(boolean value)", template: "§1.material.flatShading = §2", comment: JRC.material3dFlatShadingComment },

        { type: "field", signature: "private double alpha", comment: JRC.material3dAlphaComment },
        { type: "method", signature: "void setAlpha(double value)", template: "§1.alpha = §2", comment: JRC.material3dAlphaComment },
        { type: "method", signature: "double getAlpha(double value)", template: "§1.alpha", comment: JRC.material3dAlphaComment },

    ]

    static type: NonPrimitiveType;

    protected material: THREE.Material;
    private usageCounter: number = 0;

    set alpha(value: number){
        if(value > 1) value = 1;
        if(value < 0) value = 0;
        this.material.opacity = 1 - value;
    }

    get transparent(): boolean {
        return this.material.transparent;
    }

    get flatShading(): boolean {
        return this.material["flatShading"] || false;
    }

    get alpha():number {
        return 1 - this.material.opacity;
    }

    setColor(color: number | string | ColorClass) {
        if (this.material["color"]!==undefined) {
            this.material["color"]?.set(ColorConverter.convertToThreeJsColor(color));
        }
    }

    getMaterialAndIncreaseUsageCounter(){
        this.usageCounter++;
        return this.material;
    }

    getMaterialWithoutIncreasingUsageCounter(){
        this.usageCounter++;
        return this.material;
    }

    getColor(): number {
        let c = (<THREE.Color>this.material["color"]);
        if(!c) return 0x000000;
        return Math.round(c.r*0xff0000 + c.g*0xff00 + c.b*0xff);
    }

    destroyIfNotUsedByOtherMesh(){
        if(--this.usageCounter == 0){
            let texture = this.material["map"];
            if(texture){
                if(texture["isPartOfSpritesheet"]) return;
                let rt: THREE.WebGLRenderTarget = texture["renderTarget"];
                if(rt){
                    rt.dispose();
                }
                texture.dispose();
            }
            this.material.dispose();
        }
    }

}