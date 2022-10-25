
### 特性

* 支持触摸设备
* 支持拖拽和跨容器拖拽
* 支持父容器放大
* 不限制框架
* 无其他依赖包
* 支持移动实时获取坐标

### 安装
```
npm i dragmovablerea
```
### 引入
```
import Drag from 'dragmovablerea'
```
### 基础用法
```

<template>
    <div class="example-container">
        <div class="drag-container">
            <div class="left-menu">
                <ul class="list">
                    <li data-o="1111">aaaad</li>
                    <li data-o="2222">bbb</li>
                    <li data-o="3333">ccc</li>
                </ul>
            </div>
            <div id="moveWrapper" class="right-con">
                <div class="zoom-wrapper">
                    <template v-if="moveData.length > 0">
                        <div
                            v-for="(item, index) in moveData"
                            :key="index"
                            :style="'left:' + item.x + 'px;top:' + item.y + 'px'"
                            class="move-div"
                        >
                            <div class="close-div" />
                            {{ item.data }}</div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import Drag from 'dragmovablerea'
export default {
    name: 'Example',
    data() {
        return {
            moveData: []
        }
    },
    computed: {
    },
    mounted() {
        this.$nextTick(() => {
            this.init()
        })
        setTimeout(() => {
            this.moveData = [
                { x: 10, y: 20 },
                { x: 20, y: 30 }
            ]
        }, 500)
    },
    methods: {
        init() {
            const DragUtil = new Drag('#moveWrapper', {
                getMoveData: (res) => {
                    this.moveData = res  // 回显x,y值
                }
            })
            const domArray = document.querySelectorAll('.left-menu li')
            Array.from(domArray).forEach(el => {
                const data = el.getAttribute('data-o')
                DragUtil.makeDraggable(el, data) // 为列表绑定拖拽事件
            })
        }
    }
}
</script>
<style lang="less" scoped>
.example-container{
    font-size: 14px;
    width: 70%;
    margin: auto;
    .list{
        li{
            height: 40px;
            line-height: 40px;
        }
    }
}
</style>

```
### 效果
![image](https://github.com/xu331100/DragMovablerea/blob/master/move.gif)


### 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| el |  可拖拽父容器| String |——  |
| options |  配置项|  Object |—— |

### options配置项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scale | 放大比例| Number |1  |
| isClick | 是否支持点击事件添加移动滑块  | Boolean |true  |
| moveDivClass | 移动滑块样式| String |.move-div  |
| delIconClass | 移动滑块删除图标样式| String |.close-div  |
| getMoveData | 实时获取滑块位置等参数| Function(data) |data是回调值   |

### 事件

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| makeDraggable | 为某个dom绑定拖拽事件，可以放置到父容器中 | Function(el, data) |el是当前dom元素，data是绑定当前dom的数据  |
| setScale |  设置父容器放大比例| Number | 1 |
