import styles from './list.module.less'

type dataItem = {
  id?: number,
  name?: string | undefined,
  age?: string | undefined,
}

type FieldType = {
  id?: number,
  name: string;
  age: string;
}

interface Props {
  detail: dataItem | undefined,
  isModalOpen: boolean,
  submit: (data: dataItem) => void,
  cancel: () => void
}

const DetailModal = memo((props: Props) => {
  const {isModalOpen, submit, cancel, detail} = props
  const [form] = Form.useForm<FieldType>()
  const initialFormData = useMemo(() => {
    return detail ? { ...detail } : { id: undefined, name: '', age: '' };
  }, [detail]);
  const title = useMemo(() => 
    detail === undefined ? '新增' : '编辑', 
    [detail]
  ); 
  useEffect(() => {
    if (isModalOpen) {      
      form.setFieldsValue(initialFormData)
    }
  }, [initialFormData, isModalOpen, form])
  const handleOk = async () => {
    const values = await form.validateFields()
    submit(values)
  }
  const handleCancel = () => {
    cancel()
  }
  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={styles.detailModal}>
        <Form
          name="basic"
          form={form}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="id"
            hidden
          >
            <Input type="hidden" />
          </Form.Item>
          <Form.Item<FieldType>
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="年龄"
            name="age"
            rules={[{ required: true, message: '请输入年龄!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
})

export default DetailModal