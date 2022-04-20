import EntityManager from "../libs/ecs/EntityManager";
import ComponentManager from "../libs/ecs/ComponentManager";

export default interface EventComponent extends Component {
    eventName: string,
    fct: (idEntity: number, em: EntityManager, cm: ComponentManager) => void
}

export function getNameEvent(): string {
    return "Event";
}