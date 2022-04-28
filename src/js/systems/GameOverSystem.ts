import Sprite from "../components/Sprite";
import { System } from "../libs/ecs/System";

export default class GameOverSystem extends System {
  start() {
    let element = document.querySelector("body main .game-scene .game-over");

    if (!element)
      return;
    let inputName = element.querySelector('input[name="your-name"]');
    const name = localStorage.getItem('name');
    inputName?.setAttribute('value', name ?? '');

    inputName?.addEventListener('change', (event) => {
      // @ts-ignore
      const value = event.target.value;

      if (value.length === 0) {
        localStorage.removeItem('name');
      } else {
        localStorage.setItem('name', value);
      }
    });
  }

  update(delta: number) {
  }
}
