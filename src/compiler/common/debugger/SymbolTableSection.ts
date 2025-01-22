import { Treeview } from "../../../tools/components/treeview/Treeview";
import { JavaSymbolTable } from "../../java/codegenerator/JavaSymbolTable";
import { BaseSymbol, BaseSymbolTable } from "../BaseSymbolTable";
import { IPosition } from "../range/Position";
import { Debugger } from "./Debugger";
import { DebuggerSymbolEntry, StackElementDebuggerEntry, StaticFieldDebuggerEntry } from "./DebuggerSymbolEntry";

export class SymbolTableSection {

    children: StackElementDebuggerEntry[] = [];
    staticFieldChildren: StaticFieldDebuggerEntry[] = [];

    constructor(public treeview: Treeview<DebuggerSymbolEntry>,
        public symbolTable: BaseSymbolTable, public debugger1: Debugger) {

        // divToRenderInto.prepend(this.treeview.outerDiv);

        let symbols = symbolTable.getSymbolsOnStackframeForDebugger();
        for (let symbol of symbols) {
            if(symbol.hiddenWhenDebugging) continue;
            this.children.push(new StackElementDebuggerEntry(
                this, symbol
            ));
        }

        if(symbolTable instanceof JavaSymbolTable && symbolTable.classContext?.isMainClass && symbolTable.classContext != symbolTable.parent?.classContext){
            for(let field of symbolTable.classContext.getFields().filter(field => field.isStatic() && !field.hiddenWhenDebugging)){
                this.staticFieldChildren.push(new StaticFieldDebuggerEntry(this, field));
            }
        }
        
    }

    renewValues(stack: any[], stackBase: number, position: IPosition) {

        this.children.forEach(c => c.fetchValueFromStackAndRender(stack, stackBase, position));
        this.staticFieldChildren.forEach(c => c.fetchValueAndRender(position, this.debugger1.main.getInterpreter()));

    }

    attachNodesToTreeview() {
        for(let child of this.children){
            child.attachNodesToTreeview();
        }
        for(let child of this.staticFieldChildren){
            child.attachNodesToTreeview();
        }
    }

}