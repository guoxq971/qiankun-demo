import Vue from 'vue/dist/vue.esm';

function vueRender({ loading }) {
  return new Vue({
    template: `
      <div id="subapp-container">
        <div id="subapp-viewport"></div>
      </div>
    `,
    el: '#subapp-container',
    data() {
      return {
        loading,
      };
    },
    watch: {
      loading(val) {
        if (!val) return;
        // 路由切换时，加载动画 类似 element-ui 的渐变效果
        const loading = document.createElement('div');
        loading.id = 'subapp-loading';
        loading.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #fff;
          z-index: 9999;
          transition: opacity 0.3s;
          opacity: 1;
        `;
        document.getElementById('subapp-container').appendChild(loading);
        setTimeout(() => {
          loading.style.opacity = 0;
        }, 0);
        setTimeout(() => {
          document.getElementById('subapp-container').removeChild(loading);
        }, 300);
      },
    },
  });
}

let app = null;

export default function render({ loading }) {
  if (!app) {
    app = vueRender({ loading });
  } else {
    app.loading = loading;
  }
}
