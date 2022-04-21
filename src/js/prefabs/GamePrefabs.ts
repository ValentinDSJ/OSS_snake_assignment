import * as PIXI from "pixi.js";
import snakeHead from "../../../assets/sprites/snake.png";
import EventComponent, { getNameEvent } from "../components/Event";
import Graphics, { getNameGraphics } from "../components/Graphics";
import Sprite, { getNameSprite } from "../components/Sprite";
import Game from "../Game";
import { SceneType } from "../utils/SceneType";

export default class GamePrefabs {
  static createButton(): Array<Component> {
    let components = Array<Component>();

    const graphics = new PIXI.Graphics();

    graphics.beginFill(0x228b22);
    graphics.drawRect(100, 50, 100, 100);
    graphics.endFill();

    components.push(<Graphics>{
      name: getNameGraphics(),
      graphics: graphics,
    });
    components.push(<EventComponent>{
      name: getNameEvent(),
      eventName: "pointerdown",
      fct: (idEntity, em, cm) => {
        Game.nextScene = SceneType.MENU;
      },
    });
    return components;
  }

  static createHead(): Array<Component> {
    let components = Array<Component>();

    const snake = PIXI.Sprite.from(snakeHead);

    // snake.anchor.set(50);

    snake.anchor.x = 1;
    snake.anchor.y = 1;

    snake.width = 1000;
    snake.height = 1000;

    components.push(<Sprite>{
      name: getNameSprite(),
      sprite: snake,
    });
    // components.push(<EventComponent>{
    //   name: getNameEvent(),
    //   eventName: "pointerdown",
    //   fct: (idEntity, em, cm) => {
    //     Game.nextScene = SceneType.MENU;
    //   },
    // });
    return components;
  }
}
