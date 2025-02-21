<template>
  <context-holder />
  <div class="my-purse">
    <a-flex vertical :gap="20">
      <!-- 个人信息 -->
      <a-card class="avatar-card">
        <div class="avatar-space">
          <a-space :size="9" class="avatar">
            <img :src="userInfo.avatar" alt="" />
            <a-flex vertical :gap="8">
              <div class="nickname">HI, {{ userInfo.nickname }}</div>
              <div class="uid"> UID：{{ userInfo.uid }}</div>
            </a-flex>
          </a-space>
          <a-space :size="24" class="btn-group">
            <div class="btn" @click="handleApply">
              <span>绑定管理</span>
            </div>
            <div class="btn" @click="handleSetPayCode">
              <span>设置支付密码</span>
            </div>
          </a-space>
        </div>
      </a-card>

      <!-- 账户余额 -->
      <a-card class="zhye">
        <a-flex justify="space-between" align="center" style="padding: 0 30px">
          <a-space :size="100">
            <div class="a-flex">
              <div class="yue">{{ userInfo.now_money }}</div>
              <div class="jine">账户余额(元)</div>
            </div>
            <div class="xiantiao"> </div>
            <div class="a-flex">
              <div class="yuan">1001</div>
              <div class="jine">申请退款中(元)</div>
            </div>
            <div class="xiantiao"> </div>
            <div class="a-flex">
              <div class="yuan">1001</div>
              <div class="jine">提现在途(元)</div>
            </div>
          </a-space>
          <a-space>
            <a-space :size="24">
              <div class="btn" style="background: #f7f8fa" @click="handleRecharge">
                <span>充值</span>
              </div>
              <div class="btn" @click="handleWithdraw">
                <span>提现</span>
              </div>
            </a-space>
          </a-space>
        </a-flex>
      </a-card>
      <!-- 今日利润（元） -->
      <a-card class="jrlr">
        <a-flex justify="space-around" align="center" style="padding: 0 30px">
          <div class="kuai">
            <img src="../../../assets/image/jrlr.png" alt="jrlr" />
            <div class="a-flex">
              <div class="jrlr">688,642.00</div>
              <div class="jine">今日利润(元)</div>
            </div>
          </div>
          <div class="xiantiao"> </div>
          <div class="kuai">
            <img src="../../../assets/image/ljlr.png" alt="ljlr" />
            <div class="a-flex">
              <div class="ljlr">688,642.00</div>
              <div class="jine">累计利润(元)</div>
            </div>
          </div>
          <div class="xiantiao"> </div>
          <div class="kuai">
            <img src="../../../assets/image/ljtx.png" alt="ljtx" />
            <div class="a-flex">
              <div class="ljtx">688,642.00</div>
              <div class="jine">累计提现(元)</div>
            </div>
          </div>
        </a-flex>
      </a-card>

      <!-- 列表记录 -->
      <a-card class="lbjl">
        <a-form :colon="false" :model="formData">
          <a-row :gutter="16">
            <a-col :span="4">
              <a-form-item label="订单编号">
                <a-input v-model:value="formData.keyWord" allowClear placeholder="请输入订单编号" />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="类型">
                <a-select v-model:value="formData.BalanceType">
                  <a-select-option :value="0">全部</a-select-option>
                  <a-select-option :value="1">支出</a-select-option>
                  <a-select-option :value="2">收入</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="时间">
                <a-range-picker
                  v-model:value="hackValue"
                  :format="dateFormat"
                  @change="onChange"
                  :placeholder="['开始时间', '结束时间']"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="">
                <a-space :size="24">
                  <a-button type="primary" @click="getProductsList">查找</a-button>
                  <a-button type="primary" @click="handleExport">导出明细</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-table
          :dataSource="dataSource"
          :columns="[
            {
              title: '类型',
              align: 'center',
              dataIndex: 'title'
            },
            {
              title: '订单编号',
              dataIndex: 'order_id',
              align: 'center'
            },
            {
              title: '原金额',
              dataIndex: 'pm',
              align: 'center'
            },
            {
              title: '金额变动',
              dataIndex: 'number',
              align: 'center'
            },
            {
              title: '剩余金额',
              dataIndex: 'balance',
              align: 'center'
            },
            {
              title: '日期',
              dataIndex: 'add_time',
              align: 'center'
            },
            {
              title: '售后订单',
              dataIndex: 'add_time',
              align: 'center'
            },
            {
              title: '来源订单',
              dataIndex: 'add_time',
              align: 'center'
            },
            {
              title: '操作',
              key: 'operate',
              align: 'center'
            }
          ]"
          bordered
          :pagination="false"
          :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : '')"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'pm'">
              <span
                >￥{{
                  record.pm == 1
                    ? (Number(record.balance) - Number(record.number)).toFixed(2)
                    : (Number(record.balance) + Number(record.number)).toFixed(2)
                }}</span
              >
            </template>
            <template v-if="column.dataIndex === 'balance'">
              <span>￥{{ record.balance }}</span>
            </template>
            <template v-if="column.dataIndex === 'number'">
              <a-tag color="success" v-if="record.pm == 1">
                <span>+￥{{ record.number }}</span>
                <ArrowUpOutlined />
              </a-tag>
              <a-tag color="error" v-else>
                <span>-￥{{ record.number }}</span>
                <ArrowDownOutlined />
              </a-tag>
            </template>
            <template v-if="column.key === 'operate'">
              <a-button v-if="record.type == 'pay_product'" type="link">查看订单</a-button>
            </template>
          </template>
        </a-table>
        <Pagination
          style="display: flex; justify-content: center; margin: 20px 0"
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="total"
          @change="getProductsList"
          :pageSizeOptions="[10, 20, 30, 40, 50, 100]"
        />
      </a-card>
    </a-flex>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import {
  getUserBalance,
  editUser,
  getUserInfo,
  sendVerify,
  setPayPwd,
  reCharge,
  applyWithdraw,
  checkPayPwd
} from '@/api/user'
import type { BalanceType } from '@/api/user'
import { message, Modal, Form, FormItem, Input, QRCode } from 'ant-design-vue'
import { Dayjs } from 'dayjs'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons-vue'
import * as XLSX from 'xlsx'
import { debounce } from '@/utils/util'
import './MyPurse.scss'
import zhifubaoImg from '@/assets/image/zhifubao.png'

