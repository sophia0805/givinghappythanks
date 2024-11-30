const WALL = '#';
const PLAYER = '@';
const TURKEY = 'T';
const PLATE = 'P';
const EMPTY = ' ';
const MEAT = 'M';

let moves = 0;
let player = { x: 0, y: 0};
let currentLevelIndex = 0;
let playerInitialized = false;

// Define multiple levels
let levels = [
    [
        "##########",
        "# P    T #",
        "#   #    #",
        "#      @ #",
        "##########"
    ].map(row => row.split('')),
    [
        "##########",
        "# P      #",
        "#@ # T T #",
        "# ## ##  #",
        "# T    P #",
        "# P   ## #",
        "##########"
    ].map(row => row.split('')),
    [
        "#########",
        "#   P   #",
        "#  ###@ #",
        "# T T T #",
        "#  ### P#",
        "#   P   #",
        "#########"
    ].map(row => row.split('')),
    [
        "########",
        "###   ##",
        "#P@T  ##", 
        "### TP##",
        "#P##T ##",
        "# # P ##",
        "#T  TTP#",
        "#   P  #",
        "########",
    ].map(row => row.split('')),
    [
        "######  ### ",
        "#PP  # ##@##",
        "#PP  ###   #",
        "#PP     TT #",
        "#PP  # # T #",
        "#PP### # T #",
        "#### T #T  #",
        "   #  T# T #",
        "   # T  T  #",
        "   #  ##   #",
        "   #########"
    ].map(row => row.split('')),

    // Level 10: Maximum challenge with a large, complex design
    [
        "#############",
        "# T P   T   #",
        "# ## ### ## #",
        "#@  T   P   #",
        "# ##   ## T #",
        "#  T  ###  P#",
        "# P    T    #",
        "# ###   ## T#",
        "#   P   T P #",
        "#############"
    ].map(row => row.split(''))
];

let level = levels[currentLevelIndex];
const originalLevels = levels.map(level => level.map(row => [...row]));

function renderBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';

    const numColumns = level[0].length;
    board.style.gridTemplateColumns = `repeat(${numColumns}, 10vh)`;

    for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < level[y].length; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            switch (level[y][x]) {
                case WALL: 
                    cell.classList.add('wall');
                    cell.textContent = '🧱';
                    break;
                case TURKEY: 
                    cell.classList.add('turkey');
                    cell.textContent = '🦃';
                    if (originalLevels[currentLevelIndex][y][x] === PLATE) {
                        cell.style.backgroundColor = 'lightgreen';  // Change background color for turkey on plate
                    }
                    break;
                case PLATE: 
                    cell.classList.add('plate');
                    cell.textContent = '🍽️';
                    break;
                case MEAT: 
                    cell.classList.add('meat');
                    cell.textContent = '🍗';
                    break;
                case PLAYER:
                    if (!playerInitialized) {
                        player.x = x;  // Set player position only the first time
                        player.y = y;
                        playerInitialized = true;  // Mark player as initialized
                    }
                    console.log(player);
                    cell.classList.add('player');
                    cell.textContent = '👨';
                    break;
            }
            board.appendChild(cell);
        }
    }
    document.getElementById('moves').textContent = moves;
}

function move(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    
    if (level[newY][newX] === WALL || level[newY][newX] === MEAT) return;
    
    if (level[newY][newX] === TURKEY) {
        const pushX = newX + dx;
        const pushY = newY + dy;
        
        if (level[pushY][pushX] === WALL || level[pushY][pushX] === TURKEY) return;
        
        // Move the turkey
        level[newY][newX] = EMPTY;
        level[pushY][pushX] = TURKEY;
        
        // Check if we are moving the turkey off a plate
        if (originalLevels[currentLevelIndex][newY][newX] === PLATE) {
            level[newY][newX] = PLATE;  // Restore plate if turkey is moved off a plate
        }
    }
    
    player.x = newX;
    player.y = newY;
    moves++;
    level[player.y][player.x] = PLAYER;  // Set new position
    level[newY-dy][newX-dx] = originalLevels[currentLevelIndex][newY-dy][newX-dx] === PLATE ? PLATE : EMPTY;  // Clear old position
    renderBoard();
    setTimeout(checkWin, 200);
}

function checkWin() {
    let plates = 0;
    let turkeysOnPlates = 0;

    for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < level[y].length; x++) {
            if (level[y][x] === PLATE) plates++;
            if (level[y][x] === TURKEY && originalLevels[currentLevelIndex][y][x] === PLATE) {
                turkeysOnPlates++;
                plates++;
            }
        }
    }

    renderBoard();

    if (plates > 0 && plates === turkeysOnPlates) {
        playerInitialized = false;
        for (let y = 0; y < level.length; y++) {
            for (let x = 0; x < level[y].length; x++) {
                if (level[y][x] === TURKEY && originalLevels[currentLevelIndex][y][x] === PLATE) {
                    level[y][x] = MEAT;
                }
            }
        }
        renderBoard();
        setTimeout(() => {
            if (currentLevelIndex < levels.length - 1) {
                alert("Level Complete! Moving to the next level...");
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            } else {
                alert("Congratulations! You completed all levels!");
            }
        }, 500);
    }
}

function loadLevel(index) {
    level = levels[index].map(row => [...row]);
    player = { x: 2, y: 2 }; // Reset player position
    moves = 0;
    renderBoard();
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': move(-1, 0); break;
        case 'ArrowRight': move(1, 0); break;
        case 'ArrowUp': move(0, -1); break;
        case 'ArrowDown': move(0, 1); break;
    }
});

document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switch(btn.getAttribute('data-dir')) {
            case 'up': move(0, -1); break;
            case 'down': move(0, 1); break;
            case 'left': move(-1, 0); break;
            case 'right': move(1, 0); break;
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === " "){
        level = originalLevels[currentLevelIndex].map(row => [...row]);
        player = { x: 2, y: 2 };
        moves = 0;
        renderBoard();
    }
});


// Initialize the first level
loadLevel(currentLevelIndex);