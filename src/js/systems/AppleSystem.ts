import { System } from "../libs/ecs/System";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Graphics, {getNameGraphics} from "../components/Graphics";
import Apple, {getNameApple} from "../components/Apple";
import Application, {getNameApplication} from "../components/Application";
import Snake, {Direction, getNameSnake} from "../components/Snake";

export default class AppleSystem extends System {
  update(delta: number) {
    const apples = this.componentManager.getComponentsByType(getNameApple()) as Array<Apple>;
    const app = this.componentManager.getComponentByType(getNameApplication()) as Application;

    for (const apple of apples) {
      if (!apple.isAte)
        continue;
      const graphic = this.entityManager.getComponentByType(apple.idEntity!, getNameGraphics()) as Graphics;
      const [x, y] = this.setRandomPosition();

      if (graphic.graphics) {
        graphic.graphics.x = x;
        graphic.graphics.y = y;
      } else if (graphic.sprite) {
        graphic.sprite.x = x;
        graphic.sprite.y = y;
      }
      apple.isAte = false;
    }
  }

  setRandomPosition(): [number, number] {
    const app = this.componentManager.getComponentByType(getNameApplication()) as Application;
    let x;
    let y;

    do {
      x = Math.floor(Math.random() * (app.nbBlocksGrass) + 1) * app.blockSizeX;
      y = Math.floor(Math.random() * (app.nbBlocksGrass) + 1) * app.blockSizeY;
    } while (this.positionIsAlreadyTaken(x, y, app.blockSizeX, app.blockSizeY))
    return [x, y];
  }

  positionIsAlreadyTaken(x: number, y: number, width: number, height: number): boolean {
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const application = this.componentManager.getComponentByType("Application") as Application;

    for (const snake of snakes) {
      const graphic = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;

      let snakeX = Math.floor((graphic!.sprite!.getBounds().x) / application.blockSizeX)
      let snakeY = Math.floor((graphic!.sprite!.getBounds().y) / application.blockSizeY)

      // for (const angle of snake.angles) {
      //   let angleX = Math.floor((angle.x - (graphic!.sprite!.width / 2)) / application.blockSizeX)
      //   let angleY = Math.floor((angle.y - (graphic!.sprite!.height / 2)) / application.blockSizeY)
      // }
      if (snake.direction == Direction.DOWN) {
        snakeY += application.blockSizeY;
      } else if (snake.direction == Direction.RIGHT) {
        snakeX += application.blockSizeX;
      }

      // console.log(snakeX, snakeY, x, y)
      // if (x == snakeX && y == snakeY) {
      //   return true
      // }

      // let x2;
      // let y2;
      // let width2;
      // let height2;
      //
      // if (graphic.graphics) {
      //   x2 = graphic.graphics.getBounds().x;
      //   y2 = graphic.graphics.getBounds().y;
      //   width2 = graphic.graphics.getBounds().width;
      //   height2 = graphic.graphics.getBounds().height;
      // } else if (graphic.sprite) {
      //   width2 = graphic.sprite.width;
      //   height2 = graphic.sprite.height;
      //   x2 = graphic.sprite.x - (width2 / 2);
      //   y2 = graphic.sprite.y - (height2 / 2);
      // }

      if (
          x < graphic.sprite!.getBounds().x + graphic.sprite!.getBounds().width &&
          x + width > graphic.sprite!.getBounds().x &&
          y < graphic.sprite!.getBounds().y + graphic.sprite!.getBounds().height &&
          y + height > graphic.sprite!.getBounds().y
      ) {
        return true;
      }
    }
    return false;
  }
}
