// Mini MOBA 5v5 游戏逻辑

// 游戏配置
const GAME_CONFIG = {
    mapWidth: 1200,
    mapHeight: 800,
    unitSpeed: 2,
    gameSpeed: 30, // FPS
    teamSize: 5,
    towerDamage: 20,
    unitBaseDamage: 10,
};

// 游戏状态
let gameState = {
    blueTeam: [],
    redTeam: [],
    blueTowers: [],
    redTowers: [],
    projectiles: [],
    kills: { blue: 0, red: 0 },
    gold: { blue: 0, red: 0 },
    isPaused: false,
    gameLog: [],
    selectedUnit: null,
};

// 单位类
class Unit {
    constructor(x, y, team, type = 'soldier') {
        this.x = x;
        this.y = y;
        this.team = team; // 'blue' or 'red'
        this.type = type; // 'soldier', 'tank', 'mage'
        this.id = Math.random().toString(36).substr(2, 9);
        this.maxHealth = this.getMaxHealth();
        this.health = this.maxHealth;
        this.targetX = x;
        this.targetY = y;
        this.target = null;
        this.attackRange = 150;
        this.attackCooldown = 0;
        this.damage = this.getDamage();
        this.armor = this.getArmor();
        this.speed = GAME_CONFIG.unitSpeed;
        this.element = null;
        this.alive = true;
    }

    getMaxHealth() {
        const healthMap = { soldier: 100, tank: 200, mage: 70 };
        return healthMap[this.type] || 100;
    }

    getDamage() {
        const damageMap = { soldier: 12, tank: 8, mage: 18 };
        return damageMap[this.type] || 10;
    }

    getArmor() {
        const armorMap = { soldier: 5, tank: 15, mage: 2 };
        return armorMap[this.type] || 5;
    }

    getEmoji() {
        if (this.team === 'blue') {
            const emojiMap = { soldier: '🔵', tank: '🛡️', mage: '✨' };
            return emojiMap[this.type] || '🔵';
        } else {
            const emojiMap = { soldier: '🔴', tank: '🗡️', mage: '⚡' };
            return emojiMap[this.type] || '🔴';
        }
    }

    update() {
        if (!this.alive) return;

        // 寻找目标
        if (!this.target || !this.target.alive) {
            this.findTarget();
        }

        // 移动
        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.attackRange) {
                const moveX = (dx / distance) * this.speed;
                const moveY = (dy / distance) * this.speed;
                this.x += moveX;
                this.y += moveY;
            } else {
                // 在攻击范围内
                if (this.attackCooldown <= 0) {
                    this.attack(this.target);
                    this.attackCooldown = 30;
                }
            }
        } else {
            // 没有目标，向敌方基地方向移动
            const baseX = this.team === 'blue' ? GAME_CONFIG.mapWidth - 100 : 100;
            const baseY = GAME_CONFIG.mapHeight / 2;
            const dx = baseX - this.x;
            const dy = baseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 50) {
                const moveX = (dx / distance) * this.speed;
                const moveY = (dy / distance) * this.speed;
                this.x += moveX;
                this.y += moveY;
            }
        }

        // 更新攻击冷却
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        // 边界检查
        this.x = Math.max(0, Math.min(GAME_CONFIG.mapWidth, this.x));
        this.y = Math.max(0, Math.min(GAME_CONFIG.mapHeight, this.y));
    }

    findTarget() {
        const enemyTeam = this.team === 'blue' ? gameState.redTeam : gameState.blueTeam;
        let closestEnemy = null;
        let closestDistance = Infinity;

        for (let enemy of enemyTeam) {
            if (!enemy.alive) continue;
            const distance = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }

        this.target = closestEnemy;
    }

    attack(target) {
        if (!target.alive) return;

        const damage = Math.max(1, this.damage - target.armor / 2);
        target.takeDamage(damage);

        // 创建投射物
        const projectile = new Projectile(this.x, this.y, target.x, target.y, this.team);
        gameState.projectiles.push(projectile);

        if (target.health <= 0) {
            this.onKill(target);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    onKill(target) {
        gameState.gold[this.team] += 50;
        gameState.kills[this.team]++;
        addLog(`${this.team === 'blue' ? '🔵' : '🔴'} ${this.type} 击杀了 ${target.type}!`, 'kill');
        updateStats();
    }
}

// 防御塔类
class Tower {
    constructor(x, y, team) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.maxHealth = 300;
        this.health = this.maxHealth;
        this.attackRange = 200;
        this.attackCooldown = 0;
        this.damage = 25;
        this.alive = true;
        this.element = null;
    }

    update() {
        if (!this.alive) return;

        const enemyTeam = this.team === 'blue' ? gameState.redTeam : gameState.blueTeam;
        let target = null;
        let closestDistance = Infinity;

        for (let enemy of enemyTeam) {
            if (!enemy.alive) continue;
            const distance = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            if (distance < this.attackRange && distance < closestDistance) {
                closestDistance = distance;
                target = enemy;
            }
        }

        if (target && this.attackCooldown <= 0) {
            const damage = this.damage;
            target.takeDamage(damage);
            this.attackCooldown = 40;

            const projectile = new Projectile(this.x, this.y, target.x, target.y, this.team);
            gameState.projectiles.push(projectile);

            if (target.health <= 0) {
                gameState.gold[this.team] += 100;
                addLog(`塔 击杀了 ${target.type}!`, 'defend');
            }
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }
}

// 投射物类
class Projectile {
    constructor(fromX, fromY, toX, toY, team) {
        this.x = fromX;
        this.y = fromY;
        this.toX = toX;
        this.toY = toY;
        this.team = team;
        this.speed = 5;
        this.lifetime = 0;
        this.element = null;
    }

    update() {
        const dx = this.toX - this.x;
        const dy = this.toY - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            return false; // 投射物已到达目标
        }

        const moveX = (dx / distance) * this.speed;
        const moveY = (dy / distance) * this.speed;
        this.x += moveX;
        this.y += moveY;

        return true;
    }
}

