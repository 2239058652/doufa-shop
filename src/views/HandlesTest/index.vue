<template>
  <div class="container">
    <div v-if="!cvLoaded" class="loading">正在加载 OpenCV.js，请稍候...</div>
    <div v-else class="content">
      <input type="file" accept="image/*" @change="handleFileUpload" />
      <div class="images-container">
        <div class="image-box">
          <h3>原始图片</h3>
          <canvas ref="sourceCanvas"></canvas>
        </div>
        <div class="image-box">
          <h3>提取的印章</h3>
          <canvas ref="resultCanvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const cvLoaded = ref(false)
const sourceCanvas = ref(null)
const resultCanvas = ref(null)

const onOpenCvLoaded = () => {
  console.log('OpenCV.js 加载完成')
  cvLoaded.value = true
}

const handleFileUpload = async (event) => {
  try {
    const file = event.target.files[0]
    if (!file) return
    const img = await loadImage(file)
    await processImage(img)
  } catch (error) {
    console.error('处理图像时出错:', error)
  }
}

const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.crossOrigin = 'anonymous' // 添加跨域支持

      img.onload = () => {
        // 验证图像是否正确加载
        if (img.width > 0 && img.height > 0) {
          resolve(img)
        } else {
          reject(new Error('图片加载失败'))
        }
      }

      img.onerror = () => reject(new Error('图片加载错误'))
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

const processImage = async (img) => {
  const matsToDelete = []

  try {
    // 添加调试日志
    console.log('图像尺寸:', img.width, img.height)

    // 检查图像尺寸
    const MAX_SIZE = 2048
    let width = img.width
    let height = img.height

    // 如果图像太大，进行缩放
    if (width > MAX_SIZE || height > MAX_SIZE) {
      const scale = MAX_SIZE / Math.max(width, height)
      width = Math.floor(width * scale)
      height = Math.floor(height * scale)
    }

    // 设置canvas尺寸
    sourceCanvas.value.width = width
    sourceCanvas.value.height = height
    const sCtx = sourceCanvas.value.getContext('2d')
    sCtx.drawImage(img, 0, 0, width, height)

    // 处理图片
    const src = cv.imread(sourceCanvas.value)
    console.log('OpenCV Mat 信息:', src.rows, src.cols, src.type())
    matsToDelete.push(src)

    const dst = new cv.Mat()
    matsToDelete.push(dst)
    cv.cvtColor(src, dst, cv.COLOR_BGR2HSV)

    // 创建HSV阈值
    const lower1 = new cv.Mat(src.rows, src.cols, src.type(), [0, 70, 50, 0])
    const upper1 = new cv.Mat(src.rows, src.cols, src.type(), [15, 255, 255, 255])
    const lower2 = new cv.Mat(src.rows, src.cols, src.type(), [160, 70, 50, 0])
    const upper2 = new cv.Mat(src.rows, src.cols, src.type(), [180, 255, 255, 255])
    matsToDelete.push(lower1, upper1, lower2, upper2)

    // 提取红色区域
    const mask1 = new cv.Mat()
    const mask2 = new cv.Mat()
    const mask = new cv.Mat()
    matsToDelete.push(mask1, mask2, mask)

    cv.inRange(dst, lower1, upper1, mask1)
    cv.inRange(dst, lower2, upper2, mask2)
    cv.add(mask1, mask2, mask)

    // 2. 在这里添加高斯模糊
    const blurred = new cv.Mat()
    matsToDelete.push(blurred)
    cv.GaussianBlur(mask, blurred, new cv.Size(5, 5), 0)

    // 形态学操作
    const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(3, 3))
    const morphed = new cv.Mat()
    matsToDelete.push(kernel, morphed)
    cv.morphologyEx(blurred, morphed, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 2)

    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    matsToDelete.push(hierarchy)

    cv.findContours(morphed, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

    // 在关键步骤添加检查
    console.log('检测到的轮廓数量:', contours.size())

    // 找到轮廓
    let maxArea = 0
    let maxContourIndex = -1
    for (let i = 0; i < contours.size(); i++) {
      const area = cv.contourArea(contours.get(i))
      const perimeter = cv.arcLength(contours.get(i), true)
      const circularity = (4 * Math.PI * area) / (perimeter * perimeter)

      if (area > 200 && circularity > 0.6 && area > maxArea) {
        maxArea = area
        maxContourIndex = i
      }
    }

    console.log('最大轮廓索引:', maxContourIndex)

    if (maxContourIndex !== -1) {
      const rect = cv.boundingRect(contours.get(maxContourIndex))
      console.log('检测到的矩形区域:', rect)
      const padding = 10

      // 添加 padding 并确保不超出图像边界
      rect.x = Math.max(0, rect.x - padding)
      rect.y = Math.max(0, rect.y - padding)
      rect.width = Math.min(src.cols - rect.x, rect.width + 2 * padding)
      rect.height = Math.min(src.rows - rect.y, rect.height + 2 * padding)

      if (rect.width > 0 && rect.height > 0) {
        const stamp = src.roi(rect)
        matsToDelete.push(stamp)
        resultCanvas.value.width = rect.width
        resultCanvas.value.height = rect.height
        cv.imshow(resultCanvas.value, stamp)
      }
    } else {
      throw new Error('未检测到印章')
    }
  } catch (error) {
    console.error('详细错误信息:', error.message)
    throw error // 重新抛出错误以便查看完整堆栈
  } finally {
    // 清理所有Mat对象
    matsToDelete.forEach((mat) => {
      if (mat && !mat.isDeleted()) {
        mat.delete()
      }
    })

    // 特殊处理contours
    if (typeof contours !== 'undefined' && contours instanceof cv.MatVector) {
      contours.delete()
    }
  }
}
onMounted(() => {
  if (window.cv) {
    cvLoaded.value = true
  } else {
    window.Module = {
      onRuntimeInitialized: onOpenCvLoaded
    }
  }
})
</script>

<style scoped>
.container {
  padding: 20px;
}
.loading {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #666;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.images-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
.image-box {
  border: 1px solid #ccc;
  padding: 10px;
}
.image-box h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}
canvas {
  max-width: 100%;
  height: auto;
}
</style>
