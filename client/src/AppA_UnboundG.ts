import {Entity} from "@/Entity";
import {ListA} from "@/ListA";
import {notNullUndefined} from "@/utils";
import {ContainerA} from "@/ContainerA";

// / unbound means that the created object has no container and no name.
export class AppA_UnboundG {
    
    constructor(private entity : Entity) {
    }

    createList(...jsList : Array<Entity>) : Entity {
        let list = this.entity.appA.createEntityWithApp();
        list.listA = new ListA(list, ...jsList);
        return list;
    }

    createText(text: string) : Entity {
        let entity = this.entity.appA.createEntityWithApp();
        entity.text = text;
        return entity;
    }

    createLink(href: string, text?: string) {
        let entity = this.entity.appA.createEntityWithApp();
        entity.link = href;
        entity.text = text;
        return entity;
    }

    createTextWithList(text : string, ...jsList : Array<Entity>) : Entity {
        let entity = this.entity.appA.createEntityWithApp();
        entity.text = text;
        entity.listA = new ListA(entity, ...jsList);
        return entity;
    }

    createCollapsible(text: string, ...jsList : Array<Entity>) {
        let entity = this.createTextWithList(text, ...jsList);
        entity.collapsible = true;
        return entity;
    }

    createButton(label : string, func : Function) : Entity {
        let button = this.entity.appA.createEntityWithApp();
        button.text = label;
        button.action = func;
        return button;
    }

    createFromJson(json: any) : Entity {
        {
            let jsonString = JSON.stringify(json);
            this.entity.logInfo('createFromJson ' + jsonString.substring(0, Math.min(jsonString.length, 20)) + ' ...');
        }
        let entity : Entity = this.entity.appA.createEntityWithApp();
        entity.text = json.text;
        entity.collapsible = json.collapsible;
        entity.link = json.link;
        entity.editable = json.editable;
        if (notNullUndefined(json.list)) {
            entity.listA = new ListA(entity);
            entity.listA.jsList = [];
            for (let current of json.list) {
                if (current instanceof Array) {
                    entity.listA.jsList.push(this.entity.appA.createPath(current));
                } else {
                    entity.listA.jsList.push(this.createFromJson(current));
                }
            }
        }
        if (notNullUndefined(json.objects)) {
            entity.containerA = new ContainerA(entity);
            for (let key of Object.keys(json.objects)) {
                let current : Entity = this.createFromJson(json.objects[key]);
                entity.containerA.mapNameEntity.set(key, current);
                current.name = key;
                current.container = entity;
            }
        }
        return entity;
    }
}