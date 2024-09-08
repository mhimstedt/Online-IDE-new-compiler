import { DOM } from "../../../tools/DOM.js";
import { Main } from "../Main.js";
import { Dialog } from "./Dialog.js";
import '/include/css/issuereporter.css';

export class IssueReporter {

    dialog: Dialog;

    constructor(private main: Main) {

        this.dialog = new Dialog();
        
    }

    show() {
        let that = this;
        this.dialog.init();
        this.dialog.heading("Fehler melden");
        this.dialog.description("Fehlerbeschreibung:")

        let textfield = DOM.makeElement(this.dialog.$dialogMain[0], "textarea", "jo_issuereporterr_textfield");

        this.dialog.addCheckbox("Der Fehlermeldung eine Kopie des aktuellen Workspaces beifügen", true, "jo_cbIssueAddWorkspace");
        this.dialog.input("text", "E-Mail-Adresse (für Rückfragen, optional)");
        

        this.dialog.buttons([
            {
                caption: "Abbrechen",
                color: "#a00000",
                callback: () => { this.dialog.close() }
            },
            {
                caption: "Senden",
                color: "green",
                callback: () => {
                    
                    let networkManager = this.main.networkManager;
                    let projectExplorer = this.main.projectExplorer;


                    this.dialog.close();

                }
            },
        ])
    }

}