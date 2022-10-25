import './index.css'
interface moveDataObj {
    x: number,
    y: number,
    data?: any
}
interface options {
    scale?: number
    isClick?: boolean
    moveDivClass?: string
    delIconClass?: string
    getMoveData?: () => Array<moveDataObj>
}
export default class Drag {
    pel: HTMLElement
    el: HTMLElement
    scale: number
    isClick: boolean
    moveDivClass: string
    delIconClass: string
    getMoveData: Function | undefined
    moveData: Array<moveDataObj>
    constructor(name: string, options: options = {}) {
        if (!name) {
            throw new Error('The provided selector is empty')
        }
        this.pel = document.querySelector(name) as HTMLElement
        this.el = this.pel.querySelector(name + '> div') as HTMLElement
        this.scale = typeof options.scale !== 'undefined' ? options.scale : 1
        this.isClick = typeof options.isClick !== 'undefined' ? options.isClick : true // 是否支持点击事件添加
        this.moveDivClass = options.moveDivClass || '.move-div'
        this.delIconClass = options.delIconClass || '.close-div'
        this.getMoveData = options.getMoveData // 获取moveData回调函数
        this.moveData = [] // 存储放置的各个div位置信息
        this.init(this.pel)
    }
    isMobile() {
        const mobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        return mobile != null
    }
    init(el:HTMLElement) {
        if (this.isMobile()) {
            document.ontouchend = () => {
                // console.log('ontouchmove')
                this.el.ontouchmove = null
            }
        } else {
            document.addEventListener('dragover', e => {
                e.preventDefault()
            })
            el.addEventListener('drop', (ev: any) => {
                const text = ev.dataTransfer.getData('Text')
                if (!ev || !text) {
                    return
                }
                const data = text.indexOf('{') !== -1 ? JSON.parse(text) : text
                this.moveData.push({
                    x: ev.offsetX,
                    y: ev.offsetY,
                    data
                })
                this.getMoveData && this.getMoveData(JSON.parse(JSON.stringify(this.moveData)))
                this.nextTick(() => {
                    this.updatePosLimit(this.moveData.length - 1)
                    this.bindMoveDivEvent(this.moveData.length - 1)
                })
            })
            document.onmouseup = () => {
                // console.log('  .onmouseup')
                this.el.onmousemove = null
            }
        }
        this.setScale(this.scale)
        this.initMoveData()
    }
    initMoveData() {
        this.nextTick(() => {
            const eles = document.querySelectorAll(this.moveDivClass)
            Array.from(eles).map((ele: any, i) => {
                this.moveData.push({
                    x: ele.offsetLeft,
                    y: ele.offsetTop,
                    data: ele.getAttribute('data-o')
                })
                this.moveDivEvent(ele, i)
                this.bindDelEvent(ele.querySelector(this.delIconClass), i) // 绑定删除
            })
        })
    }
    setScale(val: number) {
        if (typeof val !== 'number') {
            throw new Error('sacle非法')
        }
        this.scale = val
        this.el.style.transform = `scale(${val})`
        this.el.style.transformOrigin = `0 0`
    }
    makeDraggable(el: HTMLElement, data: any) {
        if (!this.isMobile()) {
            el.style.cursor = 'move'
            el.setAttribute('draggable', 'true')
            el.addEventListener('dragstart', (ev: any) => {
                ev.dataTransfer.setData('Text', data)
            })
        }
        if (this.isClick) {  
            el.addEventListener('click', (ev) => {
                let x = Math.random() > 0.5 ? this.pel.offsetWidth / 2 + Math.random() * 30 : this.pel.offsetWidth / 2 - Math.random() * 30
                let y = Math.random() > 0.5 ? this.pel.scrollTop + this.pel.offsetHeight / 2 + Math.random() * 30 : this.pel.scrollTop + this.pel.offsetHeight / 2 - Math.random() * 30
                const top = data && data.pos ? data.pos.x : x
                const left = data && data.pos ? data.pos.y : y
                this.moveData.push({
                    x: top,
                    y: left,
                    data
                })
                this.getMoveData && this.getMoveData(JSON.parse(JSON.stringify(this.moveData)))
                this.nextTick(() => {
                    const curMoveEl: any = document.querySelectorAll(this.moveDivClass).item(this.moveData.length - 1)
                    const width = curMoveEl.offsetWidth
                    const height = curMoveEl.offsetHeight
                    x = data && data.pos ? data.pos.x : x - width / 2
                    y = data && data.pos ? data.pos.y : y - height / 2
                    this.moveData[this.moveData.length - 1].x = x
                    this.moveData[this.moveData.length - 1].y = y
                    // 水平，垂直居中
                    this.getMoveData && this.getMoveData(JSON.parse(JSON.stringify(this.moveData)))
                    this.nextTick(() => {
                        // 检测边界
                        this.updatePosLimit(this.moveData.length - 1)
                        this.bindMoveDivEvent(this.moveData.length - 1)
                    })
                }) 
            })
        }
    }
    nextTick(cb: () => void) {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
        // 创建MutationObserver实例，返回一个观察者对象
        const observer = new MutationObserver(function(mutationRecoards, observer) {
            cb && cb()
            observer.disconnect()
        })
        observer.observe(this.pel, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        })
    }
    bindDelEvent(delIcon: HTMLElement, index: number) {
        if (delIcon) {
            delIcon.addEventListener('click', () => {
                this.moveData.splice(index, 1)
                this.getMoveData && this.getMoveData(JSON.parse(JSON.stringify(this.moveData)))
            })
        }
    }
    // 绑定事件
    bindMoveDivEvent(index: number) {
        const eles = document.querySelectorAll(this.moveDivClass)
        Array.from(eles).map((ele:any, i) => {
            if (index === i) {
                this.moveDivEvent(ele, index) // 绑定移动
                this.bindDelEvent(ele.querySelector(this.delIconClass), index) // 绑定删除
            }
        })
    }
    moveDivEvent(div: HTMLElement, index: number) {
        if (this.isMobile()) {
            // 阻止浏览器默认滚动事件，
            this.pel.addEventListener('touchmove', () => {}, {
                passive: false
            })
            div.ontouchstart = (e) => {
                const touchs = e.targetTouches[0]
                let x = touchs.clientX / this.scale
                let y = touchs.clientY / this.scale
                this.el.ontouchmove = ev => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    const touch = ev.targetTouches[0]
                    const left = div.offsetLeft + touch.clientX / this.scale - x
                    const top = div.offsetTop + touch.clientY / this.scale - y
                    x = touch.clientX / this.scale
                    y = touch.clientY / this.scale
                    this.limitDragPos(div, left, top, index)
                }
            }
        } else {
            div.onmousedown = (e) => {
                // 阻止默认浏览器drag事件导致mouseup事件丢失
                this.pauseEvent(e)
                let x = e.clientX / this.scale
                let y = e.clientY / this.scale
                this.el.onmousemove = ev => {
                    const left = this.moveData[index].x + ev.clientX / this.scale - x
                    const top = this.moveData[index].y + ev.clientY / this.scale - y
                    x = ev.clientX / this.scale
                    y = ev.clientY / this.scale
                    this.limitDragPos(div, left, top, index)
                }
            }
        }
    }
    // 拖动放置不溢出边界值
    updatePosLimit(index: number) {
        const eles = document.querySelectorAll(this.moveDivClass)
        Array.from(eles).map((ele: any, i) => {
            if (index === i) {
                this.limitDragPos(ele, ele.offsetLeft, ele.offsetTop, i)
            }
        })
    }
    // 拖动放置不溢出边界值
    limitDragPos(div: HTMLElement, left: number, top: number, index: number) {
        const maxLeft = this.el.offsetWidth - div.offsetWidth
        const maxTop = this.el.offsetHeight - div.offsetHeight
        const x = Math.round(Math.max(0, Math.min(left, maxLeft)))
        const y = Math.round(Math.max(0, Math.min(top, maxTop)))
        this.moveData[index] = {
            ...this.moveData[index],
            x,
            y
        }
        this.getMoveData && this.getMoveData(JSON.parse(JSON.stringify(this.moveData)))
    }
    // 阻止事件冒泡
    // 不仅仅要stopPropagation，还要preventDefault
    pauseEvent(e: MouseEvent) {
        if (e.stopPropagation) e.stopPropagation()
        if (e.preventDefault) e.preventDefault()
        e.cancelBubble = true
        e.returnValue = false
        return false
    }
}
