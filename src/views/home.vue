<template>
  <context-holder />
  <div class="home">
    <!-- 顶部功能区 -->
    <div class="top-func">
      <!-- LOGO区域 -->
      <div class="func-img">
        <a href="/">
          <img src="../assets/image/logo.png" alt="" />
        </a>
      </div>
      <!-- 地址选择区 -->
      <div class="func-address">
        <div class="address-name">【济南】</div>
        <div class="address-tab">切换地址</div>
      </div>
      <!-- 搜索区域 -->
      <div class="func-sou">
        <div class="func-sou-input">
          <!-- 搜索输入框 -->
          <a-input v-model:value="inputVal" :bordered="false" placeholder="请搜索产品名称、货号">
            <template #prefix>
              <a-select :bordered="false" v-model:value="selectVal" style="width: 110px">
                <a-select-option value="jack">宝贝货号</a-select-option>
                <a-select-option value="lucy">档口搜索</a-select-option>
              </a-select>
            </template>
            <template #suffix>
              <div class="photo-sou">
                <img src="../assets/image/photo.png" alt="识图" />
                <a-button type="primary" danger>搜索</a-button>
              </div>
            </template>
          </a-input>
        </div>
        <!-- 热门搜索标签 -->
        <div class="func-sou-type">
          <div class="hot-type">
            <span :class="{ active: activeIndex === index }" v-for="(item, index) in hotSouTypeList" :key="index"
              @click="activeIndex = index">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
      <!-- 购物车 -->
      <div class="func-car">
        <div class="car-top">
          <span class="cart-count">{{ cartCount }}</span>
        </div>
        <div class="car-bottom">
          <img src="../assets/image/shopcar.png" alt="" />
          <div class="shop-car">购物车</div>
        </div>
      </div>
    </div>
    <!-- 主要内容区 -->
    <div class="shop-sort">
      <!-- 左侧分类导航 -->
      <div class="s-s-left">
        <!-- 分类标题 -->
        <div class="shops-title">
          <span>商品分类</span>
          <img src="../assets/image/weitu.png" alt="" />
        </div>
        <!-- 商品分类 --> <!-- 分类列表 -->
        <div class="shop-cate">
          <div class="cate-item" v-for="item in categoryList" :key="item.id">
            <div class="item-left">
              <img src="../assets/image/fenlei.png" alt="" />
            </div>
            <a-popover :title="item.cate_name" placement="right"
              :overlayInnerStyle="{ width: '612px', height: '446px' }">
              <div class="item-right">
                <div class="text-line">
                  <span v-for="(v, index) in item.children.slice(0, 3)" :key="v.id">
                    {{ v.cate_name }}
                    {{ index !== 2 ? ' ' : '' }}
                  </span>
                </div>
                <div class="text-line">
                  <span v-for="(v, index) in item.children.slice(4, 7)" :key="v.id">
                    {{ v.cate_name }}
                    {{ index !== 2 ? ' ' : '' }}
                  </span>
                </div>
              </div>
              <template #content>
                <div class="popover-content">
                  <div class="content-row">
                    <div v-for="i in item.children" :key="i.id" class="content-item">
                      {{ i.cate_name }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </div>
        </div>
      </div>
      <!-- 中间内容区 -->
      <div class="s-s-middle">
        <!-- 顶部导航 -->
        <div class="m-t">
          <div class="active">
            <span>抖发首页</span>
          </div>
          <div>
            <span class="">爆款专区</span>
            <img src="../assets/image/mail.png" class="badge" />
          </div>
          <div>
            <span>礼品代发</span>
            <img src="../assets/image/gift.png" class="badge" />
          </div>
          <div>
            <span>热门排行</span>
          </div>
          <div>
            <span>搜图搜款</span>
          </div>
        </div>
        <!-- 轮播图 -->
        <div class="m-m">
          <a-carousel arrows autoplay>
            <template #prevArrow>
              <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                <left-circle-outlined />
              </div>
            </template>
            <template #nextArrow>
              <div class="custom-slick-arrow" style="right: 10px">
                <right-circle-outlined />
              </div>
            </template>
            <div v-for="(item, index) in bannerList" :key="index">
              <a>
                <img :src="item.image_input" />
              </a>
            </div>
          </a-carousel>
        </div>
        <!-- 底部banner -->
        <div class="m-b">
          <div v-for="(x, index) in bannerActiveList" :key="index">
            <a>
              <img :src="x.image_input" />
            </a>
          </div>
        </div>
      </div>
      <!-- 右侧内容区 -->
      <div class="s-s-right">
        <div class="r-t">
          <div class="r-t-l">
            <div class="r-t-l-t">
              <div style="
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  gap: 8px;
                  margin-top: 20px;
                  margin-left: 13px;
                ">
                <div class="dfjp">抖发竞拍</div>
                <div class="yyqp">1元起拍</div>
              </div>
              <div style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 29px;
                  margin-top: 22px;
                ">
                <div class="chuizi"></div>
                <div class="ljcy">
                  <span>立即参与</span>
                </div>
              </div>
            </div>
            <div class="r-t-l-b">
              <div class="r-t-l-b-top">
                <div class="zngg">
                  <span>站内公告</span>
                  <img src="../assets/image/weitu.png" alt="" />
                </div>
                <div class="rightarrimg">
                  <img src="../assets/image/rightarr.png" alt="" />
                </div>
              </div>
              <div class="r-t-l-b-bottoms">
                <div>互动赢免费礼盒！双旦送礼指南来…</div>
                <div>必看！抖发年度10大商品榜单</div>
                <div>江西寻乌:以“橙”为媒 点亮乡村…</div>
                <div>乡村振兴第五期—河北张北县</div>
              </div>
            </div>
          </div>
          <div class="r-t-r">
            <div class="r-t-r-user">
              <div class="user-img">
                <img src="../assets/image/user.png" alt="" />
              </div>
              <div class="user-info">
                <div style="
                    width: 80px;
                    height: 21px;
                    font-size: 16px;
                    color: #333333;
                    line-height: 21px;
                    text-align: left;
                  ">慢慢家男装</div>
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #505259;
                    line-height: 16px;
                    text-align: left;
                    gap: 12px;
                  ">
                  <div style="cursor: pointer">切换账号</div>
                  <div style="cursor: pointer">退出</div>
                </div>
              </div>
            </div>
            <div class="mid-icon">
              <div class="icon-text">
                <img src="../assets/image/tbddicon.png" alt="" />
                <span>同步订单</span>
              </div>
              <div class="icon-text">
                <img src="../assets/image/plshicon.png" alt="" />
                <span>批量上货</span>
              </div>
              <div class="icon-text">
                <img src="../assets/image/idficon.png" alt="" />
                <span>I 抖发</span>
              </div>
            </div>
            <div class="mid-status">
              <div class="status-text">
                <span>12</span>
                <span>待付款</span>
              </div>
              <div class="status-text">
                <span>12</span>
                <span>未发出</span>
              </div>
              <div class="status-text">
                <span>12</span>
                <span>待收货</span>
              </div>
              <div class="status-text">
                <span>12</span>
                <span>售后订单</span>
              </div>
            </div>
            <div class="r-t-r-qb">
              <div class="my-ballet">我的钱包</div>
              <div class="vie-mybalet">查看我的钱包</div>
            </div>
          </div>
        </div>
        <div class="r-b"></div>
      </div>
    </div>
    <!-- 精选货源 精选货源 好评榜 礼品专区 -->
    <div class="hot-rank">
      <!-- 精选货源区域  精选货源-->
      <div class="hot-rank-item-jxhy">
        <div class="hot-jingxuan">
          <div class="jx-img">
            <img src="../assets/image/vipicon.png" alt="" />
            <span>精选货源</span>
          </div>
          <div class="jx-xjhpicon">
            <img src="../assets/image/xjhpicon.png" alt="" />
          </div>
        </div>
      </div>
      <div class="hot-rank-item-rx">热销榜</div>
      <div class="hot-rank-item-hp">好评榜</div>
      <div class="hot-rank-item-gift">礼品专区</div>
    </div>
    <div class="hot-merchants">
      <div class="hot-merch-item">热销商家</div>
      <div class="hot-merch-item">优质商家</div>
      <div class="hot-merch-item">信誉商家</div>
    </div>
    <div class="quality-source">
      <div class="q-s-item" v-for="(item, index) in 18" :key="index">
        <div>{{ item }}{{ '优质货源' }}</div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '@/components/footer/index.vue'
import { ref } from 'vue'
import { getCategory, getBanner } from '@/api/store'
import { message } from 'ant-design-vue'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue'

const [messageApi, contextHolder] = message.useMessage()

const inputVal = ref('')
const selectVal = ref('jack')
const hotSouTypeList = ref(['2024', 'T恤', '毛衣', '牛仔裤', '羽绒服'])
const activeIndex = ref(0)
const cartCount = ref(3)

const categoryList = ref<any>([])
const bannerList = ref<any>([])
const bannerActiveList = ref<any>([])

// 获取分类列表
const getCategoryList = () => {
  getCategory().then((res: any) => {
    if (res.status == 200) {
      categoryList.value = res.data
    } else {
      messageApi.error(res.msg)
    }
  })
}
// 获取轮播数据
const getBannerList = async () => {
  const res = await getBanner(1)
  const response = await getBanner(0)
  bannerList.value = res.data
  bannerActiveList.value = response.data
}
getBannerList()
getCategoryList()
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.top-func {
  width: 1560px;
  height: 124px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .func-img img {
    width: 193px;
    height: 82px;
    cursor: pointer;
  }

  .func-address {
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;

    .address-name {
      width: 80px;
      height: 26px;
      font-size: 20px;
      color: #333333;
      line-height: 26px;
      text-align: center;
      font-style: normal;
      cursor: pointer;

      &:hover {
        color: #131010;
      }
    }

    .address-tab {
      width: 56px;
      height: 19px;
      font-size: 14px;
      color: #999999;
      line-height: 19px;
      text-align: center;
      font-style: normal;
      cursor: pointer;

      &:hover {
        color: #c2b4b4;
      }
    }
  }

  .func-sou {
    width: 782px;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;

    .func-sou-input {
      width: 782px;
      height: 50px;
      border: 2px solid #f83126;
      border-radius: 8px;

      .photo-sou {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 19px;

        img {
          width: 22px;
          height: 20px;
          cursor: pointer;
        }
      }
    }

    .func-sou-type {
      width: 782px;
      height: 20px;
      background-color: #ffffff;

      .hot-type {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;

        span {
          font-size: 14px;
          line-height: 19px;
          color: #999999;
          cursor: pointer;

          &:hover {
            color: #f83126;
          }

          &.active {
            color: #f83126;
          }
        }
      }
    }
  }

  .func-car {
    width: 140px;
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .car-top {
      width: 23px;
      height: 16px;
      border-radius: 8px;
      position: relative;

      .cart-count {
        position: absolute;
        top: 5px;
        right: 15px;
        background: #f83126;
        color: white;
        font-size: 12px;
        min-width: 16px;
        height: 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
      }
    }

    .car-bottom {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;

      img {
        width: 21px;
        height: 19px;
      }

      .shop-car {
        width: 48px;
        height: 21px;
        font-size: 16px;
        color: #f83126;
        line-height: 21px;
        text-align: left;
        font-style: normal;
      }
    }
  }
}

.shop-sort {
  width: 1560px;
  height: 697px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .s-s-left {
    width: 252px;
    height: 646px;
    background-color: #f7f8fc;

    .shops-title {
      margin-left: 10px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 4px;

      span {
        width: 64px;
        height: 21px;
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        line-height: 21px;
        text-align: left;
        font-style: normal;
      }

      img {
        width: 31px;
        height: 16px;
      }
    }

    .shop-cate {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 15px;

      .cate-item {
        width: 230px;
        height: 50px;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
        cursor: pointer;
        margin-top: 20px;

        &:hover {
          background-color: #f5f5f5;
        }

        .item-left {
          width: 30px;
          height: 30px;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .item-right {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .text-line {
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &:first-child {
              color: #333;
              font-weight: 500;
            }

            span {
              color: #999;

              &:hover {
                color: #f83126;
              }

              &:not(:last-child) {
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }

  .s-s-middle {
    width: 712px;
    height: 646px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;

    .m-t {
      width: 712px;
      height: 48px;
      background: #f7f8fc;
      display: flex;

      div {
        width: 100%;
        height: 100%;
        font-size: 16px;
        color: #333;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;

        &.active {
          color: #f83126;
        }

        :hover {
          color: #f83126;
        }

        .badge {
          position: absolute;
          top: 15px;
          right: 31px;
          width: 24px;
          height: 24px;
          margin-top: -25px;
          animation: bounce 1s infinite;
        }
      }
    }

    .m-m {
      width: 712px;
      height: 324px;

      img {
        width: 712px;
        height: 324px;
        object-fit: cover;
      }
    }

    .m-b {
      width: 712px;
      height: 242px;

      img {
        width: 712px;
        height: 242px;
        object-fit: cover;
      }
    }
  }

  .s-s-right {
    width: 516px;
    height: 646px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    .r-t {
      width: 100%;
      height: 384px;
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: center;

      .r-t-l {
        width: 248px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;

        .r-t-l-t {
          width: 100%;
          height: 184px;
          background-image: url('../assets/image/dfjpbg.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;

          .dfjp {
            width: 64px;
            height: 22px;
            font-weight: 600;
            font-size: 16px;
            color: #333333;
            line-height: 22px;
            text-align: right;
          }

          .yyqp {
            width: 64px;
            height: 19px;
            font-size: 14px;
            color: #ffffff;
            line-height: 19px;
            text-align: center;
            background-image: url('../assets/image/yyqpbg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }

          .chuizi {
            width: 91px;
            height: 105px;
            background-image: url('../assets/image/chuizi.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }

          .ljcy {
            width: 86px;
            height: 86px;
            background-image: url('../assets/image/ljcybg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;

            span {
              width: 44px;
              height: 58px;
              font-weight: bold;
              font-size: 22px;
              color: #ffffff;
              line-height: 29px;
              text-align: left;
              font-style: normal;
            }
          }
        }

        .r-t-l-b {
          width: 100%;
          height: 184px;
          background-image: url('../assets/image/znggbg.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;

          .r-t-l-b-top {
            width: 100%;
            height: 22px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 13px;
            margin-top: 20px;

            .zngg {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100px;
              height: 25px;

              span {
                width: 64px;
                height: 22px;
                font-weight: 600;
                font-size: 16px;
                color: #333333;
                line-height: 22px;
                text-align: right;
              }

              img {
                width: 30px;
                height: 15px;
                object-fit: cover;
              }
            }

            .rightarrimg {
              width: 12px;
              height: 12px;
              object-fit: cover;

              &:hover {
                cursor: pointer;
              }
            }
          }

          .r-t-l-b-bottoms {
            width: 100%;
            height: 184px;
            padding: 0 13px;

            div {
              width: 222px;
              height: 19px;
              font-family: MicrosoftYaHei;
              font-size: 14px;
              color: #505259;
              line-height: 19px;
              text-align: left;
              font-style: normal;
              margin: 12px 0;

              &:nth-child(1) {
                color: #f83126; // 第一个div的颜色
              }
            }
          }
        }
      }

      .r-t-r {
        width: 252px;
        height: 100%;
        background-image: url('../assets/image/usebg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: relative;

        .r-t-r-user {
          display: flex;
          justify-content: flex-start;
          align-self: start;
          gap: 7px;
          margin-top: 30px;
          margin-left: 10px;

          .user-img {
            width: 48px;
            height: 48px;
            object-fit: cover;
          }

          .user-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }
        }

        .mid-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
          padding: 0 30px;
          margin-top: 31px;

          .icon-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            width: 50px;
            height: 56px;
            cursor: pointer;

            img {
              width: 36px;
              height: 36px;
              object-fit: cover;
            }

            span {
              width: 48px;
              height: 16px;
              font-size: 12px;
              color: #505259;
              line-height: 16px;
              text-align: center;
            }
          }
        }

        .mid-status {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 22px;
          margin: 0 14px;
          margin-top: 27px;

          .status-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            width: 50px;
            height: 50px;
            cursor: pointer;

            span {
              width: 36px;
              height: 16px;
              font-size: 12px;
              color: #505259;
              line-height: 16px;
              text-align: center;
            }

            &:nth-child(4) {
              span:nth-child(2) {
                width: 48px;
              }
            }
          }
        }

        .r-t-r-qb {
          width: 221px;
          height: 96px;
          background-image: url('../assets/image/ballet.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          position: absolute;
          top: 262px;
          left: 16px;

          .my-ballet {
            width: 64px;
            height: 21px;
            font-weight: bold;
            font-size: 16px;
            color: #664102;
            line-height: 21px;
            text-align: left;
            margin: 28px 139px 4px 18px;
            cursor: pointer;

            &:hover {
              color: #f83126;
            }
          }

          .vie-mybalet {
            width: 72px;
            height: 16px;
            font-size: 12px;
            color: #a88100;
            line-height: 16px;
            text-align: left;
            margin: 0 131px 27px 18px;
            cursor: pointer;

            &:hover {
              color: #f83126;
            }
          }
        }
      }
    }

    .r-b {
      width: 100%;
      height: 242px;
      background-image: url('../assets/image/rtrbg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
}

.popover-content {
  width: 100%;

  .content-row {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }

  .content-item {
    font-size: 14px;
    color: #666;
    padding: 8px 12px;
    cursor: pointer;

    &:hover {
      color: #f83126;
    }
  }
}

.hot-rank {
  width: 1560px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .hot-rank-item-jxhy {
    width: 375px;
    height: 496px;
    background-image: url('../assets/image/jxhybg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;

    .hot-jingxuan {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 72px;
      margin: 14px 28px 18px 0;

      .jx-img {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 140px;

        img {
          width: 50px;
          height: 35px;
          object-fit: cover;
        }

        span {
          width: 88px;
          height: 30px;
          font-weight: 500;
          font-size: 22px;
          color: #333333;
          line-height: 30px;
          text-align: left;
        }
      }

      .jx-xjhpicon {
        width: 120px;

        img {
          width: 118px;
          height: 24px;
          object-fit: cover;
        }
      }
    }
  }

  .hot-rank-item-rx {
    width: 375px;
    height: 496px;
    background-image: url('../assets/image/rxbbg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .hot-rank-item-hp {
    width: 375px;
    height: 496px;
    background-image: url('../assets/image/hpbbg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .hot-rank-item-gift {
    width: 375px;
    height: 496px;
    background-image: url('../assets/image/lpzqbg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}

.hot-merchants {
  width: 1560px;
  height: 610px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .hot-merch-item {
    width: 506px;
    height: 608px;
    background-color: #a1a4a7;
  }
}

.quality-source {
  width: 1560px;
  height: 1282px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 2px;

  .q-s-item {
    width: 255px;
    height: 372px;
    background-color: #a1a4a7;
  }
}
</style>
<style scoped>
/* For demo */
:deep(.slick-slide) {
  text-align: center;
  height: 100%;
  width: 100%;
  line-height: 324px;
  overflow: auto;
}

:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}

:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #fff;
  opacity: 0.5;
}

:deep(.slick-slide h3) {
  color: #fff;
}
</style>
