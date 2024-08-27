import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { Object3dClass } from "./Object3dClass";

export class Cube3dClass extends Object3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Cube3d extends Object3d", comment: JRC.cube3dClassComment},
        {type: "method", signature: "Cube3d(x: double, y: double, z: double)", java: Cube3dClass.prototype._cj$_constructor_$Cube3d$double$double$double, comment: JRC.cube3dConstructorXYZComment},
        {type: "method", signature: "Cube3d()", java: Cube3dClass.prototype._cj$_constructor_$Cube3d$, comment: JRC.cube3dConstructorComment}
    ];
    
    _cj$_constructor_$Cube3d$double$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, z: number ){
        this._cj$_constructor_$Cube3d$(t, () => {
            // TODO
        })
        
    }
    
    _cj$_constructor_$Cube3d$(t: Thread, callback: CallbackParameter){
        super._cj$_constructor_$Object3d$(t, () => {
            // TODO
        })
    }    
    
    move(x: number, y: number, z: number): void {
        throw new Error("Method not implemented.");
    }
    moveTo(x: number, y: number, z: number): void {
        throw new Error("Method not implemented.");
    }
}