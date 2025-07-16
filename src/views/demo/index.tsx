import { getTableList, deleteTableItem } from '@api/index'
import styles from './demo.module.less'
import useMessage from '@hooks/useMessage'
import EditModal from './EditModal'

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
  const genderOptions = useLoaderData()
  const queryClient = useQueryClient()
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 50
    },
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      width: 80
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 70
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 70
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
      width: 100,
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
      width: 200
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
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
  const [detail, setDetail] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [total, setTotal] = useState(0)
  const { data: tableList } = useQuery({
    queryKey: ['fetchTable', JSON.stringify(params)],
    queryFn: async() => {
      const res = await getTableList(params)
      const data = res.data.data
      setTotal(data.total)
      return data.list
    },
    staleTime: 100000,
    select: (data) => data.map((item: dataItem) => ({
      ...item,
      key: item.id
    }))
  })
  // 刷新分页数据
  const refresh = async (refreshOther: boolean = false) => {
    const BATCH_SIZE = 2
    // 更新当前页面
    await queryClient.refetchQueries({ queryKey: ['fetchTable', JSON.stringify(params)] })

    if(refreshOther) {
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
  }
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTableItem({ id: id }),
    onSuccess: async () => {
      message.success('删除成功')
      refresh(true)
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
    setDetail(record)
    setModalOpen(true)
  }
  const handleDelete = (record: dataItem) => {
    deleteMutation.mutate(record.id)
  }
  const handleCancel = () => {
    setModalOpen(false)
  }
  const handleSubmit = () => {
    setModalOpen(false)
    refresh()
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
      <Table
        dataSource={tableList}
        columns={columns}
        className={styles.table}
        pagination={false}
        scroll={{ y: 740, x: 1000 }}
      />
      <Pagination current={params.pageIndex} total={total} className={styles.pagination} onChange={handleChangePage} />
      <EditModal
        detail={detail}
        isModalOpen={modalOpen}
        cancel={handleCancel}
        submit={handleSubmit}
        genderOptions={genderOptions}
      >
      </EditModal>
    </div>
  )
}

export default Demo