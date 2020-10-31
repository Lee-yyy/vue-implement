import { nextTick } from "../util";

let has = {};
let queue = [];
let pending = false;
function flushSchedularQueue() {
  for (let i = 0; i < queue.length; i++) {
    let watcher = queue[i];
    watcher.run();
  }
  queue = [];
  has = {};
  pending = false;
}
// 多次调用queuewatcher 如果watcher不是同一个才将更改视图的任务加入到微任务队列中
// 多次调用queuewatcher也就是多次修改了数据，检查所修改的数据是否都会出发同一watcher
//只在watcher第一次被触发修改时将该watcher的重渲染操作加入微任务队列中，之后再触发都不做处理
//在js脚本中修改数据，不论次数多少都会优先于微任务先执行，所以使用 nexTick 可以保证重渲染在所有数据更改之后执行
//只需在执行完重渲染之后解锁，保证下一次事件循环可以正常处理数据修改与重渲染的关系
export function queueWatcher(watcher) { // 调度更新几次
  // 更新时对watcher进行去重操作
  let id = watcher.id;
  if (has[id] == null) { // 没有id    保证只有在没有相同watcher的时候才会被加入微任务队列
    queue.push(watcher);
    has[id] = true;
    // 让queue 清空ss
    if (!pending) {
      pending = true;
      nextTick(flushSchedularQueue);
    }
  }
}
