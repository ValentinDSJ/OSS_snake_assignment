import {Application as App} from "@pixi/app";

export default interface Application extends Component {
    app?: App
}

export function getNameApplication(): string {
    return "Application";
}