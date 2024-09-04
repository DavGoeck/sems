import type {Entity} from "@/Entity";

export class Output {

    private readonly ui : Entity;
    private readonly output : Entity;

    constructor(private identity : Entity) {
        this.output = this.identity.appA.simple_createText('');
        this.ui = this.identity.appA.simple_createTextWithList('output', this.output, this.identity.appA.simple_createButton('hide output', async () => {
            await this.ui.setHidden(true);
        }));
        this.ui.hidden = true;
    }

    async set(string : string) {
        await this.output.setText(string);
        this.ui.setHidden(false);
    }

    getUi() : Entity {
        return this.ui;
    }

}