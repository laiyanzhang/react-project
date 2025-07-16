import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './home.module.less';
import routes from '../../router';
import type { MenuProps } from 'antd';
const { Sider } = Layout;

type MyMenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MyMenuItem[];
};

let items: MyMenuItem[] = [];
routes.forEach((item) => {
  if(item.name == 'Home' && Array.isArray(item.children)) {
    items = item.children
      .filter((child) => !!child.path)
      .map((child) => {
        let key = ''
        if(child.path) {
          const index = child.path.indexOf('/')
          if(index > 0) key = '/' + child.path.slice(0, index)
          else key = '/' + child.path
        }
        return {
          key: key as string,
          label: child.name as string,
          icon: child.icon,
        }
      });
  }
});

function getSelectedKey(pathname: string) {
  const index = pathname.indexOf('/', 1)
  if (index > 0) return [pathname.slice(0, index)]
  else return [pathname]
}

const Home = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedKeys = getSelectedKey(location.pathname)
  const [collapsed, setCollapsed] = useState(false)
  const handleClick: MenuProps['onClick'] = (event) => {
    if(event.key == '/demo') navigate(event.key + '/1')
    else navigate(event.key)
  }
  return (
    <Layout className={styles.home}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleClick} selectedKeys={selectedKeys}/>
      </Sider>
      <Layout className={styles.content}>
        <Outlet></Outlet>
      </Layout>
    </Layout>
  )
}

export default Home