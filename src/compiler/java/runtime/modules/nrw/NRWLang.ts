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

    static listClassToFirstComment = () => lm({
        "de": `Falls die Liste nicht leer ist, wird das erste Objekt der Liste aktuelles Objekt. Ist die Liste leer, geschieht nichts.`,
        "en": `If this list is not empty, then first object gets 'current object'. Otherwise nothing happens.`,
    })

    static listClassToLastComment = () => lm({
        "de": `Falls die Liste nicht leer ist, wird das letzte Objekt der Liste aktuelles Objekt. Ist die Liste leer, geschieht nichts.`,
        "en": `If this list is not empty, then last object gets 'current object'. Otherwise nothing happens.`,
    })

    static listClassGetContentComment = () => lm({
        "de": `Falls es ein aktuelles Objekt gibt (hasAccess() == true), wird das aktuelle Objekt zurueckgegeben, andernfalls (hasAccess() == false) gibt die Anfrage den Wert null zurueck.`,
        "en": `If there is a current object (that is: hasAccess() == true), then this object is returned, otherwise null is returned.`,
    })

    static listClassSetContentComment = () => lm({
        "de": `Falls es ein aktuelles Objekt gibt (hasAccess() == true) und pContent ungleich null ist, wird das aktuelle Objekt durch pContent ersetzt. Sonst geschieht nichts.`,
        "en": `If there is a current object (that is: hasAccess() == true) and pContent != null, then current object gets replaced by pContent.`,
    })

    static listClassInsertComment = () => lm({
        "de": `Falls es ein aktuelles Objekt gibt (hasAccess() == true), und pContent != null ist, wird ein neues Objekt vor dem aktuellen Objekt in die Liste eingefuegt. Das aktuelle Objekt bleibt unveraendert. <br /> Wenn die Liste leer ist, wird pContent in die Liste eingefuegt und es gibt weiterhin kein aktuelles Objekt (hasAccess() == false). <br /> Falls es kein aktuelles Objekt gibt (hasAccess() == false) und die Liste nicht leer ist oder pContent gleich null ist, geschieht nichts.`,
        "en": `If there is a current object (that is: hasAccess() == true) and pContent != null then given pContent is inserted before current objecte.`,
    })

    static listClassAppendComment = () => lm({
        "de": `Falls pContent gleich null ist, geschieht nichts.<br /> Ansonsten wird ein neues Objekt pContent am Ende der Liste eingefuegt. Das aktuelle Objekt bleibt unveraendert. <br /> Wenn die Liste leer ist, wird das Objekt pContent in die Liste eingefuegt und es gibt weiterhin kein aktuelles Objekt (hasAccess() == false).`,
        "en": `If pContent == null then nothing happens. Otherwise pContent is added at the end of the list. Current object is not changed.`,
    })

    static listClassConcatComment = () => lm({
        "de": `Falls es sich bei der Liste und pList um dasselbe Objekt handelt, pList null oder eine leere Liste ist, geschieht nichts.<br /> Ansonsten wird die Liste pList an die aktuelle Liste angehaengt. Anschliessend wird pList eine leere Liste. Das aktuelle Objekt bleibt unveraendert. Insbesondere bleibt hasAccess identisch.`,
        "en": `If pList == this list, pList == null or pList is empty then nothing happens. Otherwise pList is concatenated to this list and then emptied.`,
    })

    static listClassRemoveComment = () => lm({
        "de": `Wenn die Liste leer ist oder es kein aktuelles Objekt gibt (hasAccess() == false), geschieht nichts.<br /> Falls es ein aktuelles Objekt gibt (hasAccess() == true), wird das aktuelle Objekt geloescht und das Objekt hinter dem geloeschten Objekt wird zum aktuellen Objekt. <br /> Wird das Objekt, das am Ende der Liste steht, geloescht, gibt es kein aktuelles Objekt mehr.`,
        "en": `If list is empty or there is no 'current object' (hasAccess() == false), then nothing happens. Otherwise the current object gets removed and the next object is the new current object. If the object removed was last in the list, then there won't be any current object.`,
    })

    static listClassGetPreviousComment = () => lm({
        "de": `Liefert den Vorgaengerknoten des Knotens pNode. Ist die Liste leer, pNode == null, pNode nicht in der Liste oder pNode der erste Knoten der Liste, wird null zurueckgegeben.`,
        "en": ``,
    })

    static queueClassComment = () => lm({
        "de": `Objekte der generischen Klasse Queue (Warteschlange) verwalten beliebige Objekte vom Typ ContentType nach dem First-In-First-Out-Prinzip, d.h., das zuerst abgelegte Objekt wird als erstes wieder entnommen. Alle Methoden haben eine konstante Laufzeit, unabhaengig von der Anzahl der verwalteten Objekte.`,
        "en": `Implementation of a queue. Elements can be accessed according to fifo systematic (first in - first out).`,
    })

    static queueClassConstructorComment = () => lm({
        "de": `Eine leere Schlange wird erzeugt.  Objekte, die in dieser Schlange verwaltet werden, muessen vom Typ ContentType sein.`,
        "en": `Creates an empty queue.`,
    })

    static queueClassIsEmptyComment = () => lm({
        "de": "Die Anfrage liefert den Wert true, wenn die Queue keine Objekte enthaelt, sonst liefert sie den Wert false.",
        "en": "Returns true if and only if this queue contains no objects.",
    })

    // static listClassConcatComment = () => lm({
    // "de": ``,
    // "en": ``,
    // })



}