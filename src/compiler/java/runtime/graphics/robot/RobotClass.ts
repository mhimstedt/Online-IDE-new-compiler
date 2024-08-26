import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "../../system/javalang/ObjectClassStringClass";
import { RobotCubeFactory } from "./RobotCubeFactory";
import { RobotWorldClass } from './RobotWorldClass';

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

    robotCubeFactory: RobotCubeFactory;
    robotWorld: RobotWorldClass;

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
        t.s.push(this);

        this.robotWorld = t.scheduler.interpreter.retrieveObject("robotWorldClass");

        if(!this.robotWorld){
            new RobotWorldClass()._cj$_constructor_$RobotWorld$int$int(t, () => {
                this.robotWorld = t.s.pop();
                this.init(startX, startY);
                if(callback) callback();
                return;
            }, worldX, worldY);    
        } else {
            this.init(startX, startY);
            if(callback) callback();
            return;
        }

    }

    private init(startX: number, startY: number){
        // TODO!
    }

    _jc$_constructor_$Robot$int$int$string(t: Thread, callback: CallbackParameter, startX: number, startY: number, initialWorld: string){
        // TODO!
    }



}