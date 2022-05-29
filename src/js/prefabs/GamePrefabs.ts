import * as PIXI from "pixi.js";
import appleSprite from "../../../assets/sprites/food.png";
import snakeBody from "../../../assets/sprites/nibbler_snake_core.png";
import snakeHead from "../../../assets/sprites/nibbler_snake_head.png";
import Graphics, {
  getNameGraphics,
  GraphicsType,
} from "../components/Graphics";
import Velocity, { getNameVelocity } from "../components/Velocity";
import Game from "../Game";
import { SceneType } from "../utils/SceneType";
import EntityManager from "../libs/ecs/EntityManager";
import ComponentManager from "../libs/ecs/ComponentManager";
import HTML, { getNameHTML } from "../components/HTML";
import GameOver, { getNameGameOver } from "../components/GameOver";
import Player, { getNamePlayer } from "../components/Player";
import Pause, { getNamePause } from "../components/Pause";
import Snake, { Direction, getNameSnake } from "../components/Snake";
import Application from "../components/Application";
import Save, { getNameSave } from "../components/Save";
import { SnakeSaved } from "../utils/GameSaved";
import Apple, { getNameApple } from "../components/Apple";
import Restart, { getNameRestart } from "../components/Restart";
import GameOverSystem from "../systems/GameOverSystem";
import Board, { getNameBoard } from "../components/Board";
import Position from "../components/Position";

export default class GamePrefabs {
  static createHTMLElement(): Array<Component> {
    let components = Array<Component>();
    let events = new Map();

    events.set(
      ".instructions .labels",
      (idEntity: number, em: EntityManager, cm: ComponentManager) => {
        const element = document.querySelector(".instructions");
        if (element?.classList.contains("close")) {
          element.classList.remove("close");
        } else {
          element?.classList.add("close");
        }
      }
    );

    components.push(<HTML>{
      name: getNameHTML(),
      onReady: (idEntity, em: EntityManager, cm: ComponentManager) => {
        document.querySelector("main")?.classList.add("game");
      },
      element: "body main .game-scene",
      eventsOnClick: events,
    });
    return components;
  }

  static createHead(
    app: Application,
    corner: "top-left" | "middle" | "bottom-right"
  ): Array<Component> {
    let components = Array<Component>();

    const snake = PIXI.Sprite.from(snakeHead);

    snake.width = app.blockSizeX;
    snake.height = app.blockSizeY;

    if (corner === "middle") {
      snake.x = app.blockSizeX * 20 + snake.width / 2;
      snake.y = app.blockSizeY * 20 + snake.height / 2;
      snake.angle = 0;
      components.push(<Graphics>{
        name: getNameGraphics(),
        sprite: snake,
        type: GraphicsType.SNAKE_HEAD,
        posInBoard: <Position>{ x: 20, y: 20 },
        lastPosInBoard: <Position>{ x: 20, y: 19 },
      });
      components.push(<Velocity>{
        name: getNameVelocity(),
        x: 0,
        y: -2,
        speed: 2,
        skip: 0,
      });
      components.push(<Snake>{
        name: getNameSnake(),
        direction: Direction.UP,
        angles: [],
        isInit: false,
        lastDirection: Direction.UP,
      });
    } else if (corner === "top-left") {
      snake.x = app.blockSizeX * 1 + snake.width / 2;
      snake.y = app.blockSizeY * 4 + snake.height / 2;
      snake.angle = 90;
      components.push(<Graphics>{
        name: getNameGraphics(),
        sprite: snake,
        type: GraphicsType.SNAKE_HEAD,
        posInBoard: <Position>{
          x: app.blockSizeX + 10,
          y: app.blockSizeX + 10,
        },
        lastPosInBoard: <Position>{
          x: app.blockSizeX + 10,
          y: app.blockSizeX + 9,
        },
      });
      components.push(<Velocity>{
        name: getNameVelocity(),
        x: 0,
        y: 2,
        speed: 2,
        skip: 0,
      });
      components.push(<Snake>{
        name: getNameSnake(),
        direction: Direction.DOWN,
        angles: [],
        isInit: false,
        lastDirection: Direction.DOWN,
      });
    } else if (corner === "bottom-right") {
      snake.x = app.blockSizeX * 80 + snake.width / 2;
      snake.y = app.blockSizeY * 37 + snake.height / 2;
      snake.angle = 0;
      components.push(<Graphics>{
        name: getNameGraphics(),
        sprite: snake,
        type: GraphicsType.SNAKE_HEAD,
        posInBoard: <Position>{
          x: app.blockSizeX * 20 - 10,
          y: app.blockSizeX * 20 - 10,
        },
        lastPosInBoard: <Position>{
          x: app.blockSizeX * 20 - 10,
          y: app.blockSizeX * 20 - 9,
        },
      });
      components.push(<Velocity>{
        name: getNameVelocity(),
        x: 0,
        y: -2,
        speed: 2,
        skip: 0,
      });
      components.push(<Snake>{
        name: getNameSnake(),
        direction: Direction.UP,
        angles: [],
        isInit: false,
        lastDirection: Direction.UP,
      });
    }
    snake.angle = 0;
    snake.anchor.set(0.5);

    return components;
  }

