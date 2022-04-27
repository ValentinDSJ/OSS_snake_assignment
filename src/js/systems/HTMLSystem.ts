import Sprite from "../components/Sprite";
import { System } from "../libs/ecs/System";
import HTML, {getNameHTML} from "../components/HTML";

export default class HTMLSystem extends System {
  awake() {
    const components = this.componentManager.getComponentsByType(getNameHTML()) as Array<HTML>;

    components?.map(component => {
      document.querySelector(component.element)?.classList.remove('hidden');
      // document.querySelector(component.element)?.classList.add('visible');
    });
  }

  update(delta: number) {
  }
}
