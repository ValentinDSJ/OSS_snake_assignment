import * as PIXI from "pixi.js";
import appleSprite from "../../../assets/sprites/food.png";
import snakeBody from "../../../assets/sprites/nibbler_snake_core.png";
import snakeHead from "../../../assets/sprites/nibbler_snake_head.png";
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

    snake.x = 800;
    snake.y = 800;

    snake.anchor.set(0.5);

    snake.width = 50;
    snake.height = 50;

    snake.angle = 0;

    components.push(<Sprite>{
      name: getNameSprite(),
      sprite: snake,
    });
    components.push(<Velocity>{
      name: getNameVelocity(),
      x: 0,
      y: -2,
    });
    return components;
  }

  static createBody(
    currentSize: number,
    tail: Sprite,
    velocity: Velocity
  ): Array<Component> {
    let components = Array<Component>();

    const snake = PIXI.Sprite.from(snakeBody);

    snake.x = tail.sprite.x;
    snake.y = tail.sprite.y + tail.sprite.height;

    snake.anchor.set(0.5);

    snake.width = 50;
    snake.height = 50;

    snake.angle = tail.sprite.angle;

    components.push(<Sprite>{
      name: getNameSprite(),
      sprite: snake,
    });
    components.push(<Velocity>{
      name: getNameVelocity(),
      x: velocity.x,
      y: velocity.y,
    });
    return components;
  }

  static createApple(posX: number, posY: number): Array<Component> {
    let components = Array<Component>();

    const apple = PIXI.Sprite.from(appleSprite);
    apple.x = posX;
    apple.y = posY;
    apple.width = 50;
    apple.height = 50;

    components.push(<Sprite>{
      name: getNameSprite(),
      sprite: apple,
    });
    return components;
  }

  static createBoard(x: number, y: number): Array<Component> {
    let components = Array<Component>();

    // const blockSize = 50 * (y / x) * 1.7;
    const blockSize = 40;

    for (let i = 0; i <= 40; i++) {
      const graphics = new PIXI.Graphics();

      graphics.beginFill(0xff0000);
      graphics.drawRect(i * blockSize, 0, blockSize, blockSize);
      graphics.drawRect(i * blockSize, 40 * blockSize, blockSize, blockSize);
      graphics.endFill();

      components.push(<Graphics>{
        name: getNameGraphics(),
        graphics: graphics,
      });

      for (let j = 0; j <= 40; j++) {
        const graphics = new PIXI.Graphics();

        graphics.beginFill(0xff0000);
        graphics.drawRect(0, j * blockSize, blockSize, blockSize);
        graphics.drawRect(40 * blockSize, j * blockSize, blockSize, blockSize);
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
          graphics.drawRect(i * blockSize, j * blockSize, blockSize, blockSize);
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
