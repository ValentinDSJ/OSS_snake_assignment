import { System } from "../libs/ecs/System";
import HTML, {getNameHTML} from "../components/HTML";

export default class HTMLSystem extends System {
  awake() {
    const components = this.componentManager.getComponentsByType(getNameHTML()) as Array<HTML>;

    components?.map(component => {
      // document.querySelector(component.element)?.classList.remove('hidden');
      if (component.onReady) {
        component.onReady(component.idEntity!, this.entityManager, this.componentManager);
      }

      component.eventsOnClick.forEach((value, key, map) => {
        document.querySelector(`${component.element} ${key}`)?.addEventListener('click', (event) => {
          value(component.idEntity!, this.entityManager, this.componentManager);
        })
      })
    });
  }

  update(delta: number) {
  }

  tearDown() {
    const components = this.componentManager.getComponentsByType(getNameHTML()) as Array<HTML>;

    components?.map(component => {
      // document.querySelector(component.element)?.classList.add('hidden');

      if (component.onFinish) {
        component.onFinish(component.idEntity!, this.entityManager, this.componentManager);
      }

      component.eventsOnClick.forEach((value, key, map) => {
        const element = document.querySelector(`${component.element} ${key}`);
        element?.replaceWith(element.cloneNode(true)); // Remove all listeners
      })
    });
  }
}
