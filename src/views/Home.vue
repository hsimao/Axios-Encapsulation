<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "home",
  data() {
    return {
      isLoading: false
    };
  },
  mounted() {
    // = axios 配置
    // 1. axios 全域配置
    axios.defaults.timeout = 1000;
    axios.defaults.baseURL = "https://127.0.0.1:8080";

    // 2. axios 實例配置, 使用 axios.create() 創建, 若沒設定參數({ .. }), 將預設使用全域配置
    let instance = axios.create();
    // 將實例配置覆蓋
    instance.defaults.timeout = 3000;

    // 3. 請求配置, 在調用方法時配置
    instance.get("/api/user", {
      timeout: 5000
    });

    // 以上權重 3 > 2 > 1
    // 最終請求配置使用的 timeout 會是 5000

    // == 攔截器 interceptors
    // 1. 請求攔截器, client 端發出去的請求 request
    // 2. 回應攔截器, serve 回應的資料 response
    // 3. 取消攔截器, 必須在創建攔截器時用變數儲存，才可使用取消方法

    // 請求攔截器使用方式
    axios.interceptors.request.use(
      config => {
        // 發送請求前 do something ...
        return config;
      },
      err => {
        // 在請求錯誤時 do something ..., 需返回 Promise
        return Promise.reject(err);
      }
    );

    // 回應攔截器使用方式
    axios.interceptors.response.use(
      res => {
        // 請求成功時對回應資料 do something ...

        return res;
      },
      err => {
        // 回應錯誤 do something ...
        // 這邊返回的 err 會回到 axios的.catch(err => console.log(err))
        return Promise.reject(err);
      }
    );

    // 取消攔截器使用方式
    // 先將攔截使使用變數儲存
    let interceptorsTest = axios.interceptors.request.use(congig => {
      config.headers = {
        auth: true
      };
      return config;
    });

    // 取消對應的 request.eject() / response.eject()
    axios.interceptors.request.eject(interceptorsTest);

    // ==  例子, 在特定需要傳遞 headers token 的驗證 api 接口使用 axios 實例搭配攔截器來實作
    // 建議在創建攔截器時，使用實例配置的 axios 來建立，避免全局污染
    const userTokenAxios = axios.create({});
    userTokenAxios.interceptors.request.use(config => {
      config.headers.token = "....";
      return config;
    });

    // == 行動裝置例子, 等待時添加動畫
    const mobileAxios = axios.create({});

    // 請求攔截器，發送前添加 loading 狀態
    mobileAxios.interceptors.request.use(config => {
      this.isLoading = true;
      return config;
    });

    // 接收到回應前，將 loading 狀態恢復
    mobileAxios.interceptors.response.use(
      res => {
        this.isLoading = false;
        return res;
      },
      err => {
        this.isLoading = false;
        return Promise.reject(err);
      }
    );

    // == 統一錯誤處理
    // request
    const handleErrorAxios = axios.create({});
    handleErrorAxios.interceptors.request.use(
      config => {
        return config;
      },
      err => {
        // 請求錯誤 http status
        // 400 錯誤請求, 401 未經授權, 403 禁止, 404 未找到, 408 請求超時
        if (err.response.status === 404) {
          router.push("/404");
        }
        return Promise.reject(err);
      }
    );

    // response
    handleErrorAxios.interceptors.response.use(
      res => {
        return res;
      },
      err => {
        // 伺服器回應錯誤 http status
        // 500 內部服務器錯誤, 502 壞門戶, 503 服務不可用, 599 網絡連接超時錯誤
        // 呼叫彈窗提示
        this.popupMessage({
          message: `伺服器錯誤，錯誤代碼：${err.response.status}`
        });
        return Pormise.reject(err);
      }
    );
  }
};
</script>
