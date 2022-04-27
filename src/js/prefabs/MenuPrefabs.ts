import * as PIXI from "pixi.js";
import Graphics, {getNameGraphics} from "../components/Graphics";
import EventComponent, {getNameEvent} from "../components/Event";
import Game from "../Game";
import {SceneType} from "../utils/SceneType";
import HTML, {getNameHTML} from "../components/HTML";
import EntityManager from "../libs/ecs/EntityManager";
import ComponentManager from "../libs/ecs/ComponentManager";

export default class MenuPrefabs {
    static createButton(): Array<Component> {
        let components = Array<Component>();
        const graphics = new PIXI.Graphics();

        graphics.beginFill(0xDE3249);
        graphics.drawRect(50, 50, 100, 100);
        graphics.endFill();

        components.push(<Graphics>{
            name: getNameGraphics(),
            graphics: graphics,
        });
        components.push(<EventComponent>{
            name: getNameEvent(),
            eventName: "pointerdown",
            fct: (idEntity, em, cm) => {
                Game.nextScene = SceneType.GAME;
            }
        });
        return components;
    }

    static createMenu(): Array<Component> {
        let components = Array<Component>();
        let events = new Map;

        events.set(".play-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
            Game.nextScene = SceneType.GAME;
        });

        components.push(<HTML>{
            name: getNameHTML(),
            element: 'body main .menu',
            eventsOnClick: events
        });
        return components;
    }
}