import Node from './Node.js';
import Vec from './Math.js';
import {canv} from './main.js';

export default class Grid {
    constructor() {
        this.nodes = [];
        this.size = 40;
        this.tileSize = canv.width / this.size;
        this.generation = 0;
    }

    createGrid() {
        let pos = new Vec(0, 0);
        for (let i = 0; i < this.size; ++i) {
            if (!this.nodes[i]) {
                this.nodes[i] = [];
                for (let j = 0; j < this.size; ++j) {
                    const node = new Node();
                    node.pos.set(pos.x, pos.y);
                    this.nodes[i].push(node);
                    pos.x++;
                }
            }
            pos.x = 0;
            pos.y++;
        }
    }

    draw(ctx) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#0f0";

        this.nodes.forEach(row => {
            row.forEach(node => {
                if (!node.isDead) {
                    ctx.fillRect(node.pos.x * this.tileSize + 1, node.pos.y * this.tileSize + 1, this.tileSize - 2, this.tileSize - 2);
                }
            });
        });
    }

    findNode(x, y) {
        x = Math.floor(x / this.tileSize);
        y = Math.floor(y / this.tileSize);
        if (x < 0 || y < 0) {
            return null;
        }
        return this.nodes[y][x];
    }

    findNeighbour(node) {
        const pos = node.pos;
        let neighbour = [];

        neighbour.push(
            this.nodes[(pos.y + 1) % this.size][(pos.x + 1) % this.size],
            this.nodes[(pos.y + 1) % this.size][Math.abs(pos.x - 1 + this.size) % this.size],
            this.nodes[(pos.y + 1) % this.size][pos.x % this.size],
            this.nodes[pos.y % this.size][(pos.x + 1) % this.size],
            this.nodes[Math.abs(pos.y - 1 + this.size) % this.size][(pos.x + 1) % this.size],
            this.nodes[Math.abs(pos.y - 1 + this.size) % this.size][Math.abs(pos.x - 1 + this.size) % this.size],
            this.nodes[Math.abs(pos.y - 1 + this.size) % this.size][pos.x % this.size],
            this.nodes[pos.y % this.size][Math.abs(pos.x - 1 + this.size) % this.size]
        );
        return neighbour;
    }

    simulate() {
        this.nodes.forEach(row => {
            row.forEach(node => {
                this.findNeighbour(node).forEach(neighbour => {
                    node.update();
                    if (!node.isDead && !neighbour.isDead) {
                        if (!node.aliveNeighbours.includes(neighbour)) {
                            node.aliveNeighbours.push(neighbour);
                        }
                    }

                    if (node.isDead && !neighbour.isDead) {
                        if (!node.aliveNeighbours.includes(neighbour)) {
                            node.aliveNeighbours.push(neighbour);
                        }
                    }                    
                });
            });
        });

        this.nodes.forEach(row => {
            row.forEach(node => {
                if (!node.isDead) {            
                    if (node.aliveNeighbours.length >= 4) {
                        node.kill();
                    }
                    if (node.aliveNeighbours.length <= 1) {
                        node.kill();
                    }
                    if (node.aliveNeighbours.length == 2 || node.aliveNeighbours.length == 3) {
                        node.revive();
                    }
                }
                if (node.isDead) {
                    if (node.aliveNeighbours.length == 3) {
                        node.revive();
                    }
                }
            });
        });
        this.generation++;
    }
}