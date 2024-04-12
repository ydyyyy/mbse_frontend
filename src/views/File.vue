<template>
  <div class="bodys">
      <!-- 标题栏 -->
      <div class="titles">
          <!-- 图标 -->
          <div><i class="el-icon-s-management"></i></div>
          <!-- 标题文字 -->
          <div>{{ title }}</div>
      </div>

      <!-- 主体部分 -->
      <div class="mains">
          <!-- 标签页 -->
          <el-tabs tab-position="left" @tab-click="tabClick">
              <!-- 文件分类信息 -->
              <el-tab-pane>
                  <span slot="label"><i class="el-icon-folder-opened"></i> 文件分类信息</span>
                  <!-- 分类信息主体部分 -->
                  <div>
                      <!-- 顶部功能操作区 -->
                      <div class="typeDos">
                          <div>
                              <el-input
                                  v-model="typeQueryInfo.fileTypeInfo.name"
                                  placeholder="分类名称"
                                  prefix-icon="el-icon-search"
                                  size="medium"
                                  clearable
                              ></el-input>
                          </div>
                          <div>
                              <el-button type="primary" icon="el-icon-search" size="medium" @click="queryTypeInfo">查询</el-button>
                          </div>
                          <div>
                              <el-button type="warning" icon="el-icon-refresh" size="medium" @click="resetQueryType">重置</el-button>
                          </div>
                          <div>
                              <el-button type="success" icon="el-icon-plus" size="medium" @click="showTypeAddFrom = !showTypeAddFrom"
                                  >添加</el-button
                              >
                          </div>
                      </div>
                      <!-- 添加分类信息的表单 -->
                      <div>
                          <transition name="el-zoom-in-top">
                              <div class="addTypeForms" v-show="showTypeAddFrom">
                                  <div>添加分类信息：</div>
                                  <div>
                                      <el-input
                                          v-model="addTypeInfo.name"
                                          placeholder="请输入分类名称"
                                          prefix-icon="el-icon-search"
                                          size="medium"
                                          clearable
                                      ></el-input>
                                  </div>
                                  <div>
                                      <el-button
                                          type="primary"
                                          size="medium"
                                          icon="el-icon-check"
                                          :loading="addTypeLoading"
                                          @click="addType"
                                      >
                                          提交
                                      </el-button>
                                  </div>
                              </div>
                          </transition>
                      </div>
                      <!-- 数据展示部分 -->
                      <div class="typeTables">
                          <!-- 数据表格 -->
                          <el-table :data="typeList" v-loading="typeLoading" element-loading-text="拼命加载中...">
                              <el-table-column label="主键" align="center" prop="ftiid"></el-table-column>
                              <el-table-column label="分类名称" align="center" prop="name"></el-table-column>
                              <el-table-column label="创建时间" align="center">
                                  <template slot-scope="scope">
                                      {{ formatDate(scope.row.create_time) }}
                                  </template>
                              </el-table-column>
                              <el-table-column label="操作" align="center">
                                  <template slot-scope="scope">
                                      <div class="tableBtns">
                                          <div>
                                              <el-button size="small" icon="el-icon-edit" @click="openUpdateType(scope.row)"
                                                  >修改</el-button
                                              >
                                          </div>
                                          <div>
                                              <el-popconfirm
                                                  :title="'确定要删除：' + scope.row.name + ' 吗？'"
                                                  @confirm="delType(scope.row)"
                                              >
                                                  <el-button slot="reference" type="danger" size="small" icon="el-icon-delete"
                                                      >删除</el-button
                                                  >
                                              </el-popconfirm>
                                          </div>
                                      </div>
                                  </template>
                              </el-table-column>
                          </el-table>
                          <!-- 数据分页 -->
                          <div class="typePages">
                              <el-pagination
                                  @size-change="handleSizeChange"
                                  @current-change="handleCurrentChange"
                                  :current-page="typePage.pageNumber"
                                  :page-sizes="[10, 20, 30, 40]"
                                  :total="typePage.pageTotal"
                                  layout="jumper, prev, pager, next, sizes, total"
                              >
                              </el-pagination>
                          </div>
                      </div>
                  </div>
              </el-tab-pane>
              <!-- 文件信息 -->
              <el-tab-pane>
                  <span slot="label"><i class="el-icon-folder"></i> 文件信息</span>
                  <div>
                      <!-- 顶部功能操作区 -->
                      <div class="typeDos">
                          <div>
                              <el-select
                                  v-model="fileQueryInfo.fileInfo.ftiid"
                                  :remote-method="queryRmFun"
                                  :loading="fileTypeLoading"
                                  size="medium"
                                  placeholder="分类名称"
                                  clearable
                                  filterable
                                  remote
                              >
                                  <el-option v-for="fl in fileTypeList" :key="fl.ftiid" :label="fl.name" :value="fl.ftiid"></el-option>
                              </el-select>
                          </div>
                          <div>
                              <el-input
                                  v-model="fileQueryInfo.fileInfo.info"
                                  placeholder="文件描述"
                                  prefix-icon="el-icon-search"
                                  size="medium"
                                  clearable
                              ></el-input>
                          </div>
                          <div>
                              <el-button type="primary" icon="el-icon-search" size="medium" @click="queryFileInfo">查询</el-button>
                          </div>
                          <div>
                              <el-button type="warning" icon="el-icon-refresh" size="medium" @click="resetQueryFileInfo">重置</el-button>
                          </div>
                          <div>
                              <el-button
                                  type="success"
                                  icon="el-icon-upload"
                                  size="medium"
                                  @click="showFileUploadFrom = !showFileUploadFrom"
                                  >上传</el-button
                              >
                          </div>
                      </div>
                      <!-- 数据展示部分 -->
                      <div class="filesBody" ref="filesBody" v-loading="fileLoading" element-loading-text="拼命加载中...">
                          <!-- 文件展示部分 -->
                          <div v-for="fl in fileList" :key="fl.fiid">
                              <el-tooltip class="item" effect="light" content="单击预览，右击菜单">
                                  <!-- 文件信息展示主体部分 -->
                                  <div @click="fileView(fl)" @contextmenu.prevent="openDoingCard($event, fl)">
                                      <div v-if="resFileType('image', fl.type)">
                                          <svg
                                              t="1685006061667"
                                              class="icon"
                                              viewBox="0 0 1024 1024"
                                              version="1.1"
                                              xmlns="http://www.w3.org/2000/svg"
                                              p-id="833"
                                              width="60"
                                              height="60"
                                          >
                                              <path
                                                  d="M160 0h512l256 256v704c0 35.3472-28.6528 64-64 64H160c-35.3472 0-64-28.6528-64-64V64c0-35.3472 28.6528-64 64-64z"
                                                  fill="#F6AD00"
                                                  p-id="834"
                                              ></path>
                                              <path
                                                  d="M258.528 742.0672L351.8336 604.928a14.5024 14.5024 0 0 1 22.1696-2.1824l61.664 60.416 135.296-212.064a14.5024 14.5024 0 0 1 24.8064 0.5568l168.1024 291.328a14.5024 14.5024 0 0 1-12.5696 21.7664H270.528a14.5024 14.5024 0 0 1-12.0064-22.6816z"
                                                  fill="#FFF7F7"
                                                  p-id="835"
                                              ></path>
                                              <path
                                                  d="M359.616 431.5456m-73.1456 0a73.1456 73.1456 0 1 0 146.2912 0 73.1456 73.1456 0 1 0-146.2912 0Z"
                                                  fill="#FFFFFF"
                                                  p-id="836"
                                              ></path>
                                              <path
                                                  d="M672 0l256 256h-192c-35.3472 0-64-28.6528-64-64V0z"
                                                  fill="#FBDE99"
                                                  p-id="837"
                                              ></path>
                                          </svg>
                                      </div>
                                      <div v-else-if="resFileType('video', fl.type)">
                                          <svg
                                              t="1685006580858"
                                              class="icon"
                                              viewBox="0 0 1024 1024"
                                              version="1.1"
                                              xmlns="http://www.w3.org/2000/svg"
                                              p-id="1347"
                                              width="60"
                                              height="60"
                                          >
                                              <path
                                                  d="M160 0h512l256 256v704c0 35.3472-28.6528 64-64 64H160c-35.3472 0-64-28.6528-64-64V64c0-35.3472 28.6528-64 64-64z"
                                                  fill="#7C8EEE"
                                                  p-id="1348"
                                              ></path>
                                              <path
                                                  d="M702.2976 579.2896l-298.5664 177.984c-19.9488 12.0192-45.3312-2.4128-45.3312-25.856v-355.968c0-22.848 25.3824-37.2736 45.3312-25.856l298.56 177.984c19.3408 12.032 19.3408 40.288 0 51.712z"
                                                  fill="#FFFFFF"
                                                  p-id="1349"
                                              ></path>
                                              <path
                                                  d="M672 0l256 256h-192c-35.3472 0-64-28.6528-64-64V0z"
                                                  fill="#CAD1F8"
                                                  p-id="1350"
                                              ></path>
                                          </svg>
                                      </div>
                                      <div v-else-if="resFileType('audio', fl.type)">
                                          <svg
                                              t="1685006637737"
                                              class="icon"
                                              viewBox="0 0 1024 1024"
                                              version="1.1"
                                              xmlns="http://www.w3.org/2000/svg"
                                              p-id="1833"
                                              width="60"
                                              height="60"
                                          >
                                              <path
                                                  d="M235.466 195.356v249.398H39.548v-179.51c0-38.59 31.296-69.888 69.888-69.888h35.726z"
                                                  fill="#BED8FB"
                                                  p-id="1834"
                                              ></path>
                                              <path
                                                  d="M984.44 393.056v548.778c0 45.39-36.756 82.166-82.126 82.166H227.34c-29.072 0-54.6-15.102-69.208-37.87a81.72 81.72 0 0 1-10.714-25.136l-0.308-46.976-1.916-279.756V82.166C145.194 36.778 181.972 0 227.34 0h364.066c32.718 0 138.662 90.348 232.326 185.494 85.486 86.844 160.708 177.686 160.708 207.562z"
                                                  fill="#DDEAFB"
                                                  p-id="1835"
                                              ></path>
                                              <path
                                                  d="M984.452 393.056v201.03c0-0.226-0.02-0.454-0.02-0.7C978.25 346.72 777.324 335.306 711.62 269.6l112.124-84.104c85.464 86.842 160.708 177.684 160.708 207.56z"
                                                  fill="#CBE2FF"
                                                  p-id="1836"
                                              ></path>
                                              <path
                                                  d="M591.386 0H390.356c0.226 0 0.454 0.02 0.7 0.02 246.666 6.182 258.08 207.108 323.786 272.812l84.104-112.124C712.102 75.244 621.26 0 591.386 0z"
                                                  fill="#CBE2FF"
                                                  p-id="1837"
                                              ></path>
                                              <path
                                                  d="M984.45 393.066v34.754c0-73.172-59.336-132.506-132.506-132.506h-80.648c-45.368 0-82.162-36.794-82.162-82.162V132.506C689.134 59.334 629.8 0 556.628 0h34.754c62.58 0 122.616 24.866 166.866 69.114l157.086 157.086a236.008 236.008 0 0 1 69.116 166.866zM701.41 693.93v184.278c0 59.606-48.316 107.922-107.922 107.922H158.132a81.72 81.72 0 0 1-10.714-25.136l-0.308-46.976-1.916-279.756v-48.254h448.294c59.606 0 107.922 48.316 107.922 107.922z"
                                                  fill="#BED8FB"
                                                  p-id="1838"
                                              ></path>
                                              <path
                                                  d="M771.298 443.052v375.384c0 59.606-48.316 107.922-107.922 107.922H109.448c-2.08 0-4.12-0.082-6.16-0.288-35.706-3.09-63.726-33.068-63.726-69.6V265.244c0 19.286 7.83 36.756 20.48 49.408 11.27 11.29 26.394 18.75 43.246 20.192 2.04 0.206 4.08 0.288 6.16 0.288h553.928c59.608-0.002 107.922 48.314 107.922 107.92z"
                                                  fill="#78D0B1"
                                                  p-id="1839"
                                              ></path>
                                              <path
                                                  d="M668.278 492.9v275.676c0 5.068-0.68 9.972-1.978 14.608-6.388 23.158-27.608 40.156-52.786 40.156H192.438a49.648 49.648 0 0 1-39.106-18.956 49.52 49.52 0 0 1-10.756-30.906V487.996c0-27.526 22.314-49.84 49.86-49.84h421.076c30.248 0 54.766 24.52 54.766 54.744z"
                                                  fill="#F1D333"
                                                  p-id="1840"
                                              ></path>
                                              <path
                                                  d="M103.288 334.842v591.228c-35.706-3.09-63.726-33.068-63.726-69.6V265.244c0 19.286 7.83 36.756 20.48 49.408 11.27 11.29 26.392 18.748 43.246 20.19z"
                                                  fill="#61AAB7"
                                                  p-id="1841"
                                              ></path>
                                              <path
                                                  d="M526.418 485.758a15.46 15.46 0 0 0-12.086-3.79l-154.412 18.39a15.454 15.454 0 0 0-13.624 15.344v137.312c-8.434-5.252-18.102-8.244-28.376-8.244-32.688 0-59.28 30.252-59.28 67.434s26.592 67.434 59.28 67.434 59.28-30.25 59.28-67.434v-122.488l123.506-14.71v59.616c-8.434-5.252-18.102-8.244-28.376-8.244-32.688 0-59.28 30.252-59.28 67.434s26.592 67.434 59.28 67.434 59.28-30.25 59.28-67.434v-196.502a15.438 15.438 0 0 0-5.192-11.552z"
                                                  fill="#475959"
                                                  p-id="1842"
                                              ></path>
                                          </svg>
                                      </div>
                                      <div v-else-if="resFileType('text', fl.type)">
                                          <svg
                                              t="1685007419392"
                                              class="icon"
                                              viewBox="0 0 1024 1024"
                                              version="1.1"
                                              xmlns="http://www.w3.org/2000/svg"
                                              p-id="2775"
                                              width="60"
                                              height="60"
                                          >
                                              <path
                                                  d="M235.46654 308.353398v249.397513H39.548923v-179.50965c0-38.589925 31.295939-69.887864 69.887863-69.887863h35.72593z"
                                                  fill="#BED8FB"
                                                  p-id="2776"
                                              ></path>
                                              <path
                                                  d="M984.451077 393.055232v548.776928c0 45.389911-36.777928 82.16784-82.145839 82.16784H227.330556c-38.775924 0-71.267861-26.867948-79.901844-63.005877l-0.329999-46.975908-1.915997-279.755454V82.16784C145.184716 36.777928 181.962645 0 227.330556 0h364.065289c32.717936 0 138.681729 90.345824 232.345546 185.493638 85.465833 86.84383 160.709686 177.685653 160.709686 207.561594z"
                                                  fill="#DDEAFB"
                                                  p-id="2777"
                                              ></path>
                                              <path
                                                  d="M984.451077 393.055232v201.029608c0-0.226-0.02-0.453999-0.02-0.699999C978.249089 346.719323 777.323482 335.305345 711.61961 269.599473l112.123781-84.103835c85.463833 86.84183 160.707686 177.683653 160.707686 207.559594z"
                                                  fill="#CBE2FF"
                                                  p-id="2778"
                                              ></path>
                                              <path
                                                  d="M591.385845 0H390.356238c0.226 0 0.453999 0.02 0.699998 0.02 246.665518 6.181988 258.079496 207.107595 323.785368 272.811467l84.103836-112.123781C712.101609 75.243853 621.259787 0 591.385845 0z"
                                                  fill="#CBE2FF"
                                                  p-id="2779"
                                              ></path>
                                              <path
                                                  d="M984.449077 393.065232v34.753932c0-73.171857-59.335884-132.505741-132.505741-132.505741h-80.647842c-45.367911 0-82.16184-36.793928-82.16184-82.161839V132.505741C689.133654 59.333884 629.79977 0 556.627913 0h34.753932c62.579878 0 122.615761 24.865951 166.865674 69.113865l157.085693 157.085693a236.007539 236.007539 0 0 1 69.115865 166.865674z"
                                                  fill="#BED8FB"
                                                  p-id="2780"
                                              ></path>
                                              <path
                                                  d="M701.41163 621.816786v184.27764c0 59.605884-48.315906 107.921789-107.921789 107.921789H147.092713l-1.915997-279.755454v-120.365765h448.313125c59.605884 0 107.921789 48.313906 107.921789 107.92179z"
                                                  fill="#CBE2FF"
                                                  p-id="2781"
                                              ></path>
                                              <path
                                                  d="M771.297494 556.048914v184.27764c0 59.605884-48.315906 107.921789-107.92179 107.921789H109.448786c-2.079996 0-4.119992-0.082-6.159988-0.287999-35.70593-3.089994-63.725876-33.067935-63.725875-69.599864v-400.119219c0 19.285962 7.829985 36.755928 20.47996 49.407904 11.269978 11.289978 26.393948 18.749963 43.245915 20.19196 2.039996 0.206 4.079992 0.287999 6.159988 0.288h553.926918c59.607884-0.002 107.921789 48.313906 107.92179 107.919789z"
                                                  fill="#C67D66"
                                                  p-id="2782"
                                              ></path>
                                              <path
                                                  d="M103.288798 447.839125v400.121219c-35.70593-3.089994-63.725876-33.067935-63.725875-69.599864v-400.119219c0 19.285962 7.829985 36.755928 20.47996 49.407904 11.269978 11.289978 26.391948 18.747963 43.245915 20.18996z"
                                                  fill="#AA593D"
                                                  p-id="2783"
                                              ></path>
                                              <path
                                                  d="M447.262126 640.880748l58.001887-82.331839A15.45197 15.45197 0 0 0 480.000062 540.750944l-51.625899 73.281857-51.545899-73.273857a15.45197 15.45197 0 1 0-25.275951 17.781965l57.915887 82.327839-67.827867 96.283812a15.44997 15.44997 0 0 0 12.617975 24.351953 15.42797 15.42797 0 0 0 12.645975-6.553988l61.45388-87.231829 61.359881 87.22383a15.43197 15.43197 0 0 0 12.651975 6.561987 15.45197 15.45197 0 0 0 12.623975-24.343953zM306.712401 534.196957H198.248613a15.45197 15.45197 0 1 0 0 30.903939h38.561924v180.949647a15.45197 15.45197 0 1 0 30.90394 0v-180.949647h38.997924c8.535983 0 15.45197-6.917986 15.45197-15.45197s-6.915986-15.45197-15.45197-15.451969zM658.377714 534.196957h-108.463788a15.45197 15.45197 0 1 0 0 30.903939h38.561925v180.949647a15.45197 15.45197 0 1 0 30.903939 0v-180.949647h38.997924c8.535983 0 15.45197-6.917986 15.45197-15.45197s-6.915986-15.45197-15.45197-15.451969z"
                                                  fill="#475959"
                                                  p-id="2784"
                                              ></path>
                                          </svg>
                                      </div>
                                      <div v-else>
                                          <svg
                                              t="1691562564931"
                                              class="icon"
                                              viewBox="0 0 1024 1024"
                                              version="1.1"
                                              xmlns="http://www.w3.org/2000/svg"
                                              p-id="1488"
                                              width="60"
                                              height="60"
                                          >
                                              <path
                                                  d="M272 960h480a128 128 0 0 0 128-128V320L624 64H272a128 128 0 0 0-128 128v640a128 128 0 0 0 128 128z"
                                                  fill="#0CCCC3"
                                                  p-id="1489"
                                              ></path>
                                              <path d="M752 320h128L624 64v128a128 128 0 0 0 128 128z" fill="#BCF7EF" p-id="1490"></path>
                                              <path
                                                  d="M513.952 437.92c15.776 0 26.96 4.16 34.544 11.632 7.776 8.32 11.872 19.232 11.872 33.36 0 10.592-3.744 20.64-11.68 30.288l-5.552 6.4c-15.904 14.016-28.72 26.24-38.4 36.64-9.6 10.336-16.448 19.248-20 26.608-7.088 13.76-10.448 30.656-10.448 50.368v13.184h69.056v-13.184c0-10.352 2.224-19.872 6.64-28.64l0.048-0.08c4.128-8.48 10.032-15.824 17.808-22.048l0.096-0.08 0.08-0.064c22.72-19.632 37.104-32.688 42.64-38.88l0.176-0.192 0.16-0.208c13.072-17.152 19.408-38.48 19.408-63.52 0-31.248-10.368-56.416-31.536-74.624-20.688-18.4-48.08-27.28-81.488-27.28-37.12 0-67.36 10.56-90 32.32-22.768 21.52-33.776 51.488-33.776 88.992v6.4h68.544v-6.4c0-19.984 3.968-34.24 10.976-43.696l0.128-0.192c7.552-10.96 20.512-17.12 40.704-17.12zM556.8 735.792c0-11.136-4.784-20.512-13.696-27.84l-0.112-0.08c-8.928-7.008-20.032-10.272-32.848-10.272-12.24 0-23.088 3.328-32.224 10.176l-0.112 0.096c-9.056 7.088-13.808 16.56-13.808 27.92 0 11.36 4.752 20.816 13.808 27.92l0.096 0.08a52.336 52.336 0 0 0 32.24 10.608c12.48 0 23.392-3.28 32.272-10.224 9.44-7.088 14.384-16.72 14.384-28.384z"
                                                  fill="#FFFFFF"
                                                  p-id="1491"
                                              ></path>
                                          </svg>
                                      </div>
                                      <div class="fnStyles">{{ fl.name }}</div>
                                  </div>
                              </el-tooltip>
                          </div>
                          <!-- 底部提示/反馈信息部分 -->
                          <div v-if="fileList.length >= 20">
                              <div v-if="!fileScrollLoading && !isNfm">滚动加载更多...</div>
                              <div v-else-if="!fileScrollLoading && isNfm">没有更多啦...</div>
                              <div v-else><i class="el-icon-loading"></i> 加载中...</div>
                          </div>
                      </div>
                  </div>
              </el-tab-pane>
          </el-tabs>
      </div>

      <!-- 文件分类信息修改对话框 -->
      <div>
          <el-dialog
              title="修改分类信息"
              center
              :visible.sync="showTypeUpdateFrom"
              :close-on-press-escape="false"
              :close-on-click-modal="false"
              :show-close="false"
          >
              <!-- 操作表单 -->
              <el-form>
                  <el-form-item label="分类名称：">
                      <el-input v-model="updateTypeInfo.name" placeholder="请输入分类名称" clearable></el-input>
                  </el-form-item>
                  <el-form-item>
                      <div class="doingFormBtns">
                          <div>
                              <el-button
                                  size="medium"
                                  type="primary"
                                  icon="el-icon-position"
                                  @click="updateType"
                                  :loading="updateTypeLoading"
                                  >提交</el-button
                              >
                          </div>
                          <div>
                              <el-button size="medium" icon="el-icon-close" @click="closeUpdateType">关闭</el-button>
                          </div>
                      </div>
                  </el-form-item>
              </el-form>
          </el-dialog>
      </div>

      <!-- 文件信息上传对话框 -->
      <div>
          <el-dialog
              title="上传文件"
              center
              :visible.sync="showFileUploadFrom"
              :close-on-press-escape="false"
              :close-on-click-modal="false"
              :show-close="false"
          >
              <!-- 上传表单 -->
              <el-form v-loading="uploadFileLoading.loading" :element-loading-text="'上传中：' + uploadFileLoading.progress + '%'">
                  <el-form-item label="附加信息：">
                      <div class="fileInfoWrites">
                          <div>
                              <el-select
                                  v-model="uploadFileInfo.fileInfo.ftiid"
                                  :remote-method="queryRmFun"
                                  :loading="fileTypeLoading"
                                  size="medium"
                                  placeholder="分类名称"
                                  clearable
                                  filterable
                                  remote
                              >
                                  <el-option v-for="fl in fileTypeList" :key="fl.ftiid" :label="fl.name" :value="fl.ftiid"></el-option>
                              </el-select>
                          </div>
                          <div>
                              <el-input
                                  v-model="uploadFileInfo.fileInfo.info"
                                  placeholder="文件描述"
                                  prefix-icon="el-icon-search"
                                  size="medium"
                                  clearable
                              ></el-input>
                          </div>
                      </div>
                  </el-form-item>
                  <el-form-item label="选择文件：">
                      <el-upload class="upload-demo" action="" :show-file-list="false" :before-upload="chooseUploadFile" drag>
                          <i class="el-icon-upload"></i>
                          <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
                      </el-upload>
                  </el-form-item>
                  <el-form-item label="选中的文件：">
                      <div>{{ uploadFileInfo.file != null ? uploadFileInfo.file.name : '未选择任何文件' }}</div>
                  </el-form-item>
                  <el-form-item>
                      <div class="doingFormBtns">
                          <div>
                              <el-button size="medium" type="primary" icon="el-icon-position" @click="uploadFile">提交</el-button>
                          </div>
                          <div>
                              <el-button size="medium" icon="el-icon-close" @click="closeUploadFile">关闭</el-button>
                          </div>
                      </div>
                  </el-form-item>
              </el-form>
          </el-dialog>
      </div>

      <!-- 文件右键菜单 -->
      <transition name="el-zoom-in-top">
          <div
              v-if="showDoingCard"
              id="doingCard"
              :style="{ left: updateDialogLeft + 'px', top: updateDialogTop + 'px' }"
              class="doingCardStyles"
          >
              <!-- 右键菜单功能按钮组 -->
              <div @click="openFileDetail">详情</div>
              <div @click="copyOnlineUrl">复制链接</div>
              <div @click="openUpdateFile">修改</div>
              <div @click="delFile">立即删除</div>
              <div @click="downLoadFile">下载</div>
              <div @click="closeDoingCard">取消</div>
          </div>
      </transition>

      <!-- 文件详情对话框 -->
      <div>
          <el-dialog
              title="文件详情"
              center
              :visible.sync="showFileDetail"
              :close-on-press-escape="false"
              :close-on-click-modal="false"
              @close="closeFileDetail"
          >
              <!-- 文件详情信息展示表单 -->
              <el-form label-position="left">
                  <el-form-item label="文件名称：">
                      {{ fileDetail.name }}
                  </el-form-item>
                  <el-form-item label="分类名称：">
                      <span v-for="ftl in fileTypeList" :key="ftl.ftiid">
                          <span v-if="fileDetail.ftiid == ftl.ftiid">{{ ftl.name }}</span>
                      </span>
                  </el-form-item>
                  <el-form-item label="文件描述：">
                      {{ fileDetail.info }}
                  </el-form-item>
                  <el-form-item label="文件类型：">
                      {{ fileDetail.type }}
                  </el-form-item>
                  <el-form-item label="文件大小：">
                      {{ formatFileSize(fileDetail.size) }}
                  </el-form-item>
                  <el-form-item label="上传时间：">
                      {{ formatDate(fileDetail.upload_time) }}
                  </el-form-item>
                  <el-form-item label="最后修改时间：">
                      {{ formatDate(fileDetail.lastupdate) }}
                  </el-form-item>
              </el-form>
          </el-dialog>
      </div>

      <!-- 文件信息修改对话框 -->
      <div>
          <el-dialog
              title="修改文件"
              center
              :visible.sync="showFileUpdateFrom"
              :close-on-press-escape="false"
              :close-on-click-modal="false"
              :show-close="false"
          >
              <!-- 文件信息修改表单 -->
              <el-form v-loading="updateFileLoading.loading" :element-loading-text="'上传中：' + updateFileLoading.progress + '%'">
                  <el-form-item label="附加信息：">
                      <div class="fileInfoWrites">
                          <div>
                              <el-select
                                  v-model="updateFileInfo.fileInfo.ftiid"
                                  :remote-method="queryRmFun"
                                  :loading="fileTypeLoading"
                                  size="medium"
                                  placeholder="分类名称"
                                  clearable
                                  filterable
                                  remote
                              >
                                  <el-option v-for="fl in fileTypeList" :key="fl.ftiid" :value="fl.ftiid" :label="fl.name"></el-option>
                              </el-select>
                          </div>
                          <div>
                              <el-input
                                  v-model="updateFileInfo.fileInfo.info"
                                  placeholder="文件描述"
                                  prefix-icon="el-icon-search"
                                  size="medium"
                                  clearable
                              ></el-input>
                          </div>
                      </div>
                  </el-form-item>
                  <el-form-item label="选择文件：">
                      <el-upload class="upload-demo" action="" :show-file-list="false" :before-upload="chooseUpdateFile" drag>
                          <i class="el-icon-upload"></i>
                          <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
                      </el-upload>
                  </el-form-item>
                  <el-form-item label="选中的文件：">
                      <div>{{ updateFileInfo.file != null ? updateFileInfo.file.name : '未选择任何文件' }}</div>
                  </el-form-item>
                  <el-form-item>
                      <div class="doingFormBtns">
                          <div>
                              <el-button size="medium" type="primary" icon="el-icon-position" @click="updateFile">提交</el-button>
                          </div>
                          <div>
                              <el-button size="medium" icon="el-icon-close" @click="closeUpdateFile">关闭</el-button>
                          </div>
                      </div>
                  </el-form-item>
              </el-form>
          </el-dialog>
      </div>
  </div>
