<template>
  <el-dialog
    @closed="handleDialogClosed"
    v-model="dialogVisible"
    :title="dialogTitle"
    width="95%"
    top="10px"
    destroy-on-close
    v-if="dialogVisible"
  >
    <div class="content">
      <div class="left_content">
        <div class="left_name">商品名称</div>
        <div class="left_radio">
          <el-col :span="24">
            <span style="font-size: 12px; font-weight: bold">价格设置:</span>
          </el-col>
          <el-radio-group v-model="cgorlrRio" @change="handleRadioChange">
            <el-row style="margin-left: 30px">
              <el-col :span="24" style="display: flex; align-items: center">
                <el-radio style="width: 50px" value="1" color="red">来源价+</el-radio>
                <el-input
                  :disabled="cgorlrRio == '1' ? false : true"
                  style="width: 100px"
                  v-model="cgval"
                  placeholder=""
                  type="number"
                  @change="handleCgChange"
                >
                  <template #suffix>
                    <span>元</span>
                  </template>
                </el-input>
              </el-col>
              <el-col :span="24" style="display: flex; align-items: center; margin-top: 10px">
                <el-radio style="width: 50px" label="2">来源价× </el-radio>
                <el-input
                  :disabled="cgorlrRio == '1' ? true : false"
                  style="width: 100px"
                  v-model="lrval"
                  placeholder=""
                  type="number"
                  @change="handleLrChange"
                >
                  <template #suffix>
                    <span>倍</span>
                  </template>
                </el-input>
              </el-col>
            </el-row>
          </el-radio-group>
        </div>
        <!-- 商品列表 -->
        <div class="left_shops">
          <div v-for="(item, index) in picList" :key="item.id" class="left_items">
            <div
              class="left_item"
              @click="handleShopItem(item, index)"
              :class="{
                left_item_s: selectedIndex === index,
                left_item: selectedIndex !== null && selectedIndex !== index
              }"
            >
              <div class="number">
                {{ index + 1 }}
              </div>
              <img
                style="width: 30%; height: 100%; padding: 10px 10px 10px 10px; box-sizing: border-box"
                :src="item.image"
              />
              <div class="text_center">
                <div class="content">
                  {{ item.store_name }}
                </div>
                <div class="price"> ¥{{ item.price }} </div>
              </div>
              <img
                style="position: absolute; top: 50%; transform: translateY(-50%); right: 10px"
                src="../../../../assets/image/close.png"
                class="h_img"
                @click.stop="handleDelete(index)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="right_content">
        <el-card class="box-card" style="width: 95%; max-height: 720px; overflow-y: auto">
          <el-form
            ref="ruleFormRef"
            :model="formData"
            class="demo-formData"
            label-position="top"
            size="default"
            label-width="140"
          >
            <el-row>
              <el-col :span="24">
                <div class="bt-title">必填项</div>
                <div class="bt-dash"></div>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="商品标题"
                  prop="name"
                  :rules="[{ required: true, message: '请输入15-60个字符（8-30个汉字）' }]"
                >
                  <el-input style="width: 100%" v-model="formData.name" placeholder="请输入15-60个字符（8-30个汉字）" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="订单库存计数"
                  prop="reduce_type"
                  :rules="[{ required: true, message: '请选择订单库存计数' }]"
                >
                  <el-radio v-model="formData.reduce_type" label="1">拍下减库存</el-radio>
                  <el-radio v-model="formData.reduce_type" label="2">付款减库存</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="运费模板"
                  prop="freight_id"
                  :rules="[{ required: true, message: '请选择运费模板' }]"
                >
                  <el-select v-model="formData.freight_id" placeholder="请选择运费模板" style="width: 50%">
                    <el-option
                      v-for="item in templateList"
                      :key="item.template.id"
                      :label="item.template.template_name"
                      :value="item.template.id"
                    >
                    </el-option>
                  </el-select>
                  <span class="moban" @click="refreshList">刷新</span>
                  <span style="font-size: 12px; color: #999">
                    如需创建新的运费模板，请自行去抖店新建运费模板。完成新建后，请返回当前页面并点击页面右侧的”刷新“按钮以完成模板更新。
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="类目:" prop="category_id" :rules="[{ required: true, message: '请选择类目' }]">
                  <el-cascader
                    style="width: 60%"
                    :options="prdCateList"
                    v-model="formData.category_id"
                    placeholder="请选择类目"
                    :props="cascaderProps"
                    @change="handleCascaderChange"
                  >
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="商品状态"
                  prop="start_sale_type"
                  :rules="[{ required: true, message: '请选择商品状态' }]"
                >
                  <el-radio v-model="formData.start_sale_type" label="0">直接上传</el-radio>
                  <el-radio v-model="formData.start_sale_type" label="1">放置仓库</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="七天无理由"
                  prop="after_sale_service"
                  :rules="[{ required: true, message: '请选择是否七天无理由' }]"
                >
                  <el-radio v-model="formData.after_sale_service" label="7-1">支持</el-radio>
                  <el-radio v-model="formData.after_sale_service" label="7-0">不支持</el-radio>
                  <el-radio v-model="formData.after_sale_service" label="7-2">支持(拆封后不支持)</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="客服电话" prop="mobile" :rules="[{ required: true, message: '请输入客服电话' }]">
                  <el-input style="width: 60%" v-model="formData.mobile" placeholder="请输入客服电话" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="颜色">
                  <el-tag :key="tag" v-for="tag in formData.color" type="info" :disable-transitions="false">
                    {{ tag.attr }}
                  </el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="尺码">
                  <el-tag :key="tag" v-for="tag in formData.size" type="info" :disable-transitions="false">
                    {{ tag.attr }}
                  </el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="SKU信息" required>
                  <el-table
                    :data="formData.tableData"
                    style="width: 100%"
                    height="400"
                    border
                    stripe
                    show-header
                    size="small"
                  >
                    <el-table-column label="图片" align="center" width="100">
                      <template #default="scope">
                        <img :src="scope.row.image" style="width: 72px; height: 72px; object-fit: cover" />
                      </template>
                    </el-table-column>
                    <el-table-column label=" 颜色" align="center" prop="color" min-width="100" />
                    <el-table-column label="尺码" align="center" prop="size" min-width="100" />
                    <el-table-column align="center" width="200">
                      <template #header>
                        <el-button size="small" v-if="plgj == true" ize="small" @click="handlePlgj">
                          批量改价
                        </el-button>
                        <el-input v-else size="small" v-model="plgjVal" placeholder="请输入" @change="plgjChange" />
                      </template>
                      <template #default="scope">
                        <el-input v-model="scope.row.price" placeholder="请输入" />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" width="200">
                      <template #header>
                        <el-button size="small" v-if="plgkc == true" ize="small" @click="handlePlgkc">
                          批量改库存
                        </el-button>
                        <el-input size="small" v-else v-model="plgkcVal" placeholder="请输入" @change="plgkcChange" />
                      </template>
                      <template #default="scope">
                        <el-input v-model="scope.row.stock" placeholder="请输入" />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" width="200" prop="bar_code" label="SKU编码" />
                  </el-table>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="售卖价">
                  <el-input style="width: 50%" v-model="smj" disabled>
                    <template #suffix>
                      <span>元</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="尺码信息" required>
                  <el-card style="width: 100%">
                    <div style="margin-top: 10px">
                      <el-button size="small" type="primary" plain @click="addSizeModel">添加尺码表</el-button>
                      <span class="priceFont" style="margin-left: 20px"
                        >请先在抖店添加尺码模板后，点击左侧“添加尺码表”按钮选择要添加的尺码模板</span
                      >
                    </div>
                    <div style="margin-top: 10px" v-if="sizeModelVal?.template_id">
                      <el-button
                        type="success"
                        plain
                        size="small"
                        @click="sizeModelRef.previewImage(sizeModelVal.image.url)"
                      >
                        <el-icon>
                          <Check />
                        </el-icon>
                        已添加尺码表
                      </el-button>
                      <span class="priceFont" style="margin-left: 20px">
                        {{ sizeModelVal.template_name }}
                      </span>
                    </div>
                  </el-card>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品属性" required> </el-form-item>
                <el-card style="width: 100%">
                  <el-row>
                    <el-col :span="24">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
                        <div>重要属性</div>
                        <div style="cursor: pointer">
                          <el-popover
                            :width="200"
                            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                          >
                            <template #reference>
                              <img style="" src="../../../../assets/image/question.png" />
                            </template>
                            <template #default>
                              <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
                                <p class="demo-rich-content__desc" style="margin: 0">
                                  商品参数属性可以使用“模板锁”功能辅助，可 锁定属性，更快捷上传商品（多平台同时上传请
                                  选择好各平台的属性）
                                </p>
                              </div>
                            </template>
                          </el-popover>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="24">
                      <el-row>
                        <el-col
                          :span="item.type == 'multi_value_measure' ? 24 : 8"
                          v-for="item in formList"
                          :key="item.property_id"
                        >
                          <el-form-item :label="item.property_name" :required="item.required == 0 ? false : true">
                            <!-- :rules="[{ required: item.required == 0 ? false : true, message: `${item.property_name}无法为空` }]" -->
                            <el-input
                              v-if="item.type == 'text'"
                              style="width: 90%"
                              v-model="formData.shuxing[item.property_id]"
                              @change="handleSelectChange(item)"
                            />
                            <el-select
                              filterable
                              @change="handleSelectChange(item)"
                              v-if="item.property_name == '品牌' && item.type !== 'text'"
                              style="width: 90%"
                              v-model="formData.shuxing[item.property_id]"
                              :multiple-limit="item.multi_select_max"
                              :multiple="item.type == 'multi_select'"
                              collapse-tags
                            >
                              <el-option
                                v-for="sel in ppList"
                                :key="sel.brand_id"
                                :label="sel.name_cn"
                                :value="sel.brand_id"
                              />
                            </el-select>
                            <el-select
                              filterable
                              @change="handleSelectChange(item)"
                              v-if="
                                (item.type == 'multi_select' || item.type == 'select') && item.property_name !== '品牌'
                              "
                              style="width: 90%"
                              v-model="formData.shuxing[item.property_id]"
                              :multiple-limit="item.multi_select_max"
                              :multiple="item.type == 'multi_select'"
                              collapse-tags
                            >
                              <el-option
                                v-for="sel in item.options"
                                :key="sel.value_id"
                                :label="sel.name"
                                :value="sel.value_id"
                              />
                            </el-select>
                            <el-select-v2
                              v-model="formData.shuxing[item.property_id]"
                              filterable
                              ref="mySelect"
                              v-if="item.type == 'multi_value_measure'"
                              :options="item.options"
                              multiple
                              style="width: 100%"
                              :multiple-limit="item.multi_select_max"
                              :props="{ value: 'value_id', label: 'name' }"
                              @change="handleFabricChange(item)"
                            >
                            </el-select-v2>
                            <el-col :span="24" v-if="item.type == 'multi_value_measure' && fabriTableList.length > 0">
                              <el-table
                                :data="fabriTableList"
                                style="width: 100%; margin-top: 10px"
                                max-height="450"
                                border
                                stripe
                                show-header
                                size="small"
                              >
                                <el-table-column label="名称" align="center" prop="name" />
                                <el-table-column align="center" label="百分比">
                                  <template #default="scope">
                                    <el-input style="width: 100%" v-model="scope.row.percent" type="number" :max="100">
                                      <template #suffix>
                                        <span>%</span>
                                      </template>
                                    </el-input>
                                  </template>
                                </el-table-column>
                              </el-table>
                            </el-col>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
              <el-col :span="24" style="margin-top: 10px">
                <el-form-item label="商品主图" required>
                  <div class="drag">
                    <VueDraggable
                      v-model="goodsMainPic"
                      :animation="150"
                      ghostClass="ghost"
                      class="drage-container"
                      filter=".Joao"
                      group="person"
                    >
                      <div v-for="(item, index) in goodsMainPic" :key="item" class="drag-item">
                        <img :src="item" alt="" />
                        <el-button
                          style="width: 60px; height: 20px; margin-top: 20px"
                          plain
                          @click="deleteMainPic(index)"
                          >删除</el-button
                        >
                      </div>
                    </VueDraggable>
                    <!-- <div class="drag-item-add">
                                <img style="padding: 10px;margin-top: 30px;" src="../../../assets/fonts/add.png"
                                    alt="图片1">
                            </div> -->
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-top: 20px">
                <el-form-item label="商品详情图" required>
                  <div class="drag-detail">
                    <VueDraggable
                      v-model="goodsXqPic"
                      :animation="150"
                      ghostClass="ghost"
                      class="drage-container-d"
                      filter=".Joao"
                      group="person"
                      :onUpdate="onUpdate"
                    >
                      <div v-for="(item, index) in goodsXqPic" :key="item" class="drag-item-d">
                        <img :src="item" alt="" />
                        <el-button style="width: 60px; height: 20px" plain @click="deleteXqPic(index)">删除</el-button>
                      </div>
                    </VueDraggable>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="bt-title">非必填项</div>
                <div class="bt-dash"></div>
              </el-col>
              <el-col :span="24">
                <el-form-item label="三包服务承诺" prop="after_sale_service_v2">
                  <el-radio v-model="formData.service_type" label="1">不包含</el-radio>
                  <el-radio v-model="formData.service_type" label="2">延长售后服务有效期</el-radio>
                  <el-select
                    v-model="formData.duration"
                    placeholder="请选择延长售后服务天数"
                    v-if="formData.service_type == '2'"
                    style="width: 30%"
                  >
                    <el-option v-for="sel in three_guarantees" :key="sel.value" :label="sel.name" :value="sel.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="测评短视频" prop="is_evaluate_opened">
                  <el-radio v-model="formData.is_evaluate_opened" label="1">开启</el-radio>
                  <el-radio v-model="formData.is_evaluate_opened" label="2">关闭</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品限购" prop="limit_per_buyer">
                  <el-col :span="8" class="xg">
                    <span>每个用户累计限购</span>
                    <el-input
                      style="width: 100px; margin: 0 10px"
                      v-model="formData.limit_per_buyer"
                      placeholder="商品限购"
                    />
                    <span>件</span>
                  </el-col>
                  <el-col :span="8" class="xg">
                    <span>每次限购</span>
                    <el-input
                      style="width: 100px; margin: 0 10px"
                      v-model="formData.maximum_per_order"
                      placeholder="每次限购"
                    />
                    <span>件</span>
                  </el-col>
                  <el-col :span="8" class="xg">
                    <span>每次至少购买</span>
                    <el-input
                      style="width: 100px; margin: 0 10px"
                      v-model="formData.minimum_per_order"
                      placeholder="每次至少购买"
                    />
                    <span>件</span>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="参考价" prop="reference_price">
                  <el-input style="width: 50%" v-model="formData.reference_price" placeholder="请输入参考价">
                    <template #suffix>
                      <span>元</span>
                    </template>
                  </el-input>
                  <div style="margin-left: 10px; cursor: pointer">
                    <el-popover
                      :width="500"
                      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                    >
                      <template #reference>
                        <img style="" src="../../../../assets/image/question.png" />
                      </template>
                      <template #default>
                        <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
                          <p class="demo-rich-content__desc" style="margin: 0">
                            请确保录入的价格真实有效并与价格凭证保持一 致。若价格录入错误或上传虚假凭证，您将面临
                            价格欺诈等法律风险。当前参考价主要场景为直 播间讲解展示使用，未来将应用在商品详情、搜
                            索等场景。
                          </p>
                        </div>
                      </template>
                    </el-popover>
                  </div>
                </el-form-item>
                <el-form-item>
                  <div class="priceFont"> 若输入的参考价小于售卖价，系统将自动将自动调整为最高售卖价。 </div>
                  <div class="priceFont"> 若设置了参考价，但未设置凭证类型/参凭图，则设置参考价将无效。 </div>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="formData.reference_price">
                <el-form-item label="参考价凭证" prop="certificate_urls">
                  <el-upload action="#" list-type="picture-card" :http-request="handleHttpUpReference" :limit="1">
                    <el-icon>
                      <Plus />
                    </el-icon>
                    <template #file="{ file }">
                      <div>
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                        <span class="el-upload-list__item-actions">
                          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                            <el-icon><zoom-in /></el-icon>
                          </span>
                          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                            <el-icon>
                              <Delete />
                            </el-icon>
                          </span>
                        </span>
                      </div>
                    </template>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="formData.reference_price">
                <el-form-item label="参考价类型" prop="certificate_type">
                  <el-select style="width: 90%" v-model="formData.certificate_type">
                    <el-option v-for="sel in certificateTypeList" :key="sel.id" :label="sel.name" :value="sel.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="白底图" prop="white_back_ground_pic_url">
                  <el-upload action="#" list-type="picture-card" :http-request="handleHttpUp" :limit="1" ref="bdRef">
                    <el-icon>
                      <Plus />
                    </el-icon>
                    <template #file="{ file }">
                      <div>
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                        <span class="el-upload-list__item-actions">
                          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                            <el-icon><zoom-in /></el-icon>
                          </span>
                          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                            <el-icon>
                              <Delete />
                            </el-icon>
                          </span>
                        </span>
                      </div>
                    </template>
                  </el-upload>

                  <el-dialog v-model="dialogImgVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                  </el-dialog>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="handleAdd(true)" :loading="loading"> 发布商品 </el-button>
        <el-button type="info" @click="handleAdd(false)">保存草稿</el-button>
      </span>
      <div
        style="
          width: 100%;
          height: 20px;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          line-height: 20px;
          text-align: center;
          font-style: normal;
        "
      >
        部分信息为平台同步信息，
        <span style="color: var(--red-color)"> 您应仔细检查每项信息，如信息有误，应修改后发布 </span>
        ，避免虚假宣传等风险
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, computed, onMounted, watch, watchEffect } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { getTemplateList, getPrdCateList, getCatePropertyList, fetchBrandList, fetchProUpRule } from '@/api/upstore'
import { Delete, Download, Plus, ZoomIn, Check } from '@element-plus/icons-vue'
import { ElMessage, type UploadFile, type UploadRequestOptions } from 'element-plus'
import type { CascaderProps } from 'element-plus'

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref<string>('')
// 图片预览弹窗
const dialogImgVisible = ref(false)
// 选中的索引
const selectedIndex = ref(0)
// 采购价或者利润率
const cgorlrRio = ref('1')
// 采购价
const cgval = ref('')
// 利润率
const lrval = ref('')
// 表单ref
const ruleFormRef = ref()
// 表单数据
const formData = reactive<any>({
  token: '',
  category_id: '',
  name: '',
  pic: '',
  description: '',
  freight_id: '',
  specs: '',
  spec_prices: '',
  spec_pic: '',
  commit: '',
  reduce_type: '',
  start_sale_type: '',
  after_sale_service: '',
  reference_price: '',
  reference_price_certificate: { certificate_type: '', certificate_urls: '' },
  size_info_template_id: '',
  product_format_new: '',
  is_evaluate_opened: '',
  maximum_per_order: '',
  limit_per_buyer: '',
  minimum_per_order: '',
  white_back_ground_pic_url: '',
  after_sale_service_v2: '',
  mobile: '',
  color: [],
  size: [],
  tableData: [],
  selectionList: []
})
// 运费模板
const templateList = ref<any>([])
// 类目列表
const prdCateList = ref<any>([])
// 商品属性列表
const formList = ref<any>([])
// 品牌选择列表
const ppList = ref<any>([])
// 批量改价
const plgj = ref(true)
const plgjVal = ref('')
// 批量改库存
const plgkc = ref(true)
const plgkcVal = ref('')
// 商品主图
const goodsMainPic = ref([])
// 商品详情图
const goodsXqPic = ref([])
const certificateTypeList = ref<any>([]) // 参考价类型
const three_guarantees = ref<any>([]) // 售后有效期
// 按钮loading
const loading = ref(false)

