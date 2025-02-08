interface IFormData {
  info: Record<string, any>
  type: string
  token: string
  cgorlrRio: number
  cgval: number | null
  lrval: number | null
  store_name: string
  reduce_type: string | null
  freight_id: string
  category_id: string[]
  start_sale_type: string
  after_sale_service: string
  mobile: number | null
  color: any[]
  size: any[]
  tableData: any[]
  shuxing: Record<string, any>
  after_sale_service_v2: {
    service_type: string
    duration: string
  }
  is_evaluate_opened: string
  limit_per_buyer: string
  maximum_per_order: string
  minimum_per_order: string
  reference_price: string
  certificate_type: string
}

interface ISize {
  data: {
    token: string;
    page_num: number;
    page_size?: number;
    template_sub_type?: string;
  }
}

// 商品列表接口
interface IProductParams {
  page: number
  limit: number
  goods_address?: string
  mer_id?: string
  sid?: string
  keyword?: string
  url?: string
  salesOrder?: string
  priceOrder?: string
  star_price?: number | string
  end_price?: number | string
  ids?: string
}

// 购物车列表
interface ICartsParams {
  status: string | number;
  page: number;
  limit: number
}