</template>

<script>
// 依赖引入
// axios
import axios from 'axios';
// qs
import qs from 'qs';
// js-base64
import { Base64 } from 'js-base64';

export default {
  name: 'FilesIndex',
  data() {
      return {
          // 页面标题
          title: '文件管理',
          // 接口服务地址
          baseUrl: 'https://kangxianghui.top',
          // ======== 分类信息部分 ========
          // 分类信息查询条件
          typeQueryInfo: {
              fileTypeInfo: {
                  name: ''
              },
              page: {
                  pageNumber: 1,
                  pageSize: 10
              }
          },
          // 分类信息查询加载
          typeLoading: false,
          // 分类信息数据集合
          typeList: [],
          // 分类信息数据分页
          typePage: {},
          // 是否打开分类信息添加对话框
          showTypeAddFrom: false,
          // 分类信息添加信息对象
          addTypeInfo: {
              name: ''
          },
          // 分类信息添加加载
          addTypeLoading: false,
          // 是否打开分类信息修改对话框
          showTypeUpdateFrom: false,
          // 分类信息修改信息对象
          updateTypeInfo: {},
          // 分类信息修改加载
          updateTypeLoading: false,
          // 分类信息删除加载
          delTypeLoading: false,
          // ======== 文件信息部分 ========
          fileSize: 10 * 1000 * 1024,
          fileQueryInfo: {
              fileInfo: {
                  ftiid: '',
                  info: ''
              },
              page: {
                  pageNumber: 1,
                  pageSize: 25
              }
          },
          // 文件信息加载
          fileLoading: false,
          // 文件信息滚动查询加载
          fileScrollLoading: false,
          // 文件分类信息加载
          fileTypeLoading: false,
          // 文件分类信息数据集合
          fileTypeList: [],
          // 文件信息数据集合
          fileList: [],
          // 文件信息数据分页
          filePage: {},
          // 文件信息数据是否全部加载完毕
          isNfm: false,
          // 是否打开上传文件对话框
          showFileUploadFrom: false,
          // 文件上传信息对象
          uploadFileInfo: {
              file: null,
              fileInfo: {
                  ftiid: '',
                  info: ''
              }
          },
          // 文件上传反馈信息对象
          uploadFileLoading: {
              loading: false,
              progress: 0
          },
          // 是否打开修改文件对话框
          showFileUpdateFrom: false,
          // 文件修改信息对象
          updateFileInfo: {
              file: null,
              fileInfo: {}
          },
          // 文件修改反馈信息对象
          updateFileLoading: {
              loading: false,
              progress: 0
          },
          // 删除文件加载
          delFileLoading: false,
          // 是否打开右击功能卡片
          showDoingCard: false,
          // 文件信息存储对象
          doingInfo: {},
          // 右键菜单样式变量
          updateDialogTop: 0,
          updateDialogLeft: 0,
          // 是否打开文件详情对话框
          showFileDetail: false,
          // 文件详情信息对象
          fileDetail: {}
      };
  },
  mounted() {
      this.queryTypeInfo();
      this.fhScroll();
  },
  methods: {
      // 修改文件表单选择文件组件触发的函数
      chooseUpdateFile(file) {
          this.updateFileInfo.file = file;
          return false;
      },
      // 修改文件
      updateFile() {
          if (this.updateFileInfo.fileInfo.ftiid == '') {
              this.showMessage(false, '请选择分类名称');
              return;
          }
          if (this.updateFileInfo.fileInfo.info == '') {
              this.showMessage(false, '文件描述必须填写');
              return;
          }
          if (this.updateFileInfo.file == null) {
              this.showMessage(false, '必须选择一个文件');
              return;
          }
          if (this.updateFileInfo.file.size > this.fileSize) {
              this.showMessage(false, '文件大小超过限制');
              return;
          }
          this.sendFile('/karl-openapi/FileInfo/Update', this.updateFileInfo, 'POST', this.updateFileLoading);
      },
      // 关闭文件修改对话框
      closeUpdateFile() {
          this.showFileUpdateFrom = false;
          this.fileTypeList = [];
          this.updateFileInfo = {
              file: null,
              fileInfo: {}
          };
          this.queryFileInfo();
      },
      // 打开文件修改对话框
      openUpdateFile() {
          this.showFileUpdateFrom = true;
          this.updateFileInfo.fileInfo = {
              fiid: this.doingInfo.fiid,
              ftiid: this.doingInfo.ftiid,
              info: this.doingInfo.info
          };
          this.ajax(
              '/karl-openapi/FileTypeInfo/QueryAll',
              {
                  fileTypeInfo: {
                      name: ''
                  },
                  page: {
                      pageNumber: 1,
                      pageSize: 100
                  }
              },
              (data) => {
                  this.fileTypeList = data.resultData.list;
              }
          );
          this.closeDoingCard();
      },
      // 删除文件
      delFile() {
          this.ajax(
              '/karl-openapi/FileInfo/Del',
              {
                  'fileInfo.fiid': this.doingInfo.fiid
              },
              (data) => {
                  this.showMessage(data.success, data.message);
                  this.closeDoingCard();
                  this.queryFileInfo();
              }
          );
      },
      // 关闭文件详情对话框
      closeFileDetail() {
          this.showFileDetail = false;
          this.fileDetail = {};
          this.fileTypeList = [];
      },
      // 打开文件详情对话框
      openFileDetail() {
          this.fileDetail = this.doingInfo;
          this.ajax(
              '/karl-openapi/FileTypeInfo/QueryAll',
              {
                  fileTypeInfo: {
                      name: ''
                  },
                  page: {
                      pageNumber: 1,
                      pageSize: 100
                  }
              },
              (data) => {
                  this.fileTypeList = data.resultData.list;
              }
          );
          this.showFileDetail = true;
          this.closeDoingCard();
      },
      // 复制文件链接
      copyOnlineUrl() {
          let input = document.createElement('input');
          input.readOnly = 'readonly';
          input.value = this.baseUrl + '/karl-openapi/FileInfo/OnlineView/' + this.doingInfo.name;
          document.body.appendChild(input);
          input.select();
          input.setSelectionRange(0, input.value.length);
          document.execCommand('Copy');
          document.body.removeChild(input);
          this.$message.success('复制成功');
          this.closeDoingCard();
      },
      // 下载文件
      downLoadFile() {
          window.open(this.baseUrl + '/karl-openapi/FileInfo/Download?fileInfo.fiid=' + this.doingInfo.fiid);
          this.closeDoingCard();
      },
      // 关闭文件右键菜单
      closeDoingCard() {
          document.removeEventListener('click', this.outsideClickListener);
          this.doingInfo = {};
          this.showDoingCard = false;
          this.updateDialogLeft = 0;
          this.updateDialogTop = 0;
      },
      // 打开文件右键菜单
      openDoingCard(e, info) {
          this.doingInfo = info;
          this.showDoingCard = true;
          this.updateDialogLeft = e.clientX + 30;
          this.updateDialogTop = e.clientY;
          document.addEventListener('click', this.outsideClickListener);
      },
      // 元素外点击监听函数
      outsideClickListener(event) {
          let targetElement = document.getElementById('doingCard');
          let isClickedOutside = !targetElement.contains(event.target);
          if (isClickedOutside) {
              this.closeDoingCard();
          }
      },
      // 预览文件
      fileView(info) {
          window.open(
              'https://kangxianghui.top/karl-fileview/onlinePreview?url=' +
                  encodeURIComponent(Base64.encodeURI(this.baseUrl + '/karl-openapi/FileInfo/OnlineView/' + info.name))
          );
      },
      // 滚动查询文件
      fhScroll() {
          let filesBody = this.$refs.filesBody;
          let app = this;
          if (filesBody) {
              filesBody.addEventListener('scroll', function () {
                  if (filesBody.scrollTop + filesBody.clientHeight >= filesBody.scrollHeight) {
                      if (app.isNfm) {
                          return;
                      }
                      app.fileScrollLoading = true;
                      app.fileQueryInfo.page.pageNumber += 1;
                      app.ajax('/karl-openapi/FileInfo/QueryAll', app.fileQueryInfo, (data) => {
                          setTimeout(() => {
                              app.fileScrollLoading = false;
                              let n = 0;
                              data.resultData.list.forEach((obj) => {
                                  if (
                                      !app.fileList.some(function (flObj) {
                                          return flObj.fiid === obj.fiid;
                                      })
                                  ) {
                                      app.fileList.push(obj);
                                      n++;
                                  }
                              });
                              if (n == 0) {
                                  app.isNfm = true;
                                  app.$message({
                                      type: 'info',
                                      message: '啊哦，没有更多数据了~'
                                  });
                              } else {
                                  app.isNfm = false;
                              }
                              app.filePage = data.resultData.page;
                          }, 800);
                      });
                  }
              });
          }
      },
      // 文件类型匹配
      resFileType(type, value) {
          return value.search(type) != -1;
      },
      // 上传文件
      uploadFile() {
          if (this.uploadFileInfo.fileInfo.ftiid == '') {
              this.showMessage(false, '请选择分类名称');
              return;
          }
          if (this.uploadFileInfo.fileInfo.info == '') {
              this.showMessage(false, '文件描述必须填写');
              return;
          }
          if (this.uploadFileInfo.file == null) {
              this.showMessage(false, '必须选择一个文件');
              return;
          }
          if (this.uploadFileInfo.file.size > this.fileSize) {
              this.showMessage(false, '文件大小超过限制');
              return;
          }
          this.sendFile('/karl-openapi/FileInfo/Add', this.uploadFileInfo, 'POST', this.uploadFileLoading);
      },
      // 文件上传选择文件组件触发的函数
      chooseUploadFile(file) {
          this.uploadFileInfo.file = file;
          return false;
      },
      // 关闭文件上传对话框
      closeUploadFile() {
          this.showFileUploadFrom = false;
          this.fileTypeList = [];
          this.uploadFileInfo = {
              file: null,
              fileInfo: {
                  ftiid: '',
                  info: ''
              }
          };
          this.queryFileInfo();
      },
      // 分类信息选择器输入值变化时触发
      queryRmFun(str) {
          this.fileTypeLoading = true;
          this.ajax(
              '/karl-openapi/FileTypeInfo/QueryAll',
              {
                  fileTypeInfo: {
                      name: str
                  },
                  page: {
                      pageNumber: 1,
                      pageSize: 100
                  }
              },
              (data) => {
                  this.fileTypeLoading = false;
                  this.fileTypeList = data.resultData.list;
              }
          );
      },
      // 重置查询文件信息
      resetQueryFileInfo() {
          this.fileTypeList = [];
          this.fileQueryInfo = {
              fileInfo: {
                  ftiid: '',
                  info: ''
              },
              page: {
                  pageNumber: 1,
                  pageSize: 25
              }
          };
          this.isNfm = false;
          this.queryFileInfo();
      },
      // 查询文件信息
      queryFileInfo() {
          this.fileLoading = true;
          this.ajax('/karl-openapi/FileInfo/QueryAll', this.fileQueryInfo, (data) => {
              setTimeout(() => {
                  this.fileLoading = false;
                  this.fileList = data.resultData.list;
                  this.filePage = data.resultData.page;
              }, 800);
          });
      },
      // 删除分类信息
      delType(obj) {
          if (obj.ftiid == '') {
              this.showMessage(false, '分类主键不能为空');
              return;
          }
          this.delTypeLoading = true;
          this.ajax(
              '/karl-openapi/FileTypeInfo/Del',
              {
                  fileTypeInfo: {
                      ftiid: obj.ftiid
                  }
              },
              (data) => {
                  this.delTypeLoading = false;
                  this.showMessage(data.success, data.message);
                  this.queryTypeInfo();
              }
          );
      },
      // 修改分类信息
      updateType() {
          if (this.updateTypeInfo.ftiid == '') {
              this.showMessage(false, '分类主键不能为空');
              return;
          }
          if (this.updateTypeInfo.name == '') {
              this.showMessage(false, '分类名称不能为空');
              return;
          }
          this.updateTypeLoading = true;
          this.ajax(
              '/karl-openapi/FileTypeInfo/Update',
              {
                  fileTypeInfo: {
                      ftiid: this.updateTypeInfo.ftiid,
                      name: this.updateTypeInfo.name
                  }
              },
              (data) => {
                  this.updateTypeLoading = false;
                  this.showMessage(data.success, data.message);
              }
          );
      },
      // 关闭分类信息修改对话框
      closeUpdateType() {
          this.showTypeUpdateFrom = false;
          this.updateTypeInfo = {};
          this.queryTypeInfo();
      },
      // 打开分类信息修改对话框
      openUpdateType(obj) {
          this.updateTypeInfo = obj;
          this.showTypeUpdateFrom = true;
      },
      // 添加分类信息
      addType() {
          if (this.addTypeInfo.name == '') {
              this.showMessage(false, '分类名称必须填写');
              return;
          }
          this.addTypeLoading = true;
          this.ajax(
              '/karl-openapi/FileTypeInfo/Add',
              {
                  'fileTypeInfo.name': this.addTypeInfo.name
              },
              (data) => {
                  this.addTypeLoading = false;
                  this.showMessage(data.success, data.message);
                  this.queryTypeInfo();
              }
          );
      },
      // 分类信息分页大小变化时触发
      handleSizeChange(val) {
          this.typeQueryInfo.page.pageSize = val;
          this.queryTypeInfo();
      },
      // 分类信息页码变化时触发
      handleCurrentChange(val) {
          this.typeQueryInfo.page.pageNumber = val;
          this.queryTypeInfo();
      },
      // 重置分类信息查询
      resetQueryType() {
          this.typeQueryInfo = {
              fileTypeInfo: {
                  name: ''
              },
              page: {
                  pageNumber: 1,
                  pageSize: 10
              }
          };
          this.queryTypeInfo();
      },
      // 查询文件分类信息
      queryTypeInfo() {
          let app = this;
          this.typeLoading = true;
          this.ajax('/karl-openapi/FileTypeInfo/QueryAll', this.typeQueryInfo, (data) => {
              app.typeLoading = false;
              app.typeList = data.resultData.list;
              app.typePage = data.resultData.page;
          });
      },
      // 标签页切换时触发的函数
      tabClick(tab) {
          switch (parseInt(tab.index)) {
              case 0:
                  this.queryTypeInfo();
                  break;
              case 1:
                  this.queryFileInfo();
                  break;
              default:
                  break;
          }
      },
      /**
       * 全局消息提示
       *
       * @param success 服务器是否正确应答
       * @param message 服务器应答内容
       */
      showMessage(success, message) {
          if (success) {
              this.$message({
                  type: 'success',
                  message: message
              });
              return;
          }
          this.$message({
              type: 'error',
              message: message
          });
      },
      /**
       * 文件上传方法
       *
       * @param url 接口地址
       * @param params 请求参数
       * @param method 请求方式
       * @param loadingObj 反馈信息对象
       */
      sendFile(url, params, method, loadingObj) {
          loadingObj.loading = true;
          let formdata = new FormData();
          formdata.append('file', params.file);
          for (let key in params.fileInfo) {
              formdata.append('fileInfo.' + key, params.fileInfo[key]);
          }
          let app = this;
          axios({
              url: app.baseUrl + url,
              data: formdata,
              method: method,
              headers: {
                  'Content-Type': 'multipart/form-data'
              },
              onUploadProgress: (progressEvent) => {
                  loadingObj.progress = parseInt(((progressEvent.loaded / progressEvent.total) * 100) | 0);
              }
          })
              .then(function ({ data }) {
                  loadingObj.progress = 0;
                  loadingObj.loading = false;
                  app.showMessage(data.success, data.message);
              })
              .catch(function (err) {
                  loadingObj.loading = false;
                  app.showMessage(false, '上传发生错误：' + err);
                  console.log(err);
              });
      },
      /**
       * ajax请求方法
       *
       * @param url 接口地址
       * @param params 请求参数
       * @param cb 回调函数
       * @param method 请求方式
       */
      ajax(url, params, cb, method) {
          url = this.baseUrl + url;
          params = qs.stringify(params, { allowDots: true });
          method = method ? method : 'POST';
          if (method.toUpperCase() == 'GET') {
              url = url + '?' + params;
              params = null;
          }
          axios({
              url: url,
              data: params,
              method: method
          })
              .then((resp) => {
                  cb(resp.data);
              })
              .catch((err) => {
                  console.log('ajax请求发生错误:{}', err);
                  cb({ code: 500, message: err, success: false });
              });
      },
      /**
       * 格式化日期时间
       *
       * @param value 时间戳
       */
      formatDate(value) {
          try {
              let date = new Date(value);
              let year = date.getFullYear() + '';
              let month = date.getMonth() + 1;
              let day = date.getDate();
              let hour = date.getHours();
              let minute = date.getMinutes();
              let second = date.getSeconds();
              month = month < 10 ? '0' + month : '' + month;
              day = day < 10 ? '0' + day : '' + day;
              hour = hour < 10 ? '0' + hour : '' + hour;
              minute = minute < 10 ? '0' + minute : '' + minute;
              second = second < 10 ? '0' + second : '' + second;
              // 日期和时间的格式 - 可自定义
              // 例如：yyyy年MM月dd日 hh时mm分ss秒、yyyy年MM月dd日 hh:mm:ss等
              let format = 'yyyy-MM-dd hh:mm:ss';
              format = format.replace(/yyyy/g, year);
              format = format.replace(/MM/g, month);
              format = format.replace(/dd/g, day);
              format = format.replace(/hh/g, hour);
              format = format.replace(/mm/g, minute);
              format = format.replace(/ss/g, second);
              return format;
          } catch (ex) {
              console.error(ex);
              return '';
          }
      },
      /**
       * 格式化文件大小
       *
       * @param size 文件大小（单位：kb）
       */
      formatFileSize(size) {
          if (size == null || size == '') {
              return '0B';
          }
          let unitArr = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
          let index = 0;
          let srcsize = parseFloat(size);
          index = Math.floor(Math.log(srcsize) / Math.log(1024));
          let sizes = srcsize / Math.pow(1024, index);
          sizes = sizes.toFixed(2);
          return sizes + unitArr[index];
      }
  }
};
</script>

