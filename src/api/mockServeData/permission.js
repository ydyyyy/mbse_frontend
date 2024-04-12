import Mock from 'mockjs'
import { getFileTree } from '..'

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
  },

  getFileTree: config => {
    const val = config.body
    if(val == 1)
      return {
        code: 20000,
        data: [
          {
            label: "一级 1",
            children: [
              {
                label: "二级 1-1",
                children: [
                  {
                    label: "三级 1-1-1",
                  },
                ],
              },
            ],
          },
          {
            label: "一级 2",
            children: [
              {
                label: "二级 2-1",
                children: [
                  {
                    label: "三级 2-1-1",
                  },
                ],
              },
              {
                label: "二级 2-2",
                children: [
                  {
                    label: "三级 2-2-1",
                  },
                ],
              },
            ],
          },
          {
            label: "一级 3",
            children: [
              {
                label: "二级 3-1",
                children: [
                  {
                    label: "三级 3-1-1",
                  },
                ],
              },
              {
                label: "二级 3-2",
                children: [
                  {
                    label: "三级 3-2-1",
                  },
                ],
              },
            ],
          },
        ],
        
      }
    if(val==2)
      return {
        code: 20000,
        data: [
          {
            label: "一级 1",
            children: [
              {
                label: "二级 1-1",
              },
              {
                label: "二级 1-2",
              },
              {
                label: "二级 1-3",
              },
            ],
          },        
        ],
        
      }
    }
  }

