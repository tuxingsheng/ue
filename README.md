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



###JS组件 - picker.js(类似select的组件)
#### 配置参数说明
```javascript
    this.defaults = {
        // 某个picker元素
        el: '.ue-picker',
        // picker类型（默认 'normal'，还支持 'date'）
        type: 'normal',
        // 是否显示遮罩
        showCover: true,
        // 定义item高度
        itemHeight: 40,
        // 定义数据列表
        items: [],
        // 定义空白列表数量
        spaceNum: 2,
        // 配置Iscroll.probeType
        probeType: 2,
        // 定义返回值的分割线
        apart: '',
        // 定义显示的字段
        show: 'text',
        // 定义输出的字段
        export: 'value',
        // 滚动结束的回调函数
        onScrollEnd: function () {

        },
        // 点击确认的回调函数
        onConfirm: function () {

        }
    };
```

#### API接口

    1、picker.show()
    ps：显示picker
    2、picker.hide()
    ps：隐藏picker


###JS组件 - calendar.js(日历组件)
#### 配置参数说明
```javascript
    this.defaults = {
        // 日期，默认null，例如：'2016-08-08'
        value: null,
        // 最小日期，默认null，例如：'2016-05-05'
        minDate: null,
        // 最大日期，默认null，例如：'2016-10-10'
        maxDate: null,
        // 是否开启弹窗模式，默认内联模式
        isPopup: false,
        // 当弹窗模式的时候，Input是否需要readOnly
        inputReadOnly: true,
        // nav文字内容
        selectNav: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        // 输出日期的格式，例如：'yyyy/MM/dd'
        dateFormat: 'yyyy-MM-dd',
        // 选择日期成功的回调，返回点击对象和日期
        onChange: function (e, v) {
            console.log('你选的日期：' + v);
        }
    };
```

###JS组件 - switch.js(开关)
#### 说明

    switch由class.ue-switch定义，.ue-switch-XXX定义switch的颜色，添加.ue-switch-mini定义大小，.ue-active定义点击状态


###JS组件 - action.js(actionsheet)
#### 配置参数说明
```javascript
    this.defaults = {
        // action选择器
        el: '.ue-action',
        // 是否显示遮罩
        showCover: true
    };
```

#### API接口

    1、action.show()
    ps：显示action
    2、action.hide()
    ps：隐藏action






