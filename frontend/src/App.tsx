// src/App.tsx
import { useState } from 'react';
import { Layout, Menu, Input, Avatar, Badge } from 'antd'; // ⬅️ ลบ List, Button ออก
import {
  UserOutlined,
  SearchOutlined,
  HeartOutlined,
  AppstoreAddOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import CommunityThread from './components/CommunityThread';
import PaymentPage from './components/Payment';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [activePage, setActivePage] = useState('community');

  const renderPage = () => {
    switch (activePage) {
      case 'payment':
        return <PaymentPage />;
      case 'community':
      default:
        return <CommunityThread />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* SIDER LEFT (คงไว้) */}
      <Sider theme="dark" width={220} style={{ background: '#0b0d12' }}>
        <div
          style={{
            color: '#9b59b6',
            fontWeight: 'bold',
            fontSize: '20px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          GAME STORE
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['community']}
          onClick={(e) => setActivePage(e.key)}
          style={{ background: '#0b0d12' }}
        >
          <Menu.Item key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
          <Menu.Item key="search" icon={<SearchOutlined />}>Search</Menu.Item>
          <Menu.Item key="favorite" icon={<HeartOutlined />}>Favorite</Menu.Item>
          <Menu.Item key="store" icon={<AppstoreAddOutlined />}>Store</Menu.Item>

          <Menu.ItemGroup title="Category">
            <Menu.Item key="community" icon={<WechatOutlined />}>CommunityThread</Menu.Item>
            <Menu.Item key="payment" icon={<WechatOutlined />}>PaymentPage</Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Sider>

      {/* CONTENT (ไม่มีแถบขวาแล้ว) */}
      <Layout>
        {/* HEADER */}
        <Header
          style={{
            background: '#111',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingInline: 20,
          }}
        >
          <Input
            prefix={<SearchOutlined />}
            placeholder="ค้นหา..."
            style={{ maxWidth: 400 }}
          />
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Badge count={2}>
              <BellOutlined style={{ fontSize: 20, color: '#fff' }} />
            </Badge>
            <ShoppingCartOutlined style={{ fontSize: 20, color: '#fff' }} />
            <Avatar src="https://i.pravatar.cc/150?img=3" />
          </div>
        </Header>

        {/* CONTENT CENTER เต็มความกว้าง */}
        <Content style={{ padding: 24, background: '#1e1e2f', flex: 1 }}>
          {renderPage()}
        </Content>

        {/* ❌ ลบ RIGHT SIDEBAR ออก (เดิมคือ Sider width=240 ที่มี Game Community + List) */}
      </Layout>
    </Layout>
  );
};

export default App;
