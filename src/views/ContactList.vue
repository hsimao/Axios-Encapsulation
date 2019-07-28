<template>
  <div>
    <!--  列表 -->
    <van-contact-list
      :list="list"
      @add="onAdd"
      @edit="onEdit" />

    <!-- 編輯 -->
    <van-popup v-model="showEdit" position="bottom">
      <van-contact-edit
        :contact-info="editingContact"
        :is-edit="isEdit"
        @save="onSave"
        @delete="onDelete" />
    </van-popup>
  </div>

</template>

<script>
import { ContactList, ContactEdit, Toast, Popup } from "vant";
import axios from "axios";

export default {
  name: "ContactList",
  components: {
    [ContactList.name]: ContactList,
    [ContactEdit.name]: ContactEdit,
    [Popup.name]: Popup
  },
  data() {
    return {
      list: [],
      editingContact: {}, // 當前編輯中的資料
      showEdit: false,
      isEdit: false // 控制新增或編輯, 差別在於input欄位要顯示資料還是空值
    };
  },
  methods: {
    onAdd() {
      this.showEdit = true;
      this.isEdit = false;
      this.editingContact = {};
    },
    onEdit(info) {
      this.showEdit = true;
      this.isEdit = true;
      this.editingContact = info;
    },
    onSave(info) {
      if (this.isEdit) {
        // 編輯保存
        this.saveEditContact(info);
      } else {
        // 新增保存
        this.saveNewContactJson(info);
      }
    },
    onDelete({ id }) {
      this.deleteContact(id);
    },
    async getContactList() {
      const { data } = await this.$Http.getContactList();
      if (!data) return;
      this.list = data;
    },
    async saveNewContactForm(info) {
      const { data } = await this.$Http.newContactForm(info, true);
      if (!data) return;
      setTimeout(() => Toast("新增成功"), 300);
      this.getContactList();
      this.showEdit = false;
    },
    async saveNewContactJson(info) {
      const { data } = await this.$Http.newContactJson(info);
      if (!data) return;
      setTimeout(() => Toast("新增成功"), 300);
      this.getContactList();
      this.showEdit = false;
    },
    async saveEditContact(info) {
      const { data } = await this.$Http.editContact(info);
      if (!data) return;
      setTimeout(() => Toast("編輯成功"), 300);
      this.getContactList();
      this.showEdit = false;
    },
    async deleteContact(id) {
      const { code } = await this.$Http.deleteContact({ id: id });
      if (code !== 200) return;
      setTimeout(() => Toast("刪除成功"), 300);
      this.getContactList();
      this.showEdit = false;
    }
  },
  created() {
    this.getContactList();
  }
};
</script>

<style lang="scss" scoped>
.van-contact-list__add {
  z-index: 0;
}
.van-popup {
  height: 80%;
}
</style>