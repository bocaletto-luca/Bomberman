/*********************
     * CONFIGURATION & GLOBALS
     *********************/
    const TILE_SIZE = 32;
    const COLS = 15;
    const ROWS = 13;
    let levelMap = [];
    // Level map encoding: 0 = empty, 1 = indestructible wall, 2 = destructible block.
    function generateLevel() {
      levelMap = [];
      for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
          if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
            row.push(1);
          } else if (r % 2 === 0 && c % 2 === 0) {
            row.push(1);
          } else {
            // Reserve a clear area (top-left 3x3) for player start.
            if (r < 3 && c < 3) row.push(0);
            else row.push(Math.random() < 0.8 ? 2 : 0);
          }
        }
        levelMap.push(row);
      }
    }
    
    // Player configuration.
    const player = {
      gridX: 1,
      gridY: 1,
      x: 1 * TILE_SIZE,
      y: 1 * TILE_SIZE,
      size: TILE_SIZE - 4,
      speed: 2, // pixels per frame update.
      lives: 3,
      bombPower: 2,
      maxBombs: 1,
      bombsPlaced: 0,
      invulnerable: false
    };
    
    let bombs = [];
    let explosions = [];
    let enemies = [];
    let score = 0;
    let level = 1;
    
    // Spawn simple enemies. In this version, enemies are purple and have 2 HP.
    function spawnEnemies() {
      enemies = [];
      enemies.push({
        gridX: COLS - 2,
        gridY: ROWS - 2,
        x: (COLS - 2) * TILE_SIZE,
        y: (ROWS - 2) * TILE_SIZE,
        moveTimer: 0,
        hp: 2,
        stunned: false,
        stunTime: 0
      });
      enemies.push({
        gridX: COLS - 3,
        gridY: 1,
        x: (COLS - 3) * TILE_SIZE,
        y: 1 * TILE_SIZE,
        moveTimer: 0,
        hp: 2,
        stunned: false,
        stunTime: 0
      });
    }
    
    /*********************
     * HUD UPDATE
     *********************/
    function updateHUD() {
      document.getElementById("livesDisplay").textContent = "Lives: " + player.lives;
      document.getElementById("scoreDisplay").textContent = "Score: " + score;
      document.getElementById("levelDisplay").textContent = "Level: " + level;
    }
    
    /*********************
     * CANVAS SETUP
     *********************/
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    /*********************
     * INPUT HANDLING
     *********************/
    const keys = {};
    window.addEventListener("keydown", (e) => { keys[e.key] = true; });
    window.addEventListener("keyup", (e) => { keys[e.key] = false; });
    
    /*********************
     * GAME LOGIC FUNCTIONS
     *********************/
    function updatePlayer(dt) {
      let dx = 0, dy = 0;
      if (keys["ArrowUp"]) dy = -player.speed;
      if (keys["ArrowDown"]) dy = player.speed;
      if (keys["ArrowLeft"]) dx = -player.speed;
      if (keys["ArrowRight"]) dx = player.speed;
      let newX = player.x + dx;
      let newY = player.y + dy;
      let newCol = Math.floor((newX + TILE_SIZE/2) / TILE_SIZE);
      let newRow = Math.floor((newY + TILE_SIZE/2) / TILE_SIZE);
      if (levelMap[newRow] && levelMap[newRow][newCol] === 0) {
        player.x = newX;
        player.y = newY;
        player.gridX = newCol;
        player.gridY = newRow;
      }
    }
    
    window.addEventListener("keydown", function(e) {
      if (e.key === " ") {
        if (player.bombsPlaced < player.maxBombs && !bombs.find(b => b.gridX === player.gridX && b.gridY === player.gridY)) {
          bombs.push({
            gridX: player.gridX,
            gridY: player.gridY,
            x: player.gridX * TILE_SIZE,
            y: player.gridY * TILE_SIZE,
            timer: 2000, // 2-second delay before explosion.
            exploded: false
          });
          player.bombsPlaced++;
        }
        keys[" "] = false;
      }
    });
    
    function triggerExplosion(bomb) {
      let cells = [{ x: bomb.gridX, y: bomb.gridY }];
      const dirs = [{dx:1,dy:0}, {dx:-1,dy:0}, {dx:0,dy:1}, {dx:0,dy:-1}];
      for (let d of dirs) {
        for (let i = 1; i <= player.bombPower; i++) {
          let cx = bomb.gridX + d.dx * i;
          let cy = bomb.gridY + d.dy * i;
          if (levelMap[cy] && levelMap[cy][cx] === 1) break;
          cells.push({ x: cx, y: cy });
          if (levelMap[cy] && levelMap[cy][cx] === 2) break;
        }
      }
      explosions.push({ cells: cells, timer: 500 });
      cells.forEach(cell => {
        if (levelMap[cell.y] && levelMap[cell.y][cell.x] === 2) {
          levelMap[cell.y][cell.x] = 0;
          score += 10;
        }
      });
    }
    
    function isCellExploding(x, y) {
      for (let exp of explosions) {
        for (let cell of exp.cells) {
          if (cell.x === x && cell.y === y) return true;
        }
      }
      return false;
    }
    
    function updateBombs(dt) {
      for (let i = bombs.length - 1; i >= 0; i--) {
        bombs[i].timer -= dt;
        if (bombs[i].timer <= 0 && !bombs[i].exploded) {
          triggerExplosion(bombs[i]);
          bombs[i].exploded = true;
          player.bombsPlaced--;
          bombs.splice(i, 1);
        }
      }
    }
    
    function updateExplosions(dt) {
      for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].timer -= dt;
        if (explosions[i].timer <= 0) {
          explosions.splice(i, 1);
        }
      }
    }
    
    // Enemy collision handling: Purple enemies (with 2 HP) will only be removed after 2 explosions.
    function checkExplosionEnemyCollision() {
      enemies.forEach((enemy, i) => {
        if (isCellExploding(enemy.gridX, enemy.gridY)) {
          enemy.hp--;
          enemy.stunned = true;
          enemy.stunTime = 1000;
          if (enemy.hp <= 0) {
            score += 50;
            enemies.splice(i, 1);
          }
        }
      });
    }
    
    function updateEnemyStun(dt, enemy) {
      if (enemy.stunned) {
        enemy.stunTime -= dt;
        if (enemy.stunTime <= 0) enemy.stunned = false;
      }
    }
    
    function updateEnemies(dt) {
      enemies.forEach(enemy => {
        updateEnemyStun(dt, enemy);
        if (!enemy.stunned) {
          enemy.moveTimer += dt;
          if (enemy.moveTimer > 1000) {
            const dirs = [{dx:0,dy:-1}, {dx:0,dy:1}, {dx:-1,dy:0}, {dx:1,dy:0}];
            let possible = dirs.filter(dir => 
              (levelMap[enemy.gridY + dir.dy] && levelMap[enemy.gridY + dir.dy][enemy.gridX + dir.dx] === 0)
            );
            if (possible.length > 0) {
              let move = possible[Math.floor(Math.random() * possible.length)];
              enemy.gridX += move.dx;
              enemy.gridY += move.dy;
              enemy.x = enemy.gridX * TILE_SIZE;
              enemy.y = enemy.gridY * TILE_SIZE;
            }
            enemy.moveTimer = 0;
          }
        }
      });
    }
    
    function update(dt) {
      updatePlayer(dt);
      updateBombs(dt);
      updateExplosions(dt);
      updateEnemies(dt);
      checkExplosionEnemyCollision();
      if (isCellExploding(player.gridX, player.gridY) && !player.invulnerable) {
        player.lives--;
        updateHUD();
        player.invulnerable = true;
        setTimeout(() => { player.invulnerable = false; }, 1000);
        player.x = TILE_SIZE;
        player.y = TILE_SIZE;
        player.gridX = 1;
        player.gridY = 1;
      }
      let levelComplete = true;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (levelMap[r][c] === 2) { levelComplete = false; break; }
        }
        if (!levelComplete) break;
      }
      if (levelComplete) {
        level++;
        score += 100;
        generateLevel();
        spawnEnemies();
      }
    }
    
    /*********************
     * RENDERING FUNCTIONS
     *********************/
    function renderGame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          let x = c * TILE_SIZE;
          let y = r * TILE_SIZE;
          if (levelMap[r][c] === 1) { ctx.fillStyle = "#333399"; ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE); }
          else if (levelMap[r][c] === 2) { ctx.fillStyle = "#ff9933"; ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE); }
          else { ctx.fillStyle = "#000"; ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE); }
          ctx.strokeStyle = "#111";
          ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
        }
      }
      bombs.forEach(bomb => {
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(bomb.x + TILE_SIZE/2, bomb.y + TILE_SIZE/2, TILE_SIZE/3, 0, Math.PI*2);
        ctx.fill();
      });
      explosions.forEach(exp => {
        exp.cells.forEach(cell => {
          let x = cell.x * TILE_SIZE;
          let y = cell.y * TILE_SIZE;
          ctx.fillStyle = "rgba(255,255,0,0.7)";
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        });
      });
      ctx.fillStyle = "#00ccff";
      ctx.beginPath();
      ctx.arc(player.x + TILE_SIZE/2, player.y + TILE_SIZE/2, player.size/2, 0, Math.PI*2);
      ctx.fill();
      enemies.forEach(enemy => {
        ctx.fillStyle = "#ff00ff";
        ctx.beginPath();
        ctx.arc(enemy.x + TILE_SIZE/2, enemy.y + TILE_SIZE/2, TILE_SIZE/2 - 2, 0, Math.PI*2);
        ctx.fill();
      });
    }
    
    let lastTime = performance.now();
    function gameLoop(timestamp) {
      let dt = timestamp - lastTime;
      lastTime = timestamp;
      update(dt);
      renderGame();
      updateHUD();
      if (player.lives <= 0) { alert("Game Over! Your score: " + score); newGame(); return; }
      requestAnimationFrame(gameLoop);
    }
    
    /*********************
     * New Game Setup & Start Screen
     *********************/
    function newGame() {
      score = 0;
      level = 1;
      player.lives = 3;
      player.bombPower = 2;
      player.maxBombs = 1;
      player.bombsPlaced = 0;
      player.gridX = 1;
      player.gridY = 1;
      player.x = TILE_SIZE;
      player.y = TILE_SIZE;
      generateLevel();
      spawnEnemies();
      lastTime = performance.now();
      requestAnimationFrame(gameLoop);
      // Set focus to canvas to capture arrow key events.
      canvas.focus();
    }
    
    // Start Screen handling.
    document.getElementById("startButton").addEventListener("click", function(){
      document.getElementById("startScreen").style.display = "none";
      newGame();
    });
