import {Application as App} from "@pixi/app";

export default interface Application extends Component {
    app?: App,
    blockSizeX: number,
    blockSizeY: number,
    nbBlocks: number
}

export function getNameApplication(): string {
    return "Application";
}