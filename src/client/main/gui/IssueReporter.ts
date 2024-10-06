import { DOM } from "../../../tools/DOM.js";
import { ajax, ajaxAsync } from "../../communication/AjaxHelper.js";
import { Main } from "../Main.js";
import { Dialog } from "./Dialog.js";
import '/include/css/issuereporter.css';

type ReportIssueRequest = {
    workspace_id: number,
    description: string,
    mail: string,
    rufname: string,
    familienname: string
}

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

        let textfield = <HTMLTextAreaElement>DOM.makeElement(this.dialog.$dialogMain[0], "textarea", "jo_issuereporterr_textfield");

        let addWorkspace = this.dialog.addCheckbox("Der Fehlermeldung eine Kopie des aktuell offenen Workspaces beifügen", true, "jo_cbIssueAddWorkspace");
        let emailInput = this.dialog.input("text", "E-Mail-Adresse (für Rückfragen, optional)");
        let rufnameInput = this.dialog.input("text", "Rufname (für Rückfragen, optional)");
        let familiennameInput = this.dialog.input("text", "Familienname (für Rückfragen, optional)");
        

        this.dialog.buttons([
            {
                caption: "Abbrechen",
                color: "#a00000",
                callback: () => { this.dialog.close() }
            },
            {
                caption: "Senden",
                color: "green",
                callback: async() => {
                    
                    let request: ReportIssueRequest = {
                        workspace_id: addWorkspace() ? this.main.getCurrentWorkspace().id : null,
                        description: textfield.value,
                        mail: emailInput.val(),
                        rufname: rufnameInput.val(),
                        familienname: familiennameInput.val()
                    }

                    let response: {success: boolean, message: string} = await ajaxAsync("/servlet/reportIssue", request);
                    if(response.success){
                        alert("Danke für die Fehlermeldung!\nDer Fehler wurde erfolgreich übermittelt.");
                    }

                    this.dialog.close();

                }
            },
        ])
    }

}