<style lang="less" scoped>
.doingCardStyles {
  position: fixed;
  z-index: 99999;
  width: auto;
  height: auto;
  background: #ffffff;
  border: 1px solid rgb(231, 231, 231);
  border-radius: 6px;
  > div {
      display: flex;
      cursor: pointer;
      font-size: 17px;
      letter-spacing: 2px;
      width: 8rem;
      height: 2.5rem;
      justify-content: center;
      align-items: center;
  }
  > div:hover {
      background: #ddeafb;
  }
  > div:not(:last-child) {
      border-bottom: 1px solid rgb(231, 231, 231);
  }
}

.filesBody {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin: 1rem 1rem 1rem 0;
  max-height: calc((@windowHeight - @titlesHeight) / 1.1);
  border-top: 1px solid #e4e7ed;
  overflow-y: auto;
  .scrollbarStyle();
  > div {
      width: 18%;
      min-height: 100%;
      margin: 1rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      word-break: break-word;
      cursor: pointer;
      padding: 1rem 0;
      overflow: hidden;
      border-radius: 0.3rem;
      > div {
          transition: all 0.5s ease;
      }
      &:hover {
          background-color: #f8f8f8;
      }
  }
}

.fileInfoWrites {
  display: flex;
  > div:first-child {
      margin-right: 0.8rem;
  }
}

