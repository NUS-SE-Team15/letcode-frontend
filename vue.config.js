const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        // 代理到本地后端
        target: "http://127.0.0.1:8101",
        //target: "http://LetCodeLB-457706603.ap-southeast-1.elb.amazonaws.com:8101",//代理到aws上面，
        //ws: true, // 如果使用 websocket，设为 true
        changeOrigin: true, // 是否开启跨域
        pathRewrite: { "^/api": "" }, // 重写路径，将 /api 替换为空
      },
    },
  },
});
