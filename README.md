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

###JS组件 - indicator.js(加载器)
#### 配置参数说明
```javascript
    this.defaults = {
        // 加载器类型（多种加载器可选择），默认是'snake'，还有'circle'
        spinnerType: 'snake',
        // 加载器文本内容
        spinnerText: '加载中...',
        // 是否隐藏加载器文本内容
        spinnerTextClose: true,
        // 设置加载器背景色
        spinnerBgColor: 'transparent'
    };
```

#### 使用

    indicator.open({
          spinnerText: '正在加载中...',
          spinnerTextClose: false,
          spinnerType: 'circle',
          spinnerBgColor: 'rgba(0,0,0,.5)'
    });

###JS组件 - toast.js(toast提示)
#### 使用

    toast('欢迎来到ue世界', 2000);
    toast('欢迎来到ue世界', 2000, 'center');


###JS组件 - lazyLoadImg.js(图片懒加载)
#### 配置参数说明
```javascript
    this.defaults = {
        // 元素选择器
        el: '[data-lazy]',
        // 元素在顶部伸出的距离才加载
        top: 0,
        // 元素在左边伸出的距离才加载
        left: 0,
        // 元素在右边伸出的距离才加载
        right: 0,
        // 元素在底部伸出的距离才加载
        bottom: 0,
        // 滑动停止多久后开始加载
        duration: 100,
        // 是否开启debug模式
        debug: true,
        // 未加载时的默认图片
        placeholder: '',
        // 懒加载触发范围
        selector: document,
        // 加载之前执行方法
        before: function () {

        },
        // 加载成功后回调方法
        load: function (el) {

        },
        // 加载失败后回调方法
        error: function (el) {

        }
    };
```

#### 使用

    var lazyloadImg = new LazyloadImg({
         el: '.ue-content [data-lazy]',
         placeholder: './loading.png',
         duration: 1500,
         bottom: 50
    });


###JS组件 - slider.js(轮播图)
#### 配置参数说明
```javascript
    this.defaults = {
        // 元素选择器
        el: '.ue-slider',
        // 是否无缝循环
        loop: true,
        // 是否自动轮播
        autoPlay: true,
        // 自动轮播时间间隔
        autoTime: 5000,
        // 动画过度速度
        speed: 300,
        // 是否动态生成状态点
        pagination: true
    };
```

#### 使用

    var slider = new Slider({
         el: '.ue-slider',
         autoTime: 4000
    });


###JS组件 - dialog.js(对话框)
#### 配置参数说明
```javascript
    this.defaults = {
        // dialog延迟关闭时间
        delay: 0,
        // dialog标题
        title: '温馨提示',
        // dialog文本内容
        message: '欢迎来到ue世界',
        // dialog按钮组
        groupBtn: ['确定'],
        // 是否显示title
        isShowTitle: true,
        // dialog点击执行之前的回调
        before: function (e) {

        },
        // dialog点击执行之后的回调
        after: function (e) {

        },
        // dialog被删除之后的回调
        close: function (e) {

        }
    };
```

#### 使用

    对dialog.js进行了再次封装，提供了alert和confirm两种模式

    dialog.alert({
        message: 'alert对话框',
        callback: function () {
             alert('消失了');
        }
    });

    dialog.confirm({
        message: 'confirm对话框',
        callback: function (e) {
            if (e == 1) {
               alert('确认了');
            }
        }
    });



###JS组件 - popup.js(popup弹窗)
#### 使用

    popup的2种触发方式：
    1、在触发的html元素上添加自定义属性data-popup，参数是对应的popup的id，如：data-popup="#appPopup"
    2、引入popup.js，事件触发调用 popup.open()方法，该方法包含2个参数，第一个是对应的popup的id，第二个
    参数是触发事件的元素或对象，如：popup.open('#appPopup', '#jsPopup') or popup.open('#appPopup', document.querySelector('#jsPopup'))


###JS组件 - dialog.js(对话框)
#### 提醒

    form元素上最好加上 onsubmit="return false;"，避免响应submit跳转

#### 使用

    var validate = new Validate({
        // 元素选择器
        el: '.ue-content',
        // 验证成功的回调
        success: function () {
           alert('验证成功');
        },
        // 验证失败的回调，返回失败信息
        fail: function (err) {
           alert(err);
        }
    });

#### 内置验证规则

     required	        必填，不能为空
     match	            和另一个输入框的值保持一致
     number	            数字
     digits	            整数
     mobile	            手机号码
     tel	            座机号码，包括区号
     email	            email地址
     zip	            邮编
     date	            日期，例如 2012-02-02，可自定义分割线，默认是'-'
     url	            网址，协议是可选的
     minlength	        最小长度
     maxlength	        最大长度
