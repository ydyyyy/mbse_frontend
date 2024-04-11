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
  }
}