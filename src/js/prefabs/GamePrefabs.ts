import * as PIXI from "pixi.js";
import appleSprite from "../../../assets/sprites/food.png";
import snakeBody from "../../../assets/sprites/nibbler_snake_core.png";
import snakeHead from "../../../assets/sprites/nibbler_snake_head.png";
import Graphics, {getNameGraphics, GraphicsType} from "../components/Graphics";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Game from "../Game";
import {SceneType} from "../utils/SceneType";
import EntityManager from "../libs/ecs/EntityManager";
import ComponentManager from "../libs/ecs/ComponentManager";
import HTML, {getNameHTML} from "../components/HTML";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Player, {getNamePlayer} from "../components/Player";
import Pause, {getNamePause} from "../components/Pause";
import Snake, {Direction, getNameSnake} from "../components/Snake";
import Apple, {getNameApple} from "../components/Apple";
import Application from "../components/Application";

export default class GamePrefabs {
  static createHTMLElement(): Array<Component> {
    let components = Array<Component>();
    let events = new Map;

    events.set(".instructions .labels", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
      const element = document.querySelector('.instructions');
      if (element?.classList.contains('close')) {
        element.classList.remove('close');
      } else {
        element?.classList.add('close');
      }
    });

    components.push(<HTML>{
      name: getNameHTML(),
      onReady: (idEntity, em: EntityManager, cm: ComponentManager) => {
        document.querySelector('main')?.classList.add('game');
      },
      element: 'body main .game-scene',
      eventsOnClick: events
    });
    return components;
  }

  static createHead(
      screenWidth: number,
      screenHeight: number,
  ): Array<Component> {
    let components = Array<Component>();

    const snake = PIXI.Sprite.from(snakeHead);

    snake.x = screenWidth / 40 * 20;
    snake.y = screenHeight / 40 * 20;

    snake.width = screenWidth / 40;
    snake.height = screenHeight / 40;

    // snake.x += snake.width / 2;
    // snake.y += snake.height / 2;


    snake.angle = 0;
    // snake.anchor.set(0.5);

    components.push(<Graphics>{
      name: getNameGraphics(),
      sprite: snake,
      type: GraphicsType.SNAKE_HEAD
    });
    components.push(<Velocity>{
      name: getNameVelocity(),
      x: 0,
      y: -2,
      speed: 2,
      skip: 0
    });
    components.push(<Snake>{
      name: getNameSnake(),
      direction: Direction.UP,
      angles: [],
      isInit: true
    });
    return components;
  }

  static createBody(
      screenWidth: number,
      screenHeight: number,
      currentSize: number,
      tail: Graphics,
      velocity: Velocity
  ): Array<Component> {
    let components = Array<Component>();

    const snake = PIXI.Sprite.from(snakeBody);

    snake.x = tail.sprite!.x;
    snake.y = tail.sprite!.y + tail.sprite!.height;

    snake.width = screenWidth / 40;
    snake.height = screenHeight / 40;

    // snake.anchor.set(0.5);
    snake.angle = tail.sprite!.angle;

    components.push(<Graphics>{
      name: getNameGraphics(),
      sprite: snake,
      type: GraphicsType.SNAKE
    });
    components.push(<Velocity>{
      name: getNameVelocity(),
      x: velocity.x,
      y: velocity.y,
      speed: velocity.speed,
      skip: 0
    });
    components.push(<Snake>{
      name: getNameSnake(),
      direction: Direction.UP,
      angles: []
    });
    return components;
  }

  static createDynamicBody(
      app: Application,
      tail: Graphics,
      velocity: Velocity,
      dependsOn: Snake
  ): Array<Component> {
    let components = Array<Component>();

    const snake = PIXI.Sprite.from(snakeBody);

    snake.x = tail.sprite!.x;
    snake.y = tail.sprite!.y;

    snake.width = app.blockSizeX;
    snake.height = app.blockSizeY;

    // snake.anchor.set(0.5);
    snake.angle = tail.sprite!.angle;

    components.push(<Graphics>{
      name: getNameGraphics(),
      sprite: snake,
      type: GraphicsType.SNAKE,
      isInit: false
    });
    components.push(<Velocity>{
      name: getNameVelocity(),
      x: 0,
      y: 0,
      speed: velocity.speed,
      skip: 0
    });
    components.push(<Snake>{
      name: getNameSnake(),
      direction: Direction.UP,
      angles: [],
      dependsOn: dependsOn
    });
    return components;
  }

  static createApple(blockSizeX: number, blockSizeY: number, screenWidth: number, screenHeight: number, nbBlocks: number): Array<Component> {
    let components = Array<Component>();

    const apple = PIXI.Sprite.from(appleSprite);
    apple.x = (Math.floor(Math.random() * (nbBlocks - 2)) + 1) * blockSizeX;
    apple.y = (Math.floor(Math.random() * (nbBlocks - 2)) + 1) * blockSizeY;
    apple.width = screenWidth / 40;
    apple.height = screenHeight / 40;

    components.push(<Graphics>{
      name: getNameGraphics(),
      sprite: apple,
      type: GraphicsType.APPLE
    });
    components.push(<Apple>{
      name: getNameApple(),
      isAte: false
    });
    return components;
  }

  static createBoard(x: number, y: number): Array<Component> {
    let components = Array<Component>();

    const blockSize = x / 40;

    let moduloColor = 1;
    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 40; j++) {
        if (i == 0 || j == 0 || i == 39 || j == 39) {
          const graphics = new PIXI.Graphics();

          graphics.beginFill(0xA98467);
          graphics.drawRect(i * blockSize, j * blockSize, blockSize, blockSize);
          graphics.endFill();

          components.push(<Graphics>{
            name: getNameGraphics(),
            graphics: graphics,
            type: GraphicsType.WALL
          });
          continue;
        }
        const graphics = new PIXI.Graphics();

        if (moduloColor % 2) {
          graphics.beginFill(0xDDE5B6);
        } else {
          graphics.beginFill(0xADC178);
        }
        graphics.drawRect(i * blockSize, j * blockSize, blockSize, blockSize);
        graphics.endFill();

        components.push(<Graphics>{
          name: getNameGraphics(),
          graphics: graphics,
          type: GraphicsType.GRASS
        });
        moduloColor++;
      }
      moduloColor++;
    }
    return components;
  }

  static createGameOver(): Array<Component> {
    let components = Array<Component>();
    let events = new Map;

    let gameOver = components.push(<GameOver>{
      name: getNameGameOver(),
      over: false,
      exit: false,
      scoreSaved: false
    });
    events.set(".game-over .restart-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
      const player = cm.getComponentByType(getNameGameOver()) as Player;
      const element = document.querySelector('body main .game-scene .game-over');

      player.score = 0;
      element?.classList.add("hidden");
    });

    events.set(".game-over .exit-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
      let gameOver = cm.getComponentByType(getNameGameOver()) as GameOver;
      const element = document.querySelector('body main');
      const pauseElement = document.querySelector('body main .game-scene .game-over');

      gameOver.exit = true;
      pauseElement?.classList.add("hidden");
      element?.classList.remove("game");
      setTimeout(function () {
        Game.nextScene = SceneType.MENU;
      }, 500);
    });

    components.push(<HTML>{
      name: getNameHTML(),
      element: 'body main .game-scene',
      eventsOnClick: events
    });
    return components;
  }

  static createPlayer(): Array<Component> {
    let components = Array<Component>();

    components.push(<Player>{
      name: getNamePlayer(),
      score: 0
    });
    return components;
  }

  static createPause(): Array<Component> {
    let components = Array<Component>();
    let events = new Map;

    events.set(".pause .resume-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
      const element = document.querySelector('body main .game-scene .pause');
      const pause = cm.getComponentByType(getNamePause()) as Pause;

      if (pause) {
        pause.isPaused = false;
      }

      element?.classList.add("hidden");
    });

    events.set(".pause .exit-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
      const element = document.querySelector('body main');
      const pauseElement = document.querySelector('body main .game-scene .pause');

      pauseElement?.classList.add("hidden");
      element?.classList.remove("game");
      setTimeout(function () {
        Game.nextScene = SceneType.MENU;
      }, 500);
    });

    events.set(".pause .restart-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
      const element = document.querySelector('body main .game-scene .pause');

      element?.classList.add("hidden");
    });

    events.set(".pause .save-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
    });
    components.push(<HTML>{
      name: getNameHTML(),
      onReady: (idEntity, em: EntityManager, cm: ComponentManager) => {
        document.querySelector('main')?.classList.add('game');
      },
      element: 'body main .game-scene',
      eventsOnClick: events
    });
    components.push(<Pause>{
      name: getNamePause(),
      isPaused: false
    });
    return components;
  }
}