const dialogImageUrl = ref('')
const sizeModelRef = ref()
const disabled = ref(false)

const smj = ref('') //售卖价
const priceValues = formData.tableData.map((item: { price: any }) => item.price)
const maxPrice = Math.max(...priceValues)
const minPrice = Math.min(...priceValues)
if (maxPrice >= minPrice * 2.3) {
  ElMessage.error('商品最高价不能超过最低价的2.3倍,请修改价格')
}
smj.value = String(minPrice) + '~' + String(maxPrice)
// 监听table的变化，可能要为售卖价做一下处理
watchEffect(() => {})
watch(
  () => formData.tableData,
  (newVal) => {
    const priceValues = newVal.map((item: { price: any }) => item.price)
    const maxPrice = Math.max(...priceValues)
    const minPrice = Math.min(...priceValues)
    smj.value = String(minPrice) + '~' + String(maxPrice)
    if (maxPrice >= minPrice * 2.3) {
      ElMessage.error('商品最高价不能超过最低价的2.3倍,请修改价格')
    }
  },
  { deep: true }
)

// 左侧商品列表
const picList = ref([
  {
    id: 1,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    store_name: '商品名称',
    price: '100'
  },
  {
    id: 2,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    store_name: '商品名称',
    price: '100'
  }
])
// 初始化
const handleInit = (edits, token) => {
  console.log('edits', edits, token)
  dialogVisible.value = true
}

