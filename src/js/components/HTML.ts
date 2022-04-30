import EntityManager from "../libs/ecs/EntityManager";
import ComponentManager from "../libs/ecs/ComponentManager";

export default interface HTML extends Component {
    element: string,
    onReady?: (idEntity: number, em: EntityManager, cm: ComponentManager) => void,
    eventsOnClick: Map<string,(idEntity: number, em: EntityManager, cm: ComponentManager) => void>
}

export function getNameHTML(): string {
    return "HTML";
}