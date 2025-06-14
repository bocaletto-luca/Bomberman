# Bomberman – WEBGAME 🎮💣
#### Author: Bocaletto Luca

[![Made with HTML5](https://img.shields.io/badge/Made%20with-HTML5-E34F26?logo=html5)](https://www.w3.org/html/)  
[![Made with CSS3](https://img.shields.io/badge/Made%20with-CSS3-1572B6?logo=css3)](https://www.w3.org/Style/CSS/)  
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-F7DF1E?logo=javascript)](https://developer.mozilla.org/docs/Web/JavaScript)  

[Test Online](https://github.com/bocaletto-luca/Bomberman/index.html)
## Overview

Bomberman Dynablaster – Single Player Edition is a modern, web-based remake of the classic Bomberman series with a twist inspired by the Italian *Dynablaster* variant. The game features dynamic grid‑based levels, bomb mechanics that allow for chain reactions, strategic power‑ups, and clever enemy AI – all wrapped up in a neon-retro, arcade aesthetic that works perfectly on both desktop and mobile browsers.

## Features

- **Grid-Based Levels:**  
  - Play on a 15×13 grid with outer indestructible walls and inner destructible blocks.
  - The top‑left area is reserved for the player's safe starting zone.
  
- **Player Controls:**  
  - **Movement:** Use the Arrow keys to move smoothly from cell to cell.
  - **Action:** Press **Space** to plant bombs with a 2‑second timer.
  
- **Bomb & Explosion Mechanics:**  
  - Bombs create cross‑shaped explosions that travel up, down, left, and right.
  - The blast radius is determined by your current bomb power.
  - Chain reactions: explosions can trigger nearby bombs.
  
- **Power-Up Capsules:**  
  - **Red Capsule:** (Dropped by destructible blocks at a 10% chance) Grants an extra bomb capacity for 10 seconds.
  - **Blue Capsule:** (Also at a 10% chance) Provides a temporary barrier protection for 10 seconds that prevents explosion damage.
  - Active power-ups are clearly displayed in the HUD with countdown timers.
  
- **Enemy Bots:**  
  - Enemies spawn in randomly selected empty cells (ensuring ample space) so they don’t trap themselves.
  - They are “purple” foes with 2 HP – a single explosion stuns them, and a second hit eliminates them.
  - Enemies can also place bombs (with a low probability) and quickly move away to avoid self-damage.
  
- **HUD & Level Progression:**  
  - The HUD displays **Lives**, **Score**, **Level**, and details of active power-ups.
  - Levels progress automatically when all destructible blocks are cleared, awarding bonus points.
  
- **Responsive & Modern Design:**  
  - A full start screen overlay welcomes the player before the game begins.
  - The game renders on an HTML5 Canvas using a retro neon-inspired style.
  - Designed to be fully responsive on both desktop and mobile platforms.
  
- **High Score Board:**  
  - Players’ names and top scores are stored in localStorage and displayed on a high score board.

## Installation

1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/bocaletto-luca/Bomberman.git
2. Start Webserver apache and open in web browser index.html

#### Enjoy Game - By Bocaletto Luca