const handleAdd = (commit: any) => {}

// 选中商品
const handleShopItem = (item: any, index: number) => {
  console.log('item', item)
  selectedIndex.value = index
}
// 删除商品
const handleDelete = (index: number) => {
  if (picList.value.length === 1) {
    ElMessage.error('至少保留一个商品')
    return
  } else {
    picList.value.splice(index, 1)
  }
}

// 弹窗关闭
const handleDialogClosed = () => {
  dialogVisible.value = false
}

// 批量改价
const handlePlgj = () => {
  plgj.value = false
  plgjVal.value = ''
}
const plgjChange = (value: string | number) => {
  plgj.value = true
  if (value !== '') {
    formData.tableData.value.map((x: any) => {
      x.price = value
    })
  }
}
// 批量改库存
const handlePlgkc = () => {
  plgkc.value = false
  plgkcVal.value = ''
}
const plgkcChange = (value: string | number) => {
  plgkc.value = true
  if (value !== '') {
    formData.tableData.value.map((x: any) => {
      x.stock = value
    })
  }
}

// 父页面改价
const changePlgjByParent = (value: string | number) => {
  if (value !== '') {
    formData.tableData.value.map((x: any) => {
      x.price = value
    })
  }
}

// 已添加尺码表
const sizeModelVal = ref()
// 添加尺码表
const addSizeModel = () => {
  sizeModelRef.value.handleInit(
    sizeModelList.value,
    formData.data.selectionList[0].access_token,
    sizeTotal.value,
    formData.data.type
  )
}
// 选择确认尺码表
const handleSelectSize = (sizeCode: string) => {
  console.log(sizeCode, '选择确认尺码表')

  sizeModelVal.value = sizeCode
}

