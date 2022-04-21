import * as PIXI from "pixi.js";
import snakeHead from "../../../assets/sprites/snake.png";
import EventComponent, { getNameEvent } from "../components/Event";
import Graphics, { getNameGraphics } from "../components/Graphics";
import Sprite, { getNameSprite } from "../components/Sprite";
import Velocity, { getNameVelocity } from "../components/Velocity";
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

    // TODO should be middle of screen
    snake.x = 500;
    snake.y = 300;

    snake.width = 100;
    snake.height = 100;

    snake.angle = 180;

    components.push(<Sprite>{
      name: getNameSprite(),
      sprite: snake,
    });
    components.push(<Velocity>{
      name: getNameVelocity(),
      x: 0,
      y: -2,
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
