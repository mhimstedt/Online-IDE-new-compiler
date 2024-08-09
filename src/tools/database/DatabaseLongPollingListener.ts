import jQuery from 'jquery';
import { csrfToken } from "../../client/communication/AjaxHelper.js";
import { DatabaseLongPollingListenerRequest, LongPollingListenerResponse } from "../../client/communication/Data.js";
import { NetworkManager } from "../../client/communication/NetworkManager.js";
import { SqlIdeUrlHolder } from "../../client/main/SqlIdeUrlHolder.js";

export class DatabaseOldLongPollingListener {

    identifier: number = Math.floor(Math.random() * 999999999);
    isClosed: boolean = false;

    constructor(private networkManager: NetworkManager,
        private token: string,
        private onServerSentStatementsCallback: (firstNewStatementIndex: number, newStatements: string[], rollbackToVersion: number) => void) {
    }

    longPoll() {
        let that = this;

        let request: DatabaseLongPollingListenerRequest = {
            token: this.token,
            listenerIdentifier: this.identifier
        }

        let headers: {[key: string]: string;} = {};
        if(csrfToken != null) headers = {"x-token-pm": csrfToken};

        jQuery.ajax({
            type: 'POST',
            async: true,
            headers: headers,
            data: JSON.stringify(request),
            contentType: 'application/json',
            url: SqlIdeUrlHolder.sqlIdeURL + "registerLongpollingListener",
            success: function (resp: string) {
                if (resp != null && !that.isClosed && resp != "") {
                    let response: LongPollingListenerResponse = JSON.parse(resp);
                    if (response.success) {
                        that.onServerSentStatementsCallback(response.firstNewStatementIndex,
                            response.newStatements, response.rollbackToVersion);
                    }
                }

                if (!that.isClosed) {
                    setTimeout(() => {
                        that.longPoll();
                    }, 100);
                }
            },
            error: function (jqXHR, message) {
                if (!that.isClosed) {
                    setTimeout(() => {
                        that.longPoll();
                    }, 1000);
                }
            }
        });

    }

    close(){
        this.isClosed = true;
    }

}