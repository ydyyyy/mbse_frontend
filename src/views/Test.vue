<template>
    <div id="diagram-container">
      
      <div>
        <demand-pic />
      </div>
    </div>
  </template>
  
  <script>
  import { jsPlumb } from 'jsplumb';
  import DemandPic from "@/components/DemandPic.vue";
  
  export default {
    components: {
        DemandPic,
    },
    data() {
      return {
        // 顶层需求数据
        topItems: [
          { id: 1, name: "飞行安全目标" },
          { id: 2, name: "市场目标与需求" },
          { id: 3, name: "系统需求" }
        ],
        // 底层需求数据
        bottomItems: [
          { id: 1, name: "安全分析" },
          { id: 2, name: "详细设计需求" },
          { id: 3, name: "实现方案" }
        ]
      };
    },
    mounted() {
      this.initJsPlumb();
    },
    methods: {
      initJsPlumb() {
        jsPlumb.ready(() => {
          jsPlumb.setContainer('diagram-container');
  
          // 设置连接样式和端点
          jsPlumb.importDefaults({
            Connector: ["Straight"],  // 使用直线连接
            PaintStyle: { stroke: "#5c96bc", strokeWidth: 2 },
            Endpoint: ["Dot", { radius: 5 }],
            EndpointStyle: { fill: "#5c96bc" },
            Anchors: ["Bottom", "Top"]  // 上下行之间连线
          });
  
          // 动态连接上下行的需求
          for (let i = 0; i < this.topItems.length; i++) {
            jsPlumb.connect({
              source: `top${this.topItems[i].id}`,
              target: `bottom${this.bottomItems[i].id}`,
              overlays: [["Arrow", { width: 10, length: 10, location: 1 }]] // 添加箭头
            });
          }
        });
      }
    }
  };
  </script>
  
  <style>
  #diagram-container {
    display: flex;
    flex-direction: column;
    width: 800px;
    margin: 50px auto;
  }
  
  .row {
    display: flex;
    justify-content: space-around; /* 自动调整节点间距 */
    margin: 20px 0;
  }
  
  .item {
    width: 150px;
    height: 50px;
    background-color: lightblue;
    text-align: center;
    line-height: 50px;
    border: 1px solid #5c96bc;
    border-radius: 5px;
  }
  </style>
  