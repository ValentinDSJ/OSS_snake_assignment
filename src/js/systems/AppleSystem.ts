import { System } from "../libs/ecs/System";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Graphics, {getNameGraphics} from "../components/Graphics";
import Apple, {getNameApple} from "../components/Apple";
import Application, {getNameApplication} from "../components/Application";
import Snake, {getNameSnake} from "../components/Snake";

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
      x = (Math.floor(Math.random() * (app.nbBlocks - 2)) + 1) * app.blockSizeX;
      y = (Math.floor(Math.random() * (app.nbBlocks - 2)) + 1) * app.blockSizeY;
    } while (this.positionIsAlreadyTaken(x, y, app.blockSizeX, app.blockSizeY))
    return [x, y];
  }

  positionIsAlreadyTaken(x: number, y: number, width: number, height: number): boolean {
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;

    for (const snake of snakes) {
      const graphic = this.componentManager.getComponentByType(getNameSnake()) as Graphics;
      let x2;
      let y2;
      let width2;
      let height2;

      if (graphic.graphics) {
        x2 = graphic.graphics.getBounds().x;
        y2 = graphic.graphics.getBounds().y;
        width2 = graphic.graphics.getBounds().width;
        height2 = graphic.graphics.getBounds().height;
      } else if (graphic.sprite) {
        x2 = graphic.sprite.x;
        y2 = graphic.sprite.y;
        width2 = graphic.sprite.width;
        height2 = graphic.sprite.height;
      }

      if (
          x < x2 + width2 &&
          x + width > x2 &&
          y < y2 + height2 &&
          y + height > y2
      ) {
        return true;
      }
    }
    return false;
  }
}
