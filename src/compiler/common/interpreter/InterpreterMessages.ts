import { lm } from "../../../tools/language/LanguageManager";

export class InterpreterMessages {
    static CantJumpToLine = () => lm({
    "de": `Das Programm kann die Ausführung nicht in dieser Zeile fortsetzen, da sie nicht innerhalb der aktuellen Methode liegt.`,
    "en": `You can't continue program execution in this line as it's outside scope of the current method.`,
    })
}