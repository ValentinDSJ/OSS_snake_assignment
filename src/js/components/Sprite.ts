import {Sprite as S} from "pixi.js";

export default interface Sprite extends Component {
    sprite: S
}

export function getNameSprite(): string {
    return "Sprite";
}