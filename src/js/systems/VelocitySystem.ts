import { System } from "../libs/ecs/System";
import Snake, {getNameSnake} from "../components/Snake";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Graphics, {getNameGraphics} from "../components/Graphics";
import Pause, {getNamePause} from "../components/Pause";
import GameOver, {getNameGameOver} from "../components/GameOver";

export default class VelocitySystem extends System {
  spawnApple() {
  }

  update(delta: number) {
    const pause = this.componentManager.getComponentByType(getNamePause()) as Pause;

    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;

    if (gameOver?.over || pause?.isPaused) {
      return;
    }
    const velocities = this.componentManager.getComponentsByType(getNameVelocity()) as Array<Velocity>;

    velocities.map((value, index, _) => {
      const graphics = this.entityManager.getComponentsByType(value.idEntity!, getNameGraphics()) as Array<Graphics>;

      for (const graphic of graphics) {
        if (graphic.graphics) {
          graphic.graphics.x += value.x * delta;
          graphic.graphics.y += value.y * delta;
        } else if (graphic.sprite) {
          graphic.sprite.x += value.x * delta;
          graphic.sprite.y += value.y * delta;
        }
      }
    });
  }
}
