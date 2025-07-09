import { getTableList, getGenderOptions, deleteTableItem } from '@api/index'
import styles from './demo.module.less'
import useMessage from '@hook/useMessage';

interface dataItem {
  id: number,
  name: string,
  age: number,
  gender: string,
  email: string,
  address: string,
  createTime: string,
  tags: Array<string>
}

const Demo = () => {
  const message = useMessage()
  const queryClient = useQueryClient()
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (_:any , { tags }: { tags: Array<string> }) => (
        <>
          {
            tags.map((tag: string, index: number) => {
              let color = 'red'
              if(tag == 'A') color = 'red'
              if(tag == 'B') color = 'blue'
              if(tag == 'C') color = 'green'
              if(tag == 'D') color = 'yellow'
              return (
                <Tag color={color} key={`${index}+${tag}`}>{tag}</Tag>
              )
            })
          }
        </>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: dataItem) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    }
  ]
  const [params, setParams] = useImmer({
    pageIndex: 1,
    pageSize: 10,
    name: '',
    gender: '',
  })
  const [total, setTotal] = useState(0)
  const {data: genderOptions} = useQuery({
    queryKey: ['fecthGender'],
    queryFn: async() => {
      const res = await getGenderOptions()
      return res.data.data
    }
  })
  const { data: tableList } = useQuery({
    queryKey: ['fetchTable', JSON.stringify(params)],
    queryFn: async() => {
      console.log('请求')
      const res = await getTableList(params)
      const data = res.data.data
      console.log(data.list)
      setTotal(data.total)
      return data.list
    },
    staleTime: 100000,
    select: (data) => data.map((item: dataItem) => ({
      ...item,
      key: item.id
    }))
  })
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTableItem({ id: id }),
    onSuccess: async () => {
      message.success('删除成功')
      const BATCH_SIZE = 2
      // 更新当前页面
      await queryClient.refetchQueries({ queryKey: ['fetchTable', JSON.stringify(params)] })

      // 获取其他已缓存的分页键
      const otherCachedPages = queryClient
        .getQueryCache()
        .findAll({
          queryKey: ['fetchTable'],
          predicate: (query) => 
          query.queryKey[0] === 'fetchTable' && 
          query.queryKey[1] !== JSON.stringify(params)
        })

      // 分批次更新其他页
      for (let i = 0; i < otherCachedPages.length; i += BATCH_SIZE) {
        const batch = otherCachedPages
          .slice(i, i + BATCH_SIZE)
          .map(query => queryClient.refetchQueries({ queryKey: query.queryKey }));
        await Promise.allSettled(batch);
      }
    }
  })
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setParams(draft => {
      draft.name = event.target.value
      draft.pageIndex = 1
    })
  }
  const handleChange = (value: string) => {
    setParams(draft => {
      draft.gender = value
      draft.pageIndex = 1
    })
  }
  const handleChangePage = (page: number) => {
    setParams(draft => {
      draft.pageIndex = page
    })
  }
  const handleEdit = (record: dataItem) => {
    console.log(record)
  }
  const handleDelete = (record: dataItem) => {
    deleteMutation.mutate(record.id)
  }
  return (
    <div className={ styles.demo }>
      <div className={styles.query}>
        <div className={styles.select}>
          <div className={styles.label}>名称：</div>
          <Input placeholder="请输入名称" onBlur={handleBlur}/>
        </div>
        <div className={styles.select}>
          <div className={styles.label}>性别：</div>
          <Select
            style={{ width: 120 }}
            onChange={handleChange}
            options={genderOptions}
          />
        </div>
      </div>
      <Table dataSource={tableList} columns={columns} className={styles.table} pagination={false} />
      <Pagination current={params.pageIndex} total={total} className={styles.pagination} onChange={handleChangePage} />
    </div>
  )
}

export default Demo