const dateFormat = 'YYYY-MM-DD'
type RangeValue = [Dayjs, Dayjs] | [string, string]
const hackValue = ref<RangeValue>()

const [messageApi, contextHolder] = message.useMessage()
const formData = ref<{
  startTime: string
  endTime: string
  keyWord: string
  BalanceType: BalanceType
}>({
  startTime: '',
  endTime: '',
  keyWord: '',
  BalanceType: 0
})
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const total = ref(0) // 总条数

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

const dataSource = ref([])

// 绑定管理
const handleApply = () => {
  const zhifubao = ref(userInfo.alipay || '')
  const AInputRef = ref()
  const debouncedOk = debounce((resolve, reject) => {
    if (!zhifubao.value) {
      AInputRef.value.focus()
      message.error('请输入支付宝账号')
      reject(new Error('请输入支付宝账号'))
    } else {
      editUser({ alipay: zhifubao.value }).then((res: any) => {
        if (res.status === 200) {
          message.success('绑定成功')
          fetchUserInfo()
        } else {
          message.error(res.msg)
        }
      })
      setTimeout(() => {
        resolve(true)
      }, 1000)
    }
  }, 300)
  Modal.confirm({
    title: () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginBottom: '20px' }}>
        <span>绑定支付宝账号</span>
      </div>
    ),
    icon: null,
    width: '30%',
    closable: true,
    maskClosable: true,
    okText: '确认绑定',
    content: () => {
      return (
        <Form>
          <FormItem label="支付宝账号">
            <Input ref={AInputRef} v-model={[zhifubao.value, 'value']} allowClear placeholder="请输入支付宝账号" />
          </FormItem>
        </Form>
      )
    },
    onOk() {
      return new Promise((resolve, reject) => {
        debouncedOk(resolve, reject)
      })
    },
    afterClose() {
      zhifubao.value = ''
    }
  })
}

