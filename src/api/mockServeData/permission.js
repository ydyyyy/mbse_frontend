import Mock from 'mockjs'

export default {
  getProjects: () => {
    return {
      code: 20000,
      data: {
        "projects": [
          { "id": 1, "name": "Project 1", "description": "Description of Project 1" },
          { "id": 2, "name": "Project 2", "description": "Description of Project 2" },
          { "id": 3, "name": "Project 3", "description": "Description of Project 3" },
        ]
      }
      
    }
  },

  getFiles: () => {
    return {
      code: 20000,
      resultData: {
        list: [
          { "id": 1, "name": "project1.txt", "type": "text" },
          { "id": 2, "name": "Image.png", "type": "image" },
          { "id": 3, "name": "a.mp4", "type": "audio" }
        ]
      }
      
    }
  }


}