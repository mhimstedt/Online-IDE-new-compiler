import { lm } from "../../../../../tools/language/LanguageManager";

/**
 * Language file for NRW-Classes
 */
export class NRWLang {


    /**
     * List class
     */
    static listClassComment = () => lm({
        "de": `Generische Klasse List<ContentType> Objekt der generischen Klasse List verwalten beliebig viele linear angeordnete Objekte vom Typ ContentType. Auf hoechstens ein Listenobjekt, aktuellesObjekt genannt, kann jeweils zugegriffen werden.<br /> Wenn eine Liste leer ist, vollstaendig durchlaufen wurde oder das aktuelle Objekt am Ende der Liste geloescht wurde, gibt es kein aktuelles Objekt.<br /> Das erste oder das letzte Objekt einer Liste koennen durch einen Auftrag zum aktuellen Objekt gemacht werden. Ausserdem kann das dem aktuellen Objekt folgende Listenobjekt zum neuen aktuellen Objekt werden. <br /> Das aktuelle Objekt kann gelesen, veraendert oder geloescht werden. Ausserdem kann vor dem aktuellen Objekt ein Listenobjekt eingefuegt werden.`,
        "en": "Generic class List<ContentType>",
    })

    static listClassConstructorComment = () => lm({
        "de": "Eine leere Liste wird erzeugt.",
        "en": "Creates an empty list.",
    })

    static listClassIsEmptyComment = () => lm({
        "de": "Die Anfrage liefert den Wert true, wenn die Liste keine Objekte enthaelt, sonst liefert sie den Wert false.",
        "en": "Returns true if and only if this list contains no objects.",
    })

    static listClassHasAccessComment = () => lm({
        "de": "Die Anfrage liefert den Wert true, wenn es ein aktuelles Objekt gibt, sonst liefert sie den Wert false.",
        "en": "Returns true if and only there is a 'current object'.",
    })

    static listClassNextComment = () => lm({
        "de": "Falls die Liste nicht leer ist, es ein aktuelles Objekt gibt und dieses nicht das letzte Objekt der Liste ist, wird das dem aktuellen Objekt in der Liste folgende Objekt zum aktuellen Objekt, andernfalls gibt es nach Ausfuehrung des Auftrags kein aktuelles Objekt, d.h. hasAccess() liefert den Wert false.",
        "en": "Makes 'current object' point to next object in list. If end of list is reached then there's no current object anymore.",
    })



    
}