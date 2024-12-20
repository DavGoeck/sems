import type {Entity} from "@/Entity";

export class DeepCopyA {

    map : Map<Entity, Entity>;
    objectAndDependencies : Set<Entity>;

    constructor(public entity : Entity) {
    }

    async run() : Promise<Entity> {
        this.objectAndDependencies = await this.entity.getObjectAndDependencies();
        await this.createBoundEmptyEntities();
        for (let object of this.objectAndDependencies) {
            await this.copyToEmptyEntity(object, this.map.get(object));
        }
        return this.map.get(this.entity);
    }

    async createBoundEmptyEntities() {
        this.map = new Map();
        for (let object of this.objectAndDependencies) {
            this.map.set(object, await this.entity.getApp_typed().createBoundEntity());
        }
    }

    async copyToEmptyEntity(object : Entity, emptyEntity : Entity) {
        emptyEntity.text = object.text;
        emptyEntity.collapsible = object.collapsible;
        emptyEntity.link = object.link;
        emptyEntity.editable = object.editable;
        if (object.listA) {
            emptyEntity.installListA();
            for (let listItem of object.listA.jsList) {
                if (listItem.pathA) {
                    emptyEntity.listA.jsList.push(emptyEntity.getPath(this.map.get(await object.resolve(listItem))));
                } else {
                    emptyEntity.listA.jsList.push(listItem);
                }
            }
        }
    }
}