// 初始化游戏
function initGame() {
    gameState.blueTeam = [];
    gameState.redTeam = [];
    gameState.blueTowers = [];
    gameState.redTowers = [];
    gameState.projectiles = [];
    gameState.kills = { blue: 0, red: 0 };
    gameState.gold = { blue: 0, red: 0 };
    gameState.gameLog = [];

    // 创建蓝队单位
    const blueStartX = 150;
    const blueStartY = GAME_CONFIG.mapHeight / 2;
    const types = ['soldier', 'soldier', 'tank', 'mage', 'soldier'];

    for (let i = 0; i < GAME_CONFIG.teamSize; i++) {
        const unit = new Unit(
            blueStartX + Math.random() * 50,
            blueStartY + (i - 2) * 80,
            'blue',
            types[i]
        );
        gameState.blueTeam.push(unit);
    }

    // 创建红队单位
    const redStartX = GAME_CONFIG.mapWidth - 150;
    for (let i = 0; i < GAME_CONFIG.teamSize; i++) {
        const unit = new Unit(
            redStartX + Math.random() * 50,
            blueStartY + (i - 2) * 80,
            'red',
            types[i]
        );
        gameState.redTeam.push(unit);
    }

    // 创建防御塔
    gameState.blueTowers.push(
        new Tower(100, GAME_CONFIG.mapHeight / 2 - 100, 'blue'),
        new Tower(100, GAME_CONFIG.mapHeight / 2, 'blue'),
        new Tower(100, GAME_CONFIG.mapHeight / 2 + 100, 'blue')
    );

    gameState.redTowers.push(
        new Tower(GAME_CONFIG.mapWidth - 100, GAME_CONFIG.mapHeight / 2 - 100, 'red'),
        new Tower(GAME_CONFIG.mapWidth - 100, GAME_CONFIG.mapHeight / 2, 'red'),
        new Tower(GAME_CONFIG.mapWidth - 100, GAME_CONFIG.mapHeight / 2 + 100, 'red')
    );

    addLog('游戏开始！', 'defend');
    renderGame();
}

// 游戏更新
function updateGame() {
    if (gameState.isPaused) return;

    // 更新所有单位
    [...gameState.blueTeam, ...gameState.redTeam].forEach(unit => unit.update());

    // 更新所有塔
    [...gameState.blueTowers, ...gameState.redTowers].forEach(tower => tower.update());

    // 更新投射物
    gameState.projectiles = gameState.projectiles.filter(p => p.update());

    // 检查游戏结束
    checkGameEnd();

    renderGame();
}

// 渲染游戏
function renderGame() {
    const gameMap = document.getElementById('gameMap');
    gameMap.innerHTML = '<div class="minimap" id="minimap"></div>';

    // 渲染单位
    [...gameState.blueTeam, ...gameState.redTeam].forEach(unit => {
        if (unit.alive) {
            const unitEl = document.createElement('div');
            unitEl.className = `unit ${unit.team}${gameState.selectedUnit === unit ? ' selected' : ''}`;
            unitEl.style.left = unit.x - 15 + 'px';
            unitEl.style.top = unit.y - 15 + 'px';
            unitEl.innerHTML = `
                <div class="unit-label">${unit.type}</div>
                ${unit.getEmoji()}
                <div class="healthbar">
                    <div class="healthbar-fill" style="width: ${(unit.health / unit.maxHealth) * 100}%"></div>
                </div>
            `;
            unitEl.onclick = (e) => {
                e.stopPropagation();
                selectUnit(unit);
            };
            gameMap.appendChild(unitEl);
        }
    });

    // 渲染防御塔
    [...gameState.blueTowers, ...gameState.redTowers].forEach(tower => {
        if (tower.alive) {
            const towerEl = document.createElement('div');
            towerEl.className = `tower ${tower.team}`;
            towerEl.style.left = tower.x - 12 + 'px';
            towerEl.style.top = tower.y - 12 + 'px';
            towerEl.textContent = tower.team === 'blue' ? '🏰' : '🏯';
            gameMap.appendChild(towerEl);
        }
    });

    // 渲染投射物
    gameState.projectiles.forEach(projectile => {
        const projEl = document.createElement('div');
        projEl.className = `projectile ${projectile.team}`;
        projEl.style.left = projectile.x + 'px';
        projEl.style.top = projectile.y + 'px';
        gameMap.appendChild(projEl);
    });

    // 渲染小地图
    renderMinimap();
}

