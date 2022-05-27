import { System } from "../libs/ecs/System";
import Graphics, { getNameGraphics, GraphicsType } from "../components/Graphics";
import Apple, { getNameApple } from "../components/Apple";
import Application, { getNameApplication } from "../components/Application";
import Snake, { Direction, getNameSnake } from "../components/Snake";
import Player, { getNamePlayer } from "../components/Player";
import Pause, { getNamePause } from "../components/Pause";
import GameOver, { getNameGameOver } from "../components/GameOver";
import Position from "../components/Position";

interface Case {
  type: GraphicsType,
  x: number,
  y: number,
  width: number,
  height: number,
}

enum Move {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export default class AIControllerSystem extends System {
  private cases: Array<Array<Case>> = Array<Array<Case>>();
  private applePos: Position = <Position>{ x: 0, y: 0 };
  private headPos: Position = <Position>{ x: 0, y: 0 };
  private direction: Direction = Direction.UP;

  awake() {
    const application = this.componentManager.getComponentByType(getNameApplication()) as Application;

    for (let i = 0; i < application.nbBlocksWithWall; i++) {
      this.cases.push(Array<Case>(application.nbBlocksWithWall));

      for (let j = 0; j < application.nbBlocksWithWall; j++) {
        this.cases[i][j] = <Case>{
          y: i * application.blockSizeX,
          x: j * application.blockSizeY,
          width: application.blockSizeX,
          height: application.blockSizeY,
          type: GraphicsType.GRASS
        };

        if (i == 0 || j == 0 || i == application.nbBlocksWithWall - 1 || j == application.nbBlocksWithWall - 1) {
          this.cases[i][j].type = GraphicsType.WALL;
        }
      }
    }
  }

  getNewType(caseElement: Case): GraphicsType {
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const apples = this.componentManager.getComponentsByType(getNameApple()) as Array<Apple>;

    for (const apple of apples) {
      const graphic = this.entityManager.getComponentByType(apple.idEntity!, getNameGraphics()) as Graphics;

      if (
        caseElement.x < graphic.sprite!.x + graphic.sprite!.width &&
        caseElement.x + caseElement.width > graphic.sprite!.x &&
        caseElement.y < graphic.sprite!.y + graphic.sprite!.height &&
        caseElement.y + caseElement.height > graphic.sprite!.y
      ) {
        // console.log(caseElement.type, caseElement.x, caseElement.y);
        this.applePos = { x: caseElement.x, y: caseElement.y };
        return graphic.type;
      }
    }

    for (const snake of snakes) {
      const graphic = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;

      let x = graphic.sprite!.x - (graphic.sprite!.width / 2);
      let y = graphic.sprite!.y - (graphic.sprite!.height / 2);
      if (
        caseElement.x < x + graphic.sprite!.width &&
        caseElement.x + caseElement.width > x &&
        caseElement.y < y + graphic.sprite!.height &&
        caseElement.y + caseElement.height > y
      ) {
        if (graphic.type === GraphicsType.SNAKE_HEAD) {
          this.headPos = { x: caseElement.x, y: caseElement.y };
          this.direction = snake.direction;
        }
        return graphic.type;
      }
    }

    return GraphicsType.GRASS;
  }

  updateCases() {
    for (const caseLine of this.cases) {
      for (const caseElement of caseLine) {
        if (caseElement.type == GraphicsType.WALL) {
          continue;
        }
        caseElement.type = this.getNewType(caseElement);
      }
    }
  }

  update(delta: number) {
    const pause = this.componentManager.getComponentByType(getNamePause()) as Pause;
    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;

    if (gameOver?.over || pause?.isPaused) {
      return;
    }

    const players = this.componentManager.getComponentsByType(getNamePlayer()) as Array<Player>;

    this.updateCases();

    for (const player of players) {
      if (!player.isBot)
        continue;

      const horizontalDiff = this.applePos.x - this.headPos.x;
      const verticalDiff = this.applePos.y - this.headPos.y;

      console.log("Horzion: " + horizontalDiff)
      console.log("Vertical: " + verticalDiff)
      console.log("Direction: " + Direction[this.direction])
      if (Math.abs(horizontalDiff) > Math.abs(verticalDiff)) {
        if (horizontalDiff <= 0) {
          document.dispatchEvent(new KeyboardEvent('keydown', { 'key': this.direction !== Direction.RIGHT ? player.keyEventLeft : verticalDiff <= 0 ? player.keyEventUp : player.keyEventDown }));
        } else if (horizontalDiff > 0) {
          document.dispatchEvent(new KeyboardEvent('keydown', { 'key': this.direction !== Direction.LEFT ? player.keyEventRight : verticalDiff <= 0 ? player.keyEventUp : player.keyEventDown }));
        }
      } else if (Math.abs(horizontalDiff) < Math.abs(verticalDiff)) {
        if (verticalDiff <= 0) {
          document.dispatchEvent(new KeyboardEvent('keydown', { 'key': this.direction !== Direction.DOWN ? player.keyEventUp : horizontalDiff <= 0 ? player.keyEventLeft : player.keyEventRight }));
        } else if (verticalDiff > 0) {
          document.dispatchEvent(new KeyboardEvent('keydown', { 'key': this.direction !== Direction.UP ? player.keyEventDown : horizontalDiff <= 0 ? player.keyEventLeft : player.keyEventRight }));
        }
      }
    }
  }
}
