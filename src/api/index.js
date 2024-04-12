import http from "@/utils/request";

//请求首页数据
export const getData = () => {
  // 返回一个promise对象
  return http.get("/home/getData");
};

export const getUser = (params) => {
  // 返回用户列表
  return http.get("/user/getUser", params);
};

export const addUser = (data) => {
  return http.post("/user/add", data);
};

export const editUser = (data) => {
  return http.post("/user/edit", data);
};

export const delUser = (data) => {
  return http.post("/user/del", data);
};

export const getMenu = (data) => {
  return http.post("/permission/getMenu", data);
};

export const getProjects = () => {
  return http.get("/permission/getProjects");
};

export const getFiles = () => {
  return http.get("/permission/getFiles");
};

export const getFileTree = (data) => {
  return http.post("/permission/getFileTree", data);
};

export const getFileById = (data) => {
  return http.post("/permission/getFileById", data);
}


export const getTypeFiles = (data) => {
  console.log("发了");
  return http.post("/permission/getTypeFiles", data);
}
sendToServer

export const sendToServer = (val1,val2) => {
  return http.post("/permission/sendToServer", val1,val2);
}