// 渲染小地图
function renderMinimap() {
    const minimap = document.getElementById('minimap');
    minimap.innerHTML = '';

    const scale = 200 / GAME_CONFIG.mapWidth;

    [...gameState.blueTeam, ...gameState.redTeam].forEach(unit => {
        if (unit.alive) {
            const dot = document.createElement('div');
            dot.className = `minimap-entity ${unit.team}`;
            dot.style.left = (unit.x * scale) + 'px';
            dot.style.top = (unit.y * scale) + 'px';
            minimap.appendChild(dot);
        }
    });
}

// 选择单位
function selectUnit(unit) {
    gameState.selectedUnit = unit;
    updateUnitInfo();
}

// 更新单位信息面板
function updateUnitInfo() {
    const unitInfo = document.getElementById('unitInfo');
    if (!gameState.selectedUnit || !gameState.selectedUnit.alive) {
        unitInfo.innerHTML = '<div class="unit-name">选择一个单位</div>';
        return;
    }

    const unit = gameState.selectedUnit;
    unitInfo.innerHTML = `
        <div class="unit-name">${unit.type.toUpperCase()} - ${unit.team === 'blue' ? '蓝队' : '红队'}</div>
        <div class="unit-stat">
            <span>生命值:</span>
            <span>${Math.ceil(unit.health)} / ${unit.maxHealth}</span>
        </div>
        <div class="unit-stat">
            <span>攻击力:</span>
            <span>${unit.damage}</span>
        </div>
        <div class="unit-stat">
            <span>防御:</span>
            <span>${unit.armor}</span>
        </div>
    `;
}

// 更新统计信息
function updateStats() {
    document.getElementById('blueKills').textContent = gameState.kills.blue;
    document.getElementById('redKills').textContent = gameState.kills.red;
    document.getElementById('blueGold').textContent = gameState.gold.blue;
    document.getElementById('redGold').textContent = gameState.gold.red;
}

// 添加游戏日志
function addLog(message, type = 'normal') {
    const gameLog = document.getElementById('gameLog');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = message;
    gameLog.insertBefore(logEntry, gameLog.firstChild);

    // 只保留最近10条日志
    while (gameLog.children.length > 10) {
        gameLog.removeChild(gameLog.lastChild);
    }
}

// 攻击最近敌人
function attackNearestEnemy() {
    if (!gameState.selectedUnit || !gameState.selectedUnit.alive) {
        addLog('请先选择一个单位', 'normal');
        return;
    }
    gameState.selectedUnit.findTarget();
    addLog(`${gameState.selectedUnit.type} 已选择目标`, 'normal');
}

// 保卫基地
function defendBase() {
    if (!gameState.selectedUnit || !gameState.selectedUnit.alive) {
        addLog('请先选择一个单位', 'normal');
        return;
    }
    const unit = gameState.selectedUnit;
    const baseX = unit.team === 'blue' ? 100 : GAME_CONFIG.mapWidth - 100;
    const baseY = GAME_CONFIG.mapHeight / 2;
    unit.targetX = baseX;
    unit.targetY = baseY;
    unit.target = null;
    addLog(`${unit.type} 正在返回基地`, 'defend');
}

// 暂停/继续游戏
function pauseGame() {
    gameState.isPaused = !gameState.isPaused;
    addLog(gameState.isPaused ? '游戏已暂停' : '游戏继续', 'normal');
}

// 检查游戏结束
function checkGameEnd() {
    const blueAlive = gameState.blueTeam.filter(u => u.alive).length;
    const redAlive = gameState.redTeam.filter(u => u.alive).length;

    if (blueAlive === 0) {
        endGame('red');
    } else if (redAlive === 0) {
        endGame('blue');
    }

    // 检查塔的数量
    const blueTowersAlive = gameState.blueTowers.filter(t => t.alive).length;
    const redTowersAlive = gameState.redTowers.filter(t => t.alive).length;

    if (blueTowersAlive === 0) {
        endGame('red');
    } else if (redTowersAlive === 0) {
        endGame('blue');
    }
}

// 游戏结束
function endGame(winner) {
    gameState.isPaused = true;
    const message = winner === 'blue' ? '🔵 蓝队获胜！' : '🔴 红队获胜！';
    addLog(message, 'kill');
    alert(message + '\n\n蓝队击杀: ' + gameState.kills.blue + '\n红队击杀: ' + gameState.kills.red);
}

// 游戏循环
let gameLoop = setInterval(updateGame, 1000 / GAME_CONFIG.gameSpeed);

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    updateStats();
});
