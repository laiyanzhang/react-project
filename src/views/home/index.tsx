import { Outlet, useNavigate } from 'react-router-dom';
import styles from './home.module.less';
import type { MenuProps } from 'antd';
const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number]
const items: MenuItem[] = [
  {
    key: 'demo',
    label: 'Demo',
    icon: <MailOutlined />,
  },
  {
    key: 'test',
    label: 'Test',
    icon: <MailOutlined />,
  },
]


const Home = () => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const handleClick: MenuProps['onClick'] = (event) => {
    const path = '/' + event.key
    navigate(path)
  }
  return (
    <div className={styles.home}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleClick} />
      </Sider>
      <div className={styles.content}>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default Home