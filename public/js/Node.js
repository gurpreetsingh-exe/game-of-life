import Vec from './Math.js';

export default class Node {
    constructor() {
        this.pos = new Vec(0, 0);
        this.isDead = true;
        this.aliveNeighbours = [];
    }

    update() {
        for (let i = 0; i < this.aliveNeighbours.length; ++i) {
            if (this.aliveNeighbours[i].isDead) {
                this.aliveNeighbours.splice(i, 1);
            }
        }
    }

    kill() {
        this.isDead = true;
    }

    revive() {
        this.isDead = false;
    }
}