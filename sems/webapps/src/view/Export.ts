import { TextObjectViewController } from "./TextObjectViewController";

export class Export {
    // public static fourDays_safe_html(tovc : TextObjectViewController) : HTMLElement {
        
    // }

    public static getHtmlOfTree_Safe(tovc : TextObjectViewController, level : number) : HTMLElement {
        let htmlElement : HTMLElement;
        htmlElement = document.createElement('div');
        if (level == 0) {
            let p : HTMLParagraphElement = document.createElement('p');
            htmlElement.appendChild(p);
            p.style.fontSize = "2rem";
            p.style.color = "gold";
            p.innerHTML = Export.getTextSafe(tovc);
            if (!tovc.isCollapsed() && !Export.textHasXXXMark(tovc)) {
                htmlElement.appendChild(Export.getHtmlOfDetailUios(tovc, level + 1));
            }
        } else {
            if (level == 1) {
                let p : HTMLParagraphElement = document.createElement('p');
                htmlElement.appendChild(p);
                p.style.fontSize = "1rem";
                p.style.color = "blue";
                p.innerHTML = Export.getTextSafe(tovc);
                if (!tovc.isCollapsed() && !Export.textHasXXXMark(tovc)) {
                    let ul : HTMLUListElement = document.createElement('ul');
                    htmlElement.appendChild(ul);
                    ul.appendChild(Export.getHtmlOfDetailUios(tovc, level + 1));
                }
            } else {
                let li : HTMLLIElement = document.createElement('li');
                htmlElement.appendChild(li);
                li.style.fontSize = "1rem";
                li.style.color = "blue";
                li.innerHTML = Export.getTextSafe(tovc);
                if (!tovc.isCollapsed() && !Export.textHasXXXMark(tovc)) {
                    let ul : HTMLUListElement = document.createElement('ul');
                    htmlElement.appendChild(ul);
                    ul.appendChild(Export.getHtmlOfDetailUios(tovc, level + 1));
                }
            }
        }
        return htmlElement;
    }

    private static getTextSafe(tovc : TextObjectViewController) : string {
        if (Export.textHasXXXMark(tovc)) {
            let text : string = tovc.getText();
            return text.substring(0, text.indexOf('XXX')) + '[pS]';
        } else {
            return tovc.getText();
        }
    }

    private static getHtmlOfDetailUios(tovc : TextObjectViewController, level : number) : HTMLElement {
        let htmlElement : HTMLElement = document.createElement('div');
        let listOfDetailUio = tovc.getListOfDetailUio();
        for (let i = 0; i < listOfDetailUio.length; i++) {
            let detailTovc : TextObjectViewController = TextObjectViewController.map.get(listOfDetailUio[i]);
            htmlElement.appendChild(Export.getHtmlOfTree_Safe(detailTovc, level));
        }
        return htmlElement;
    }

    public static textHasXXXMark(tovc : TextObjectViewController) : boolean {
        return tovc.getText().indexOf('XXX') >= 0;
    }
}