import { CodeFragment } from "../../../../common/disassembler/CodeFragment";
import { JavaLibraryModule } from "../../../module/libraries/JavaLibraryModule";
import { SystemModule } from "../../system/SystemModule";
import { NRWListClass } from "./NRWListClass";


export class NRWModule extends JavaLibraryModule {


    constructor() {
        super();
        this.classesInterfacesEnums.push(
            NRWListClass
            // Graphics'n Games (GNG)
            // GNGBaseFigur, GNGKreis, GNGRechteck, GNGDreieck, GNGText, GNGFigur,
            // GNGAktionsempfaenger, GNGZeichenfensterClass, GNGTurtle, GNGEreignisbehandlung
        )
    }


    isReplModule(): boolean {
        return false;
    }
    
    getCodeFragments(): CodeFragment[] {
        return [];
    }

    prepareSystemModule(systemModule: SystemModule): void {
        let classesToRemove: string[] = ['List', 'ArrayList', 'LinkedList', 'Vector', 'Stack'];
        systemModule.classesInterfacesEnums = systemModule.classesInterfacesEnums.filter(c => classesToRemove.indexOf(this.getName(c)) < 0);
    }

    



}