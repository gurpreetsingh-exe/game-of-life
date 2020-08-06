import Grid from './Grid.js';
import Node from './Node.js';

export const canv = document.getElementById("gc");
const ctx = canv.getContext("2d");

const grid = new Grid();
grid.createGrid();

let startSimulation = false;

document.addEventListener('keydown', e => {
    if (e.code == 'Space') {
        startSimulation = !startSimulation;
    }
});

function setupControls(canvas) {
    canvas.addEventListener("contextmenu", e => e.preventDefault());

    ["mousedown", "mousemove"].forEach(eventName => {
        canvas.addEventListener(eventName, drawPixels);
    });
}

let currentzoom = 1;
let originX = 0, originY = 0;

function drawPixels(event) {
    let b = canv.getBoundingClientRect();
    let scale = canv.width / Math.floor(b.width);
    let x = (event.clientX - b.left) * scale;
    let y = (event.clientY - b.top) * scale;

    if (x < 0 || y < 0 || x > canv.width || y > canv.height) {
        return;
    } else {
        let node = grid.findNode(x, y);
        if (event.buttons == 1) {
            node.isDead = false;
        }
        if (event.buttons == 2) {
            node.isDead = true;
        }
    }
}

setupControls(canv);

const deltaTime = 1/10;
let accumulatedTime = 0;
let lastTime = 0;

function update(time) {
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, canv.width, canv.height);

    ctx.fillStyle = "#0f0";
    ctx.globalAlpha = 0.2;
    for (let i = 0; i <= grid.size; ++i) {
        for (let j = 0; j <= grid.size; ++j) {
            ctx.fillRect(i * grid.tileSize + 1, j * grid.tileSize + 1, grid.tileSize - 2, grid.tileSize - 2)
        }
    }

    grid.draw(ctx);

    ctx.fillStyle = "#000";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Generation: "+ grid.generation, 10, 30);

    accumulatedTime += (time - lastTime) / 1000;
    while (accumulatedTime >= deltaTime) {
        if (startSimulation) {
            grid.simulate();
            grid.nodes.forEach(row => {
                row.forEach(node => {
                    node.update();
                });
            });
        }
        accumulatedTime -= deltaTime;
    }

    lastTime = time;

    requestAnimationFrame(update);
}

update(0);
