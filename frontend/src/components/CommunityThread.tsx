// src/components/CommunityThread.tsx
import { useState, useRef, useLayoutEffect } from 'react';
import {
  Card,
  Avatar,
  Typography,
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
  MessageOutlined,
  UserOutlined,
  PictureOutlined,
  SendOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const FOOTER_MAX_WIDTH_PX = 900;
const { Title, Text } = Typography;

type ThreadComment = {
  id: number;
  author: string;
  content: string;
  datetime: string;
  children?: ThreadComment[];
};

// คอมโพเนนต์คอมเมนต์ (เรนเดอร์แบบซ้อน + ปุ่มตอบกลับที่คอมเมนต์แต่ละตัว)
const CommentItem = ({
  data,
  onReply,
}: {
  data: ThreadComment;
  onReply: (parentId: number, content: string) => void;
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const submitReply = () => {
    const text = replyText.trim();
    if (!text) return;
    onReply(data.id, text);
    setReplyText('');
    setShowReplyBox(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitReply();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <Avatar icon={<UserOutlined />} />
      <div style={{ flex: 1 }}>
        {/* กล่องข้อความของคอมเมนต์ (เข้มกว่าเธรดหลัก) */}
        <div
          style={{
            background: '#191a1f',
            border: '1px solid #2b2b2b',
            borderRadius: 10,
            padding: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <Text style={{ color: '#ddd', fontWeight: 500 }}>{data.author}</Text>
            <span style={{ color: '#888', fontSize: 12 }}>{data.datetime}</span>
          </div>
          <div style={{ color: '#ccc', marginTop: 6 }}>{data.content}</div>

          {/* ปุ่มตอบกลับ */}
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <Button
              size="small"
              type="default"
              icon={<MessageOutlined />}
              onClick={() => setShowReplyBox((s) => !s)}
            >
              ตอบกลับ
            </Button>
          </div>

          {/* กล่องพิมพ์คำตอบ (ย่อย) */}
          {showReplyBox && (
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <Input.TextArea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="พิมพ์คำตอบของคุณ... (Ctrl + Enter เพื่อส่ง)"
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{
                  background: '#1e1e1e',
                  color: '#fff',
                  borderColor: '#303030',
                  borderRadius: 8,
                }}
              />
              <Space direction="vertical" size="small">
                <Button
                  type="primary"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={submitReply}
                  disabled={!replyText.trim()}
                >
                  ส่ง
                </Button>
                <Button
                  size="small"
                  type="text"
                  onClick={() => {
                    setShowReplyBox(false);
                    setReplyText('');
                  }}
                >
                  ยกเลิก
                </Button>
              </Space>
            </div>
          )}
        </div>

        {/* ลูก (คอมเมนต์ซ้อน) */}
        {data.children?.length ? (
          <div style={{ borderLeft: '1px dashed #303030', marginTop: 10, paddingLeft: 12 }}>
            {data.children.map((child) => (
              <CommentItem key={child.id} data={child} onReply={onReply} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CommunityThread = () => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [sending, setSending] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  // ใช้ state เพื่อให้สามารถเพิ่มคำตอบลงไปได้จริง
  const [comments, setComments] = useState<ThreadComment[]>([
    {
      id: 1,
      author: 'Alice',
      content: 'เริ่มจาก RPG เบาๆ เช่น Stardew / Pokémon',
      datetime: '1 ชม.ที่แล้ว',
      children: [
        {
          id: 11,
          author: 'Bob',
          content: 'เห็นด้วยครับ มือใหม่เข้าถึงง่าย',
          datetime: '55 นาทีที่แล้ว',
        },
      ],
    },
    {
      id: 2,
      author: 'Korn',
      content: 'ถ้าชอบเนื้อเรื่องเข้ม ลอง FF7 Remake หรือ Persona 5',
      datetime: '30 นาทีที่แล้ว',
    },
  ]);

  // id วิ่งสำหรับคอมเมนต์ใหม่
  const commentIdRef = useRef(100);

  // กันคอนเทนต์โดนแถบล่างบัง (ความสูงแถบล่างเปลี่ยนได้)
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

  // helper: สร้าง dataURL สำหรับ preview
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
    // TODO: ส่งคอมเมนต์/โพสต์จริงด้วย API
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

  // เพิ่มคำตอบเข้าไปใต้คอมเมนต์ที่มี id = parentId
  const handleReply = (parentId: number, content: string) => {
    const newComment: ThreadComment = {
      id: commentIdRef.current++,
      author: 'คุณ', // TODO: แทนด้วยชื่อผู้ใช้จริงจาก auth
      content,
      datetime: 'เพิ่งตอบกลับ',
    };

    const appendToTree = (list: ThreadComment[]): ThreadComment[] =>
      list.map((c) => {
        if (c.id === parentId) {
          return { ...c, children: [...(c.children ?? []), newComment] };
        }
        if (c.children?.length) {
          return { ...c, children: appendToTree(c.children) };
        }
        return c;
      });

    setComments((prev) => appendToTree(prev));
    setShowComments(true);
    message.success('เพิ่มคำตอบแล้ว');
  };

  return (
    <>
      {/* พื้นที่คอนเทนต์ (กันถูกแถบล่างบัง) */}
      <div style={{ paddingBottom: footerHeight }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card
            style={{ backgroundColor: '#1e1e1e', border: '1px solid #303030', borderRadius: 10 }}
            bodyStyle={{ padding: 24 }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Title level={4} style={{ color: '#fff', marginBottom: 0 }}>
                สงสัยเกี่ยวกับเกมแนว RPG ควรเริ่มจากตรงไหนก่อนดี?
              </Title>

              {/* ลบ Tag ออกแล้ว */}
              <Text style={{ color: '#ccc' }}>
                ผมเพิ่งเริ่มเข้าสู่วงการเกมแนว RPG แต่ไม่รู้จะเริ่มจากเกมไหนดี รบกวนขอคำแนะนำหน่อยครับ :)
              </Text>

              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar icon={<UserOutlined />} />
                  <Text style={{ color: '#aaa' }}>by GamerX · 2 ชั่วโมงที่แล้ว</Text>
                </div>

                <Space>
                  {/* เหลือแค่ Like */}
                  <Button icon={<LikeOutlined />} shape="circle" />
                  {/* ปุ่มคอมเมนต์: toggle แสดง/ซ่อนคอมเมนต์ย่อย */}
                  <Badge count={comments.length} size="small">
                    <Button
                      icon={<MessageOutlined />}
                      shape="circle"
                      onClick={() => setShowComments((s) => !s)}
                    />
                  </Badge>
                </Space>
              </Space>

              {/* โซนคอมเมนต์ย่อย — เข้มกว่าเธรดหลัก */}
              {showComments && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 12,
                    border: '1px solid #303030',
                    background: '#161616',
                    borderRadius: 12,
                  }}
                >
                  {comments.map((c) => (
                    <CommentItem key={c.id} data={c} onReply={handleReply} />
                  ))}
                </div>
              )}
            </Space>
          </Card>
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
                    <img
                      src={src}
                      alt={f.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
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

      {/* พรีวิวรูปใหญ่ */}
      <Modal
        open={!!previewSrc}
        onCancel={() => setPreviewSrc(null)}
        footer={null}
        centered
        bodyStyle={{ padding: 0, background: '#000' }}
      >
        {previewSrc && <img src={previewSrc} style={{ width: '100%', display: 'block' }} alt="preview" />}
      </Modal>
    </>
  );
};

export default CommunityThread;
