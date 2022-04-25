import * as PIXI from "pixi.js";
import snakeHead from "../../../assets/sprites/snake.png";
import appleSprite from "../../../assets/sprites/food.png";
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
    snake.y = 500;

    snake.anchor.set(0.5);

    snake.width = 50;
    snake.height = 50;

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

  static createApple(posX, posY): Array<Component> {
    let components = Array<Component>();

    const apple = PIXI.Sprite.from(appleSprite);
    apple.x = posX;
    apple.y = posY;
    apple.width = 100;
    apple.height = 100;

    components.push(<Sprite>{
      name: getNameSprite(),
      sprite: apple,
    });
    return components;
  }

  static createBoard(): Array<Component> {
    let components = Array<Component>();

    for (let i = 0; i <= 40; i++) {
      const graphics = new PIXI.Graphics();

      graphics.beginFill(0xff0000);
      graphics.drawRect(i * 25, 0, 25, 25);
      graphics.drawRect(i * 25, 40 * 25, 25, 25);
      graphics.endFill();

      components.push(<Graphics>{
        name: getNameGraphics(),
        graphics: graphics,
      });

      for (let j = 0; j <= 40; j++) {
        const graphics = new PIXI.Graphics();

        graphics.beginFill(0xff0000);
        graphics.drawRect(0, j * 25, 25, 25);
        graphics.drawRect(40 * 25, j * 25, 25, 25);
        graphics.endFill();

        components.push(<Graphics>{
          name: getNameGraphics(),
          graphics: graphics,
        });

        if (i > 0 && i < 40 && j > 0 && j < 40) {
          const graphics = new PIXI.Graphics();

          // if (i % 2) {
          //   graphics.beginFill(j % 2 ? 0x228b22 : 0x32cd32);
          // }
          // if (j % 2) {
          //   graphics.beginFill(i % 2 ? 0x228b22 : 0x32cd32);
          // }
          // if (!(i % 2) && !(j % 2)) {
          //   graphics.beginFill(0x228b22);
          // }
          graphics.beginFill(0x228b22);
          graphics.drawRect(i * 25, j * 25, 25, 25);
          graphics.endFill();

          components.push(<Graphics>{
            name: getNameGraphics(),
            graphics: graphics,
          });
        }
      }
    }
    return components;
  }
}