// // 刷新运费模板
// function refreshList(sts, edits) {
//     // 刷新运费模板
//     getTemplateList({ token: formData.data.selectionList[0].access_token }).then((res: any) => {
//         if (res.status == 200) {
//             nextTick(() => {
//                 templateList.value = res.data.List
//             })
//         }
//     })

// }
// // 获取类目列表
// getPrdCateList({ token: formData.selectionList[0].access_token, cid: '' }).then((res: any) => {
//     if (res.status == 200) {
//         prdCateList.value = []
//         nextTick(() => {
//             res.data.forEach((element: any) => {
//                 prdCateList.value.push({
//                     ...element,
//                     child: [],
//                 })
//             });

//         })
//     }
// })

// // 类目懒加载
// const cascaderProps: CascaderProps = {
//     lazy: true,
//     lazyLoad(node, resolve) {
//         const { value } = node
//         getPrdCateList({ token: formData.selectionList[0].access_token, cid: value }).then((res: any) => {
//             // 格式化为级联选择器需要的节点格式
//             const nodes = res.data.map((item: any) => ({
//                 value: item.id,
//                 label: item.name,
//                 leaf: item.is_leaf // 是否为叶子节点
//             }));
//             resolve(nodes);
//         })

//     },
// }

// 商品主图删除
const deleteMainPic = (index: number) => {
  goodsMainPic.value.splice(index, 1)
}
// 商品详情图删除
const deleteXqPic = (index: number) => {
  goodsXqPic.value.splice(index, 1)
}

