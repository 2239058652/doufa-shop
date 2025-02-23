<template>
  <RelaxModal />
  <div class="page-container" :style="{ '--theme-color': currentColor }">
    <!-- 游戏元素 -->
    <div class="game-elements">
      <div
        v-for="(item, index) in gameItems"
        :key="index"
        class="game-item"
        :class="item.type"
        :style="item.style"
        @click="collectItem(index)"
      >
        <span v-if="item.type === 'coffee'">☕</span>
        <span v-if="item.type === 'work'">📄</span>
        <span v-if="item.type === 'boss'">👔</span>
      </div>
    </div>

    <!-- 游戏状态 -->
    <div class="game-hud">
      <div class="energy-bar">
        <div class="energy" :style="{ width: energy + '%' }"></div>
      </div>
      <div class="score">得分: {{ score }}</div>
      <div class="multiplier">连击 x{{ comboMultiplier }}</div>
    </div>

    <!-- 倒计时容器 -->
    <div class="countdown-container">
      <!-- 原有倒计时结构... -->

      <!-- 新增游戏进度 -->
      <div class="game-progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: gameProgress + '%' }"></div>
        </div>
        <div class="milestones">
          <div v-for="n in 5" :key="n" class="milestone" :class="{ active: n * 20 <= gameProgress }"></div>
        </div>
      </div>

      <!-- 成就提示 -->
      <transition-group name="pop" tag="div" class="achievements">
        <div v-for="(ach, index) in activeAchievements" :key="ach.name" class="achievement">
          🏆 {{ ach.name }} +{{ ach.points }}
        </div>
      </transition-group>
    </div>

    <!-- 角色动画 -->
    <div class="character" :style="characterStyle">
      <div class="emoji">{{ characterState }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import RelaxModal from './relax.vue'

// 游戏核心数据
const energy = ref(100)
const score = ref(0)
const combo = ref(0)
const gameProgress = ref(0)
const gameItems = ref<Array<{ type: string; style: any }>>([])
const activeAchievements = ref<Array<{ name: string; points: number }>>([])

// 游戏配置
const COMBO_TIMEOUT = 2000
const ITEM_SPAWN_RATE = 800
const TYPES = ['coffee', 'work', 'boss']
const ACHIEVEMENTS = [
  { name: '新手打工人', score: 50 },
  { name: '咖啡达人', collect: { coffee: 10 } },
  { name: '工作狂', collect: { work: 20 } },
  { name: '摸鱼大师', score: 300 }
]

// 游戏状态计算
const comboMultiplier = computed(() => Math.min(5, Math.floor(combo.value / 5) + 1))
const characterState = computed(() => {
  if (energy.value < 20) return '😫'
  if (combo.value > 8) return '🚀'
  return energy.value > 80 ? '😎' : '😃'
})

const characterStyle = computed(() => ({
  transform: `translateY(${Math.sin(Date.now() / 300) * 10}px)`,
  filter: `hue-rotate(${score.value}deg)`
}))

// 游戏逻辑
let lastClickTime = 0
let itemSpawner: number
let comboTimeout: number

const spawnItem = () => {
  const type = TYPES[Math.floor(Math.random() * 3)]
  gameItems.value.push({
    type,
    style: {
      left: Math.random() * 90 + '%',
      top: Math.random() * 90 + '%',
      animationDuration: Math.random() * 3 + 2 + 's'
    }
  })
}

const collectItem = (index: number) => {
  const item = gameItems.value[index]
  const now = Date.now()

  // 连击系统
  combo.value = now - lastClickTime < COMBO_TIMEOUT ? combo.value + 1 : 1
  lastClickTime = now

  // 得分计算
  let points = 0
  switch (item.type) {
    case 'coffee':
      points = 50
      energy.value = Math.min(100, energy.value + 15)
      break
    case 'work':
      points = 30
      gameProgress.value = Math.min(100, gameProgress.value + 2)
      break
    case 'boss':
      points = 100
      energy.value = Math.max(0, energy.value - 30)
      break
  }

  score.value += points * comboMultiplier.value
  checkAchievements()
  playCollectEffect(index)
}

const playCollectEffect = (index: number) => {
  const item = gameItems.value[index]
  item.style.animation = 'collect 0.5s'
  setTimeout(() => {
    gameItems.value.splice(index, 1)
  }, 500)
}

const checkAchievements = () => {
  ACHIEVEMENTS.forEach((ach) => {
    if (!activeAchievements.value.find((a) => a.name === ach.name)) {
      let unlocked = false
      if (ach.score && score.value >= ach.score) unlocked = true
      if (ach.collect) {
        unlocked = Object.entries(ach.collect).every(
          ([type, count]) => gameItems.value.filter((i) => i.type === type).length >= count
        )
      }
      if (unlocked) {
        activeAchievements.value.push({
          name: ach.name,
          points: ach.score || 100
        })
        setTimeout(() => {
          activeAchievements.value.shift()
        }, 3000)
      }
    }
  })
}

// 游戏循环
const gameLoop = () => {
  energy.value = Math.max(0, energy.value - 0.1)
  gameProgress.value = Math.min(100, gameProgress.value + 0.05)

  if (energy.value <= 0) {
    gameItems.value = []
    activeAchievements.value = []
  }
}

onMounted(() => {
  itemSpawner = setInterval(spawnItem, ITEM_SPAWN_RATE)
  setInterval(gameLoop, 100)
})

onUnmounted(() => {
  clearInterval(itemSpawner)
})
</script>

<style scoped>
/* 游戏元素样式 */
.game-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.game-item {
  position: absolute;
  font-size: 2rem;
  cursor: pointer;
  pointer-events: auto;
  animation: float 3s infinite;
  transition: 0.3s;
}

.game-item.coffee {
  animation-name: coffee-float;
}
.game-item.work {
  transform: rotate(10deg);
}
.game-item.boss {
  font-size: 3rem;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes coffee-float {
  0%,
  100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

/* 游戏HUD */
.game-hud {
  position: fixed;
  top: 20px;
  left: 20px;
  color: white;
  z-index: 100;
}

.energy-bar {
  width: 200px;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
}

.energy {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s;
}

.score {
  font-size: 1.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.multiplier {
  color: #ffd700;
  font-weight: bold;
  animation: glow 1s infinite;
}

/* 角色动画 */
.character {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 4rem;
  transition: 0.3s;
}

/* 成就提示 */
.achievements {
  position: fixed;
  top: 20px;
  right: 20px;
}

.achievement {
  background: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  animation: achievement-pop 0.5s;
}

@keyframes achievement-pop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 收集动画 */
@keyframes collect {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

/* 游戏进度条 */
.game-progress {
  margin: 20px 0;
  position: relative;
}

.progress-track {
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  transition: width 0.5s;
}

.milestones {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.milestone {
  width: 15px;
  height: 15px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.milestone.active {
  background: #ffd700;
  box-shadow: 0 0 10px #ffd700;
}
</style>
