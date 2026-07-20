class MarioGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.score = 0;
        this.coins = 0;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;

        // Mario properties
        this.mario = {
            x: 50,
            y: 350,
            width: 40,
            height: 50,
            velocityY: 0,
            velocityX: 0,
            jumping: false,
            direction: 1 // 1 for right, -1 for left
        };

        this.gravity = 0.6;
        this.jumpPower = -15;
        this.moveSpeed = 5;
        this.platforms = [];
        this.enemies = [];
        this.coins_list = [];
        this.keys = {};

        this.initGame();
        this.setupEventListeners();
    }

    initGame() {
        this.gameBoard.innerHTML = '';
        this.createPlatforms();
        this.createEnemies();
        this.createCoins();
        this.createMario();
    }

    createMario() {
        const marioEl = document.createElement('div');
        marioEl.id = 'mario';
        marioEl.className = 'mario';
        marioEl.textContent = '🔴';
        marioEl.style.left = this.mario.x + 'px';
        marioEl.style.top = this.mario.y + 'px';
        this.gameBoard.appendChild(marioEl);
    }

    createPlatforms() {
        const platformConfigs = [
            { x: 0, y: 450, width: 900, height: 50 }, // Ground
            { x: 150, y: 380, width: 200, height: 20 },
            { x: 500, y: 320, width: 200, height: 20 },
            { x: 100, y: 260, width: 150, height: 20 },
            { x: 600, y: 240, width: 200, height: 20 },
            { x: 300, y: 180, width: 150, height: 20 },
            { x: 700, y: 160, width: 150, height: 20 },
        ];

        platformConfigs.forEach(config => {
            this.platforms.push(config);
            const platformEl = document.createElement('div');
            platformEl.className = 'platform';
            platformEl.style.left = config.x + 'px';
            platformEl.style.top = config.y + 'px';
            platformEl.style.width = config.width + 'px';
            platformEl.style.height = config.height + 'px';
            this.gameBoard.appendChild(platformEl);
        });
    }

    createEnemies() {
        const enemyConfigs = [
            { x: 200, y: 350, type: 'goomba' },
            { x: 550, y: 290, type: 'koopa' },
            { x: 150, y: 230, type: 'goomba' },
            { x: 750, y: 110, type: 'koopa' }
        ];

        enemyConfigs.forEach((config, idx) => {
            const enemy = {
                x: config.x,
                y: config.y,
                width: 40,
                height: 40,
                velocity: 2,
                type: config.type,
                direction: 1
            };
            this.enemies.push(enemy);
            this.renderEnemy(enemy, idx);
        });
    }

    renderEnemy(enemy, idx) {
        const enemyEl = document.createElement('div');
        enemyEl.className = `enemy ${enemy.type}`;
        enemyEl.id = `enemy-${idx}`;
        enemyEl.textContent = enemy.type === 'goomba' ? '👾' : '🦖';
        enemyEl.style.left = enemy.x + 'px';
        enemyEl.style.top = enemy.y + 'px';
        this.gameBoard.appendChild(enemyEl);
    }

    createCoins() {
        const coinPositions = [
            { x: 250, y: 340 },
            { x: 550, y: 280 },
            { x: 150, y: 220 },
            { x: 700, y: 100 },
            { x: 400, y: 170 },
            { x: 800, y: 150 }
        ];

        coinPositions.forEach((pos, idx) => {
            const coin = {
                x: pos.x,
                y: pos.y,
                width: 20,
                height: 20,
                collected: false
            };
            this.coins_list.push(coin);
            this.renderCoin(coin, idx);
        });
    }

    renderCoin(coin, idx) {
        if (!coin.collected) {
            const coinEl = document.createElement('div');
            coinEl.className = 'coin';
            coinEl.id = `coin-${idx}`;
            coinEl.style.left = coin.x + 'px';
            coinEl.style.top = coin.y + 'px';
            this.gameBoard.appendChild(coinEl);
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    }

    handleKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;

        if (e.key === ' ') {
            e.preventDefault();
            if (!this.mario.jumping && this.gameRunning && !this.gamePaused) {
                this.mario.jumping = true;
                this.mario.velocityY = this.jumpPower;
            }
        }

        if (e.key.toLowerCase() === 'r') {
            this.restart();
        }
    }

    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }

    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        document.getElementById('startBtn').textContent = 'Resume';
        document.getElementById('pauseBtn').disabled = false;
        this.gameLoop();
    }

    togglePause() {
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }

    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;

        this.updateMario();
        this.updateEnemies();
        this.checkCollisions();
        this.updateUI();

        requestAnimationFrame(() => this.gameLoop());
    }

    updateMario() {
        // Handle horizontal movement
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.mario.x -= this.moveSpeed;
            this.mario.direction = -1;
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            this.mario.x += this.moveSpeed;
            this.mario.direction = 1;
        }

        // Boundary check
        if (this.mario.x < 0) this.mario.x = 0;
        if (this.mario.x + this.mario.width > this.gameBoard.offsetWidth) {
            this.mario.x = this.gameBoard.offsetWidth - this.mario.width;
        }

        // Apply gravity
        this.mario.velocityY += this.gravity;
        this.mario.y += this.mario.velocityY;

        // Check ground collision
        let onGround = false;
        for (let platform of this.platforms) {
            if (this.isColliding(this.mario, platform)) {
                if (this.mario.velocityY > 0) {
                    this.mario.y = platform.y - this.mario.height;
                    this.mario.velocityY = 0;
                    this.mario.jumping = false;
                    onGround = true;
                }
            }
        }

        // Game over if fell off screen
        if (this.mario.y > this.gameBoard.offsetHeight) {
            this.gameOver();
        }

        // Update visual
        const marioEl = document.getElementById('mario');
        marioEl.style.left = this.mario.x + 'px';
        marioEl.style.top = this.mario.y + 'px';
    }

    updateEnemies() {
        this.enemies.forEach((enemy, idx) => {
            enemy.x += enemy.velocity * enemy.direction;

            // Bounce off edges
            if (enemy.x < 0 || enemy.x > this.gameBoard.offsetWidth - enemy.width) {
                enemy.direction *= -1;
            }

            const enemyEl = document.getElementById(`enemy-${idx}`);
            if (enemyEl) {
                enemyEl.style.left = enemy.x + 'px';
                enemyEl.style.transform = enemy.direction === -1 ? 'scaleX(-1)' : 'scaleX(1)';
            }
        });
    }

    checkCollisions() {
        // Check coin collection
        this.coins_list.forEach((coin, idx) => {
            if (!coin.collected && this.isColliding(this.mario, coin)) {
                coin.collected = true;
                this.coins++;
                this.score += 10;
                const coinEl = document.getElementById(`coin-${idx}`);
                if (coinEl) coinEl.remove();
            }
        });

        // Check enemy collision
        for (let enemy of this.enemies) {
            if (this.isColliding(this.mario, enemy)) {
                // If jumping on enemy, defeat it
                if (this.mario.velocityY > 0 && this.mario.y < enemy.y) {
                    this.score += 100;
                    enemy.defeated = true;
                    const idx = this.enemies.indexOf(enemy);
                    const enemyEl = document.getElementById(`enemy-${idx}`);
                    if (enemyEl) enemyEl.remove();
                    this.mario.velocityY = this.jumpPower * 0.8;
                } else {
                    // Otherwise game over
                    this.gameOver();
                }
            }
        }

        // Check if all coins collected (level up)
        if (this.coins_list.every(c => c.collected)) {
            this.levelUp();
        }
    }

    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('coins').textContent = this.coins;
        document.getElementById('level').textContent = this.level;
    }

    levelUp() {
        this.level++;
        alert(`🎉 Level ${this.level}! Score: ${this.score}`);
        this.reset();
        this.initGame();
    }

    gameOver() {
        this.gameRunning = false;
        document.getElementById('gameOverText').textContent = 'Game Over!';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'flex';
    }

    restart() {
        this.score = 0;
        this.coins = 0;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('startBtn').textContent = 'Start Game';
        this.mario = {
            x: 50,
            y: 350,
            width: 40,
            height: 50,
            velocityY: 0,
            velocityX: 0,
            jumping: false,
            direction: 1
        };
        this.initGame();
    }

    reset() {
        this.mario = {
            x: 50,
            y: 350,
            width: 40,
            height: 50,
            velocityY: 0,
            velocityX: 0,
            jumping: false,
            direction: 1
        };
        this.enemies = [];
        this.coins_list = [];
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new MarioGame();
});
