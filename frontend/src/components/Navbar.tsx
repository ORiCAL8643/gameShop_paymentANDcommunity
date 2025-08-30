import { Input, Avatar, Space } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, BellOutlined } from '@ant-design/icons';

const Navbar = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#1f1f1f' }}>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search"
        style={{ width: '50%', borderRadius: 8, background: '#2f2f2f', color: 'white' }}
      />
      <Space size="large">
        <BellOutlined style={{ color: 'white', fontSize: '18px' }} />
        <ShoppingCartOutlined style={{ color: 'white', fontSize: '18px' }} />
        <Avatar src="https://i.pravatar.cc/300" />
      </Space>
    </div>
  );
};

export default Navbar;