// 设置支付密码
const handleSetPayCode = () => {
  const yanzhengma = ref('获取验证码')
  const countdown = ref(60)
  const password = ref('')
  const verifyCode = ref('')
  const codeRef = ref()
  const verifyCodeRef = ref()

  const startCountdown = () => {
    const timer = setInterval(() => {
      countdown.value--
      yanzhengma.value = `${countdown.value}s`
      if (countdown.value <= 0) {
        clearInterval(timer)
        yanzhengma.value = '获取验证码'
        countdown.value = 60
      }
    }, 1000)
  }

  const debouncedOk = debounce((resolve, reject) => {
    if (!password.value) {
      codeRef.value.focus()
      message.error('请输入密码')
      return reject(new Error('请输入密码'))
    }
    if (!verifyCode.value) {
      verifyCodeRef.value.focus()
      message.error('请输入验证码')
      return reject(new Error('请输入验证码'))
    }

    setPayPwd({
      pwd: password.value,
      code: verifyCode.value
    }).then((res: any) => {
      if (res.status === 200) {
        message.success('设置成功')
        resolve(true)
      } else {
        message.error(res.msg)
        reject(new Error(res.msg))
      }
    })
  }, 300)

  Modal.confirm({
    title: () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginBottom: '20px' }}>
        <span>设置支付密码</span>
      </div>
    ),
    icon: null,
    width: '30%',
    closable: true,
    maskClosable: true,
    content: () => {
      return (
        <Form labelAlign={'right'} labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} colon={false}>
          <input type="text" name="username" autocomplete="username" style="display: none" />
          <FormItem label="密码">
            <Input
              ref={codeRef}
              v-model={[password.value, 'value']}
              autocomplete="current-password"
              type="password"
              allowClear
              placeholder="请输入密码"
            />
          </FormItem>
          <FormItem label="手机号">
            <Input disabled v-model={[userInfo.phone, 'value']} placeholder="请输入手机号" />
          </FormItem>
          <FormItem label="验证码">
            <Input
              ref={verifyCodeRef}
              style={{ width: '70%' }}
              v-model={[verifyCode.value, 'value']}
              allowClear
              placeholder="请输入验证码"
            />
            <span
              class="yanzhengma"
              onClick={() => {
                if (yanzhengma.value !== '获取验证码') return
                startCountdown()
                sendVerify({
                  phone: userInfo.phone,
                  type: 'setpaypwd'
                }).then((res: any) => {
                  if (res.status === 200) {
                    message.success('验证码发送成功，请注意接收短信')
                  } else {
                    message.error(res.msg)
                  }
                })
              }}
            >
              {yanzhengma.value}
            </span>
          </FormItem>
        </Form>
      )
    },
    onOk() {
      return new Promise((resolve, reject) => {
        debouncedOk(resolve, reject)
      })
    },
    afterClose() {
      password.value = ''
      verifyCode.value = ''
      yanzhengma.value = '获取验证码'
    }
  })
}

// 充值
const handleRecharge = () => {
  const applyUrl = ref('')
  const applyMoney = ref('')
  const AInputRef = ref()
  const debouncedOk = debounce((resolve, reject) => {
    if (!applyMoney.value) {
      AInputRef.value.focus()
      message.error('请输入充值金额')
      reject(new Error('请输入充值金额'))
    } else {
      reCharge({ money: applyMoney.value, returl: 'http://localhost:5468/usermanage/mypurse', type: 2 }).then(
        (res: any) => {
          if (res.status === 200) {
            applyUrl.value = res.data.url
            message.success('请打开支付宝扫码支付')
            Modal.info({
              icon: null,
              closable: true,
              footer: null,
              width: 350,
              centered: true,
              content: () => {
                return (
                  <div class="arcode">
                    <QRCode size={300} value={applyUrl.value} />
                    <div>请使用手机扫码支付</div>
                    <div>付款成功后请及时刷新页面</div>
                  </div>
                )
              }
            })
          } else {
            message.error(res.msg)
            reject(new Error(res.msg))
          }
        }
      )
      setTimeout(() => {
        resolve(true)
      }, 1000)
    }
  }, 300)
  Modal.confirm({
    title: () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginBottom: '20px' }}>
        <span>充值</span>
      </div>
    ),
    icon: null,
    width: '30%',
    closable: true,
    maskClosable: true,
    okText: '确认充值',
    content: () => {
      return (
        <Form>
          <FormItem label="充值金额">
            <Input ref={AInputRef} v-model={[applyMoney.value, 'value']} allowClear placeholder="请输入充值金额" />
          </FormItem>
          <FormItem label="支付方式">
            <div class={'pay-type'}>
              <img src={zhifubaoImg} alt="zhifubao" />
              <span>支付宝</span>
            </div>
          </FormItem>
        </Form>
      )
    },
    onOk() {
      return new Promise((resolve, reject) => {
        debouncedOk(resolve, reject)
      })
    },
    afterClose() {
      applyMoney.value = ''
    }
  })
}

