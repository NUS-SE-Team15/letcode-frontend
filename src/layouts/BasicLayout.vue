<template>
  <div id="basiclayout">
    <a-layout style="height: 400px">
      <a-layout-header class="header">Navigation bar</a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">Letcode by Team15</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basiclayout {
}

#basiclayout .header {
  background: red;
  margin-bottom: 16px;
}

#basiclayout .content {
  background: linear-gradient(to right, #eee, #fff);
  margin-bottom: 16px;
}

#basiclayout .footer {
  background: #efefef;
  padding: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
