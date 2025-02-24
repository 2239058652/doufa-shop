<template>
  <RelaxModal />
  <div class="game-container">
    <div class="game-header">
      <div class="score">得分: {{ score }}</div>
      <div class="controls">
        <button @click="resetGame">新游戏</button>
        <div class="direction-keys">
          <button @click="changeDirection('UP')">↑</button>
          <button @click="changeDirection('LEFT')">←</button>
          <button @click="changeDirection('DOWN')">↓</button>
          <button @click="changeDirection('RIGHT')">→</button>
        </div>
      </div>
    </div>

    <div class="game-board" :style="gridStyle">
      <div
        v-for="(cell, index) in cells"
        :key="index"
        class="cell"
        :class="{
          'snake-body': cell.isSnake,
          'snake-head': cell.isHead,
          food: cell.isFood
        }"
      ></div>
    </div>

    <div v-if="gameOver" class="game-over">
      <h2>游戏结束!</h2>
      <p>最终得分: {{ score }}</p>
      <button @click="resetGame">再玩一次</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import RelaxModal from './relax.vue'

// 游戏配置
const GRID_SIZE = 20
const GAME_SPEED = 150

// 游戏状态
const snake = ref([{ x: 10, y: 10 }])
const direction = ref('RIGHT')
const food = ref({ x: 15, y: 15 })
const score = ref(0)
const gameOver = ref(false)
let gameInterval: number

// 生成网格
const cells = computed(() => {
  const grid = []
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isSnake = snake.value.some((segment) => segment.x === x && segment.y === y)
      const isHead = snake.value[0].x === x && snake.value[0].y === y
      const isFood = food.value.x === x && food.value.y === y
      grid.push({ x, y, isSnake, isHead, isFood })
    }
  }
  return grid
})

// 网格样式
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
}))

// 生成食物
const generateFood = () => {
  do {
    food.value = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  } while (snake.value.some((segment) => segment.x === food.value.x && segment.y === food.value.y))
}

// 移动蛇
const moveSnake = () => {
  if (gameOver.value) return

  const head = { ...snake.value[0] }

  switch (direction.value) {
    case 'UP':
      head.y--
      break
    case 'DOWN':
      head.y++
      break
    case 'LEFT':
      head.x--
      break
    case 'RIGHT':
      head.x++
      break
  }

  // 碰撞检测
  if (
    head.x < 0 ||
    head.x >= GRID_SIZE ||
    head.y < 0 ||
    head.y >= GRID_SIZE ||
    snake.value.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver.value = true
    return
  }

  // 添加新头部
  snake.value.unshift(head)

  // 吃食物检测
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    generateFood()
  } else {
    snake.value.pop()
  }
}

// 改变方向
const changeDirection = (newDir: string) => {
  const oppositeDirs: Record<string, string> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
  }
  if (oppositeDirs[newDir] !== direction.value) {
    direction.value = newDir
  }
}

// 重置游戏
const resetGame = () => {
  snake.value = [{ x: 10, y: 10 }]
  direction.value = 'RIGHT'
  score.value = 0
  gameOver.value = false
  generateFood()
  startGame()
}

// 开始游戏循环
const startGame = () => {
  if (gameInterval) clearInterval(gameInterval)
  gameInterval = setInterval(moveSnake, GAME_SPEED)
}

// 键盘控制
const handleKeyPress = (e: KeyboardEvent) => {
  const directions: Record<string, string> = {
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT'
  }
  if (directions[e.key]) {
    e.preventDefault()
    changeDirection(directions[e.key])
  }
}

onMounted(() => {
  generateFood()
  startGame()
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  clearInterval(gameInterval)
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background: #2c3e50;
  padding: 20px;
}

.game-header {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: white;
}

.game-board {
  width: 90vmin;
  height: 90vmin;
  max-width: 600px;
  max-height: 600px;
  display: grid;
  background: #34495e;
  border: 2px solid #ecf0f1;
  border-radius: 5px;
}

.cell {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.snake-body {
  background: #2ecc71;
  border-radius: 25%;
}

.snake-head {
  background: #27ae60;
  border-radius: 35%;
}

.food {
  background: #e74c3c;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(0.9);
  }
}

.controls {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  background: #3498db;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  background: #2980b9;
}

.direction-keys {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.direction-keys button {
  width: 40px;
  height: 40px;
  padding: 0;
}

.game-over {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 20px 40px;
  border-radius: 10px;
  color: white;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
</style>
