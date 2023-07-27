<template>
  <div class="home col">
    {{ ruleNumber }}
    <div id="rule-container" class="rule_container">
      <span class="rule_cursor"></span>
      <canvas id="test-canvas" width="300" height="200" @touchmove="canvasTouchMove" @touchend="canvasTouchEnd" @touchstart="canvasTouchStart"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, nextTick } from 'vue';

export default defineComponent({
  name: 'Home',
  setup() {
    const state = reactive({
      ruleNumber: 0,
    });

    /**  每十个格子就写一次刻度数字*/
    const divider = 10;

    /**  隔十个像素就画一个刻度线*/
    const itemWidth = 10;

    /**  画刻度线的起始y坐标*/
    const startY = 0;

    /**  尺子的最小值*/
    const min = 0;

    /** 尺子的最大值*/
    const max = 100;

    let leftMin;

    let leftMax;

    /**  惯性滑动用到的计时器 */
    let enableInertiaMove = true;

    // 手指按下时的时间
    // let startTime = 0;

    /**  手指按下时的x坐标，用来比较本次滑动的方向和距离，加在currentCanvasLocation上，就能让尺子移动了*/
    let touchStartX = 0;

    /* 手指按下时，当前 currentCanvasLocation 的值  */
    let startValue = 0;

    /**
     * 尺子最核心的值，单位为像素，这个值记录了当前手指总共滑动了多少像素距离和方向
     * 如果把尺子最低刻度理解为1厘米的话，那么这个就是1毫米。
     */
    let currentCanvasLocation = 10;

    // let timer = 0;

    /**  画布元素 canvas = document.getElementById('test-canvas');*/
    let canvas;

    /** 画布的宽 */
    let canvasWidth;
    /* 画布的高 */
    let canvasHeight;

    /* 画布context，通过操作ctx来画内容 */
    let ctx;

    /* 画布左侧到画布中间格子的数量，加上这个偏移值就能符合视觉的尺子当前值 */
    let numberOffset = 0;

    /** 手指抬起之前的滑动距离，用来发起惯性滑动*/
    let lastScrollDistacne = 0;

    /** 手指最后抬起之前接触的x坐标*/
    let lastTouchX = 0;

    /* 初始化 Canvas */
    const initCanvas = () => {
      const ruleContainer = document.getElementById('rule-container');
      canvas = document.getElementById('test-canvas');
      canvas.width = ruleContainer.clientWidth;
      canvas.height = ruleContainer.clientHeight;
      ctx = canvas.getContext('2d', { alpha: false });

      // 计算屏幕能放下的尺子格数
      const screenCount = parseInt((canvas.clientWidth / itemWidth).toFixed(0));
      // 计算尺子读数需要的偏移刻度数
      numberOffset = parseInt((screenCount / 2).toFixed(0));
      leftMin = min - numberOffset;
      leftMax = max - numberOffset;

      // 设置宽高
      canvasWidth = canvas.clientWidth;
      canvasHeight = canvas.clientHeight;

      // 设置字体
      ctx.font = '14px Arial';

      // 初始化完成后渲染一下
      window.requestAnimationFrame(draw);
    };

    const draw = () => {
      // 设置笔触颜色为白色，每次绘制之前，先把画布用白色清空
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.closePath();
      // 清空完画布，再把笔触设置成黑色
      ctx.fillStyle = '#000000';

      // 尺子的最小刻度为10个像素，for循环渲染尺度时会以 start 为准，所以每次会出现每次滑动时就一格一格的跳动，不够顺滑
      // 这里把 currentCanvasLocation 末尾的像素值取回来，让滑动更加顺滑
      let offset: number;

      // 取当前的位移量的最后一位
      const str = currentCanvasLocation.toString();
      const lastNumber = Number(str.charAt(str.length - 1));

      // currentCanvasLocation 大于和小于0时有不同的取值方式
      if (currentCanvasLocation > 0) {
        offset = itemWidth - lastNumber;
      } else if (currentCanvasLocation < 0) {
        offset = lastNumber;
        // 因为这里是直接将lastNumber赋值给offset，而不是10-lastNumber，所以为出现没有0 的情况，会出现 9 之后直接到1，然后闪一下的情况
        // 所以需要手动判断为0时设置为10
        if (offset === 0) {
          offset = itemWidth;
        }
      } else {
        offset = 0;
      }
      // for循环绘制尺子刻度
      for (let i = offset; i < canvasWidth; i += itemWidth) {
        ctx.moveTo(i, startY);
        // 开头偏移的像素
        const scaleNumber = i + currentCanvasLocation;
        // 只绘制在尺子数值范围内的
        if (canDraw(scaleNumber) === 0) {
          if (scaleNumber % (divider * itemWidth) === 0) {
            const metrics = ctx.measureText(i);
            const textX = (i - metrics.width / 2).toFixed(2);
            ctx.fillText(scaleNumber / itemWidth, textX, 45);
            ctx.lineTo(i, 30);
          } else {
            ctx.lineTo(i, 10);
          }
        }
      }
      ctx.stroke();
      // 绘制完成，加上数量
      nextTick(() => {
        state.ruleNumber = Math.floor(currentCanvasLocation / itemWidth) + numberOffset;
      });
    };

    onMounted(() => {
      initCanvas();
    });

    const canDraw = (x: number): number => {
      const currentNumber = Math.floor(x / itemWidth);
      if (currentNumber >= min && currentNumber <= max) {
        return 0;
      }
      return -1;
    };

    /**
     * 这里使用 1、-1、0 来标志当前尺子的状态
     * 当为0时表示可以滑动，1和-1则不行
     * 原理：
     * 滑动时（包括惯性滑动），向右滑，手指从右往左，currentCanvasLocation 加一个正数，
     * 向左划，手指从左往右，currentCanvasLocation加一个负数。
     * 判断是否可以滑动时，使用如下代码：
     * if(value * canScroll() >0){
     *     return;
     * }
     * 如果一直向左划，划到最小值时，再向左划，value为负数，负负的正，此时被return则不能继续滑动
     * 如果一直向右划，划到最大值，再向右划，value为正数，canScroll()为1，此时也会相乘大于0，被return
     *
     */
    const canScroll = (x: number): number => {
      const currentNumber = Math.floor(x / itemWidth);
      if (currentNumber <= leftMin) {
        return -1;
      } else if (currentNumber >= leftMax) {
        return 1;
      } else {
        return 0;
      }
    };

    /* 手指按下事件 */
    const canvasTouchStart = (e) => {
      touchStartX = e.changedTouches[0].clientX;
      startValue = currentCanvasLocation;
      // 清除之前的惯性滑动
      enableInertiaMove = false;
    };

    const canvasTouchMove = (e): void => {
      const touchClientX = e.targetTouches[0].clientX;
      const moveX = Math.floor(touchStartX - touchClientX);
      lastScrollDistacne = lastTouchX - touchClientX;
      lastTouchX = touchClientX;
      if (moveX * canScroll(currentCanvasLocation) > 0) {
        return;
      }
      cursorMove(moveX);
    };

    const cursorMove = (value) => {
      currentCanvasLocation = startValue + value;
      window.requestAnimationFrame(draw);
    };

    const canvasTouchEnd = (e) => {
      // 直接用最后一次滑动的距离来当做速度
      enableInertiaMove = true;
      ease(lastScrollDistacne);
    };

    const ease = (target) => {
      if (!enableInertiaMove) {
        return;
      }
      if (target * canScroll(currentCanvasLocation) > 0) {
        return;
      }
      target *= 0.9;
      if (Math.abs(target) < 1 || target * canScroll(currentCanvasLocation) > 0) {
        return;
      }
      currentCanvasLocation += Math.floor(target);
      window.requestAnimationFrame(() => {
        ease(target);
        draw();
      });
    };

    return {
      ...toRefs(state),
      canvasTouchMove,
      canvasTouchEnd,
      canvasTouchStart,
    };
  },
});
</script>

<style scoped>
.rule_container {
  /* width: 100%; */
  position: relative;
}
.rule_cursor {
  position: absolute;
  top: 0;
  width: 1%;
  left: 49.5%;
  height: 40px;
  background-color: blue;
}
</style>
