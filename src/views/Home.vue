<template>
  <el-row>
    <el-col :span="6"
      ><div class="grid-content bg-purple">
        <el-tree
          :data="fileTreeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </el-col>
    <el-col :span="18">
      <div class="grid-content bg-purple-light">
        <el-card style="height: 610px">
          <quill-editor
            v-model="content"
            ref="myQuillEditor"
            style="height: 500px"
            :options="editorOption"
          >
            <!-- 自定义toolar -->
            <div id="toolbar" slot="toolbar">
              <!-- Add a bold button -->
              <button class="ql-bold" title="加粗">Bold</button>
              <button class="ql-italic" title="斜体">Italic</button>
              <button class="ql-underline" title="下划线">underline</button>
              <button class="ql-strike" title="删除线">strike</button>
              <button class="ql-blockquote" title="引用"></button>
              <button class="ql-code-block" title="代码"></button>
              <button class="ql-header" value="1" title="标题1"></button>
              <button class="ql-header" value="2" title="标题2"></button>
              <!--Add list -->
              <button class="ql-list" value="ordered" title="有序列表"></button>
              <button class="ql-list" value="bullet" title="无序列表"></button>
              <!-- Add font size dropdown -->
              <select class="ql-header" title="段落格式">
                <option selected>段落</option>
                <option value="1">标题1</option>
                <option value="2">标题2</option>
                <option value="3">标题3</option>
                <option value="4">标题4</option>
                <option value="5">标题5</option>
                <option value="6">标题6</option>
              </select>
              <select class="ql-size" title="字体大小">
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px" selected>16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
              <select class="ql-font" title="字体">
                <option value="SimSun">宋体</option>
                <option value="SimHei">黑体</option>
                <option value="Microsoft-YaHei">微软雅黑</option>
                <option value="KaiTi">楷体</option>
                <option value="FangSong">仿宋</option>
                <option value="Arial">Arial</option>
              </select>
              <!-- Add subscript and superscript buttons -->
              <select class="ql-color" value="color" title="字体颜色"></select>
              <select
                class="ql-background"
                value="background"
                title="背景颜色"
              ></select>
              <select class="ql-align" value="align" title="对齐"></select>
              <button class="ql-clean" title="还原"></button>
              <el-button class="el-icon-document-checked" style="margin-left: 50px;  font-weight: bold;" @click="updateFile">保存</el-button>
              <!-- You can also add your own -->
            </div>
          </quill-editor>
        </el-card>
      </div></el-col
    >
  </el-row>
</template>
<script>
import { getFileById } from "../api";
import {
    Quill,
    quillEditor
  } from 'vue-quill-editor'
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
//引入font.css 
import '../assets/css/font.css'


// 自定义字体大小
let Size = Quill.import('attributors/style/size')
  Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
  Quill.register(Size, true)

  // 自定义字体类型
  var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
    '宋体', '黑体'
  ]
  var Font = Quill.import('formats/font')
  Font.whitelist = fonts
  Quill.register(Font, true)

import {mapMutations} from 'vuex'
import { set } from 'vue';

export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      content: null,
      editorOption: {
          placeholder: "请输入",
          theme: "snow", // or 'bubble' 
          modules: {
            toolbar: {
              container: '#toolbar'
            }
          }
        }
    };
  },
  methods: {
    ...mapMutations(['setFileInfo']),
    handleNodeClick(node) {
    if (node.isRoot && !node.clicked) { // 节点对象有一个 `isRoot` 属性来标识是否为根节点
      // 发送请求获取数据
      node.clicked = true;
      console.log("根节点")
      this.fetchNodeFiles(node.id);
    }
  },
  fetchNodeFiles(nodeId) {
      getFileById(nodeId).then(({ data }) => {
        console.log(data);
        if (data.code === 20000) {
          this.content = data.data.content;
          this.setFileInfo(data.data);
        } else {
          this.$message.error(data.data.message);
        }
      })
    },
    updateFile() {
      console.log(this.content)
      this.$store.state.tab.fileInfo.content = this.content;
    }
  },
  computed: {
  fileTreeData() {
    return this.$store.state.tab.fileTree;
  }
 },
};
</script>
<style lang="less" scoped>
.user {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  img {
    margin-right: 40px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  .userinfo {
    .name {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .access {
      color: #999999;
    }
  }
}

.login-info {
  p {
    line-height: 28px;
    font-size: 14px;
    color: #999999;
    span {
      color: #666666;
      margin-left: 60px;
    }
  }
}
.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .icon {
    width: 80px;
    height: 80px;
    font-size: 30px;
    text-align: center;
    line-height: 80px;
    color: #fff;
  }
  .detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 15px;
    .price {
      font-size: 30px;
      margin-bottom: 10px;
      line-height: 30px;
      height: 30px;
    }
    .desc {
      font-size: 14px;
      color: #999;
      text-align: center;
    }
  }
  .el-card {
    width: 32%;
    margin-bottom: 20px;
  }
}
.graph {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;

  .el-card {
    width: 48%;
  }
}
</style>
