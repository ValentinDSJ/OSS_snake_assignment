import Application, { getNameApplication } from "../components/Application";
import EventComponent, { getNameEvent } from "../components/Event";
import Graphics, { getNameGraphics } from "../components/Graphics";
import Sprite, { getNameSprite } from "../components/Sprite";
import Velocity, { getNameVelocity } from "../components/Velocity";
import { System } from "../libs/ecs/System";

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

    document.onkeydown = (e) => {
      const velocities = this.componentManager.getComponentsByType(
        getNameVelocity()
      );

      // TODO: how to get head
      const head = sprites[0] as Sprite;

      if (e.key === "ArrowLeft") {
        head.sprite.angle = 90;
        velocities.map((v) => {
          const velocity = v as Velocity;
          velocity.x = -2 * delta;
          velocity.y = 0;
        });
      }
      if (e.key === "ArrowRight") {
        head.sprite.angle = 270;
        velocities.map((v) => {
          const velocity = v as Velocity;
          velocity.x = 2 * delta;
          velocity.y = 0;
        });
      }
      if (e.key === "ArrowUp") {
        head.sprite.angle = 180;
        velocities.map((v) => {
          const velocity = v as Velocity;
          velocity.x = 0;
          velocity.y = -2 * delta;
        });
      }
      if (e.key === "ArrowDown") {
        head.sprite.angle = 0;
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
