import { ConsoleEntry } from "./ConsoleEntry.js";
import { Main } from "../../Main.js";
import { MainBase } from "../../MainBase.js";
import { Helper } from "../Helper.js";

export class MyConsole {

    editor: monaco.editor.IStandaloneCodeEditor;
    history: string[] = [];
    historyPos: number = 0;

    timerHandle: any;
    isDirty: boolean = false;

    consoleEntries: ConsoleEntry[] = [];

    $consoleTabHeading: JQuery<HTMLElement>;
    $consoleTab: JQuery<HTMLElement>;

    constructor(private main: MainBase, public $bottomDiv: JQuery<HTMLElement>) {
        if ($bottomDiv == null) return; // Console is only used to highlight exceptions

        this.$consoleTabHeading = $bottomDiv.find('.jo_tabheadings>.jo_console-tab');
        this.$consoleTab = $bottomDiv.find('.jo_tabs>.jo_consoleTab');
    }

    initConsoleClearButton() {

        let that = this;

        let $consoleClear = this.$consoleTabHeading.parent().find('.jo_console-clear');

        this.$consoleTab.on('myshow', () => {
            $consoleClear.show();
            that.editor.layout();
        });

        this.$consoleTab.on('myhide', () => {
            $consoleClear.hide();
        });

        $consoleClear.on('mousedown', (e) => {
            e.stopPropagation();
            that.clear();
        });

    }

    initGUI() {

        if (this.$bottomDiv == null) return;

        this.initConsoleClearButton();

        let $editorDiv = this.$consoleTab.find('.jo_commandline');

        this.editor = monaco.editor.create($editorDiv[0], {
            value: [
                ''
            ].join('\n'),
            automaticLayout: false,
            renderLineHighlight: "none",
            guides: {
                bracketPairs: false,
                highlightActiveIndentation: false,
                indentation: false
            },
            overviewRulerLanes: 0,
            lineNumbers: 'off',
            glyphMargin: false,
            folding: false,
            // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            fixedOverflowWidgets: true,
            language: 'myJava',

            fontSize: 14,
            //@ts-ignore
            fontFamily: window.javaOnlineFont == null ? "Consolas, Roboto Mono" : window.javaOnlineFont,
            fontWeight: "500",
            roundedSelection: true,
            occurrencesHighlight: false,
            suggest: {
                localityBonus: true,
                snippetsPreventQuickSuggestions: false
            },
            minimap: {
                enabled: false
            },
            scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden'
            },
            theme: "myCustomThemeDark", 

            acceptSuggestionOnEnter: "off"

        }
        );

        this.editor.layout();

        let that = this;

        let lastStatement: string = "";

        this.editor.onKeyDown((e) => {
            let statement = this.editor.getModel()?.getValue();
            if (!statement) return;

            if (e.code == 'Enter') {
                setTimeout(async () => {
                    let command = that.editor.getModel().getValue(monaco.editor.EndOfLinePreference.LF, false);

                    if (!command || command == "") return;

                    that.history.push(command);
                    that.historyPos = 0;

                    let returnValue = await that.main.getRepl().executeAsync(command!, false);
                    if(typeof returnValue !== "undefined"){
                        that.writeConsoleEntry(command, returnValue.text);
                        this.editor.getModel()?.setValue('');
                    }
                }, 10);
                e.preventDefault();
            } else {
                if (statement != lastStatement) {
                    that.main.getRepl().compileAndShowErrors(statement);
                    lastStatement = statement;
                }
            }
        })

        // this.editor.addCommand(monaco.KeyCode.UpArrow, () => {

        //     let nextHistoryPos = that.history.length - (that.historyPos + 1);
        //     if (nextHistoryPos >= 0) {
        //         that.historyPos++;
        //         let text = that.history[nextHistoryPos];
        //         that.editor.setValue(text);
        //         that.editor.setPosition({
        //             lineNumber: 1,
        //             column: text.length + 1
        //         })
        //     }

        // }, "!suggestWidgetVisible");

        // this.editor.addCommand(monaco.KeyCode.DownArrow, () => {

        //     let nextHistoryPos = that.history.length - (that.historyPos - 1);
        //     if (nextHistoryPos <= that.history.length - 1) {
        //         that.historyPos--;
        //         let text = that.history[nextHistoryPos];
        //         that.editor.setValue(text);
        //         that.editor.setPosition({
        //             lineNumber: 1,
        //             column: text.length + 1
        //         })
        //     } else {
        //         that.editor.setValue("");
        //         that.historyPos = 0;
        //     }

        // }, "!suggestWidgetVisible");


        let model = this.editor.getModel();
        let lastVersionId = 0;

        model.onDidChangeContent(() => {
            let versionId = model.getAlternativeVersionId();

            if (versionId != lastVersionId) {
                that.isDirty = true;
                lastVersionId = versionId;
            }
        });

        this.$consoleTabHeading.on("mousedown", () => {
            Helper.showHelper("consoleHelper", this.main);

            setTimeout(() => {
                that.editor.focus();
            }, 500);
        });

    }


    execute() {

        // monaco.editor.colorize(command, 'myJava', { tabSize: 3 }).then((command) => {

        // });

    }

    showTab() {
        let mousePointer = window.PointerEvent ? "pointer" : "mouse";
        this.$consoleTabHeading.trigger(mousePointer + "down");
    }

    writeConsoleEntry(command: string | JQuery<HTMLElement>, value: any, color: string = null) {

        if (this.$consoleTab == null) {
            return;
        }
        let consoleTop = this.$consoleTab.find('.jo_console-top');

        let commandEntry = new ConsoleEntry(true, command, null, null, null, value == null, color);
        this.consoleEntries.push(commandEntry);
        consoleTop.append(commandEntry.$consoleEntry);

        let resultEntry = new ConsoleEntry(false, null, value, null, null, true, color);
        this.consoleEntries.push(resultEntry);
        consoleTop.append(resultEntry.$consoleEntry);

        var height = consoleTop[0].scrollHeight;
        consoleTop.scrollTop(height);

    }

    clear() {
        let consoleTop = this.$consoleTab.find('.jo_console-top');
        consoleTop.children().remove(); // empty();
        this.consoleEntries = [];
    }

    detachValues() {
        for (let ce of this.consoleEntries) {
            ce.detachValue();
        }
    }


    clearExceptions() {
        if (this.$bottomDiv == null) return;
        let $consoleTop = this.$consoleTab.find('.jo_console-top');
        $consoleTop.find('.jo_exception').parents('.jo_consoleEntry').remove();
    }

}