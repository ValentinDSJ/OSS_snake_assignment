import * as PIXI from "pixi.js";
import Sprite, {getNameSprite} from "../components/Sprite";
import Graphics, {getNameGraphics} from "../components/Graphics";
import EventComponent, {getNameEvent} from "../components/Event";
import Game from "../Game";
import {SceneType} from "../utils/SceneType";

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
}