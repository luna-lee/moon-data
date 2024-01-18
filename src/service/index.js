import router from '@/router';
import { Message } from 'element-ui';
// import axios from 'axios'; 'https://www.1724956493.top/moon-datav/egg'; //
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'https://www.1724956493.top/moon-datav/egg' : 'http://127.0.0.1:7001';
axios.defaults.withCredentials = true;
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';

axios.interceptors.request.use((config) => {
    return config;
});
axios.interceptors.response.use((response) => {
    /*  if (response.data.data === "没有登录") {
        localStorage.removeItem('useId')
        window._ROUTER_.push('/')
        return Promise.reject(response);
    } */
    if (response.data.code == 200) return response.data;
    if (response.data.code == 4000) {
        router.replace('/');
        Message.error(response.data.msg);
        Promise.reject(response);
    }
    if (response.data.code == 500) {
        Message.error(response.data.msg);
        Promise.reject(response);
    }
});
/*  */
export const login = (params) => axios.post('/login', params);

export const getWorkSpaceById = (params) => axios.get('/getWorkSpaceById', { params });

export const getCellsByWorkSpaceId = (params) => axios.get('/getCellsByWorkSpaceId', { params });
export const getWorkSpaceListByProjectId = (params) => axios.get('/getWorkSpaceListByProjectId', { params });
export const getProjectList = (params) => axios.get('/getProjectList', { params });
export const getProjectListAll = (params) => axios.get('/getProjectListAll', { params });

export const getCellByWorkspaceIdAndCellId = (params) => axios.get('/getCellByWorkspaceIdAndCellId', { params });

export const getProjectById = (params) => axios.get('/getProjectById', { params });

export const addOrUpdateWorkSpace = (params) => axios.post('/addOrUpdateWorkSpace', params);

export const addOrUpdateProject = (params) => axios.post('/addOrUpdateProject', params);
export const addOrUpdateCells = (params) => axios.post('/addOrUpdateCells', params);
export const delWorkspace = (id) => axios.post('/delWorkspace/' + id);
export const delProject = (id) => axios.post('/delProject/' + id);

export const delCellByWorkspaceIdAndCellId = (params) => axios.post('/delCellByWorkspaceIdAndCellId', params);

export const getProjectGroup = (params) => axios.get('/getProjectGroup', { params });

export const deleteProjectGroup = (id) => axios.post('/deleteProjectGroup/' + id);

export const addOrUpdateProjectGroup = (params) => axios.post('/addOrUpdateProjectGroup', params);
