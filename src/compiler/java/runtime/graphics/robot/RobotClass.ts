import * as THREE from 'three';
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "../../system/javalang/ObjectClassStringClass";
import { World3dClass } from "../3d/World3dClass";
import { RobotCubeFactory } from "./RobotCubeFactory";

export class RobotClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Robot extends Object", comment: JRC.robotClassComment },

        { type: "method", signature: "Robot()", java: RobotClass.prototype._jc$_constructor_$Robot$, comment: JRC.robotEmptyConstructorComment },
        { type: "method", signature: "Robot(int startX, int startY)", java: RobotClass.prototype._jc$_constructor_$Robot$int$int, comment: JRC.robotConstructorStartXStartY },
        { type: "method", signature: "Robot(int startX, int startY, int worldX, int worldY)", java: RobotClass.prototype._jc$_constructor_$Robot$int$int$int$int, comment: JRC.robotConstructorStartXStartYWorldXWorldY },
        { type: "method", signature: "Robot(int startX, int startY, string initialWorld)", java: RobotClass.prototype._jc$_constructor_$Robot$int$int$string, comment: JRC.robotConstructorStartXStartYinitialWorld },
        
        // { type: "method", signature: "RobotWorld getWelt()", native: RobotClass.prototype._getWelt, comment: JRC.robotGetWelt },


    ];

    static type: NonPrimitiveType;

    world3d!: World3dClass;
    robotCubeFactory: RobotCubeFactory;

    constructor(){
        super();
    }

    _jc$_constructor_$Robot$(t: Thread, callback: CallbackParameter) {
        this._jc$_constructor_$Robot$int$int$int$int(t, callback, 1, 1, 5, 8);
    }

    _jc$_constructor_$Robot$int$int(t: Thread, callback: CallbackParameter, startX: number, startY: number) {
        this._jc$_constructor_$Robot$int$int$int$int(t, callback, startX, startY, 5, 10);
    }

    _jc$_constructor_$Robot$int$int$int$int(t: Thread, callback: CallbackParameter, startX: number, startY: number, 
        worldX: number, worldY: number) {
        
        this.world3d = new World3dClass();

        this.world3d._cj$_constructor_$World$(t, async () => {

            this.robotCubeFactory = new RobotCubeFactory();
            await this.robotCubeFactory.loadTextures();

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = this.robotCubeFactory.material.get("grassblock");
            const cube = new THREE.Mesh(geometry, material);
            this.world3d.scene.add(cube);
            cube.geometry.rotateY(45);


        })        

    }

    _jc$_constructor_$Robot$int$int$string(t: Thread, callback: CallbackParameter, startX: number, startY: number, initialWorld: string){
        // TODO!
    }



}