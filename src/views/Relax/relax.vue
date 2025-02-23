<template>
  <div class="page-container">
    <!-- 动态背景 -->
    <div class="animated-background"></div>

    <!-- 四周古诗词 -->
    <div class="poetry-elements">
      <div class="poem">"会当凌绝顶，一览众山小。" - 杜甫</div>
      <div class="poem">"采菊东篱下，悠然见南山。" - 陶渊明</div>
      <div class="poem">"长风破浪会有时，直挂云帆济沧海。" - 李白</div>
      <div class="poem">"绿树村边合，青山郭外斜。" - 王维</div>
    </div>

    <div class="countdown-container">
      <h2 class="title">
        <span class="emoji">⏰</span>
        下班倒计时
        <span class="emoji">🎉</span>
      </h2>

      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>

      <div class="time-display">
        <div class="time-block">
          <span class="time">{{ hours }}</span>
          <span class="label">小时</span>
        </div>
        <div class="time-block">
          <span class="time">{{ minutes }}</span>
          <span class="label">分钟</span>
        </div>
        <div class="time-block">
          <span class="time">{{ seconds }}</span>
          <span class="label">秒</span>
        </div>
      </div>

      <div class="motivation">
        {{ motivationalMessage }}
      </div>

      <div class="target-time"> <span class="icon">🌙</span> 下班时间: 18:30 </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let timer: number

const motivationalMessages = [
  '马上就要下班啦，再坚持一下！ 💪',
  '今天也辛苦了！ 🌟',
  '想想美好的下班时光~ 🎵',
  '快要解放啦！ 🚀',
  '马上就能回家啦！ 🏠',
  '放松心情，享受生活！ 🌈',
  '下班后的小确幸在等着你！ 🍰',
  '再努力一点，胜利就在眼前！ 🏆'
]

const motivationalMessage = ref(motivationalMessages[0])

const calculateTimeLeft = () => {
  const now = new Date()
  const target = new Date()
  target.setHours(18, 30, 0)

  if (now >= target) {
    target.setDate(target.getDate() + 1)
  }

  const diff = target.getTime() - now.getTime()

  hours.value = Math.floor(diff / (1000 * 60 * 60))
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000)

  // 随机更换激励消息
  if (seconds.value % 10 === 0) {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
    motivationalMessage.value = motivationalMessages[randomIndex]
  }
}

// 计算工作进度百分比
const progressPercentage = computed(() => {
  const now = new Date()
  const start = new Date()
  start.setHours(9, 0, 0)
  const end = new Date()
  end.setHours(18, 30, 0)

  const total = end.getTime() - start.getTime()
  const current = now.getTime() - start.getTime()

  return Math.min(Math.max((current / total) * 100, 0), 100)
})

onMounted(() => {
  calculateTimeLeft()
  timer = setInterval(calculateTimeLeft, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.page-container {
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, #ff6b6b, #4ecdc4, #45b7d1);
}

.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #ff6b6b);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  z-index: -1;
  opacity: 0.2;
}

.poetry-elements {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 18px;
  z-index: 1;
  flex-wrap: wrap;
}

.poem {
  margin: 10px;
  font-style: italic;
  text-align: center;
  width: 45%;
}

.countdown-container {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  margin: 40px auto;
  max-width: 700px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
  transform: translateY(0);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.title {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.emoji {
  font-size: 40px;
  animation: shake 2s ease-in-out infinite;
  display: inline-block;
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}

.progress-bar {
  height: 12px;
  background: #eee;
  border-radius: 6px;
  margin: 20px 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #45b7d1);
  transition: width 0.3s ease;
}

.time-display {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  font-size: 40px;
  min-width: 80px;
  display: inline-block;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.time:hover {
  transform: scale(1.1);
}

.label {
  margin-top: 10px;
  color: #666;
  font-size: 16px;
}

.motivation {
  font-size: 22px;
  color: #2c3e50;
  margin: 20px 0;
  padding: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.target-time {
  color: #666;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.icon {
  font-size: 26px;
}
</style>
