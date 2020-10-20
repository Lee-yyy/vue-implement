import { initMixin } from "./init";

function Vue(options) {
  this._init(options); // 当用户new Vue时 就调用init方法进行vue的初始方法
}

initMixin(Vue);
export default Vue


