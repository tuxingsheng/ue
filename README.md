# ue - 移动端UI框架

### github地址：https://github.com/tuxingsheng/ue.git
### 在线访问地址：https://tuxingsheng.github.io/ue/examples/

###框架理念
---

    分离、独立、组件，ue框架之间保持低耦合，保持单个组件的独立性，不和框架本身绑定，即使某个组件功能单独拿出去当做
    插件也可以使用，ue只包含必不可少的核心，具体使用哪些组件，需要单独引入具体的js和css，看起来很符合组件的概念(其
    实是为了方便以后ue + vue相结合的ue+做的准备)


###ue框架核心
---

    框架主体由ue-flex.js(压缩之后2kb) + ue.js(压缩之后40kb) + ue.css(压缩之后10kb)[共52kb]组成，ue-flex是
    淘宝的flexible.js，动态计算rem，ue.js主要由Iscroll.js(v5.2.0) + touch.js组成，Iscroll.js主要是实现移
    动端的滚动，touch.js主要是实现移动端的事件支持，包含tap、flick、swipe、drag、longtap、hold、pinch等事件
    支持，默认已经支持tap事件


###ue JS组件
---

    1、ue.js默认支持scrollX横向滚动和纵向滚动(经常使用的页面滚动)
    2、依赖Iscroll的组件：pull.js(下拉刷新和上拉刷新)、picker.js(类似select的组件)
    3、原生js的独立组件(插件)：calendar.js(日历组件)、switch.js(开关)、action.js(actionsheet)、indicator.js
    (加载器)、toast.js(toast提示)、lazyLoadImg.js(图片懒加载)、slider.js(轮播图)、dialog.js(对话框)、popup.js
    (popup弹窗)、validate.js(表单验证)


###JS组件 - pull.js(下拉刷新和上拉刷新)
#### 配置参数说明
```javascript
    this.defaults = {
        // 某个scroll需要pull
        scroll: 'appScroll',
        // 拉动距离上限值
        limit: 50,
        // 上拉刷新
        up: {
              // 初始化是否自动加载一次
              auto: false,
              // 是否开启上拉刷新
              isOpen: false,
              // 文字设置
              pullInitName: '上拉可以刷新',
              pullStartName: '释放立即刷新',
              pullLoadingName: '正在刷新...',
              pullClearName: '没有更多数据了',
              // 成功的回调
              callback: function () {

              }
            },
        // 下拉刷新
        down: {
              auto: false,
              isOpen: false,
              pullInitName: '下拉可以刷新',
              pullStartName: '释放立即刷新',
              pullLoadingName: '正在刷新...',
              pullClearName: '没有更多数据了',
              callback: function () {

              }
            }
    };
```
#### API接口

    1、pull.endPullToRefresh(true/false)
    ps：是否还有更多数据；若还有更多数据，则传入false; 否则传入true
    2、pull.resetPullToRefresh('down'/'up')
    ps：重置刷新状态，如果不传参数，默认根据最近的一次是下拉还是上拉来判断















