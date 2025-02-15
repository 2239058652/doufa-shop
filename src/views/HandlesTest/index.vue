<template>
  <div class="container">
    <div v-if="!cvLoaded" class="loading">正在加载 OpenCV.js，请稍候...</div>
    <div v-else class="content">
      <input type="file" accept="image/*" @change="handleFileUpload" />
      <div class="images-container">
        <div class="image-box">
          <h3>原始图片</h3>
          <canvas ref="sourceCanvas" @click="previewImage('source')"></canvas>
        </div>
        <div class="image-box">
          <h3>提取的印章</h3>
          <canvas ref="resultCanvas" @click="previewImage('result')"></canvas>
        </div>
      </div>
    </div>
    <!-- 添加预览弹窗 -->
    <a-modal v-model:open="previewVisible" :footer="null" @cancel="previewVisible = false" width="800px">
      <img :src="previewImageUrl" style="width: 100%" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const cvLoaded = ref(false)
const sourceCanvas = ref(null)
const resultCanvas = ref(null)
const previewVisible = ref(false)
const previewImageUrl = ref('')

const previewImage = (type) => {
  const canvas = type === 'source' ? sourceCanvas.value : resultCanvas.value
  if (canvas) {
    previewImageUrl.value = canvas.toDataURL('image/png')
    previewVisible.value = true
  }
}

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
    alert('处理失败：' + error.message)
  }
}

const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('图片加载错误'))
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

// 修改颜色阈值部分的代码
const createThresholdMat = (values) => {
  return cv.matFromArray(1, 3, cv.CV_8UC1, values)
}

const processImage = async (img) => {
  const matsToDelete = []
  let contours
  try {
    // 设置canvas尺寸
    const MAX_SIZE = 2048
    const [width, height] = resizeWithAspectRatio(img.width, img.height, MAX_SIZE)

    sourceCanvas.value.width = width
    sourceCanvas.value.height = height
    const sCtx = sourceCanvas.value.getContext('2d')
    sCtx.drawImage(img, 0, 0, width, height)

    // 图像处理流程
    const src = cv.imread(sourceCanvas.value)
    matsToDelete.push(src)

    // 预处理：降噪
    const blurredSrc = new cv.Mat()
    cv.medianBlur(src, blurredSrc, 5)
    matsToDelete.push(blurredSrc)

    // 颜色空间转换
    const hsv = new cv.Mat()
    cv.cvtColor(blurredSrc, hsv, cv.COLOR_BGR2HSV)
    matsToDelete.push(hsv)

    const rgba = new cv.Mat()
    cv.cvtColor(blurredSrc, rgba, cv.COLOR_RGBA2RGB)
    cv.cvtColor(rgba, hsv, cv.COLOR_RGB2HSV)
    matsToDelete.push(rgba)

    // 创建红色范围掩膜（优化红色检测）
    const lowerRed1 = createThresholdMat([0, 80, 80]) // 降低饱和度和亮度阈值
    const upperRed1 = createThresholdMat([20, 255, 255]) // 扩大色相范围
    const lowerRed2 = createThresholdMat([160, 80, 80])
    const upperRed2 = createThresholdMat([180, 255, 255])

    const mask1 = new cv.Mat()
    const mask2 = new cv.Mat()
    const mask = new cv.Mat()
    cv.inRange(hsv, lowerRed1, upperRed1, mask1)
    cv.inRange(hsv, lowerRed2, upperRed2, mask2)
    cv.add(mask1, mask2, mask)

    matsToDelete.push(lowerRed1, upperRed1, lowerRed2, upperRed2, mask1, mask2, mask)
    const debugMask = new cv.Mat()
    cv.cvtColor(mask, debugMask, cv.COLOR_GRAY2BGR)
    cv.imshow(sourceCanvas.value, debugMask)
    debugMask.delete()

    // 形态学操作（优化形状保留）
    const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(13, 13))
    const morphed = new cv.Mat()
    cv.morphologyEx(mask, morphed, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 4)
    cv.morphologyEx(morphed, morphed, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 2)
    matsToDelete.push(kernel, morphed)

    // 查找轮廓
    contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    cv.findContours(morphed, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    matsToDelete.push(hierarchy)

    // 轮廓分析（优化筛选条件）
    let maxArea = 0
    let maxContourIndex = -1
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i)
      const area = cv.contourArea(contour)
      const perimeter = cv.arcLength(contour, true)
      const circularity = perimeter > 0 ? (4 * Math.PI * area) / (perimeter * perimeter) : 0
      const rect = cv.boundingRect(contour)
      const aspectRatio = rect.width / (rect.height || 1) // 避免除零

      console.log(`轮廓 ${i}: 面积=${area}, 圆形度=${circularity.toFixed(2)}, 宽高比=${aspectRatio.toFixed(2)}`)

      if (
        area > 100 && // 降低最小面积阈值
        circularity > 0.2 && // 降低圆形度要求
        aspectRatio > 0.3 && // 放宽宽高比限制
        aspectRatio < 3.0 &&
        rect.width > 15 && // 降低最小尺寸要求
        rect.height > 15
      ) {
        if (area > maxArea) {
          maxArea = area
          maxContourIndex = i
        }
      }
    }

    if (maxContourIndex !== -1) {
      const rect = cv.boundingRect(contours.get(maxContourIndex))
      // 扩展ROI区域（添加边界检查）
      const padding = 20
      const x = Math.max(0, rect.x - padding)
      const y = Math.max(0, rect.y - padding)
      const w = Math.min(src.cols - x, rect.width + 2 * padding)
      const h = Math.min(src.rows - y, rect.height + 2 * padding)

      if (w > 10 && h > 10) {
        const stamp = src.roi(new cv.Rect(x, y, w, h))
        matsToDelete.push(stamp)

        // 后处理：锐化边缘
        const sharpened = new cv.Mat()
        cv.GaussianBlur(stamp, sharpened, new cv.Size(0, 0), 3)
        cv.addWeighted(stamp, 1.5, sharpened, -0.5, 0, sharpened)

        resultCanvas.value.width = w
        resultCanvas.value.height = h
        cv.imshow(resultCanvas.value, sharpened)
        sharpened.delete()
      }
    } else {
      throw new Error('未检测到有效印章区域')
    }
  } catch (error) {
    console.error('详细错误信息:', error)
    throw error
  } finally {
    matsToDelete.forEach((mat) => !mat.isDeleted() && mat.delete())
    contours && contours instanceof cv.MatVector && contours.delete()
  }
}

// 保持宽高比的尺寸调整
const resizeWithAspectRatio = (width, height, maxSize) => {
  const ratio = Math.min(maxSize / width, maxSize / height)
  return [Math.floor(width * ratio), Math.floor(height * ratio)]
}

onMounted(() => {
  if (window.cv) {
    cvLoaded.value = true
  } else {
    window.Module = { onRuntimeInitialized: onOpenCvLoaded }
    const script = document.createElement('script')
    script.src = 'https://docs.opencv.org/4.5.0/opencv.js'
    script.async = true
    script.onload = () => console.log('OpenCV.js 脚本加载完成')
    document.head.appendChild(script)
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
