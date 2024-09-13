<template>
  <div>
    <!-- 文件选择按钮和需求链接测试按钮容器 -->
    <div class="button-container">
      <label class="custom-file-input">
        <input type="file" @change="onFileChangeTop" multiple />
        选择顶层需求文件
      </label>
      <label class="custom-file-input">
        <input type="file" @change="onFileChangeBottom" multiple />
        选择底层需求文件
      </label>
      <button @click="initJsPlumb" class="test-button">需求链接测试</button>
    </div>
    <div id="diagram-container">
      <!-- 第一行：顶层需求 -->
      <div class="row" id="top-layer">
        <div
          v-for="(item, index) in filesTop"
          :key="index"
          :id="'top' + item.id"
          class="item"
        >
          {{ item.name }}
        </div>
      </div>

      <!-- 第二行：底层需求 -->
      <div class="row" id="bottom-layer">
        <div
          v-for="(item, index) in filesBottom"
          :key="index"
          :id="'bottom' + item.id"
          class="item"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";

export default {
  data() {
    return {
      // 顶层需求数据
      filesTop: [],
      // 底层需求数据
      filesBottom: [],
    };
  },
  methods: {
    initJsPlumb() {
      console.log("初始化jsPlumb");
      jsPlumb.ready(() => {
        jsPlumb.setContainer("diagram-container");

        // 设置连接样式和端点
        jsPlumb.importDefaults({
          Connector: ["Bezier", { curviness: 60 }], // 使用曲线连接
          PaintStyle: { stroke: "#ff6347", strokeWidth: 3 }, // 使用更宽的连接器
          Endpoint: ["Dot", { radius: 6 }], // 增加端点半径
          EndpointStyle: { fill: "#ff6347", stroke: "#fff", strokeWidth: 2 }, // 设置端点样式
          Anchors: ["Bottom", "Top"], // 上下行之间连线
          HoverPaintStyle: { stroke: "#ff4500", strokeWidth: 3 }, // 鼠标悬停时的样式
          ConnectionOverlays: [
            ["Arrow", { width: 12, length: 12, location: 1, id: "arrow" }]
          ], // 添加箭头
        });

        // 动态连接上下行的需求
        for (let i = 0; i < this.filesTop.length; i++) {
          jsPlumb.connect({
            source: `top${this.filesTop[i].id}`,
            target: `bottom${this.filesBottom[i].id}`,
            overlays: [["Arrow", { width: 10, length: 10, location: 1 }]], // 添加箭头
          });
        }
      });
    },
    onFileChangeTop(event) {
      // 监听文件选择事件，更新 files 数组
      this.filesTop = Array.from(event.target.files); 
      this.filesTop.forEach((item, index) => {
        item.id = index; // 为每个文件添加 id 属性
      });
    },
    onFileChangeBottom(event) {
      // 监听文件选择事件，更新 files 数组
      this.filesBottom = Array.from(event.target.files); 
        this.filesBottom.forEach((item, index) => {
            item.id = index; // 为每个文件添加 id 属性
        });
    },
  },
};
</script>

<style lang="less" scoped>
#diagram-container {
  display: flex;
  flex-direction: column;
  width: 800px;
  margin: 50px auto;
  position: relative;
}

.row {
  display: flex;
  justify-content: space-around; /* 自动调整节点间距 */
  margin: 50px 0;
}

.item {
  width: 180px;
  height: 60px;
  background-color: #42b983;
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 60px;
  border: 1px solid #42b983;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, background-color 0.3s;
  cursor: pointer;
  position: relative; /* 保证元素的定位明确 */
}

/* 按钮容器样式 */
.button-container {
  margin-left: 20px;
  display: flex;
  gap: 40px; /* 按钮之间的间距 */
  margin-bottom: 20px; /* 按钮与卡片之间的距离 */
}

/* 自定义文件选择按钮 */
.custom-file-input {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.custom-file-input input {
  display: none; /* 隐藏原生 input */
}

/* 需求链接测试按钮 */
.test-button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}
</style>
