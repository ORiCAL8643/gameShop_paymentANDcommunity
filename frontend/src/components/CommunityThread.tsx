
import { Card, Avatar, Typography, Tag, Button, Space } from 'antd';
import { LikeOutlined, DislikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CommunityThread = () => {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Card
        style={{ backgroundColor: '#1e1e1e', border: '1px solid #303030', borderRadius: 10 }}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Title level={4} style={{ color: '#fff' }}>
            สงสัยเกี่ยวกับเกมแนว RPG ควรเริ่มจากตรงไหนก่อนดี?
          </Title>
          <Tag color="geekblue">RPG</Tag>
          <Text style={{ color: '#ccc' }}>
            ผมเพิ่งเริ่มเข้าสู่วงการเกมแนว RPG แต่ไม่รู้จะเริ่มจากเกมไหนดี รบกวนขอคำแนะนำหน่อยครับ :)
          </Text>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Avatar icon={<UserOutlined />} />
              <Text style={{ color: '#aaa' }}>by GamerX · 2 ชั่วโมงที่แล้ว</Text>
            </div>
            <Space>
              <Button icon={<LikeOutlined />} shape="circle" />
              <Button icon={<DislikeOutlined />} shape="circle" />
              <Button icon={<MessageOutlined />} shape="circle" />
            </Space>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default CommunityThread;
