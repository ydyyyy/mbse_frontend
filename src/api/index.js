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
  return http.get("/projects/");
};

export const getFiles = () => {
  return http.get("/permission/getFiles");
};

export const getFileTree = (data) => {
  return http.get(`/projects/${data}/structure`);
};

export const getFileById = (data) => {
  return http.get(`/fileorfolder/${data}`);
}


export const getTypeFiles = (data) => {
  return http.get("/fileorfolder/", data);
}


export const sendToServer = (val1,val2) => {
  console.log(val1,val2);
  return http.post("/permission/sendToServer", { val1, val2 });
}

export const updateFileById=(id,content) => {
  console.log({id,content});
return http.post("/fileorfolder/updateContent",{id,content});
}

export const getSpecialFiles = (content) => {
  console.log({content});
  return http.post("/fileorfolder/search",{content});
}