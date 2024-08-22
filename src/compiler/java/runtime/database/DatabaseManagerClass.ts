import { Main } from "../../../../client/main/Main";
import { CallbackFunction } from "../../../common/interpreter/StepFunction";
import { Thread, ThreadState } from "../../../common/interpreter/Thread";
import { JRC } from "../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass";
import { RuntimeExceptionClass } from "../system/javalang/RuntimeException";
import { ConnectionClass } from "./ConnectionClass";

export class DatabaseManagerClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class DatabaseManager extends Object", comment: JRC.databaseManagerClassComment},

        {type: "method", signature: "static Connection getConnection(string code)", java: DatabaseManagerClass._mj$getConnection$Connection$string, comment: JRC.databaseManagerGetConnectionComment}
    ];

    type: NonPrimitiveType;

    static _mj$getConnection$Connection$string(t: Thread, code: string){

        let interpreter = t.scheduler.interpreter;
        let main = <Main>interpreter.getMain();

        if(!main || main.isEmbedded()){
            throw new RuntimeExceptionClass(JRC.databaseManagerNotInEmbeddedVersionException());
        }

        let ch: ConnectionClass = new ConnectionClass(t.scheduler.interpreter);

        interpreter.showProgramPointer(undefined, "DatabaseManager");
        main.getBottomDiv().showHideDbBusyIcon(true);
        t.state = ThreadState.waiting;

        ch.connect(code, (error: string) => {
            main.getBottomDiv().showHideDbBusyIcon(false);
            if(error == null){
                t.s.push(ch);
            } else {
                t.s.push(null);
            }
            t.state = ThreadState.runnable;
        })

    }

}