/**
 * 判断鼠标是否在元素内 (可能出现滚动条的情况)
 * @param {Object} oElement 元素
 * @param {Object} e 事件
 * @return {Boolean} true: 在元素内, false: 不在元素内
 */
function isMouseWithinElement(oElement: HTMLElement, e: MouseEvent): Boolean {
  if (!oElement || !e) {
    console.error('判断鼠标是否在元素内 参数错误');
    return false;
  }
  var iX = e.clientX;
  var iY = e.clientY;
  var oRect = oElement.getBoundingClientRect() as DOMRect;
  if (iX >= oRect.left && iX <= oRect.right && iY >= oRect.top && iY <= oRect.bottom) {
    return true;
  } else {
    return false;
  }
}

/**
 * 判断鼠标按下和抬起是否在同一坐标, 如果是, 则认为是点击事件, 否则是拖拽事件
 * @param {Object} e1 按下事件
 * @param {Object} e2 抬起事件
 * @return {Boolean} true: 点击, false: 拖拽
 */
function isClick(e1: MouseEvent, e2: MouseEvent): Boolean {
  if (!e1 || !e2) {
    console.error('判断鼠标按下和抬起是否在同一坐标 参数错误');
    return false;
  }
  var iX = e1.clientX;
  var iY = e1.clientY;
  var iX2 = e2.clientX;
  var iY2 = e2.clientY;
  if (iX === iX2 && iY === iY2) {
    return true;
  } else {
    return false;
  }
}

/**
 * 判断鼠标是否在元素内
 * @param {Object} id 元素id
 * @param {Function} callback 回调函数
 * @return  {Object} unFn: 销毁事件
 */
export function domWithin(id: string, callback: Function) {
  const dom = document.getElementById(id) as HTMLElement;

  function fn(e: MouseEvent) {
    // console.log('鼠标按下');
    const isWithinDown = isMouseWithinElement(dom, e);

    document.onmouseup = function (e2: MouseEvent) {
      // console.log('鼠标抬起');
      const isWithinUp = isMouseWithinElement(dom, e2);
      const isCheck = isClick(e, e2);
      // console.log('元素内?result', result);
      // console.log(isWithinUp ? '元素之内' : '元素之外');
      // console.log(isCheck ? '点击' : '拖拽');

      callback(isWithinUp, isCheck, isWithinDown);

      document.onmouseup = null;
    };
  }

  document.onmousedown = fn;

  // 销毁事件
  function unFn() {
    document.onmousedown = null;
  }

  return {
    unFn,
  };
}
