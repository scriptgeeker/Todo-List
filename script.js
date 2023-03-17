let vm = new Vue({
    el: '#app',
    data: {
        viewType: 'doing',
        footer: {
            class: ['footer'],
            style: { 'z-index': '-99', },
        },
        inputTask: { // 任务表单
            title: '',
            type: 1,
            remark: '',
        },
        taskQueue: [], // 任务队列
        historyLength: 1,
    },
    computed: {
        currentDate: function () { // 显示当前日期
            let date = new Date();
            let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            let year = String(date.getFullYear());
            let month = String(date.getMonth() + 1);
            let day = String(date.getDate());
            let today = week[date.getDay()];
            return (year + '年' + month + '月' + day + '日 ' + today);
        },
        viewTypeZH: function () {
            let obj = {
                'all': '全部',
                'done': '已完成',
                'doing': '未完成',
            };
            return obj[this.viewType];
        },
    },
    watch: {
        taskQueue: function () { // 本地存储任务队列
            localforage.setItem('task-list', this.taskQueue);
        },
    },
    methods: {
        newTask: function (type = 1) { // 新任务
            return {
                title: '',
                type: type,
                status: false,
                remark: '',
                tsid: Date.now(),
            }
        },
        editTask: function (task) { // 编辑任务
            if (this.historyLength <= 1) {
                history.pushState(null, null, location.href);
                this.historyLength++;
            }
            this.inputTask = JSON.parse(JSON.stringify(task));
            this.footer.class = ['footer', 'show'];
            this.footer.style = { 'z-index': '99' };
        },
        mainView: function () { // 回到主页面
            this.footer.class = ['footer'];
            setTimeout(() => {
                this.footer.style = { 'z-index': '-99' };
            }, 500);
        },
        selTaskType: function (evt) { // 选择任务类型
            let ele = evt.target;
            if (ele.tagName === 'SPAN') {
                ele = ele.parentElement;
            }
            if (ele.tagName === 'DIV') {
                ele = ele.parentElement;
            }
            if (ele.tagName === 'LI') {
                ele = ele.firstElementChild;
                let type = parseInt(ele.className.slice(-1));
                this.inputTask.type = type;
            }
        },
        queryIndex: function (tsid) { // 查询任务序号
            for (let index in this.taskQueue) {
                if (this.taskQueue[index].tsid === tsid) {
                    return index;
                }
            }
            return -1;
        },
        deleteTask: function () { // 删除任务
            if (this.inputTask.tsid === '') return;
            let index = this.queryIndex(this.inputTask.tsid);
            if (index !== -1) {
                this.taskQueue.splice(index, 1);
            }
            this.mainView();
        },
        saveTask: function () { // 保存任务
            if (this.inputTask.title === '') return;
            let index = this.queryIndex(this.inputTask.tsid);
            if (index === -1) {
                this.taskQueue.unshift(this.inputTask);
            } else {
                this.taskQueue.splice(index, 1, this.inputTask);
            }
            this.mainView();
        },
        taskBoxClick: function (evt) { // 任务列表点击事件
            let ele = evt.target;
            if (ele.tagName === 'SPAN') {
                ele = ele.parentElement;
            }
            if (ele.className === 'title') { // 展示任务详细信息
                let tsid = ele.parentElement.getAttribute('data-tsid');
                let index = this.queryIndex(parseInt(tsid));
                if (index !== -1) {
                    this.editTask(this.taskQueue[index]);
                }
            }
            if (ele.className.slice(0, 5) === 'radio') { // 切换任务完成状态
                let tsid = ele.parentElement.getAttribute('data-tsid');
                let index = this.queryIndex(parseInt(tsid));
                if (index !== -1) {
                    let task = this.taskQueue[index];
                    task.status = !task.status;
                    this.taskQueue.splice(index, 1, task);
                }
            }
        },
        changeView: function (evt) { // 切换主页面类型
            let ele = evt.target;
            if (ele.tagName === 'DIV') {
                let ul = ele.nextElementSibling;
                ul.className = ((ul.className === 'show') ? 'hide' : 'show');
            }
            if (ele.tagName === 'LI') {
                this.viewType = ele.getAttribute('data-type');
                ele.parentElement.className = 'hide';
            }
            evt.stopPropagation();
        },
        formatTime: function (timestamp) { // 时间格式化
            let date = new Date(timestamp);
            let MM = ('00' + (date.getMonth() + 1)).slice(-2);
            let DD = ('00' + date.getDate()).slice(-2);
            let hh = ('00' + date.getHours()).slice(-2);
            let mm = ('00' + date.getMinutes()).slice(-2);
            return (MM + '/' + DD + ' ' + hh + ':' + mm);
        },
        showTask: function (isComplete) { // 是否展示
            if (this.viewType === 'done') {
                return isComplete;
            }
            if (this.viewType === 'doing') {
                return !isComplete;
            }
            return true;
        },
    },
    mounted: function () {
        /* 加载本地存储的任务队列 */
        localforage.getItem('task-list').then(data => {
            if (Array.isArray(data)) {
                const MAX_SIZE = 1000;
                this.taskQueue = data.slice(0, MAX_SIZE);
            }
        });
        /* 桌面端交互优化 - 回车自动保存 */
        let input = document.querySelector('.former>div>input');
        input.addEventListener('keypress', evt => {
            if (evt.keyCode === 13) {
                this.saveTask();
            }
        });
        /* 移动端交互优化 - 返回键切换视图 */
        window.addEventListener('popstate', evt => {
            this.mainView();
            this.historyLength--;
        }, false);
        /* 点击文档隐藏所有下拉选框 */
        document.addEventListener('click', evt => {
            document.querySelectorAll('ul.show').forEach(item => {
                item.className = 'hide';
            });
        });
    },
});

// localforage.clear();
