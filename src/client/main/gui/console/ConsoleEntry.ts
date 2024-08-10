import jQuery from 'jquery';
import { ValueTool } from '../../../../compiler/common/debugger/ValueTool';

export class ConsoleEntry {

    caption: string|JQuery<HTMLElement>; // only used for root elements, e.g. "Local variables"
    // if caption is set then value == null and parent == null

    parent: ConsoleEntry;
    children: ConsoleEntry[];

    canOpen: boolean;
    isOpen: boolean = false;

    identifier: string;
    value: any;

    $consoleEntry: JQuery<HTMLElement>;

    constructor(private isCommand: boolean, caption: string|JQuery<HTMLElement>, value: any, identifier: string, parent: ConsoleEntry, 
        private withBottomBorder: boolean, private color: string = null ) {
        this.caption = caption;
        this.parent = parent;
        if (parent != null) {
            parent.children.push(this);
        }
        this.value = value;

        this.identifier = identifier;

        this.render();
    }

    getLevel(): number {
        return this.parent == null ? 0 : this.parent.getLevel() + 1;
    }

    getIndent(): number {
        // return this.getLevel() * 15;
        return this.getLevel() == 0 ? 0 : 15;
    }

    render() {

        this.$consoleEntry = jQuery('<div>');
        this.$consoleEntry.addClass("jo_consoleEntry");
        this.$consoleEntry.css('margin-left', '' + this.getIndent() + 'px');

        if(this.color != null){
            this.$consoleEntry.css('background-color', this.color);
        }

        if(this.withBottomBorder){
            this.$consoleEntry.addClass('jo_withBorder');
        }

        let $deFirstLine = jQuery('<div class="jo_ceFirstline"></div>');

        this.$consoleEntry.append($deFirstLine);


        if (ValueTool.hasChildren(this.value)) {
            this.canOpen = true;
            this.$consoleEntry.addClass('jo_canOpen');
            this.$consoleEntry.append(jQuery('<div class="jo_ceChildContainer"></div>'));

            this.$consoleEntry.find('.jo_ceFirstline').on('mousedown', (event) => {
                if (this.value != null) {
                    if (this.children == null) {
                        this.onFirstOpening();
                    }
                    this.$consoleEntry.toggleClass('jo_expanded');
                    this.isOpen = !this.isOpen;
                } else {
                    this.children = null;
                }

                event.stopPropagation();

            });

        } else {
            if(this.caption == null && this.getLevel() == 0){
                this.$consoleEntry.addClass('jo_cannotOpen');
            }
        }

        this.renderValue();

    }

    onFirstOpening() {

        this.children = [];

        for(let iv of ValueTool.getChildren(this.value)){
            let de = new ConsoleEntry(false, null, iv.value, iv.identifier, this, false);
            de.render();
            this.$consoleEntry.find('.jo_ceChildContainer').append(de.$consoleEntry);
        }

    }

    renderValue() {

        let $firstLine = this.$consoleEntry.find('.jo_ceFirstline');

        let v = this.value;
        
        if (this.isCommand) {
            if(this.caption != null){
                if(typeof this.caption == "string" ){
                    $firstLine.append(jQuery('<span class="jo_ceCaption">' + this.caption + "</span>"));
                } else {
                    let span = jQuery('<span class="jo_ceCaption"></span>');
                    span.append(this.caption);
                    $firstLine.append(span);
                }
            } else {
                $firstLine.append(jQuery('<span class="jo_ceNoValue">Kein Wert zurückgegeben.</span>'));
            }
            return;
        } else {
            let valueString = ValueTool.renderValue(v);
            
            if(this.identifier != null){
                $firstLine.append(jQuery('<span class="jo_ceIdentifier">' + this.identifier + ":&nbsp;</span>"));
            }
            let $span = jQuery('<span class="jo_ceValue"></span>')
            $span.text(valueString);
            $firstLine.append($span);
        }    }

    detachValue() {
        this.value = undefined;
        this.$consoleEntry.removeClass('jo_canOpen');
        if(this.getLevel() == 0 && this.caption == null){
            this.$consoleEntry.addClass('jo_cannotOpen');
        }
    }

}