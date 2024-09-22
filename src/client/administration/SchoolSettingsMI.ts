import { UserData } from "../communication/Data";
import { AdminMenuItem } from "./AdminMenuItem";




export class SchoolSettings extends AdminMenuItem {

    getButtonIdentifier(): string {
        return "Schulweite Einstellungen"
    }

    onMenuButtonPressed($mainHeading: JQuery<HTMLElement>, $tableLeft: JQuery<HTMLElement>, $tableRight: JQuery<HTMLElement>, $mainFooter: JQuery<HTMLElement>): void {
        
    }

    destroy() {
    }

    checkPermission(user: UserData): boolean {
        return user.is_schooladmin;
    }

}