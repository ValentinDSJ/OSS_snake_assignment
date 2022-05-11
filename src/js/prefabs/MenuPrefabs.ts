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

        if (!localStorage.getItem("saveGame")) {
            if (document.querySelector("body main .menu .load-button")) {
                // @ts-ignore
                document.querySelector("body main .menu .load-button")!.disabled = true;
            }
        } else {
            if (document.querySelector("body main .menu .load-button")) {
                // @ts-ignore
                document.querySelector("body main .menu .load-button")!.disabled = false;
            }
        }

        events.set(".play-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
            document.querySelector('main')?.classList.add('game');
            Game.nextScene = SceneType.GAME;
        });

        events.set(".ranking-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
            document.querySelector('main')?.classList.add('ranking');
            Game.nextScene = SceneType.RANKING;
        });

        events.set(".load-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
            document.querySelector('main')?.classList.add('game');
            localStorage.setItem("loadGame", "true");
            Game.nextScene = SceneType.GAME;
        });

        events.set(".dual-play-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
            document.querySelector('main')?.classList.add('game');
            Game.nextScene = SceneType.DUAL_PLAY;
        });

        events.set(".auto-play-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
            document.querySelector('main')?.classList.add('game');
            Game.nextScene = SceneType.AUTO_PLAY;
        });

        events.set(".exit-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
        });

        components.push(<HTML>{
            name: getNameHTML(),
            onReady: (idEntity, em: EntityManager, cm: ComponentManager) => {
                document.querySelector('main')?.classList.remove('game');
            },
            element: 'body main .menu',
            eventsOnClick: events
        });
        return components;
    }
}