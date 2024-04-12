import Cookie from "js-cookie";
export default {
  state: {
    logged: false, // 是否登录
    fileTree: [], // 文件树
    fileInfo: {}, // 当前展示的文件信息
  },
  mutations: {
    // 修改登录状态
    setLogged(state, val) {
      state.logged = val;
    },
    setFileTree(state, val) {
      state.fileTree = val;
    },
    setFileId(state, val) {
      state.fileId = val;
    },
    setFileInfo(state, val) {
      state.fileInfo = val;
    },
  },
};
