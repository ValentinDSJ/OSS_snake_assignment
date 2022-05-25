import {System} from "../libs/ecs/System";
import Snake, {Direction, getNameSnake} from "../components/Snake";
import Graphics, {getNameGraphics, GraphicsType} from "../components/Graphics";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Application, {getNameApplication} from "../components/Application";
import GamePrefabs from "../prefabs/GamePrefabs";
import Player, {getNamePlayer} from "../components/Player";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Apple, {getNameApple} from "../components/Apple";
import Pause, {getNamePause} from "../components/Pause";

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

    for (const graphic of graphics) {
      if (graphic.type == GraphicsType.GRASS || graphic.type == GraphicsType.SNAKE_HEAD || graphic.idEntity! == snakeAfterHead.idEntity!)
        continue;
      let x;
      let y;
      let width;
      let height;

      let width2 = snakeHeadGraphics.sprite!.width;
      let height2 = snakeHeadGraphics.sprite!.height;
      let x2 = snakeHeadGraphics.sprite!.x - (width2 / 2);
      let y2 = snakeHeadGraphics.sprite!.y - (height2 / 2);

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
        if (graphic.type == GraphicsType.SNAKE) {
          x -= width / 2;
          y -= height / 2;
        }
      }

      if (
          x2 < x + width &&
          x2 + width2 > x &&
          y2 < y + height &&
          y2 + height2 > y
      ) {
        switch (graphic.type) {
          case GraphicsType.APPLE:
            const apple = this.entityManager.getComponentByType(graphic.idEntity!, getNameApple()) as Apple;

            if (apple.isAte) {
              break;
            }
            if (snakes.length == (application.nbBlocksGrass) * (application.nbBlocksGrass)) {
              this.gameOver();
              break;
            }
            apple.isAte = true;
            const newBody = GamePrefabs.createDynamicBody(application, this.getSnakeTail(), snakeHeadVelocity!, snakes[snakes.length - 1]);
            this.entityManager.addEntity(newBody);
            this.componentManager.addComponents(newBody);

            const app = this.componentManager.getComponentByType(
                getNameApplication()
            ) as Application;

            const player = this.componentManager.getComponentByType(getNamePlayer()) as Player;

            player.score++;
            break;
          case GraphicsType.SNAKE:
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
    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;
    const pause = this.componentManager.getComponentByType(getNamePause()) as Pause;

    if (gameOver.over || pause.isPaused) {
      return;
    }

    for (const s of snake) {

      // If snake has a dependsOn, it means that we must create the snake just right after the dependsOn snake
      if (s.dependsOn) {
        const graphic = this.entityManager.getComponentByType(s.idEntity!, getNameGraphics()) as Graphics;
        const velocity = this.entityManager.getComponentByType(s.idEntity!, getNameVelocity()) as Velocity;
        const graphicDependsOn = this.entityManager.getComponentByType(s.dependsOn.idEntity!, getNameGraphics()) as Graphics;
        const velocityDependsOn = this.entityManager.getComponentByType(s.dependsOn.idEntity!, getNameVelocity()) as Velocity;
        let pass = false;

        switch (s.dependsOn.direction) {
          case Direction.UP:
            if (graphicDependsOn.sprite!.y + graphicDependsOn.sprite!.height <= graphic.sprite!.y) {
              graphic.sprite!.y = graphicDependsOn.sprite!.y + graphicDependsOn.sprite!.height;
              graphic.sprite!.x = graphicDependsOn.sprite!.x;
              pass = true;
            }
            break;
          case Direction.RIGHT:
            if (graphicDependsOn.sprite!.x >= graphic.sprite!.x + graphic.sprite!.width) {
              graphic.sprite!.x = graphicDependsOn.sprite!.x - graphic.sprite!.width;
              graphic.sprite!.y = graphicDependsOn.sprite!.y;
              pass = true;
            }
            break;
          case Direction.LEFT:
            if (graphicDependsOn.sprite!.x + graphicDependsOn.sprite!.width <= graphic.sprite!.x) {
              graphic.sprite!.x = graphicDependsOn.sprite!.x + graphicDependsOn.sprite!.width;
              graphic.sprite!.y = graphicDependsOn.sprite!.y;
              pass = true;
            }
            break;
          case Direction.DOWN:
            if (graphicDependsOn.sprite!.y >= graphic.sprite!.y + graphic.sprite!.height) {
              graphic.sprite!.y = graphicDependsOn.sprite!.y - graphic.sprite!.height;
              graphic.sprite!.x = graphicDependsOn.sprite!.x;
              pass = true;
            }
            break;
        }
        if (pass) {
          velocity.x = velocityDependsOn.x;
          velocity.y = velocityDependsOn.y;
          s.angles = [];
          s.angles = [...s.dependsOn.angles];
          s.lastDirection = s.direction
          s.direction = s.dependsOn.direction;
          // graphic.posInBoard = {...graphicDependsOn.posInBoard};
          // graphic.lastPosInBoard = {...graphicDependsOn.lastPosInBoard};
          s.dependsOn = undefined;
        }
        continue;
      }

      if (s.angles.length == 0) {
        this.keepStraight(s);
        continue;
      }

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
        s.lastDirection = s.direction
        s.direction = nextAngle.direction;
        s.angles.shift();
        switch (s.direction) {
          case Direction.DOWN:
            newAngle = 180 * Math.PI / 180;
            newVelocity.x = 0;
            newVelocity.y = velocity.speed;
            newPosX = nextAngle.x;
            newPosY = nextAngle.y + diffX;
            graphics.lastPosInBoard = {...graphics.posInBoard};
            graphics.posInBoard.y++;
            break;
          case Direction.LEFT:
            newAngle = 270 * Math.PI / 180;
            newVelocity.x = -velocity.speed;
            newVelocity.y = 0;
            newPosX = nextAngle.x - diffY;
            newPosY = nextAngle.y;
            graphics.lastPosInBoard = {...graphics.posInBoard};
            graphics.posInBoard.x--;
            break;
          case Direction.UP:
            newAngle = 0 * Math.PI / 180;
            newVelocity.x = 0;
            newVelocity.y = -velocity.speed;
            newPosX = nextAngle.x;
            newPosY = nextAngle.y - diffX;
            graphics.lastPosInBoard = {...graphics.posInBoard};
            graphics.posInBoard.y--;
            break;
          case Direction.RIGHT:
            newAngle = 90 * Math.PI / 180;
            newVelocity.x = velocity.speed;
            newVelocity.y = 0;
            newPosX = nextAngle.x + diffY;
            newPosY = nextAngle.y;
            graphics.lastPosInBoard = {...graphics.posInBoard};
            graphics.posInBoard.x++;
            break;
        }
        if (graphics.graphics) {
          graphics.graphics.x = nextAngle.x;
          graphics.graphics.y = nextAngle.y;
        } else if (graphics.sprite) {
          // graphics.sprite.setTransform(0, 0, 1, 1, newAngle, 0, 0, graphics.sprite.width / 2, graphics.sprite.height / 2);
          // graphics.sprite.angle = newAngle;
          graphics.sprite.rotation = newAngle;
          graphics.sprite.x = newPosX;
          graphics.sprite.y = newPosY;
        }
        velocity.x = newVelocity.x;
        velocity.y = newVelocity.y;
        // this.setSkipForOnLoop();
      } else {
        this.keepStraight(s);
      }
    }

    this.checkCollisions();
  }

  keepStraight(snake: Snake) {
    const application = this.componentManager.getComponentByType("Application") as Application;
    const graphics = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;
    const velocity = this.entityManager.getComponentByType(snake.idEntity!, getNameVelocity()) as Velocity;
    let x = Math.floor((graphics!.sprite!.x - (graphics!.sprite!.width / 2)) / application.blockSizeX) * application.blockSizeX;
    let y = Math.floor((graphics!.sprite!.y - (graphics!.sprite!.height / 2)) / application.blockSizeY) * application.blockSizeY;

    if (snake.direction == Direction.DOWN) {
      y += application.blockSizeY;
    } else if (snake.direction == Direction.RIGHT) {
      x += application.blockSizeX;
    } else if (snake.direction == Direction.UP) {
      // y -= application.blockSizeY;
    } else if (snake.direction == Direction.LEFT) {
      // x -= application.blockSizeX;
    }
    // y += application.blockSizeY;
    // x += application.blockSizeX;

    // console.log(x, y, graphics.posInBoard.x * application.blockSizeX, graphics.posInBoard.y * application.blockSizeY);

    if (
        (snake.direction == Direction.LEFT && x != graphics.posInBoard.x * application.blockSizeX) ||
        (snake.direction == Direction.RIGHT && x != graphics.posInBoard.x * application.blockSizeX) ||
        (snake.direction == Direction.UP && y != graphics.posInBoard.y * application.blockSizeY) ||
        (snake.direction == Direction.DOWN && y != graphics.posInBoard.y * application.blockSizeY)
    ) {
      graphics.lastPosInBoard = {...graphics.posInBoard};
      switch (snake.direction) {
        case Direction.UP:
          graphics.posInBoard.y--;
          break;
        case Direction.RIGHT:
          graphics.posInBoard.x++;
          break;
        case Direction.LEFT:
          graphics.posInBoard.x--;
          break;
        case Direction.DOWN:
          graphics.posInBoard.y++;
          break;
      }
    }
  }

  setSkipForOnLoop() {
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;

    for (const snake of snakes) {
      const velocity = this.entityManager.getComponentByType(snake.idEntity!, getNameVelocity()) as Velocity;

      velocity.skip++;
    }
  }
}