const mySelect = ref()
const fabriTableList = ref<any>([])
// 面料材质选择变化
const handleFabricChange = (value: any) => {
  fabriTableList.value = mySelect.value[0].showTagList
  console.log('fabriTableList', fabriTableList.value)
  handleSelectChange(value)
}

// 商品属性变化
const handleSelectChange = (item: any) => {
  let newObj: any = {}
  newObj[item.property_id] = {
    ...item,
    value: formData.shuxing[item.property_id]
  }
  let existingIndex = false
  shuxingList.value.forEach((element: any) => {
    if (Object.keys(element)[0] == item.property_id) {
      existingIndex = true
      element[item.property_id] = {
        ...item,
        value: formData.shuxing[item.property_id]
      }
    }
  })

  if (existingIndex) {
    return
  } else {
    shuxingList.value.push(newObj)
  }
  console.log(shuxingList.value, 'shuxingList')
}

// 选择类目model变化,请求属性接口列表
const handleCascaderChange = (value: any) => {
  formList.value = []
  getCatePropertyList({
    data: { token: formData.data.selectionList[0].access_token, category_leaf_id: value[value.length - 1] }
  }).then((res: any) => {
    if (res.status == 200) {
      nextTick(() => {
        // 先过滤掉不是必传的商品属性
        res.data.data.forEach((element: any) => {
          if (element.required == 1) {
            formList.value.push(element)
          }
        })
        // formList.value = res.data.data
      })
    }
  })
  ppList.value = [{ brand_id: '0', name_cn: '无品牌', name_en: '0' }]
  // fetchBrandList({ token: formData.data.selectionList[0].access_token, category_id: value[value.length - 1] }).then((res: any) => {
  //     if (res.status == 200) {
  //         nextTick(() => {
  //             ppList.value = [
  //                 { brand_id: '0', name_cn: '无品牌', name_en: '0' },
  //                 ...res.data.brand_list
  //             ]
  //         })
  //     }
  // })
  fetchProUpRule({
    data: { token: formData.data.selectionList[0].access_token, category_id: value[value.length - 1] }
  }).then((res: any) => {
    if (res.status == 200) {
      nextTick(() => {
        const result = []
        for (const key in res.data.reference_price_rule.certificate_types) {
          if (res.data.reference_price_rule.certificate_types.hasOwnProperty(key)) {
            result.push({
              id: key,
              name: res.data.reference_price_rule.certificate_types[key]
            })
          }
        }
        certificateTypeList.value = result
        three_guarantees.value = res.data.after_sale_rule.three_guarantees.options[0].options // 售后有效期
      })
    }
  })
}