.doingFormBtns {
  display: flex;
  justify-content: flex-end;
  > div {
      .btnsstyle();
  }
}

.tableBtns {
  display: flex;
  justify-content: center;
  > div {
      .btnsstyle();
  }
}

.addTypeForms {
  display: flex;
  justify-content: flex-end;
  margin-right: @mainsMarginRight;
  margin-top: 1rem;
  > div {
      .btnsstyle();
      display: flex;
      align-items: center;
      font-size: 1rem;
  }
}

.typePages {
  margin: 1rem 0;
  text-align: right;
  margin-right: @mainsMarginRight;
  padding-bottom: 2rem;
}

.typeTables {
  margin: 2rem;
  height: calc((@windowHeight - @titlesHeight) / 1.15);
  overflow-y: auto;
  .scrollbarStyle();
}

.typeDos {
  display: flex;
  justify-content: flex-end;
  margin-right: @mainsMarginRight;
  > div {
      .btnsstyle();
  }
}

.mains {
  display: flex;
  padding: 1rem 0;
  height: calc(@windowHeight - @titlesHeight);
  .el-tabs {
      width: 100%;
  }
}

.titles {
  display: flex;
  justify-content: center;
  height: @titlesHeight;
  font-size: 1.8rem;
  font-family: '黑体';
  color: rgb(255, 255, 255);
  background-color: #7bbbe8;
  letter-spacing: 2px;
  i {
      font-size: 2.2rem;
      font-weight: 700;
  }
  > div {
      margin: 0 0.3rem;
      display: flex;
      align-items: center;
  }
}

.bodys {
  overflow: hidden;
  height: @windowHeight;
}

.btnsstyle() {
  margin: 0 0.4rem;
}

.scrollbarStyle() {
  &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
      background-color: rgb(255, 255, 255);
  }

  &::-webkit-scrollbar {
      width: 6px;
      background-color: rgb(255, 255, 255);
  }

  &::-webkit-scrollbar-thumb {
      height: 20px;
      background-image: -webkit-gradient(
          linear,
          left bottom,
          left top,
          color-stop(0.2, #e4e7ed),
          color-stop(0.4, #e4e7ed),
          color-stop(0.8, #e4e7ed)
      );
  }
}

@mainsMarginRight: 3rem;
@titlesHeight: 90px;
@windowHeight: calc(100vh);
@windowWidth: calc(100vw);
</style>

