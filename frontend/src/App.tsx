// src/App.tsx
import { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  HeartOutlined,
  AppstoreAddOutlined,
  WechatOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import Navbar from "./components/Navbar";

// ✅ ใช้หน้าใหม่แทน CommunityThread เดิม
import CommunityPage from "./pages/Community/CommunityPage";
// ปรับเส้นทางให้ตรงกับไฟล์ของคุณ (ถ้าคุณวางไว้ที่ src/pages/PaymentPage.tsx)
import PaymentPage from './components/Payment';
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";

import "./styles/community-dark.css";


const { Header, Sider, Content } = Layout;

export default function App() {
  const [activePage, setActivePage] = useState<
    "community" | "payment" | "login" | "signup"
  >("community");

  const renderPage = () => {
    switch (activePage) {
      case "payment":
        return <PaymentPage />;
      case "login":
        return <LoginPage onSignup={() => setActivePage("signup")} />;
      case "signup":
        return <SignupPage />;
        
      case "community":
      default:
        return <CommunityPage />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* LEFT SIDER */}
      <Sider theme="dark" width={220} style={{ background: "#0b0d12" }}>
        <div
          style={{
            color: "#9b59b6",
            fontWeight: "bold",
            fontSize: 20,
            padding: 16,
            textAlign: "center",
          }}
        >
          GAME STORE
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activePage]}
          onClick={(e) => setActivePage(e.key as "community" | "payment")}
          style={{ background: "#0b0d12" }}
        >
          {/* เมนูอื่น ๆ ไว้เป็น placeholder ไม่ผูกเพจ */}
          <Menu.Item key="profile" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item key="search" icon={<SearchOutlined />}>
            Search
          </Menu.Item>
          <Menu.Item key="favorite" icon={<HeartOutlined />}>
            Favorite
          </Menu.Item>
          <Menu.Item key="store" icon={<AppstoreAddOutlined />}>
            Store
          </Menu.Item>

          <Menu.ItemGroup title="Category">
            <Menu.Item key="community" icon={<WechatOutlined />}>
              Community
            </Menu.Item>
            <Menu.Item key="payment" icon={<CreditCardOutlined />}>
              Payment
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Sider>

      {/* CONTENT */}
      <Layout>
        <Header style={{ background: "#111", paddingInline: 0 }}>
          <Navbar onLogin={() => setActivePage("login")} />
        </Header>

        <Content style={{ padding: 24, background: "#1e1e2f", flex: 1 }}>{renderPage()}</Content>
      </Layout>
    </Layout>
  );
}
