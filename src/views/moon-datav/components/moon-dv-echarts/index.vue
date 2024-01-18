<template>
    <div class="moon-dv-echarts" v-resize="resize">
        <slot></slot>
        <div class="echarts" ref="echarts"></div>
        <slot name="last"></slot>
    </div>
</template>
<script>
// import * as echarts from 'echarts';
import { resize } from '@/components-global/directives.js';
import { debounce } from 'lodash';
export default {
    inheritAttrs: false,
    name: 'moon-dv-echarts',
    props: {
        option: {
            type: Object,
            default: () => ({})
        }
    },
    components: {},
    directives: { resize },
    created() {},
    mounted() {
        this.myChart = echarts.init(this.$refs.echarts);
        setTimeout(() => {
            this.myChart.setOption(this.option, { notMerge: true });
        }, 150);
        this.myChart.on('click', (param) => {
            //param参数包含的内容有：
            //param.name：X轴的值
            //param.data：Y轴的值
            //param.value：Y轴的值
            //param.type：点击事件均为click
            //param.seriesName：legend的名称
            //param.seriesIndex：系列序号（series中当前图形是第几个图形第几个）
            //param.dataIndex：数值序列（X轴上当前点是第几个点）
            //alert(param.seriesName);  //legend的名称
            this.$emit('click', param, this.myChart);
        });
        this.changeSize = debounce(() => {
            this.myChart.resize();
        }, 10);
    },
    data() {
        return {
            myChart: null,
            changeSize: null
        };
    },
    watch: {
        option: {
            handler() {
                this.myChart.setOption(this.option, { notMerge: true });
            },
            deep: true
        }
    },
    computed: {},
    methods: {
        resize() {
            this.changeSize();
        }
    }
};
</script>
<style lang="scss" scoped>
.moon-dv-echarts {
    height: 100%;
    width: 100%;
    display: flex;
    .echarts {
        height: 100%;
        width: 100%;
    }
}
</style>
