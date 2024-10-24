<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.svg" />
            <div class="title">LetCode</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div @click="goLoginout" style="cursor: pointer">
        {{ curUsername }}
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import { UserControllerService } from "../../generated";
import message from "@arco-design/web-vue/es/message";

const router = useRouter();
const route = useRoute();
const store = useStore();

const curUsername = computed(() => {
  if (isLogin.value)
    return store.state.user.loginUser.userAccount ?? "Please Login";
  return "Please Login";
});

const isLogin = computed(() => {
  return store.state.user?.loginUser?.userRole !== "notLogin";
});

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    return checkAccess(
      store.state.user.loginUser,
      item?.meta?.access as string
    );
  });
});

// 默认主页
const selectedKeys = ref([route.path]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

setTimeout(async () => {
  await store.dispatch("user/getLoginUser");
  if (isLogin.value && route.path == "/user/login") {
    message.success("Already Login!");
    router.replace("/");
  }
}, 1000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

const goLoginout = () => {
  if (isLogin.value) {
    logout();
    return;
  }
  router.push("/user/login");
};

const logout = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.code === 0) {
    message.success("Logout successfully!");
    await store.dispatch("user/getLoginUser");
    router.replace("/user/login");
  }
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
