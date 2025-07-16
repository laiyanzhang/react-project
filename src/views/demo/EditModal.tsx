import { editTableItem } from "@api/index"
import useMessage from '@hooks/useMessage'
import styles from './demo.module.less'

type options = {
  value: string,
  label: string
}

interface Props {
  detail: object,
  isModalOpen: boolean,
  genderOptions: Array<options>,
  submit: () => void,
  cancel: () => void
}

type FieldType = {
  id: number,
  name?: string;
  age?: string;
  gender?: string;
  email?: string;
  address?: string;
};

const EditModal = (props: Props) => {
  const message = useMessage()
  const {isModalOpen, submit, cancel, detail, genderOptions} = props
  const [form] = Form.useForm<FieldType>()
  const [formData, setFormData] = useState({...detail})
  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue(detail);
      setFormData({...detail})
    }
  }, [detail, isModalOpen, form])
  const handleOk = async () => {
    const isVaild = await form.validateFields()
    if(isVaild) {
      try {
        const res = await editTableItem(formData)
        if(res.data.code == 200) {
          message.success(res.data.message)
          submit()
        }
      }
      catch(e) {
        message.error(e)
      }
    }
  }
  const handleCancel = () => {
    cancel()
  }
  const handleChange = (_: any, allValues: FieldType) => {
    setFormData(allValues);
  }
  return (
    <Modal
      title="编辑"
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={styles.editModal}>
        <Form
          name="basic"
          form={form}
          style={{ maxWidth: 600 }}
          initialValues={detail}
          onValuesChange={handleChange}
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
          <Form.Item<FieldType>
            label="性别"
            name="gender"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select
              style={{ width: 120 }}
              options={genderOptions}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="邮箱"
            name="email"
            rules={[{ required: true, message: '请输入邮箱!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="地址"
            name="address"
            rules={[{ required: true, message: '请输入地址!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default EditModal