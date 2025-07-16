import styles from './list.module.less'
import DetailModal from './DetailModal'
import tableReducer from '@reducers/tableReducer'
import useMessage from '@hooks/useMessage'

interface dataItem {
  id?: number,
  name?: string | undefined,
  age?: string | undefined,
}

let nextId = 1

const Test = () => {
  const message = useMessage()
  const [modalOpen, setModalOpen] = useState(false)
  const [detail, setDetail] = useState<dataItem | undefined>(undefined)
  const [tableList, dispatch] = useImmerReducer(tableReducer, [])
  const [test, setTest] = useState(false)
  const columns = [
    {
      title: 'id',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      key: 'age',
      dataIndex: 'age',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: dataItem) => (
        <Space size="middle">
          <a onClick={handleEdit.bind(null, record)}>编辑</a>
          <a onClick={handleDelete.bind(null, record)}>删除</a>
        </Space>
      ),
    }
  ]
  const hanldeAdd = () => {
    setDetail(undefined)
    setModalOpen(true)
  }
  const handleTest = () => {
    console.log(test)
    setTest(true)
  }
  const handleEdit = (record: dataItem) => {
    setDetail(record)
    setModalOpen(true)
  }
  const handleDelete = (record: dataItem) => {
    dispatch({
      type: 'delete',
      id: record.id
    })
    message.success('删除成功')
  }
  const handleSubmit = useCallback((data: dataItem) => {
    if(!data.id) {
      data.id = nextId++
      dispatch({
        type: 'add',
        item: data
      })
      message.success('新增成功')
    }
    else {
      dispatch({
        type: 'edit',
        item: data,
        id: data.id
      })
      message.success('编辑成功')
    }
    setModalOpen(false)
  }, [dispatch, message])
  const handleCancel = useCallback(() => {
    setModalOpen(false)
  }, [])
  return (
    <div className={styles.page}>
      <div className={styles.operation}>
        <Button onClick={hanldeAdd}>新增</Button>
        <Button onClick={handleTest}>测试</Button>
      </div>
      <Table
        dataSource={tableList}
        columns={columns}
        className={styles.table}
      />
      <DetailModal
        isModalOpen={modalOpen}
        detail={detail}
        submit={handleSubmit}
        cancel={handleCancel}
      >
      </DetailModal>
    </div>
  )
}

export default Test