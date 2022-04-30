import Application, {getNameApplication} from "../components/Application";
import EventComponent, {getNameEvent} from "../components/Event";
import Graphics, {getNameGraphics, GraphicsType} from "../components/Graphics";
import Velocity from "../components/Velocity";
import {System} from "../libs/ecs/System";
import GamePrefabs from "../prefabs/GamePrefabs";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Player, {getNamePlayer} from "../components/Player";
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

  checkCollision(
    apple: Sprite,
    head: Sprite,
    currentSize: number,
    tail: Sprite,
    velocity: Velocity
  ) {
    const application = this.componentManager.getComponentByType("Application") as Application;

    if (!apple || !head) return;

    if (
      head.sprite.x <= application.app!.screen.width / 40 ||
      head.sprite.x >= application.app!.screen.width ||
      head.sprite.y <= application.app!.screen.height / 40 ||
      head.sprite.y >= application.app!.screen.height
    ) {
      const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;

      gameOver.over = true;
    }

    if (
      head.sprite.x >= apple.sprite.x &&
      head.sprite.x <= apple.sprite.x + apple.sprite.width
    ) {
      if (
        head.sprite.y >= apple.sprite.y &&
        head.sprite.y <= apple.sprite.y + apple.sprite.height
      ) {
        apple.sprite.x = Math.floor(Math.random() * (application.app!.screen.width - 60)) + 60;
        apple.sprite.y = Math.floor(Math.random() * (application.app!.screen.height - 60)) + 60;

        const newBody = GamePrefabs.createBody(
            application.app?.screen.width ?? 0,
            application.app?.screen.height ?? 0,
            currentSize, tail, velocity);

        this.entityManager.addEntity(newBody);
        this.componentManager.addComponents(newBody);

        const app = this.componentManager.getComponentByType(
          "Application"
        ) as Application;

        app.app?.stage.addChild((newBody[0] as Sprite).sprite);

        const player = this.componentManager.getComponentByType(getNamePlayer()) as Player;

        player.score++;
      }
    }
    apple.sprite.x;
  }

  moveBody() {
    const sprites = this.componentManager.getComponentsByType("Sprite");

    for (let i = 2; i < sprites.length; i++) {
      const sprite = sprites[i] as Sprite;
      const prevSprite = sprites[i - 1] as Sprite;

      sprite.sprite.x = prevSprite.sprite.x;
      sprite.sprite.y = prevSprite.sprite.y;
    }

    console.log(sprites);
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

    snakeHead!.angles = [];
    snakeHead!.angles.push({
      direction: direction,
      x: x,
      y: y,
      validate: true
    });
    for (const s of snake) {
      if (s.idEntity == snakeHead!.idEntity)
        continue;
      s.angles.filter((value) => {
        return !value.validate;
      });
      s.angles.push({
        direction: direction,
        x: x,
        y: y,
        validate: false
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
    // const sprites = this.componentManager.getComponentsByType(getNameSprite());

    // sprites.map((s) => {
    //   const sprite = s as Sprite;

    //   const entities = this.entityManager.getComponentsOfEntity(
    //     sprite.idEntity
    //   );

    //   const velocity = entities?.get("Velocity")?.[0] as Velocity | undefined;

    //   if (velocity) {
    //     sprite.sprite.x += velocity.x;
    //     sprite.sprite.y += velocity.y;
    //   }
    // });

    // const velocities = this.componentManager.getComponentsByType(
    //   getNameVelocity()
    // );

    // TODO: how to get head
    // const apple = sprites[0] as Graphics;
    // const head = sprites[1] as Graphics;
    // const tail = sprites[sprites.length - 1] as Graphics;

    // const headSpeed = this.entityManager.getComponentsOfEntity(head?.idEntity)?.get("Velocity")?.[0] as Velocity | undefined;

    let prevPosX;
    let prevPosY;
    // if (headSpeed) {
    //   head.sprite.x += headSpeed.x;
    //   head.sprite.y += headSpeed.y;
    //   prevPosX = head.sprite.x;
    //   prevPosY = head.sprite.y;
    // }
    // if (this.localDelta > 30) {
    //   sprites.map((s, idx) => {
    //     const sprite = s as Graphics;
    //     if (idx > 0) {
    //       const tempX = sprite.sprite.x;
    //       const tempY = sprite.sprite.y;
    //       sprite.sprite.x = prevPosX;
    //       sprite.sprite.y = prevPosY;
    //       prevPosX = tempX;
    //       prevPosY = tempY;
    //     }
    //   });
    //   this.localDelta = 0;
    // }

    // this.checkCollision(
    //   apple,
    //   head,
    //   sprites.length - 1,
    //   tail,
    //   velocities[0] as Velocity
    // );

    // const headVelocity = velocities[0] as Velocity;

    document.onkeydown = (e) => {
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
