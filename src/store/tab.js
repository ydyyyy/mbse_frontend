import Cookie from "js-cookie";
export default {
  state: {
    logged: false, // 是否登录
    fileTree: [], // 文件列表
  },
  mutations: {
    // 修改登录状态
    setLogged(state, val) {
      state.logged = val;
    },
    setFileTree(state, val) {
      state.fileTree = val;
    }
  },
};
