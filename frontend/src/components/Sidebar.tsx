import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  //HeartOutlined,
  WalletOutlined,
  DesktopOutlined,
  CustomerServiceOutlined,
  VideoCameraOutlined,
  AppstoreOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider theme="dark" width={220}>
      <div style={{ color: '#9254de', fontSize: 20, textAlign: 'center', padding: '16px 0' }}>
        GAME STORE
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<UserOutlined />}>Profile</Menu.Item>
        <Menu.Item key="2" icon={<SearchOutlined />}>Search</Menu.Item>
        <Menu.Item key="3" icon={<CustomerServiceOutlined />}>Favorite</Menu.Item>
        <Menu.Item key="4" icon={<WalletOutlined />}>Balance</Menu.Item>
        <Menu.Divider />
        <Menu.ItemGroup title="Category">
          <Menu.Item key="5" icon={<DesktopOutlined />}>Computer</Menu.Item>
          <Menu.Item key="6" icon={<CustomerServiceOutlined />}>Game Headphones</Menu.Item>
          <Menu.Item key="7" icon={<VideoCameraOutlined />}>VR Glasses</Menu.Item>
          <Menu.Item key="8" icon={<AppstoreOutlined />}>Keyboard</Menu.Item>
          <Menu.Item key="9" icon={<EditOutlined />}>Mouse Gaming</Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
