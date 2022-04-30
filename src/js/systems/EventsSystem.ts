import Application, {getNameApplication} from "../components/Application";
import EventComponent, {getNameEvent} from "../components/Event";
import Graphics, {getNameGraphics, GraphicsType} from "../components/Graphics";
import {System} from "../libs/ecs/System";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Pause, {getNamePause} from "../components/Pause";
import Snake, {Direction, getNameSnake} from "../components/Snake";

export default class EventsSystem extends System {
  awake() { }

  start() {
    const events = this.componentManager.getComponentsByType(getNameEvent());

    events.map((e) => {
      const event = e as EventComponent;
      let graphics = this.entityManager.getComponentsByType(
        e.idEntity ?? -1,
        getNameGraphics()
      );

      graphics.map((g) => {
        const graphic = g as Graphics;

        if (graphic.graphics) {
          graphic.graphics.interactive = true;
          graphic.graphics.buttonMode = true;
          graphic.graphics.on(event.eventName, () => {
            event.fct(
              event.idEntity ?? -1,
              this.entityManager,
              this.componentManager
            );
          });
        }
      });
    });
  }

  setNextDirectionSnake(direction: Direction, snakeHead: Snake, snakeHeadGraphics: Graphics) {
    const snake = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const application = this.componentManager.getComponentByType("Application") as Application;
    const blockSize = application.blockSizeX;
    let x = Math.floor(snakeHeadGraphics!.sprite!.x / blockSize) * blockSize;
    let y = Math.floor(snakeHeadGraphics!.sprite!.y / blockSize) * blockSize;

    if (snakeHead.direction == Direction.DOWN) {
      y += blockSize;
    } else if (snakeHead.direction == Direction.RIGHT) {
      x += blockSize;
    }

    snakeHead!.angles.push({
      direction: direction,
      x: x,
      y: y
    });
    for (const s of snake) {
      if (s.idEntity == snakeHead!.idEntity)
        continue;
      s.angles.push({
        direction: direction,
        x: x,
        y: y
      });
    }
  }

  update(delta: number) {
    const pause = this.componentManager.getComponentByType(getNamePause()) as Pause;

    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;

    if (gameOver?.over || pause?.isPaused) {
      return;
    }
    this.localDelta += delta;
    document.onkeydown = (e) => {
      const pause = this.componentManager.getComponentByType(getNamePause()) as Pause;

      const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;

      if (gameOver?.over || pause?.isPaused) {
        return;
      }
      const snake = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
      let snakeHead: Snake;
      let snakeHeadGraphics: Graphics;
      let direction;

      for (const s of snake) {
        const graphics = this.entityManager.getComponentsByType(s.idEntity!, getNameGraphics()) as Array<Graphics>;
        let found = false;

        for (const graphic of graphics) {
          if (graphic.type == GraphicsType.SNAKE_HEAD) {
            direction = s.direction;
            found = true;
            snakeHead = s;
            snakeHeadGraphics = graphic;
            break;
          }
        }
        if (found) {
          break;
        }
      }

      if (e.key === "ArrowLeft" && direction !== Direction.RIGHT && direction !== Direction.LEFT) {
        this.setNextDirectionSnake(Direction.LEFT, snakeHead!, snakeHeadGraphics!);
      }
      if (e.key === "ArrowRight" && direction !== Direction.LEFT && direction !== Direction.RIGHT) {
        this.setNextDirectionSnake(Direction.RIGHT, snakeHead!, snakeHeadGraphics!);
      }
      if (e.key === "ArrowUp" && direction !== Direction.DOWN && direction !== Direction.UP) {
        this.setNextDirectionSnake(Direction.UP, snakeHead!, snakeHeadGraphics!);
      }
      if (e.key === "ArrowDown" && direction !== Direction.UP && direction !== Direction.DOWN) {
        this.setNextDirectionSnake(Direction.DOWN, snakeHead!, snakeHeadGraphics!);
      }
      if (e.key == "Escape") {
        if (pause) {
          pause.isPaused = true;
        }
        document.querySelector('body main .game-scene .pause')?.classList.remove("hidden");
      }
    };
  }

  stop() { }

  tearDown() {
    const app = this.componentManager.getComponentByType(
      getNameApplication()
    ) as Application;
    const graphics = this.componentManager.getComponentsByType(
      getNameGraphics()
    ) as Array<Graphics>;

    graphics.map((c) => {
      if(c.graphics) {
        app.app?.stage.removeChild(c.graphics);
      }
    });
  }
}
