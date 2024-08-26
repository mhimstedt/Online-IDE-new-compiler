import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { ObjectClass } from "../../system/javalang/ObjectClassStringClass";
import { World3dClass } from "../3d/World3dClass";
import { RobotCubeFactory } from "./RobotCubeFactory";

export class RobotWorldClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class RobotWorld extends Object", comment: JRC.robotWorldClassComment},
        {type: "method", signature: "RobotWorld(int worldX, int worldY)", java: RobotWorldClass.prototype._cj$_constructor_$RobotWorld$int$int, comment: JRC.robotWorldConstructorWorldXWorldY}

    ];


    world3d: World3dClass;
    robotCubeFactory: RobotCubeFactory;


    _cj$_constructor_$RobotWorld$int$int(t: Thread, callback: CallbackParameter, worldX: number, worldY: number){

        let existingWorld = t.scheduler.interpreter.retrieveObject("robotWorldClass");
        if(existingWorld){
            t.s.push(existingWorld);
            if(callback) callback();
            return;
        }

        t.s.push(this);
        t.scheduler.interpreter.storeObject("robotWorldClass", this);

        new World3dClass()._cj$_constructor_$World$(t, async () => {

            this.world3d = t.s.pop();
            this.world3d.scene.clear();

            this.world3d.camera.position.z = 10;

            this.robotCubeFactory = new RobotCubeFactory(this);
            await this.robotCubeFactory.init();

            new OrbitControls(this.world3d.camera, this.world3d.renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xeeeeee, 3);
            this.world3d.scene.add(ambientLight);

            this.robotCubeFactory.getGrassPlane(5, 10);

        })


    }


}