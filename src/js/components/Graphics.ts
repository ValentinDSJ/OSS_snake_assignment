import {Graphics as G} from "pixi.js";

export default interface Graphics extends Component {
    graphics: G
}

export function getNameGraphics(): string {
    return "Graphics";
}