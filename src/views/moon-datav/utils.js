import * as utils from '@/components-global/utils';
import dayjs from 'dayjs';

export const updateCellDataView = (cell, data) => {
    cell.replaceData({ ...data, changId: utils.getUUID() });
};
export const equalsString = (str1, str2) => {
    return str1 && str2 && str1.replace(/\s|\\n|\\r|\\t/gms, '') == str2.replace(/\s|\\n|\\r|\\t/gms, '');
};

// 判断字符函数是否修改了自定义全局变量,true,修改了，false未
export const willChangeGlabalVar = (graph, functionText, pageCellId) => {
    // 禁止在函数中改变自定义全局变量值
    const pageCellData = graph.getCellById(pageCellId).getData();
    const globalVarObj = pageCellData.globalVar || {};
    return (
        Object.keys(globalVarObj).some((key) => {
            // const reg = new RegExp(key + '\\s*=[^=]');
            const reg = new RegExp(`(?<=(${key}))[\\w\\d.]*[^!><=]?(?=(=[^=]))`, 'g');
            let m = functionText.match(reg);
            let flag = false;
            if (m) {
                //判断匹配到的中间字符，在剔除空格的前提下，长度是否为0，或者以.开始
                flag = m.some((str) => {
                    return str.trim().length == 0 || str.trim().startsWith('.');
                });
            }
            return flag;
        }) || /vm\.[\d\w]*\s*=[^=]/.test(functionText)
    );
};
// 异步字符函数执行
export const ExecFunctionStr = async (globalVar, vm, funStr) => {
    try {
        return await new Function('globalVar', 'vm', 'Utils', 'dayjs', `return ${funStr}`)(globalVar, vm, utils, dayjs)();
    } catch (error) {
        console.error(error, funStr);
    }
};
// 同步字符函数执行
export const ExecFunctionStrSync = (globalVar, vm, funStr) => {
    try {
        return new Function('globalVar', 'vm', 'Utils', 'dayjs', `return ${funStr}`)(globalVar, vm, utils, dayjs)();
    } catch (error) {
        console.error(error, funStr);
    }
};
// 获取字符函数
export const GetFunctionFromFunStr = (globalVar, vm, funStr) => {
    try {
        return new Function('globalVar', 'vm', 'Utils', 'dayjs', `return ${funStr}`)(globalVar, vm, utils, dayjs);
    } catch (error) {
        console.error(error, funStr);
    }
};

// 变量名替换
export const ReplaceGlobalVarName = (str = '', workspaceId = '', prefix = 'globalVar.') => {
    return str.replace(/globalVar_/g, prefix + 'globalVar_').replace(/workspaceVar_/g, prefix + 'workspaceVar_' + workspaceId);
};
