import { CodeFragment } from "../../../../common/disassembler/CodeFragment";
import { JavaLibraryModule } from "../../../module/libraries/JavaLibraryModule";


export class NRWModule extends JavaLibraryModule {


    constructor() {
        super();
        this.classes.push(
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





}