// 文件上传调用接口
const uploadFile = (file: FormData) => {
  fetchUploadFile(file).then((res: any) => {
    if (res.status == 200) {
      formData.data.white_back_ground_pic_url = res.data.url
    }
  })
}
const uploadFiles = (file: FormData) => {
  fetchUploadFile(file).then((res: any) => {
    if (res.status == 200) {
      formData.data.certificate_urls = res.data.url
    }
  })
}

const bdRef = ref()
// 移除图片
const handleRemove = (file: UploadFile) => {
  console.log(file)
  dialogImageUrl.value = '' // 清空图片地址
  bdRef.value.clearFiles()
}

// 预览图片
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogImgVisible.value = true
}

// 参考价凭证
const handleHttpUpReference = (param: UploadRequestOptions) => {
  const formData = new FormData()
  formData.append('file', param.file)
  uploadFiles(formData)
}
// 上传文件白底图
const handleHttpUp = (param: UploadRequestOptions) => {
  const formData = new FormData()
  formData.append('file', param.file)
  uploadFile(formData)
}

defineExpose({
  handleInit
})
</script>

<style src="./index.scss" scoped></style>
<style scoped lang="scss">
.xg {
  height: 20px;
  font-weight: 400;
  font-size: 14px;
  color: #999999;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}

.bt-title {
  width: 100%;
  height: 25px;
  font-weight: 500;
  font-size: 18px;
  color: $red-color;
  line-height: 25px;
  text-align: left;
  font-style: normal;
}

.moban {
  color: #3a84ff;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    color: #2066d6;
  }
}

