import axios from 'axios'
import contactApi from './contact'
import { Toast } from 'vant'

// 封裝 axios

// 創建 axios實例, 設置通用配置
const axiosConfig = axios.create({
  baseURL: 'http://localhost:9000/api',
  timeout: 1000,
})

// 封裝不同 http 請求方法的容器
const Http = {}

// 循環抓出不同 api 方法
for (let key in contactApi) {
  const api = contactApi[key]
  Http[key] = async (params, isFormData = false, config = {}) => {
    let newParams = {}

    // 如果是 form-data 格式
    if (params && isFormData) {
      newParams = new FormData()
      for (let i in params) {
        newParams.append(i, params[i])
      }

      // 如果是不 form-data 格式
    } else {
      newParams = params
    }

    // 針對不同請求的不同接收參數方法來設置
    // 如果是 put、post、patch
    let response = {} // 請求的返回值
    if (api.method === 'put' || api.method === 'post' || api.method === 'patch') {
      try {
        response = await axiosConfig[api.method](api.url, newParams, config)
      } catch (err) {
        response = err
      }

      // 如果是 get、delete
    } else if (api.method === 'get' || api.method === 'delete') {
      config.params = newParams
      try {
        response = await axiosConfig[api.method](api.url, config)
      } catch (err) {
        response = err
      }
    }

    return response
  }
}

// 請求攔截器
axiosConfig.interceptors.request.use(
  config => {
    // 發送請求前處理 ...
    // 提示窗
    Toast.loading({
      mask: false, // 是否要有陰影
      duration: 0, // 一直存在
      forbidClick: true, // 禁止點擊
      message: '載入中...',
    })
    return config
  },
  err => {
    // 請求錯誤處理 ...
    Toast.clear()
    Toast('請求錯誤，請稍後再重新嘗試')

    return Promise.reject(err)
  }
)

// 回應攔截器
axiosConfig.interceptors.response.use(
  res => {
    // 請求成功，取得返回值 ...
    Toast.clear()
    if (res.data.code !== 200) {
      Toast('發生錯誤')
    }
    return res.data
  },
  err => {
    // 請求錯誤處理 ...
    Toast.clear()
    Toast('請求錯誤，請稍後再重新嘗試')

    return Promise.reject(err)
  }
)

export default Http