  static createBody(
    app: Application,
    corner: "top-left" | "middle" | "bottom-right",
    tail: Graphics,
    velocity: Velocity
  ): Array<Component> {
    let components = Array<Component>();

    const snake = PIXI.Sprite.from(snakeBody);

    snake.x = tail.sprite!.x;
    switch (corner) {
      case "bottom-right":
        snake.y = tail.sprite!.y + tail.sprite!.height;
        break;
      case "middle":
        snake.y = tail.sprite!.y + tail.sprite!.height;
        break;
      case "top-left":
        snake.y = tail.sprite!.y - tail.sprite!.height;
        break;
    }
    // snake.y = tail.sprite!.y + tail.sprite!.height;

    snake.width = app.blockSizeX;
    snake.height = app.blockSizeY;

    snake.anchor.set(0.5);
    snake.angle = tail.sprite!.angle;

    components.push(<Graphics>{
      name: getNameGraphics(),
      sprite: snake,
      type: GraphicsType.SNAKE,
      posInBoard: <Position>{ x: tail.posInBoard.x, y: tail.posInBoard.y + 1 },
      lastPosInBoard: <Position>{
        x: tail.posInBoard.x,
        y: tail.posInBoard.y + 1,
      },
    });
    components.push(<Velocity>{
      name: getNameVelocity(),
      x: velocity.x,
      y: velocity.y,
      speed: velocity.speed,
      skip: 0,
    });
    components.push(<Snake>{
      name: getNameSnake(),
      direction: corner === "top-left" ? Direction.DOWN : Direction.UP,
      angles: [],
      lastDirection: corner === "top-left" ? Direction.DOWN : Direction.UP,
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

    snake.anchor.set(0.5);
    snake.angle = tail.sprite!.angle;

    console.log("Create dynamic body :", tail.posInBoard, tail.lastPosInBoard);
    components.push(<Graphics>{
      name: getNameGraphics(),
      sprite: snake,
      type: GraphicsType.SNAKE,
      isInit: false,
      posInBoard: <Position>{ x: tail.posInBoard.x, y: tail.posInBoard.y },
      lastPosInBoard: <Position>{
        x: tail.lastPosInBoard.x,
        y: tail.lastPosInBoard.y,
      },
    });
    components.push(<Velocity>{
      name: getNameVelocity(),
      x: 0,
      y: 0,
      speed: velocity.speed,
      skip: 0,
    });
    components.push(<Snake>{
      name: getNameSnake(),
      direction: dependsOn.direction,
      angles: [],
      dependsOn: dependsOn,
      lastDirection: dependsOn.direction,
    });
    return components;
  }

  static createApple(
    app: Application,
    blockSizeX: number,
    blockSizeY: number,
    screenWidth: number,
    screenHeight: number,
    nbBlocks: number
  ): Array<Component> {
    let components = Array<Component>();
    let x = Math.floor(Math.random() * (app.nbBlocksWithWallX - 2)) + 1;
    let y = Math.floor(Math.random() * (app.nbBlocksWithWallY - 2)) + 1;

    const apple = PIXI.Sprite.from(appleSprite);
    apple.x = x * blockSizeX;
    apple.y = y * blockSizeY;
    apple.width = app.blockSizeX;
    apple.height = app.blockSizeY;

    components.push(<Graphics>{
      name: getNameGraphics(),
      sprite: apple,
      type: GraphicsType.APPLE,
      posInBoard: <Position>{ x: x, y: y },
      lastPosInBoard: <Position>{ x: x, y: y },
    });
    components.push(<Apple>{
      name: getNameApple(),
      isAte: false,
    });
    return components;
  }

  static createSavedApple(
    blockSizeX: number,
    blockSizeY: number,
    x: number,
    y: number,
    isAte: boolean
  ): Array<Component> {
    let components = Array<Component>();

    const apple = PIXI.Sprite.from(appleSprite);
    apple.x = x;
    apple.y = y;
    apple.width = blockSizeX;
    apple.height = blockSizeY;

    components.push(<Graphics>{
      name: getNameGraphics(),
      sprite: apple,
      type: GraphicsType.APPLE,
      posInBoard: <Position>{ x: x, y: y },
      lastPosInBoard: <Position>{ x: x, y: y },
    });
    components.push(<Apple>{
      name: getNameApple(),
      isAte: isAte,
    });
    return components;
  }

  static createSavedSnake(
    savedSnake: SnakeSaved,
    blockSizeX: number,
    blockSizeY: number
  ): Array<Component> {
    let components = Array<Component>();

    const snake = PIXI.Sprite.from(
      savedSnake.type == GraphicsType.SNAKE_HEAD ? snakeHead : snakeBody
    );

    snake.x = savedSnake.x;
    snake.y = savedSnake.y;

    snake.width = blockSizeX;
    snake.height = blockSizeY;

    // snake.x += snake.width / 2;
    // snake.y += snake.height / 2;

    snake.angle = 0;
    snake.anchor.set(0.5);

    components.push(<Graphics>{
      name: getNameGraphics(),
      sprite: snake,
      type: savedSnake.type,
      posInBoard: <Position>{ x: 0, y: 0 },
      lastPosInBoard: <Position>{ x: 0, y: 0 },
    });
    components.push(<Velocity>{
      name: getNameVelocity(),
      x: savedSnake.velocity.x,
      y: savedSnake.velocity.y,
      speed: savedSnake.velocity.speed,
      skip: savedSnake.velocity.skip,
    });
    components.push(<Snake>{
      name: getNameSnake(),
      direction: savedSnake.direction,
      angles: savedSnake.angles,
      isInit: savedSnake.isInit,
      lastDirection: savedSnake.direction,
    });
    return components;
  }

  static createBoard(app: Application, x: number, y: number): Array<Component> {
    let components = Array<Component>();

    let moduloColor = 1;
    for (let i = 0; i < app.nbBlocksWithWallX; i++) {
      for (let j = 0; j < app.nbBlocksWithWallY; j++) {
        if (
          i == 0 ||
          j == 0 ||
          i == app.nbBlocksWithWallX - 1 ||
          j == app.nbBlocksWithWallY - 1
        ) {
          const graphics = new PIXI.Graphics();

          graphics.beginFill(0xa98467);
          graphics.drawRect(
            i * app.blockSizeX,
            j * app.blockSizeY,
            app.blockSizeX,
            app.blockSizeY
          );
          graphics.endFill();

          components.push(<Graphics>{
            name: getNameGraphics(),
            graphics: graphics,
            type: GraphicsType.WALL,
          });
          continue;
        }
        const graphics = new PIXI.Graphics();

        if (moduloColor % 2) {
          graphics.beginFill(0xdde5b6);
        } else {
          graphics.beginFill(0xadc178);
        }
        graphics.drawRect(
          i * app.blockSizeX,
          j * app.blockSizeY,
          app.blockSizeX,
          app.blockSizeY
        );
        graphics.endFill();

        components.push(<Graphics>{
          name: getNameGraphics(),
          graphics: graphics,
          type: GraphicsType.GRASS,
        });
        moduloColor++;
      }
      moduloColor++;
    }
    components.push(<Board>{
      name: getNameBoard(),
    });
    return components;
  }

  static createGameOver(saveScore: boolean = true): Array<Component> {
    let components = Array<Component>();
    let events = new Map();

    let gameOver = components.push(<GameOver>{
      name: getNameGameOver(),
      over: false,
      exit: false,
      scoreSaved: false,
      saveScore: saveScore,
    });
    events.set(
      ".game-over .restart-button",
      (idEntity: number, em: EntityManager, cm: ComponentManager) => {
        const restart = cm.getComponentByType(getNameRestart()) as Restart;
        restart.click = true;

        if (saveScore) {
          GameOverSystem.saveLatestScoreIfExist();
        }
      }
    );

    events.set(
      ".game-over .exit-button",
      (idEntity: number, em: EntityManager, cm: ComponentManager) => {
        let gameOver = cm.getComponentByType(getNameGameOver()) as GameOver;
        const element = document.querySelector("body main");
        const pauseElement = document.querySelector(
          "body main .game-scene .game-over"
        );

        gameOver.exit = true;
        pauseElement?.classList.add("hidden");
        element?.classList.remove("game");
        setTimeout(function () {
          Game.nextScene = SceneType.MENU;
        }, 500);
      }
    );

    components.push(<HTML>{
      name: getNameHTML(),
      element: "body main .game-scene",
      eventsOnClick: events,
    });
    return components;
  }

  static createPlayer(
    head: number,
    body: Array<number>,
    score?: number,
    playerNb: number = 0
  ): Array<Component> {
    let components = Array<Component>();

    components.push(<Player>{
      name: getNamePlayer(),
      score: score ?? 0,
      keyEventRight: playerNb === 0 ? "ArrowRight" : "d",
      keyEventLeft: playerNb === 0 ? "ArrowLeft" : "a",
      keyEventDown: playerNb === 0 ? "ArrowDown" : "s",
      keyEventUp: playerNb === 0 ? "ArrowUp" : "w",
      head: head,
      body: body,
    });
    return components;
  }

  static createPause(): Array<Component> {
    let components = Array<Component>();
    let events = new Map();

    events.set(
      ".pause .resume-button",
      (idEntity: number, em: EntityManager, cm: ComponentManager) => {
        const element = document.querySelector("body main .game-scene .pause");
        const pause = cm.getComponentByType(getNamePause()) as Pause;

        if (pause) {
          pause.isPaused = false;
        }

        element?.classList.add("hidden");
      }
    );

    events.set(
      ".pause .exit-button",
      (idEntity: number, em: EntityManager, cm: ComponentManager) => {
        const element = document.querySelector("body main");
        const pauseElement = document.querySelector(
          "body main .game-scene .pause"
        );

        pauseElement?.classList.add("hidden");
        element?.classList.remove("game");
        setTimeout(function () {
          Game.nextScene = SceneType.MENU;
        }, 500);
      }
    );

    events.set(
      ".pause .restart-button",
      (idEntity: number, em: EntityManager, cm: ComponentManager) => {
        const element = document.querySelector("body main .game-scene .pause");
        const pause = cm.getComponentByType(getNamePause()) as Pause;

        if (pause) {
          pause.isPaused = false;
        }

        element?.classList.add("hidden");

        const restart = cm.getComponentByType(getNameRestart()) as Restart;

        restart.click = true;
      }
    );

    events.set(
      ".pause .save-button",
      (idEntity: number, em: EntityManager, cm: ComponentManager) => {
        const save = cm.getComponentByType(getNameSave()) as Save;

        save.click = true;
      }
    );
    components.push(<HTML>{
      name: getNameHTML(),
      onReady: (idEntity, em: EntityManager, cm: ComponentManager) => {
        document.querySelector("main")?.classList.add("game");
      },
      element: "body main .game-scene",
      eventsOnClick: events,
    });
    components.push(<Pause>{
      name: getNamePause(),
      isPaused: false,
    });
    components.push(<Save>{
      name: getNameSave(),
      click: false,
    });
    components.push(<Restart>{
      name: getNameRestart(),
      click: false,
    });
    return components;
  }
}
