import axios from 'axios';

interface listParams {
  pageIndex: number,
  pageSize: number,
  name: string,
  gender: string,
  createTime: string
}

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
});

// 获取表格数据
export const getTableList = (data: listParams) => {
  return service.get('/api/table/list', { params: data });
};

// 添加表格数据
export const addTableItem = (data: any) => {
  return service.post('/api/table/add', data);
};

// 删除表格数据
export const deleteTableItem = (data: any) => {
  return service.post('/api/table/delete', data)
}

// 编辑表格数据
export const editTableItem = (data: any) => {
  return service.post('/api/table/edit', data)
}

// 获取性别可选项
export const getGenderOptions = () => {
  return service.get('/api/select/genderOptions')
}