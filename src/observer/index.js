import { arrayMethods } from "./array";

class Observer {
  constructor(value) { // 需要对这个value属性重新定义
    // value可能是对象 可能是数组，分类来处理
    // value.__ob__ = this; 
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false, // 不能被枚举表示 不能被循环
      configurable: false,// 不能删除此属性
    })
    if (Array.isArray(value)) {
      // 数组不用defineProperty来进行代理 性能不好
      // push shift reverse sort  我要重写这些方法增加更新逻辑
      Object.setPrototypeOf(value, arrayMethods); // 循环将属性赋予上去
      this.observeArray(value); // 原有数组中的对象  Object.freeze()
    } else {
      this.walk(value);
    }
  }
  observeArray(value) {
    for (let i = 0; i < value.length; i++) {
      observe(value[i]);
    }
  }
  walk(data) {
    // 将对象中的所有key 重新用defineProperty定义成响应式的
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    })
  }
}
export function defineReactive(data, key, value) { // vue2中数据嵌套不要过深 过深浪费性能
  // value 可能也是一个对象
  observe(value); // 对结果递归拦截
  let dep = new Dep(); // 每次都会给属性创建一个dep
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend(); // 让这个属性自己的dep记住这个watcher，也要让watcher记住这个dep
      }
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(newValue); // 如果用户设置的是一个对象 ， 就继续将用户设置的对象变成响应式的
      value = newValue

      dep.notify();// 通知dep中记录的watcher让它去执行
    }
  })
}
export function observe(data) {
  // 只对对象类型进行观测 非对象类型无法观测
  if (typeof data !== 'object' || data == null) {
    return;
  }
  if (data.__ob__) { // 放置循环引用了
    return;
  }
  // 通过类来对实现对数据的观测 类可以方便扩展，会产生实例
  return new Observer(data);
}