// 提现
const handleWithdraw = () => {
  const withdrawMoney = ref('')
  const password = ref('')
  const moneyRef = ref()
  const passwordRef = ref()

  const debouncedOk = debounce((resolve, reject) => {
    if (!withdrawMoney.value) {
      moneyRef.value.focus()
      message.error('请输入提现金额')
      return reject(new Error('请输入提现金额'))
    }
    if (!password.value) {
      passwordRef.value.focus()
      message.error('请输入支付密码')
      return reject(new Error('请输入支付密码'))
    }
    // if (!userInfo.alipay) {
    //   message.error('请先绑定支付宝账号')
    //   return reject(new Error('请先绑定支付宝账号'))
    // }

    checkPayPwd({ pwd: password.value }).then((res: any) => {
      if (res.status === 200) {
        applyWithdraw({
          money: withdrawMoney.value,
          alipay: userInfo.alipay
        }).then((res: any) => {
          if (res.status === 200) {
            message.success('提现申请成功')
            resolve(true)
          } else {
            message.error(res.msg)
            reject(new Error(res.msg))
          }
        })
      } else {
        message.error(res.msg)
        reject(new Error(res.msg))
      }
    })
  }, 300)

  Modal.confirm({
    title: () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginBottom: '20px' }}>
        <span>提现</span>
      </div>
    ),
    icon: null,
    width: '40%',
    closable: true,
    maskClosable: true,
    okText: '确认提现',
    content: () => {
      return (
        // labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}
        <Form labelAlign={'right'} colon={false} class="withdraw-form">
          <div class="txts">
            注：最低提现金额为100元，提交提现申请后，将进入人工审核流程。审核通过后，款项将在提交申请起48小时内到账。
          </div>
          <FormItem label="提现金额">
            <Input ref={moneyRef} v-model={[withdrawMoney.value, 'value']} allowClear placeholder="请输入提现金额" />
            <div class="txsxf">
              到账金额
              {withdrawMoney.value && (
                <span>({(Number(withdrawMoney.value) - Number(withdrawMoney.value) * 0.005).toFixed(2)}元)</span>
              )}
              = 提现金额 - 提现金额*0.5%
            </div>
          </FormItem>
          {/* <FormItem label="支付宝账号">
            <Input v-model={[userInfo.alipay, 'value']} placeholder="支付宝账号" />
          </FormItem> */}
          <input type="text" name="username" autocomplete="username" style="display: none" />
          <FormItem label="支付密码">
            <Input
              ref={passwordRef}
              type="password"
              autocomplete="current-password"
              v-model={[password.value, 'value']}
              allowClear
              placeholder="请输入支付密码"
            />
          </FormItem>
        </Form>
      )
    },
    onOk() {
      return new Promise((resolve, reject) => {
        debouncedOk(resolve, reject)
      })
    },
    afterClose() {
      withdrawMoney.value = ''
      password.value = ''
    }
  })
}

const getProductsList = () => {
  getUserBalance({
    page: currentPage.value,
    limit: pageSize.value,
    BalanceType: formData.value.BalanceType,
    keyWord: formData.value.keyWord,
    startTime: formData.value.startTime,
    endTime: formData.value.endTime,
    keyWordType: 'order'
  }).then((res: any) => {
    if (res.status == 200) {
      dataSource.value = res.data.list
      total.value = res.data.count
    } else {
      messageApi.error(res.msg)
    }
  })
}
const onChange = (val: RangeValue | [string, string], dateStrings: [string, string]) => {
  if (val) {
    formData.value.startTime = dateStrings[0]
    formData.value.endTime = dateStrings[1]
  } else {
    formData.value.startTime = ''
    formData.value.endTime = ''
  }
}
const handleExport = () => {
  // 准备导出数据
  const exportData = dataSource.value.map((item: any) => ({
    类型: item.type === 1 ? '支出' : '收入',
    订单编号: item.order_id,
    原金额: item.pm == 1 ? '+' + item.balance : '-' + item.balance,
    金额变动: item.number,
    剩余金额: item.balance,
    日期: item.add_time
  }))

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '余额明细')
  // 导出文件
  XLSX.writeFile(wb, `余额明细${new Date().getTime()}.xlsx`)
}

const fetchUserInfo = () => {
  getUserInfo().then((res: any) => {
    if (res.status == 200) {
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      // location.reload()
      return
    }
    // location.reload()
  })
}
getProductsList()
fetchUserInfo()
</script>

<style scoped src="./MyPurse.scss"></style>