.bt-dash {
  border-bottom: 2px dashed #ccc;
  margin-bottom: 20px;
  margin-top: 5px;
}

.image-container {
  display: flex;
  gap: 10px;
}

.image-container img {
  width: 90px;
  height: 90px;
  border: 2px solid transparent;
  cursor: pointer;

  &:hover {
    border-color: blue;
  }
}

.image-container img.selected {
  border-color: blue;
}

.priceFont {
  width: 371px;
  height: 24px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #999999;
  line-height: 24px;
  text-align: left;
  font-style: normal;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.drag {
  display: flex;
  gap: 10px;
}

.drage-container {
  display: flex;
  gap: 10px;
}

.drag-item {
  border: 1px dashed #d1d1d1;
  width: 120px;
  height: 120px;
  text-align: center;
  cursor: move;

  img {
    width: 80%;
    height: 80%;
    padding-top: 10%;
  }

  &:hover {
    background-color: #f5f7fa;
  }
}

.drag-item-add {
  border: 1px dashed #d1d1d1;
  width: 120px;
  height: 120px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #f5f7fa;
  }
}

.drag-detail {
  display: flex;
  gap: 10px;
}

.drage-container-d {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.drag-item-d {
  border: 1px dashed #d1d1d1;
  width: 120px;
  height: 140px;
  text-align: center;
  cursor: move;
  margin: 0 0 50px 0;

  img {
    width: 100%;
    height: 100%;
  }

  &:hover {
    background-color: #f5f7fa;
  }
}

.drag-item-add-d {
  border: 1px dashed #d1d1d1;
  width: 120px;
  height: 140px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #f5f7fa;
  }
}
</style>
