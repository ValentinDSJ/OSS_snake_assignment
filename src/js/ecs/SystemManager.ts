import {System} from "./System";

export default class SystemManager {
    private systems: Array<System>;

    constructor() {
        this.systems = Array<System>();
    }

    addSystem(system: System) {
        this.systems.push(system);
    }

    awake() {
        this.systems.map(system => {
            system.awake();
        })
    }

    start() {
        this.systems.map(system => {
            system.start();
        })
    }

    update() {
        this.systems.map(system => {
            system.update();
        })
    }

    stop() {
        this.systems.map(system => {
            system.stop();
        })
    }

    tearDown() {
        this.systems.map(system => {
            system.tearDown();
        })
    }
}