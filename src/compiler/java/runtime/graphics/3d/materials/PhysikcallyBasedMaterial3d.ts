import * as THREE from 'three';
import { JRC } from "../../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../../module/libraries/DeclareType";
import { ColorClass } from "../../ColorClass";
import { Material3dClass } from "./Material3dClass";
import { ColorConverter } from '../../ColorConverter';

export class PhysicallyBasedMaterial3dClass extends Material3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "final class PhysicallyBasedMaterial3d extends Material3d", comment: JRC.physicallyBasedMaterial3dClassComment},
        {type: "method", signature: "PhysicallyBasedMaterial3d(int color, double routhness, double metalness)", native: PhysicallyBasedMaterial3dClass.prototype._physicallyBasedMaterialConstructor, comment: JRC.physicallyBasedMaterial3dConstructorComment },
        {type: "method", signature: "PhysicallyBasedMaterial3d(string color, double routhness, double metalness)", native: PhysicallyBasedMaterial3dClass.prototype._physicallyBasedMaterialConstructor, comment: JRC.physicallyBasedMaterial3dConstructorComment },
        {type: "method", signature: "PhysicallyBasedMaterial3d(Color color, double routhness, double metalness)", native: PhysicallyBasedMaterial3dClass.prototype._physicallyBasedMaterialConstructor, comment: JRC.physicallyBasedMaterial3dConstructorComment },
        
        {type: "field", signature: "private int emissive", template: "§1.emissive", comment: JRC.material3dEmissiveComment },
        {type: "method", signature: "void setEmissive(int color)", native: PhysicallyBasedMaterial3dClass.prototype._setEmissive, comment: JRC.material3dEmissiveComment },
        {type: "method", signature: "void setEmissive(string color)", native: PhysicallyBasedMaterial3dClass.prototype._setEmissive, comment: JRC.material3dEmissiveComment },
        {type: "method", signature: "void setEmissive(Color color)", native: PhysicallyBasedMaterial3dClass.prototype._setEmissive, comment: JRC.material3dEmissiveComment },
        {type: "method", signature: "int getEmissive()", template: "§1.emissive", comment: JRC.material3dEmissiveComment },

        {type: "field", signature: "boolean wireframe", comment: JRC.materialWireframeComment},
        {type: "method", signature: "boolean isWireframe()", template: "§1.material.wireframe", comment: JRC.materialWireframeComment},
        {type: "method", signature: "void setWireframe(boolean value)", template: "§1.material.wireframe = §2", comment: JRC.materialWireframeComment},

        { type: "field", signature: "private double roughness", template: "§1.roughness", comment: JRC.physicallyBasedMaterial3dRoughnessComment },
        { type: "method", signature: "void setRoughness(double value)", template: "§1.material.roughness = §2", comment: JRC.physicallyBasedMaterial3dRoughnessComment },
        { type: "method", signature: "double getRoughness(double value)", template: "§1.material.roughness", comment: JRC.physicallyBasedMaterial3dRoughnessComment },
        
        { type: "field", signature: "private double metalness", template: "§1.metalness", comment: JRC.physicallyBasedMaterial3dMetalnessComment },
        { type: "method", signature: "void setMetalness(double value)", template: "§1.material.metalness = §2", comment: JRC.physicallyBasedMaterial3dMetalnessComment },
        { type: "method", signature: "double getMetalness(double value)", template: "§1.material.metalness", comment: JRC.physicallyBasedMaterial3dMetalnessComment },

    ]
    get wireframe(): boolean {
        return (<THREE.MeshStandardMaterial>this.material).wireframe;
    }

    get roughness(): number {
        return (<THREE.MeshStandardMaterial>this.material).roughness;
    }

    get metalness(): number {
        return (<THREE.MeshStandardMaterial>this.material).metalness;
    }

    get emissive(): number {
        let c = (<THREE.MeshStandardMaterial>this.material).emissive;
        if(!c) return 0x000000;
        return Math.round(c.r*0xff0000 + c.g*0xff00 + c.b*0xff);
    }

    _setEmissive(color: number | string | ColorClass){
        (<THREE.MeshStandardMaterial>this.material).emissive = ColorConverter.convertToThreeJsColor(color);
    }

    _physicallyBasedMaterialConstructor(color: number | string | ColorClass, roughness: number, metalness: number){
        this.material = new THREE.MeshStandardMaterial({
            color: ColorConverter.convertToThreeJsColor(color),
            roughness: roughness,
            metalness: metalness
        })
        return this;
    }

}