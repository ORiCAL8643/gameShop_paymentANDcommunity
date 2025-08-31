// src/components/CommunityThread.tsx
import { useState, useRef, useLayoutEffect } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Tag,
  Button,
  Upload,
  Input,
  Badge,
  Space,
  message,
  Modal,
} from 'antd';
import {
  LikeOutlined,
  DislikeOutlined,
  MessageOutlined,
  UserOutlined,
  PictureOutlined,
  SendOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

// ✅ ให้แถบพิมพ์ข้อความกว้างเท่าคอนเทนต์กลาง (ต้องเท่ากับ PAGE_MAX_WIDTH ใน App)
const FOOTER_MAX_WIDTH_PX = 900;

const { Title, Text } = Typography;

const CommunityThread = () => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [sending, setSending] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const footerRef = useRef<HTMLDivElement | null>(null);
  const [footerHeight, setFooterHeight] = useState<number>(120);
  useLayoutEffect(() => {
    if (!footerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect?.height ?? 120;
      setFooterHeight(h + 16);
    });
    ro.observe(footerRef.current);
    return () => ro.disconnect();
  }, []);

  const toDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const onUploadChange = async ({ fileList }: { fileList: UploadFile[] }) => {
    const withPreview = await Promise.all(
      fileList.map(async (f) => {
        if (!f.url && !f.preview && f.originFileObj) {
          try {
            const dataUrl = await toDataURL(f.originFileObj as File);
            return { ...f, preview: dataUrl };
          } catch {
            return f;
          }
        }
        return f;
      })
    );
    setFiles(withPreview.slice(-5));
  };

  const removeFileByUid = (uid: string) => setFiles((prev) => prev.filter((f) => f.uid !== uid));

  const handleSend = () => {
    if (!text.trim() && files.length === 0) {
      message.warning('พิมพ์ข้อความหรือแนบรูปภาพอย่างน้อย 1 รายการก่อนส่งนะครับ');
      return;
    }
    setSending(true);
    setTimeout(() => {
      message.success('ส่งเรียบร้อย!');
      setText('');
      setFiles([]);
      setSending(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ใช้พื้นที่คอนเทนต์กลางจาก App: แค่เว้นที่กันโดนแถบล่างบัง */}
      <div style={{ paddingBottom: footerHeight }}>
        {/* ถ้าจะมีหลายโพสต์ ให้ครอบด้วย Space vertical เพื่อระยะห่างสม่ำเสมอ */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card
            style={{ backgroundColor: '#1e1e1e', border: '1px solid #303030', borderRadius: 10 }}
            bodyStyle={{ padding: 24 }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Title level={4} style={{ color: '#fff', marginBottom: 0 }}>
                สงสัยเกี่ยวกับเกมแนว RPG ควรเริ่มจากตรงไหนก่อนดี?
              </Title>
              <Tag color="geekblue">RPG</Tag>
              <Text style={{ color: '#ccc' }}>
                ผมเพิ่งเริ่มเข้าสู่วงการเกมแนว RPG แต่ไม่รู้จะเริ่มจากเกมไหนดี รบกวนขอคำแนะนำหน่อยครับ :)
              </Text>

              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

          {/* ตัวอย่างการ์ดที่ 2 (ลบได้) เพื่อให้เห็นการเรียงเว้นระยะสวยขึ้นเมื่อไม่มีแถบขวา */}
          {/* <Card ...> ... </Card> */}
        </Space>
      </div>

      {/* แถบส่งข้อความ (fixed + กึ่งกลาง + กว้างเท่าคอนเทนต์กลาง) */}
      <div
        ref={footerRef}
        style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 0,
          width: `min(${FOOTER_MAX_WIDTH_PX}px, calc(100% - 24px))`,
          background: '#141414',
          border: '1px solid #303030',
          borderRadius: 12,
          padding: 12,
          marginBottom: 8,
          zIndex: 1000,
          boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
        }}
      >
        {/* พรีวิวรูป */}
        {files.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 8,
              marginBottom: 8,
              borderBottom: '1px dashed #303030',
            }}
          >
            {files.map((f) => {
              const src = (f.preview as string) || f.url;
              return (
                <div
                  key={f.uid}
                  style={{
                    position: 'relative',
                    width: 72,
                    height: 72,
                    border: '1px solid #303030',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#1e1e1e',
                    flex: '0 0 auto',
                    cursor: 'pointer',
                  }}
                  onClick={() => src && setPreviewSrc(src)}
                  title={f.name}
                >
                  {src ? (
                    <img src={src} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ color: '#777', fontSize: 12, padding: 6 }}>{f.name}</div>
                  )}
                  <Button
                    size="small"
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFileByUid(f.uid);
                    }}
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      background: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      borderRadius: 6,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* กล่องพิมพ์ + ปุ่ม */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Input.TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์ข้อความของคุณ... (กด Ctrl + Enter เพื่อส่ง)"
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{
              flex: 1,
              minWidth: 0,
              width: '100%',
              background: '#1e1e1e',
              color: '#fff',
              borderColor: '#303030',
              borderRadius: 8,
            }}
          />

          <Space direction="vertical" size="small">
            <Upload
              multiple
              accept="image/*"
              beforeUpload={() => false}
              fileList={files}
              onChange={onUploadChange}
              showUploadList={false}
            >
              <Badge count={files.length} size="small">
                <Button icon={<PictureOutlined />} />
              </Badge>
            </Upload>

            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={sending}
              disabled={!text.trim() && files.length === 0}
            >
              ส่ง
            </Button>
          </Space>
        </div>
      </div>

      {/* พรีวิวใหญ่ */}
      <Modal open={!!previewSrc} onCancel={() => setPreviewSrc(null)} footer={null} centered bodyStyle={{ padding: 0, background: '#000' }}>
        {previewSrc && <img src={previewSrc} style={{ width: '100%', display: 'block' }} alt="preview" />}
      </Modal>
    </>
  );
};

export default CommunityThread;
