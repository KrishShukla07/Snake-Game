const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const scoreDisplay = document.getElementById('scoreDisplay'); // Get score display element

const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

const gridSize = 20;
const tileCount = canvasSize / gridSize;
let snakeSpeed = 150; // milliseconds - adjust for desired speed

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 }; // Initial direction (stopped)
let food = { x: 15, y: 15 };
let score = 0;
let gameLoopTimeout; // Variable to hold the timeout ID
let gameStarted = false; // Flag to track if the game has started

function gameLoop() {
    if (!gameStarted) return; // Don't run if game hasn't started

    clearTimeout(gameLoopTimeout); // Clear previous timeout

    moveSnake();

    if (checkCollision()) {
        resetGame();
        return; // Stop the loop after collision
    }

    drawGame();

    // Set the next game loop iteration
    gameLoopTimeout = setTimeout(gameLoop, snakeSpeed);
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawFood();
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1); // Draw square segments with a small gap
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1); // Draw food as a square
}

function moveSnake() {
    if (direction.x === 0 && direction.y === 0) return; // Don't move if no direction is set

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScoreDisplay();
        placeFood();
        // Increase speed slightly (optional)
        // if (snakeSpeed > 50) snakeSpeed -= 5;
    } else {
        snake.pop(); // Remove tail segment if no food eaten
    }
}

function checkCollision() {
    const head = snake[0];

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }

    return false;
}

function placeFood() {
    let newFoodPosition;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (isFoodOnSnake(newFoodPosition)); // Keep trying until food is not on the snake
    food = newFoodPosition;
}

function isFoodOnSnake(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function resetGame() {
    clearTimeout(gameLoopTimeout); // Stop the current game loop
    gameStarted = false; // Stop game logic
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    updateScoreDisplay();
    placeFood(); // Place initial food
    drawGame(); // Draw initial state
    // Game will restart on next key press
}

function changeDirection(event) {
    const keyPressed = event.key; // Use event.key for modern browsers
    const LEFT = 'ArrowLeft';
    const UP = 'ArrowUp';
    const RIGHT = 'ArrowRight';
    const DOWN = 'ArrowDown';

    const goingUp = direction.y === -1;
    const goingDown = direction.y === 1;
    const goingLeft = direction.x === -1;
    const goingRight = direction.x === 1;

    if (!gameStarted) { // Start the game on the first key press
        gameStarted = true;
        gameLoop();
    }

    if (keyPressed === LEFT && !goingRight) {
        direction = { x: -1, y: 0 };
    } else if (keyPressed === UP && !goingDown) {
        direction = { x: 0, y: -1 };
    } else if (keyPressed === RIGHT && !goingLeft) {
        direction = { x: 1, y: 0 };
    } else if (keyPressed === DOWN && !goingUp) {
        direction = { x: 0, y: 1 };
    }
}

// Event Listeners
document.addEventListener('keydown', changeDirection);
resetButton.addEventListener('click', resetGame);

// Initial setup
updateScoreDisplay();
placeFood();
drawGame(); // Draw the initial state before the game starts