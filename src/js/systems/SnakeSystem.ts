import {System} from "../libs/ecs/System";
import Snake, {Direction, getNameSnake} from "../components/Snake";
import Graphics, {getNameGraphics, GraphicsType} from "../components/Graphics";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Application, {getNameApplication} from "../components/Application";
import GamePrefabs from "../prefabs/GamePrefabs";
import Player, {getNamePlayer} from "../components/Player";
import GameOver, {getNameGameOver} from "../components/GameOver";

export default class SnakeSystem extends System {
  spawnApple() {
  }

  getSnakeHead(): [Snake?, Graphics?, Velocity?] {
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;

    for (const snake of snakes) {
      const graphic = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;
      const velocity = this.entityManager.getComponentByType(snake.idEntity!, getNameVelocity()) as Velocity;
      let found = false;

      if (graphic.type == GraphicsType.SNAKE_HEAD) {
        return [snake, graphic, velocity];
      }
    }
    return [];
  }

  getSnakeTail(): Graphics {
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const graphics = this.entityManager.getComponentByType(snakes[snakes.length - 1].idEntity!, getNameGraphics());

    return <Graphics>graphics;
  }

  checkCollisions() {
    const application = this.componentManager.getComponentByType(getNameApplication()) as Application;
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const snakeAfterHead = snakes[1];
    const snakeAfterHead2 = snakes[2];
    const graphics = this.componentManager.getComponentsByType(getNameGraphics()) as Array<Graphics>;
    const [snakeHead, snakeHeadGraphics, snakeHeadVelocity] = this.getSnakeHead();

    if (!snakeHeadGraphics || !snakeHead) {
      return;
    }
    console.log(snakes);

    for (const graphic of graphics) {
      if (graphic.type == GraphicsType.GRASS || graphic.type == GraphicsType.SNAKE_HEAD || graphic.idEntity! == snakeAfterHead.idEntity!)
        continue;
      let x;
      let y;
      let width;
      let height;

      if (graphic.graphics) {
        x = graphic.graphics.getBounds().x;
        y = graphic.graphics.getBounds().y;
        width = graphic.graphics.getBounds().width;
        height = graphic.graphics.getBounds().height;
      } else if (graphic.sprite) {
        x = graphic.sprite.x;
        y = graphic.sprite.y;
        width = graphic.sprite.width;
        height = graphic.sprite.height;
      }


      if (
          snakeHeadGraphics.sprite!.x < x + width &&
          snakeHeadGraphics.sprite!.x + snakeHeadGraphics.sprite!.width > x &&
          snakeHeadGraphics.sprite!.y < y + height &&
          snakeHeadGraphics.sprite!.y + snakeHeadGraphics.sprite!.height > y
      ) {
        console.log(x, y, width, height);
        console.log(snakeHeadGraphics.sprite!.x, snakeHeadGraphics.sprite!.y, snakeHeadGraphics.sprite!.width, snakeHeadGraphics.sprite!.height);
        console.log(graphic.idEntity);
        switch (graphic.type) {
          case GraphicsType.APPLE:
            const newBody = GamePrefabs.createBody(
                application.app?.screen.width ?? 0,
                application.app?.screen.height ?? 0,
                snakes.length - 1,
                this.getSnakeTail(), snakeHeadVelocity!);
            this.entityManager.addEntity(newBody);
            this.componentManager.addComponents(newBody);

            const app = this.componentManager.getComponentByType(
                getNameApplication()
            ) as Application;

            app.app?.stage.addChild((newBody[0] as Graphics).sprite!);

            const player = this.componentManager.getComponentByType(getNamePlayer()) as Player;

            player.score++;
            break;
          case GraphicsType.SNAKE:
            this.gameOver();
            break;
          case GraphicsType.WALL:
            this.gameOver();
            break;
        }
      }
    }
  }

  gameOver() {
    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;

    gameOver.over = true;
  }

  update(delta: number) {
    const snake = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const application = this.componentManager.getComponentByType("Application") as Application;

    for (const s of snake) {
      if (s.angles.length == 0)
        continue;

      const nextAngle = s.angles[0];
      const graphics = this.entityManager.getComponentByType(s.idEntity!, getNameGraphics()) as Graphics;
      const velocity = this.entityManager.getComponentByType(s.idEntity!, getNameVelocity()) as Velocity;
      let x;
      let y;
      let newAngle;
      let newVelocity = <Velocity>{};

      if (graphics.graphics) {
        x = graphics.graphics.x;
        y = graphics.graphics.y;
      } else if (graphics.sprite) {
        x = graphics.sprite.x;
        y = graphics.sprite.y;
      }
      if (
          (s.direction == Direction.LEFT && x <= nextAngle.x) ||
          (s.direction == Direction.RIGHT && x >= nextAngle.x) ||
          (s.direction == Direction.UP && y <= nextAngle.y) ||
          (s.direction == Direction.DOWN && y >= nextAngle.y)
      ) {
        let newPosX = 0;
        let newPosY = 0;
        let diffX = Math.abs(x - nextAngle.x);
        let diffY = Math.abs(y - nextAngle.y);
        s.direction = nextAngle.direction;
        s.angles.shift();
        switch (s.direction) {
          case Direction.DOWN:
            newAngle = 180 * Math.PI / 180;
            newVelocity.x = 0;
            newVelocity.y = velocity.speed;
            newPosX = nextAngle.x;
            newPosY = nextAngle.y + diffX;
            break;
          case Direction.LEFT:
            newAngle = 270 * Math.PI / 180;
            newVelocity.x = -velocity.speed;
            newVelocity.y = 0;
            newPosX = nextAngle.x - diffY;
            newPosY = nextAngle.y;
            break;
          case Direction.UP:
            newAngle = 0 * Math.PI / 180;
            newVelocity.x = 0;
            newVelocity.y = -velocity.speed;
            newPosX = nextAngle.x;
            newPosY = nextAngle.y - diffX;
            break;
          case Direction.RIGHT:
            newAngle = 90 * Math.PI / 180;
            newVelocity.x = velocity.speed;
            newVelocity.y = 0;
            newPosX = nextAngle.x + diffY;
            newPosY = nextAngle.y;
            break;
        }
        if (graphics.graphics) {
          graphics.graphics.x = nextAngle.x;
          graphics.graphics.y = nextAngle.y;
        } else if (graphics.sprite) {
          // graphics.sprite.setTransform(0, 0, 1, 1, newAngle, 0, 0, graphics.sprite.width / 2, graphics.sprite.height / 2);
          // graphics.sprite.angle = newAngle;
          // graphics.sprite.rotation = newAngle;
          graphics.sprite.x = newPosX;
          graphics.sprite.y = newPosY;
        }
        velocity.x = newVelocity.x;
        velocity.y = newVelocity.y;
        // this.setSkipForOnLoop();
      }
    }

    this.checkCollisions();
  }

  setSkipForOnLoop() {
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;

    for (const snake of snakes) {
      const velocity = this.entityManager.getComponentByType(snake.idEntity!, getNameVelocity()) as Velocity;

      velocity.skip++;
    }
  }
}
