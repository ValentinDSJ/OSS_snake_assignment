import * as PIXI from "pixi.js";
import Graphics, {getNameGraphics} from "../components/Graphics";
import EventComponent, {getNameEvent} from "../components/Event";
import Game from "../Game";
import {SceneType} from "../utils/SceneType";
import HTML, {getNameHTML} from "../components/HTML";
import EntityManager from "../libs/ecs/EntityManager";
import ComponentManager from "../libs/ecs/ComponentManager";

export default class RankingPrefabs {

    static createRankingHTML(): Array<Component> {
        let components = Array<Component>();
        let events = new Map;

        events.set(".button-back button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
            Game.nextScene = SceneType.MENU;
            document.querySelector('main')?.classList.remove('ranking');
        });

        components.push(<HTML>{
            name: getNameHTML(),
            element: 'body main .ranking-scene',
            eventsOnClick: events
        });
        return components;
    }
}