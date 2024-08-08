import { Debugger } from "../../compiler/common/debugger/Debugger.js";
import { IMain } from "../../compiler/common/IMain.js";
import { CompilerWorkspace } from "../../compiler/common/module/CompilerWorkspace.js";
import { Module } from "../../compiler/common/module/Module.js";
import { Position } from "../../compiler/common/range/Position.js";
import { IRange } from "../../compiler/common/range/Range.js";
import { File } from "../workspace/File.js";
import { ActionManager } from "./gui/ActionManager.js";
import { BottomDiv } from "./gui/BottomDiv.js";
import { RightDiv } from "./gui/RightDiv.js";

export interface MainBase extends IMain {
    printProgram();
    drawClassDiagrams(onlyUpdateIdentifiers: boolean);
    
    getDebugger(): Debugger;
    getRightDiv(): RightDiv;
    getBottomDiv(): BottomDiv;
    getActionManager(): ActionManager;
    showProgramPointerPosition(file: File, position: Position);
    hideProgramPointerPosition();
    setFileActive(file: File);
    isEmbedded(): boolean;
    jumpToDeclaration(file: File, declaration: IRange);


    addWorkspace(ws: CompilerWorkspace): void;

}