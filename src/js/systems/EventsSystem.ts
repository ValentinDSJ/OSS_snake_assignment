import {System} from "../libs/ecs/System";
import Application, {getNameApplication} from "../components/Application";
import * as PIXI from "pixi.js";
import Graphics, {getNameGraphics} from "../components/Graphics";
import EventComponent, {getNameEvent} from "../components/Event";

export default class EventsSystem extends System {
    awake() {
    }

    start() {
        const events = this.componentManager.getComponentsByType(getNameEvent());

        events.map((e: EventComponent) => {
            let graphics = this.entityManager.getComponentsByType(e.idEntity, getNameGraphics());

            graphics.map((g: Graphics) => {
                g.graphics.interactive = true;
                g.graphics.buttonMode = true;
                g.graphics.on(e.eventName, () => {
                    e.fct(e.idEntity, this.entityManager, this.componentManager);
                })
            });
        });
    }

    update(delta: number) {}

    stop() {}

    tearDown() {
        const app = this.componentManager.getComponentByType(getNameApplication()) as Application;
        const graphics = this.componentManager.getComponentsByType(getNameGraphics());

        graphics.map((c: Graphics) => {
            app.app.stage.removeChild(c.graphics);
        });
    }
}