const WALL = '#';
const PLAYER = '@';
const TURKEY = 'T';
const PLATE = 'P';
const EMPTY = ' ';
const MEAT = 'M'

let moves = 0;
let player = { x: 2, y: 1 };
let level = [
    "########",
    "#  P   #",
    "# T#   #", 
    "#  T  P#",
    "########"
].map(row => row.split(''));

function renderBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    
    for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < level[y].length; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (player.x === x && player.y === y) {
                cell.classList.add('player');
                cell.textContent = '👨';
            } else {
                switch (level[y][x]) {
                    case WALL: 
                        cell.classList.add('wall');
                        cell.textContent = '🧱';
                        break;
                    case TURKEY: 
                        cell.classList.add('turkey');
                        cell.textContent = '🦃';
                        break;
                    case PLATE: 
                        cell.classList.add('plate');
                        cell.textContent = '🍽️';
                        break;
                    case MEAT: 
                        cell.classList.add('meat');
                        cell.textContent = '🍗';
                        break;
                }
            }
            board.appendChild(cell);
        }
    }
    document.getElementById('moves').textContent = moves;
}

function move(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    
    if (level[newY][newX] === WALL) return;
    
    if (level[newY][newX] === TURKEY) {
        const pushX = newX + dx;
        const pushY = newY + dy;
        
        if (level[pushY][pushX] === WALL || level[pushY][pushX] === TURKEY) return;
        
        level[newY][newX] = EMPTY;
        level[pushY][pushX] = TURKEY;
    }
    
    player.x = newX;
    player.y = newY;
    moves++;
    
    renderBoard();
    setTimeout(checkWin, 200);
}

function checkWin() {
    let plates = 0;
    let turkeysOnPlates = 0;
    
    for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < level[y].length; x++) {
            if (level[y][x] === PLATE) plates++;
            if (level[y][x] === TURKEY && originalLevel[y][x] === PLATE) {
                turkeysOnPlates++;
                plates++;
                level[y][x] = MEAT;
                renderBoard();
            }
        }
    }
    console.log(turkeysOnPlates);
    console.log(plates);
    
    if (plates > 0 && plates === turkeysOnPlates) {
        setTimeout(() => {
            alert("Congratulations! You won");
        }, 100);
    }
}

const originalLevel = level.map(row => [...row]);

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': move(-1, 0); break;
        case 'ArrowRight': move(1, 0); break;
        case 'ArrowUp': move(0, -1); break;
        case 'ArrowDown': move(0, 1); break;
    }
});

renderBoard();