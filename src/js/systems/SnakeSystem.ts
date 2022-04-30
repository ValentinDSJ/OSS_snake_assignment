import {System} from "../libs/ecs/System";
import Snake, {Direction, getNameSnake} from "../components/Snake";
import Graphics, {getNameGraphics} from "../components/Graphics";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Application from "../components/Application";

export default class SnakeSystem extends System {
  spawnApple() {
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
        s.direction = nextAngle.direction;
        s.angles.shift();
        switch (s.direction) {
          case Direction.DOWN:
            newAngle = 180;
            newVelocity.x = 0;
            newVelocity.y = velocity.speed;
            break;
          case Direction.LEFT:
            newAngle = 270;
            newVelocity.x = -velocity.speed;
            newVelocity.y = 0;
            break;
          case Direction.UP:
            newAngle = 0;
            newVelocity.x = 0;
            newVelocity.y = -velocity.speed;
            break;
          case Direction.RIGHT:
            newAngle = 90;
            newVelocity.x = velocity.speed;
            newVelocity.y = 0;
            break;
        }
        if (graphics.graphics) {
          // graphics.graphics.angle = newAngle;
          graphics.graphics.x = nextAngle.x;
          graphics.graphics.y = nextAngle.y;
        } else if (graphics.sprite) {
          // graphics.sprite.angle = newAngle;
          graphics.sprite.x = nextAngle.x;
          graphics.sprite.y = nextAngle.y;
        }
        velocity.x = newVelocity.x;
        velocity.y = newVelocity.y;
      }
    }
  }
}
