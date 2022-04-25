import Application, { getNameApplication } from "../components/Application";
import EventComponent, { getNameEvent } from "../components/Event";
import Graphics, { getNameGraphics } from "../components/Graphics";
import Sprite, { getNameSprite } from "../components/Sprite";
import Velocity, { getNameVelocity } from "../components/Velocity";
import { System } from "../libs/ecs/System";
import GamePrefabs from "../prefabs/GamePrefabs";

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
        graphic.graphics.interactive = true;
        graphic.graphics.buttonMode = true;
        graphic.graphics.on(event.eventName, () => {
          event.fct(
            event.idEntity ?? -1,
            this.entityManager,
            this.componentManager
          );
        });
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
    if (!apple || !head) return;

    if (
      head.sprite.x <= 60 ||
      head.sprite.x >= 1580 ||
      head.sprite.y <= 60 ||
      head.sprite.y >= 1580
    ) {
      // TODO: show game over scene
      console.log("game over");
    }

    if (
      head.sprite.x >= apple.sprite.x &&
      head.sprite.x <= apple.sprite.x + apple.sprite.width
    ) {
      if (
        head.sprite.y >= apple.sprite.y &&
        head.sprite.y <= apple.sprite.y + apple.sprite.height
      ) {
        apple.sprite.x = Math.floor(Math.random() * (1580 - 60)) + 60;
        apple.sprite.y = Math.floor(Math.random() * (1580 - 60)) + 60;

        const newBody = GamePrefabs.createBody(currentSize, tail, velocity);

        this.entityManager.addEntity(newBody);
        this.componentManager.addComponents(newBody);

        const app = this.componentManager.getComponentByType(
          "Application"
        ) as Application;

        app.app?.stage.addChild((newBody[0] as Sprite).sprite);

        // TODO: add score
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

    // console.log(sprites);
  }

  update(delta: number) {
    const sprites = this.componentManager.getComponentsByType(getNameSprite());

    sprites.map((s) => {
      const sprite = s as Sprite;

      const entities = this.entityManager.getComponentsOfEntity(
        sprite.idEntity
      );

      const velocity = entities?.get("Velocity")?.[0] as Velocity | undefined;

      if (velocity) {
        sprite.sprite.x += velocity.x;
        sprite.sprite.y += velocity.y;
      }
    });

    const velocities = this.componentManager.getComponentsByType(
      getNameVelocity()
    );

    // TODO: how to get head
    const apple = sprites[0] as Sprite;
    const head = sprites[1] as Sprite;
    const tail = sprites[sprites.length - 1] as Sprite;

    this.checkCollision(
      apple,
      head,
      sprites.length - 1,
      tail,
      velocities[0] as Velocity
    );

    document.onkeydown = (e) => {
      const angle = head.sprite.angle;

      if (e.key === "ArrowLeft" && angle !== 90) {
        head.sprite.angle = 270;
        velocities.map((v) => {
          const velocity = v as Velocity;
          velocity.x = -2 * delta;
          velocity.y = 0;
        });
      }
      if (e.key === "ArrowRight" && angle !== 270) {
        head.sprite.angle = 90;
        velocities.map((v) => {
          const velocity = v as Velocity;
          velocity.x = 2 * delta;
          velocity.y = 0;
        });
      }
      if (e.key === "ArrowUp" && angle !== 180) {
        head.sprite.angle = 0;
        velocities.map((v) => {
          const velocity = v as Velocity;
          velocity.x = 0;
          velocity.y = -2 * delta;
        });
      }
      if (e.key === "ArrowDown" && angle !== 0) {
        head.sprite.angle = 180;
        velocities.map((v) => {
          const velocity = v as Velocity;
          velocity.x = 0;
          velocity.y = 2 * delta;
        });
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
    );

    graphics.map((c) => {
      app.app?.stage.removeChild((c as Graphics).graphics);
    });
  }
}
