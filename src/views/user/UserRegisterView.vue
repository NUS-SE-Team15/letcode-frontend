<template>
  <div id="userRegisterView">
    <h2 style="margin-bottom: 16px">Register</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="Account">
        <a-input
          v-model="form.userAccount"
          placeholder="Please enter your account"
        />
      </a-form-item>
      <a-form-item
        field="userPassword"
        tooltip="Password must be at least 8 characters"
        label="Password"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="Please enter a password"
        />
      </a-form-item>
      <a-form-item
        field="checkPassword"
        tooltip="Reenter password"
        label="Confirm password"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="Please enter your password again"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px">
          Register
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const router = useRouter();

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (form.userPassword !== form.checkPassword) {
    message.error("The two password entries are inconsistent\n");
    return;
  }
  const res = await UserControllerService.userRegisterUsingPost(form);
  // 注册成功，跳转到登录页面
  if (res.code === 0) {
    message.success("Registration successful, please login");
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    message.error("Fail to register, " + res.message);
  }
};
</script>
