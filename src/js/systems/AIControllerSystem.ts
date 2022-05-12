import {System} from "../libs/ecs/System";
import Graphics, {getNameGraphics, GraphicsType} from "../components/Graphics";
import Apple, {getNameApple} from "../components/Apple";
import Application, {getNameApplication} from "../components/Application";
import Snake, {getNameSnake} from "../components/Snake";
import Player, {getNamePlayer} from "../components/Player";
import Pause, {getNamePause} from "../components/Pause";
import GameOver, {getNameGameOver} from "../components/GameOver";

interface Case {
  type: GraphicsType,
  x: number,
  y: number,
  width: number,
  height: number
}

export default class AIControllerSystem extends System {
  private cases: Array<Array<Case>> = Array<Array<Case>>();

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
        console.log(caseElement.type, caseElement.x, caseElement.y);
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

      const keysEvent = [player.keyEventLeft, player.keyEventRight, player.keyEventUp, player.keyEventDown];

      document.dispatchEvent(new KeyboardEvent('keydown',  {'key': keysEvent[Math.floor(Math.random() * keysEvent.length)]}));
    }
  }
}
