import { lm } from "../../tools/language/LanguageManager";

export class HelpMessages {
    static apiDocNone = () => lm({
    "de": "Keine",
    "en": "None",
    })

    static apiDocClasses= () => lm({
    "de": "Klassen",
    "en": "Classes",
    })

    static apiDocInterfaces = () => lm({
    "de": "Interfaces",
    "en": "Interfaces",
    })

    static apiDocEnums = () => lm({
    "de": "Enums",
    "en": "enums",
    })

    static apiDocMainHeading = () => lm({
    "de": "Online-IDE: Dokumentation der Java-API",
    "en": "Online-IDE: Java-API documentation",
    })
}