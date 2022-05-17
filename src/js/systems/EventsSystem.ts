import Application, { getNameApplication } from "../components/Application";
import EventComponent, { getNameEvent } from "../components/Event";
import Graphics, {
  getNameGraphics,
  GraphicsType,
} from "../components/Graphics";
import { System } from "../libs/ecs/System";
import GameOver, { getNameGameOver } from "../components/GameOver";
import Pause, { getNamePause } from "../components/Pause";
import Snake, { Direction, getNameSnake } from "../components/Snake";
import Player, { getNamePlayer } from "../components/Player";

export default class EventsSystem extends System {
  awake() {}

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

  setNextDirectionSnake(
    direction: Direction,
    snakeHead: Snake,
    snakeHeadGraphics: Graphics
  ) {
    const snake = this.componentManager.getComponentsByType(
      getNameSnake()
    ) as Array<Snake>;
    const application = this.componentManager.getComponentByType(
      "Application"
    ) as Application;
    // const blockSize = application.blockSizeX;
    let x =
      Math.floor(
        (snakeHeadGraphics!.sprite!.x - snakeHeadGraphics!.sprite!.width / 2) /
          application.blockSizeX
      ) *
        application.blockSizeX +
      application.blockSizeX / 2;
    let y =
      Math.floor(
        (snakeHeadGraphics!.sprite!.y - snakeHeadGraphics!.sprite!.height / 2) /
          application.blockSizeY
      ) *
        application.blockSizeY +
      application.blockSizeY / 2;
    let nbToRemove: number;

    if (snakeHead.direction == Direction.DOWN) {
      y += application.blockSizeY;
    } else if (snakeHead.direction == Direction.RIGHT) {
      x += application.blockSizeX;
    }

    nbToRemove = snakeHead!.angles.length;
    for (let i = 0; i < nbToRemove; i++) {
      snakeHead!.angles.pop();
    }
    snakeHead!.angles.push({
      direction: direction,
      x: x,
      y: y,
    });
    for (const s of snake) {
      if (s.idEntity == snakeHead!.idEntity) continue;
      for (let i = 0; i < nbToRemove; i++) {
        s.angles.pop();
      }
      s.angles.push({
        direction: direction,
        x: x,
        y: y,
      });
    }
  }

  update(delta: number) {
    const pause = this.componentManager.getComponentByType(
      getNamePause()
    ) as Pause;

    const gameOver = this.componentManager.getComponentByType(
      getNameGameOver()
    ) as GameOver;

    if (gameOver?.over || pause?.isPaused) {
      return;
    }
    this.localDelta += delta;
    document.onkeydown = (e) => {
      const pause = this.componentManager.getComponentByType(
        getNamePause()
      ) as Pause;

      const gameOver = this.componentManager.getComponentByType(
        getNameGameOver()
      ) as GameOver;

      if (gameOver?.over || pause?.isPaused) {
        return;
      }
      const players = this.componentManager.getComponentsByType(
        getNamePlayer()
      ) as Array<Player>;

      for (const player of players) {
        let snakeHead: Snake = this.entityManager.getComponentByType(
          player.head,
          getNameSnake()
        ) as Snake;
        let snakeHeadGraphics: Graphics = this.entityManager.getComponentByType(
          player.head,
          getNameGraphics()
        ) as Graphics;
        let direction = snakeHead.direction;

        if (
          e.key === player.keyEventLeft &&
          direction !== Direction.RIGHT &&
          direction !== Direction.LEFT
        ) {
          this.setNextDirectionSnake(
            Direction.LEFT,
            snakeHead!,
            snakeHeadGraphics!
          );
        }
        if (
          e.key === player.keyEventRight &&
          direction !== Direction.LEFT &&
          direction !== Direction.RIGHT
        ) {
          this.setNextDirectionSnake(
            Direction.RIGHT,
            snakeHead!,
            snakeHeadGraphics!
          );
        }
        if (
          e.key === player.keyEventUp &&
          direction !== Direction.DOWN &&
          direction !== Direction.UP
        ) {
          this.setNextDirectionSnake(
            Direction.UP,
            snakeHead!,
            snakeHeadGraphics!
          );
        }
        if (
          e.key === player.keyEventDown &&
          direction !== Direction.UP &&
          direction !== Direction.DOWN
        ) {
          this.setNextDirectionSnake(
            Direction.DOWN,
            snakeHead!,
            snakeHeadGraphics!
          );
        }
      }

      if (e.key == "Escape") {
        if (pause) {
          pause.isPaused = true;
        }
        document
          .querySelector("body main .game-scene .pause")
          ?.classList.remove("hidden");
      }
    };
  }

  stop() {}

  tearDown() {
    const app = this.componentManager.getComponentByType(
      getNameApplication()
    ) as Application;
    const graphics = this.componentManager.getComponentsByType(
      getNameGraphics()
    ) as Array<Graphics>;

    graphics.map((c) => {
      if (c.graphics) {
        app.app?.stage.removeChild(c.graphics);
      }
    });
  }
}
