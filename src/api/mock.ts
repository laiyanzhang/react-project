import Mock from 'mockjs';

interface tableItem {
  id: number,
  name: string,
  age: number,
  gender: string,
  email: string,
  address: string,
  createTime: string
  tags: Array<string>
}

Mock.Random.extend({
  tag: function() {
    const tags = ['A', 'B', 'C', 'D']
    return this.pick(tags)
  }
})

// 模拟数据
let tableData = Mock.mock({
  'list|40': [{
    'id|+1': 1,
    'name': '@cname',
    'age|20-50': 1,
    'gender': /男|女/,
    'email': '@email',
    'address': '@county(true)',
    'createTime': '@datetime',
    'tags|2': ['@tag']
  }]
}).list

// 模拟获取表格数据的接口
Mock.mock(/\/api\/table\/list/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const pageSize = Number(params.get('pageSize')) || 10
  const pageIndex = Number(params.get('pageIndex')) || 1
  const name = params.get('name')
  const gender = params.get('gender')
  const start = pageSize * (pageIndex - 1)
  const end = pageSize * pageIndex
  let list: tableItem[] = []
  let total = 0
  tableData.forEach((item: tableItem) => {
    let isMatch = true
    if(name && item.name != name) isMatch = false
    if(gender && item.gender !== gender) isMatch = false
    if(isMatch) list.push(item)
  })
  total = list.length
  list = list.slice(start, end)
  console.log(list)
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total,
    }
  };
});

Mock.mock('/api/select/genderOptions', 'get', (options) => {
  console.log(options)
  return {
    code: 200,
    message: 'success',
    data: [{
      value: '男',
      label: '男'
    },{
      value: '女',
      label: '女'
    }]
  }
})


// 模拟添加数据的接口
Mock.mock('/api/table/add', 'post', (options: any) => {
  const newItem = JSON.parse(options.body);
  newItem.id = Mock.mock('@id');
  newItem.createTime = Mock.mock('@datetime');
  tableData.unshift(newItem);
  return {
    code: 200,
    message: '添加成功',
    data: newItem
  };
});

// 模拟删除接口
Mock.mock('/api/table/delete', 'post', (options: any) => {
  const deleteItem = JSON.parse(options.body);
  tableData = tableData.filter((item: tableItem) => item.id != deleteItem.id)
  console.log(tableData)
  return {
    code: 200,
    message: '删除成功',
  };
});