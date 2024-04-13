import http from "@/utils/request";

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
  return http.post("/permission/getTypeFiles", data);
}


export const sendToServer = (id,content) => {
  return http.post("/permission/sendToServer", { id, content });
}


export const updateFileById = (id,content) => {
  return http.post("/permission/updateFileById", { id, content });
}