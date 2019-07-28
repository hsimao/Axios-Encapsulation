// 封裝 api 接口
const CONTACT_API = {
  // 取得聯絡人列表
  getContactList: {
    method: 'get',
    url: '/contactList',
  },

  // 新增聯絡人 form-data
  newContactForm: {
    method: 'post',
    url: '/contact/new/form',
  },

  // 新增聯絡人 application/json
  newContactJson: {
    method: 'post',
    url: '/contact/new/json',
  },

  // 編輯聯絡人
  editContact: {
    method: 'put',
    url: '/contact/edit',
  },

  // 刪除聯絡人
  deleteContact: {
    method: 'delete',
    url: '/contact',
  },
}

export default CONTACT_API
