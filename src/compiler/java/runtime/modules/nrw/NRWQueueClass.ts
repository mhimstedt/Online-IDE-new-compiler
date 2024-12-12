import { BaseListType } from "../../../../common/BaseType.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { JRC } from "../../../language/JavaRuntimeLibraryComments.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { SystemCollection } from "../../system/collections/SystemCollection.ts";
import { ObjectClassOrNull, StringClass } from "../../system/javalang/ObjectClassStringClass.ts";
import { NRWLang } from "./NRWLang.ts";

class QueueNode {
    next: QueueNode | undefined;

    constructor(public contentObject: ObjectClassOrNull) {

    }
}


export class NRWQueueClass extends SystemCollection implements BaseListType {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Queue<ContentType>", comment: NRWLang.queueClassComment },

        { type: "method", signature: "Queue()", native: NRWQueueClass.prototype._constructor, comment: NRWLang.queueClassConstructorComment },

        { type: "method", signature: "boolean isEmpty()", native: NRWQueueClass.prototype._isEmpty, comment: NRWLang.queueClassIsEmptyComment },

        { type: "method", signature: "String toString()", java: NRWQueueClass.prototype._mj$toString$String$, comment: JRC.objectToStringComment },
        //
    ]

    static type: NonPrimitiveType;

    first: QueueNode = null;
    last: QueueNode = null;
    current: QueueNode = null;


    constructor() {
        super();
    }

    _constructor() {
        return this;
    }

    _isEmpty(): boolean {
        return this.first == null;
    }

    _hasAccess(): boolean {
        return this.current != null;
    }

    _next() {
        if (this._hasAccess()) {
            this.current = this.current.next;
        }
    }

    _toFirst() {
        if (!this._isEmpty()) {
            this.current = this.first;
        }
    }

    _toLast() {
        if (!this._isEmpty()) {
            this.current = this.last;
        }
    }

    _getContent(): ObjectClassOrNull | null {
        if (this._hasAccess()) {
            return this.current.contentObject;
        } else {
            return null;
        }
    }

    _setContent(pContent: ObjectClassOrNull) {
        if (pContent != null && this._hasAccess()) {
            this.current.contentObject = pContent;
        }
    }

    _insert(pContent: ObjectClassOrNull) {
        if (pContent != null) {
            if (this._hasAccess()) {
                const newNode = new QueueNode(pContent);
                if (this.current != this.first) { // Fall: Nicht an erster Stelle einfuegen.
                    const previous = this._getPrevious(this.current);
                    newNode.next = previous.next;
                    previous.next = newNode;
                } else { // Fall: An erster Stelle einfuegen.
                    newNode.next = this.first;
                    this.first = newNode;
                }
            } else {
                if (this._isEmpty()) { // Fall: In leere Queuee einfuegen.

                    // Neuen Knoten erstellen.
                    const newNode = new QueueNode(pContent);

                    this.first = newNode;
                    this.last = newNode;
                }
            }
        }
    }


    _append(pContent: ObjectClassOrNull) {
        if (pContent != null) {
            if (this._isEmpty()) { // Fall: An leere Queuee anfuegen.
                this._insert(pContent);
            } else { // Fall: An nicht-leere Queuee anfuegen.

                // Neuen Knoten erstellen.
                const newNode = new QueueNode(pContent);

                this.last.next = newNode;
                this.last = newNode; // Letzten Knoten aktualisieren.
            }
        }
    }

    _concat(pQueue: NRWQueueClass) {
        if (pQueue != this && pQueue != null && !pQueue._isEmpty()) { // Nichts tun,
            // wenn pQueue und this identisch, pQueue leer oder nicht existent.

            if (this._isEmpty()) { // Fall: An leere Queuee anfuegen.
                this.first = pQueue.first;
                this.last = pQueue.last;
            } else { // Fall: An nicht-leere Queuee anfuegen.
                this.last.next = pQueue.first;
                this.last = pQueue.last;
            }

            // Queuee pQueue loeschen.
            pQueue.first = null;
            pQueue.last = null;
            pQueue.current = null;
        }
    }

    _remove() {
        // Nichts tun, wenn es kein aktuelle Element gibt oder die Queuee leer ist.
        if (this._hasAccess() && !this._isEmpty()) {

            if (this.current == this.first) {
                this.first = this.first.next;
            } else {
                const previous = this._getPrevious(this.current);
                if (this.current == this.last) {
                    this.last = previous;
                }
                previous.next = this.current.next;
            }

            const temp = this.current.next;
            this.current.contentObject = null;
            this.current.next = null
            this.current = temp;

            //Beim Loeschen des letzten Elements last auf null setzen. 
            if (this._isEmpty()) {
                this.last = null;
            }
        }

    }

    _getPrevious(pNode: QueueNode) {
        if (pNode != null && pNode != this.first && !this._isEmpty()) {
            let temp = this.first;
            while (temp != null && temp.next != pNode) {
                temp = temp.next;
            }
            return temp;
        } else {
            return null;
        }
    }


    _mj$toString$String$(t: Thread, callback: CallbackFunction) {
        if (this.first == null) {
            t.s.push("[]");
            if (callback) callback();
            return;
        }
        let element = this.first.contentObject;
        if (typeof element == "object" || Array.isArray(element) || element == null) {
            t._arrayOfObjectsToString(this.getAllElements(), () => {
                t.s.push(new StringClass(t.s.pop()));
                if (callback) callback();
            })
            return;
        } else {
            t.s.push(new StringClass(t._primitiveElementOrArrayToString(this.getAllElements())));
            if (callback) callback();
            return;
        }
    }

    getAllElements(): ObjectClassOrNull[] {
        if(this.first == null) return [];
        const elements: ObjectClassOrNull[] = [];
        let node = this.first;
        while(node != null){
            elements.push(node.contentObject);
            node = node.next;
        }
        return elements;
    }



    getElements(): any[] {
        return this.getAllElements();
    }


}