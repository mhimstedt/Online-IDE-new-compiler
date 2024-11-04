import { JavaLibraryModule } from "../java/module/libraries/JavaLibraryModule";
import { BaseType } from "./BaseType";
import { Error } from "./Error";
import { EventManager } from "./interpreter/EventManager";
import { CompilerFile } from "./module/CompilerFile";
import { Module } from "./module/Module";

export type CompilerEvents = "typesReadyForCodeCompletion" | "compilationFinished";

export interface Compiler {
    setFiles(files: CompilerFile[]): void;
    updateSingleModuleForCodeCompletion(module: Module): "success" | "completeCompilingNecessary";
    findModuleByFile(file: CompilerFile): Module | undefined;
    getAllModules(): Module[];
    setFileDirty(file: CompilerFile): void;
    getSortedAndFilteredErrors(file: CompilerFile): Error[];
    getType(identifier: string): BaseType | undefined;
    triggerCompile(): void;
    interruptAndStartOverAgain(): Promise<void>;

    setAdditionalModules(...modules: JavaLibraryModule[]): void;

    eventManager: EventManager<CompilerEvents>;

}