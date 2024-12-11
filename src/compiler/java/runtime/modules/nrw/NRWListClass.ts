import { BaseListType } from "../../../../common/BaseType.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { SystemCollection } from "../../system/collections/SystemCollection.ts";
import { ObjectClassOrNull, StringClass } from "../../system/javalang/ObjectClassStringClass.ts";
import { NRWLang } from "./NRWLang.ts";


export class NRWListClass extends SystemCollection implements BaseListType {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class List<ContentType>", comment: NRWLang.listClassComment },

        { type: "method", signature: "List()", native: NRWListClass.prototype._constructor, comment: NRWLang.listClassConstructorComment },

        // { type: "method", signature: "Iterator<E> iterator()", native: ArrayListClass.prototype._iterator, comment: JRC.arrayListIteratorComment },

        // override toString-method
        { type: "method", signature: "boolean isEmpty()", java: NRWListClass.prototype._isEmpty, comment: NRWLang.listClassIsEmptyComment },
        { type: "method", signature: "boolean hasAccess()", java: NRWListClass.prototype._hasAccess, comment: NRWLang.listClassIsEmptyComment },
        { type: "method", signature: "void next()", java: NRWListClass.prototype._next, comment: NRWLang.listClassNextComment },
        { type: "method", signature: "String toString()", java: NRWListClass.prototype._mj$toString$String$, comment: JRC.objectToStringComment },
        //
    ]

    static type: NonPrimitiveType;

    protected elements: ObjectClassOrNull[] = [];

    protected currentIndex: number | undefined;

    constructor(elements?: ObjectClassOrNull[]) {
        super();
        this.elements = elements || [];
    }

    _constructor() {
        return this;
    }

    _isEmpty(): boolean {
        return this.elements.length == 0;
    }

    _hasAccess(): boolean {
        return typeof this.currentIndex !== "undefined";
    }

    _next() {
        this.currentIndex++;
        if(this.currentIndex >= this.elements.length) this.currentIndex = undefined;
    }

    

    _mj$toString$String$(t: Thread, callback: CallbackFunction) {
        if (this.elements.length == 0) {
            t.s.push("[]");
            if (callback) callback();
            return;
        }
        let element = this.elements[0];
        if (typeof element == "object" || Array.isArray(element) || element == null) {
            t._arrayOfObjectsToString(this.elements, () => {
                t.s.push(new StringClass(t.s.pop()));
                if (callback) callback();
            })
            return;
        } else {
            t.s.push(new StringClass(t._primitiveElementOrArrayToString(this.elements)));
            if (callback) callback();
            return;
        }
    }

    getAllElements(): ObjectClassOrNull[] {
        return this.elements;
    }



    getElements(): any[] {
        return this.elements;
    }


}