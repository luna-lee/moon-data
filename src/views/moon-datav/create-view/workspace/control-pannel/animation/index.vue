<template>
    <div class="animation">
        <el-tabs type="border-card" v-model="tab">
            <el-tab-pane label="进入动画">
                <div class="currentItem" v-if="enter.label">
                    {{ enter.label }}
                    <i class="el-icon-remove" @click="removeEnter" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="退出动画">
                <div class="currentItem" v-if="leave.label">
                    {{ leave.label }}
                    <i class="el-icon-remove" @click="removeLeave" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="自定义">
                <code-monaco-editor ref="moonMonacoEditor1" :value="animation" @input="changeAnimation" style="height: 300px" :mode="{ language: 'json' }"></code-monaco-editor>
            </el-tab-pane>
        </el-tabs>
        <div v-if="tab == '0' || tab == '1'">
            <div class="top">选择栏</div>
            <div class="content" v-for="(value, index) in animationConfig" :key="value.code">
                <div class="title">{{ value.label }}</div>
                <div class="list">
                    <div
                        v-for="item in value.children"
                        :key="item.code"
                        @click="onClick(item)"
                        class="item"
                        :class="hoverCode == item.code ? `animate__animated animate__fast ${item.code}` : ''"
                    >
                        {{ item.label }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { updateCellDataView, equalsString } from '@/views/moon-datav/utils';
import animationConfig from './animationjs';
import CodeMonacoEditor from '../_c/code-monaco-editor.vue';

export default {
    inheritAttrs: false,
    name: '',
    inject: ['getTransformPlugin', 'getWorkspace'],
    props: ['cell', 'graph'],
    components: { CodeMonacoEditor },
    created() {},
    mounted() {
        const cellData = this.cell.getData();
        this.animation = JSON.stringify(cellData.animation || {});
    },
    data() {
        return {
            animation: '{}',
            animationConfig,
            tab: '0',
            hoverCode: ''
        };
    },
    watch: {},
    computed: {
        enter() {
            return this.getSelectAnimate('enter');
        },
        leave() {
            return this.getSelectAnimate('leave');
        }
    },
    methods: {
        getSelectAnimate(type) {
            let animation = JSON.parse(this.animation);
            let selectClass = animation?.[type + '-active-class'] || '';
            if (!selectClass)
                return {
                    code: '',
                    label: ''
                };
            // 自定义的
            if (selectClass.indexOf('animate__') == -1)
                return {
                    code: animation?.[type + '-active-class'],
                    label: animation?.[type + '-active-class']
                };
            // animate css
            let obj = {};
            animationConfig.forEach((v) => {
                v.children.forEach((i) => {
                    if (selectClass.includes(i.code)) {
                        obj.label = v.label + ': ' + i.label;
                        obj.code = i.code;
                    }
                });
            });
            return obj;
        },
        onClick(item) {
            this.hoverCode = item.code;
            setTimeout(() => {
                this.hoverCode = '';
            }, 1000);
            const data = this.cell.getData();
            if (!data.animation) data.animation = {};
            if (this.tab == '0') {
                if (data.animation['enter-active-class'] != item.code) {
                    data.animation['enter-active-class'] = item.code;
                    updateCellDataView(this.cell, data);
                    this.animation = JSON.stringify(data.animation);
                }
            } else {
                if (data.animation['leave-active-class'] != item.code) {
                    data.animation['leave-active-class'] = item.code;
                    updateCellDataView(this.cell, data);
                    this.animation = JSON.stringify(data.animation);
                }
            }
        },
        changeAnimation(e) {
            if (equalsString(this.animation, e)) return;
            this.animation = e ? e : '{}';
            let flag = true;
            let json = {};

            try {
                json = JSON.parse(this.animation);
            } catch (error) {
                flag = false;
            }
            if (flag) {
                const data = this.cell.getData();
                data.animation = json;
                updateCellDataView(this.cell, data);
            }
        },
        removeEnter() {
            const data = this.cell.getData();
            data.animation = JSON.parse(this.animation);
            delete data.animation['enter-active-class'];
            updateCellDataView(this.cell, data);
            this.animation = JSON.stringify(data.animation);
        },
        removeLeave() {
            const data = this.cell.getData();
            data.animation = JSON.parse(this.animation);
            delete data.animation['leave-active-class'];
            updateCellDataView(this.cell, data);
            this.animation = JSON.stringify(data.animation);
        }
    }
};
</script>
<style lang="scss" scoped>
.animation {
    .top {
        color: #fff;
        background-color: #000;
        padding: 10px;
        text-align: center;
    }
    .currentItem {
        color: #fff;
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        border: 1px solid #373739;
        display: inline-block;
        padding: 0 10px;
        margin: 5px;
        font-size: 12px;
        background-color: #2e343c;
        i {
            color: #f56c6c;
            cursor: pointer;
        }
    }
    .content {
        color: #fff;
        .title {
            padding: 5px;
            background-color: #2e343c;
        }
        .list {
            display: flex;
            flex-wrap: wrap;
            font-size: 14px;
            .item {
                background-color: #2e343c;
                height: 40px;
                line-height: 40px;
                width: 100px;
                text-align: center;
                cursor: pointer;
                border-radius: 5 px;
                border: 1px solid #373739;
                margin: 5px;
                font-size: 12px;
            }
        }
    }
}
</style>
