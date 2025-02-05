<template>
    <el-dialog title="尺码表" v-model="dialogVisible" width="70%" top="1vh" style="height: 85vh;">
        <div class="image-grid">
            <div v-for="(image, index) in imageList" :key="index" class="image-item" @mouseover="showButtons(index)"
                @mouseleave="hideButtons(index)">
                <img :src="image.image.url" :alt="image.template_name" class="image" />
                <div v-if="showIndexes.includes(index)" class="buttons-container">
                    <el-button @click="previewImage(image.image.url)" style="width: 80px;">预览</el-button>
                    <el-button type="primary" @click="useImage(image)" style="width: 80px;">使用</el-button>
                </div>
                <div class="image-name">{{ image.template_name }}</div>
            </div>
            <el-pagination key="pager" background="#ffffff" layout="total, sizes, prev, pager, next, jumper"
                :total="pageListTotal" v-model:current-page="pager.page" v-model:page-size="pager.limit"
                @change="getPageList" />
        </div>
        <el-dialog title="图片预览" v-model="previewDialogVisible" append-to-body style="width: 40%; height: 70vh;">
            <img :src="previewImageSrc" class="preview-image" alt="图片预览" />
        </el-dialog>
    </el-dialog>
</template>

<script setup>
import { nextTick, ref, reactive } from 'vue';
import { getProductList } from '@/api/product'

const emits = defineEmits(['handleSelectSize']);

const previewDialogVisible = ref(false); // 新增的预览对话框可见性
const previewImageSrc = ref(''); // 新增的预览图片源
const imageList = ref([])

const pager = reactive({
    page: 1,
    limit: 10,
});
const pageListTotal = ref(0);
const tokenId = ref('');


const types = ref('');
const handleInit = (val, token, total, type) => {
    nextTick(() => {
        imageList.value = val;
        pageListTotal.value = total;
        tokenId.value = token;
        dialogVisible.value = true;
        types.value = type;
    })
}

const sizeSelectVal = ref('');
const dialogVisible = ref(false);

const showIndexes = ref([]);
function showButtons(index) {
    if (!showIndexes.value.includes(index)) {
        showIndexes.value.push(index);
    }
}

function hideButtons(index) {
    showIndexes.value = showIndexes.value.filter(i => i !== index);
}

// 预览
function previewImage(image) {
    previewImageSrc.value = image; // 设置预览图片源
    previewDialogVisible.value = true;
}

// 使用
function useImage(image) {
    sizeSelectVal.value = image;
    emits('handleSelectSize', image);
    dialogVisible.value = false;
}

const getPageList = () => {
    // 获取尺码表模板列表   template_sub_type: 'children_clothing' 'clothing'
    getProductList({ data: { token: tokenId.value, page_size: pager.limit, page_num: pager.page - 1, template_sub_type: types.value.includes('67') ? '' : '' } }).then((res) => {
        if (res.status == 200) {
            imageList.value = res.data.component_template_info_list
            pageListTotal.value = res.data.total_num;
        }
    })

}


defineExpose({
    handleInit, previewImage
});
</script>

<style scoped>
.image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    height: 75vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.image-item {
    position: relative;
}

.image {
    width: 300px;
    height: 180px;
    object-fit: cover;
    border: 1px solid #ccc;
}

.buttons-container {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    flex-direction: row;
    gap: 5px;
    transform: translate(-50%, -50%);
}

.buttons-container .el-button {
    padding: 5px 10px;
    border: none;
    cursor: pointer;
}

.preview-image {
    width: 100%;
    height: 60vh;
    display: block;
    margin: 0 auto;
}

.image-name {
    text-align: center;
    font-size: 14px;
    color: #c52222;
    margin-top: 3px;
}
</style>