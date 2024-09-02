import type {Identity} from "@/Identity";
import {devtools} from "vue";

export class LogG {
    toConsole: boolean;
    toListOfStrings: boolean;
    listOfStrings: Array<string> = [];

    constructor(private identity : Identity) {
    }

    log(logger : Identity, log : string) {
        if (this.toListOfStrings || this.toConsole) {
            let shortDescription = logger.getShortDescription();
            if (this.toListOfStrings) {
                this.listOfStrings.push(shortDescription + ' /// ' + log);
            }
            if (this.toConsole) { // Note: logging to console could lead to a data leak. You should be careful, when using it.
                if (devtools?.enabled || location?.hostname == 'localhost') {
                    console.log(shortDescription + ' /// ' + log);
                }
            }
        }
    }
}