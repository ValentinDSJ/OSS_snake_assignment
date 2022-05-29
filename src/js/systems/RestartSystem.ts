import {System} from "../libs/ecs/System";
import Snake, {Direction, getNameSnake} from "../components/Snake";
import Graphics, {getNameGraphics} from "../components/Graphics";
import Restart, {getNameRestart} from "../components/Restart";
import Application, {getNameApplication} from "../components/Application";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Apple, {getNameApple} from "../components/Apple";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Player, {getNamePlayer} from "../components/Player";

export default class RestartSystem extends System {
  update(delta: number) {
    const restart = this.componentManager.getComponentByType(getNameRestart()) as Restart;

    if (!restart || !restart.click)
      return;
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const app = this.componentManager.getComponentByType(getNameApplication()) as Application;

    const players = this.componentManager.getComponentsByType(getNamePlayer()) as Array<Player>;
    const apples = this.componentManager.getComponentsByType(getNameApple()) as Array<Apple>;

    for (const player of players) {
      let i = 0;
      for (const snake of snakes) {
        if (snake.idEntity != player.head && player.body.indexOf(snake.idEntity!) == -1)
          continue;
        if (i < 3) {
          const graphic = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;
          const velocity = this.entityManager.getComponentByType(snake.idEntity!, getNameVelocity()) as Velocity;

          snake.direction = snake.initialDirection;
          snake.dependsOn = undefined;
          snake.angles = [];
          velocity.x = graphic.initialVelocity.x;
          velocity.y = graphic.initialVelocity.y;
          velocity.skip = 0;
          graphic.sprite!.x = graphic.initialPosition.x;
          graphic.sprite!.y = graphic.initialPosition.y;
          // graphic.sprite!.x = app.blockSizeX * 20 + (graphic.sprite!.width / 2);
          // graphic.sprite!.y = app.blockSizeY * (20 + i) + (graphic.sprite!.height / 2);
          graphic.sprite!.rotation = 0;
          i++;
          continue;
        }

        const graphic = this.entityManager.getComponentByType(snake!.idEntity!, getNameGraphics()) as Graphics;

        this.componentManager.removeComponentOfEntity(snake!.idEntity!);
        this.entityManager.removeEntity(snake!.idEntity!);

        if (graphic.graphics) {
          graphic.graphics.destroy();
          // app.app?.stage.removeChild(graphic.graphics);
        } else if (graphic.sprite) {
          graphic.sprite.destroy();
          // app.app?.stage.removeChild(graphic.sprite);
        }
        snakes.splice(snakes.indexOf(snake));
        console.log(player.body);
        player.body.splice(player.body.indexOf(snake.idEntity!), 1);
        console.log(player.body);
        i++;
      }
      player.score = 0;
    }

    for (const apple of apples) {
      apple.isAte = true;
    }

    restart.click = false;

    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;
    gameOver.over = false;

    const element = document.querySelector('body main .game-scene .game-over');
    element?.classList.add("hidden");
  }
}
