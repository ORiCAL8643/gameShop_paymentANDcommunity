import { useState } from "react";
import { Avatar, Button, Input, Space, Typography } from "antd";
import { MessageOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import type { ThreadComment } from "./types";

const { Text } = Typography;

type Props = {
  data: ThreadComment;
  onReply: (parentId: number, payload: { content: string }) => void;
};

export default function CommentItem({ data, onReply }: Props) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");

  const submit = () => {
    const t = val.trim();
    if (!t) return;
    onReply(data.id, { content: t });
    setVal("");
    setOpen(false);
  };

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
      <Avatar icon={<UserOutlined />} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            background: "#191a1f",
            border: "1px solid #2b2b2b",
            borderRadius: 10,
            padding: 10,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <Text style={{ color: "#ddd", fontWeight: 500 }}>{data.author}</Text>
            <span style={{ color: "#888", fontSize: 12 }}>{data.datetime}</span>
          </div>
          <div style={{ color: "#ccc", marginTop: 6 }}>{data.content}</div>

          <div style={{ marginTop: 8 }}>
            <Button
              size="small"
              icon={<MessageOutlined />}
              onClick={() => setOpen((s) => !s)}
            >
              ตอบกลับ
            </Button>
          </div>

          {open && (
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Input.TextArea
                value={val}
                onChange={(e) => setVal(e.target.value)}
                autoSize={{ minRows: 1, maxRows: 4 }}
                placeholder="พิมพ์คำตอบของคุณ… (Ctrl+Enter เพื่อส่ง)"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    submit();
                  }
                }}
                style={{
                  background: "#1e1e1e",
                  color: "#fff",
                  borderColor: "#303030",
                  borderRadius: 8,
                }}
              />
              <Space direction="vertical" size="small">
                <Button type="primary" size="small" icon={<SendOutlined />} onClick={submit}>
                  ส่ง
                </Button>
                <Button size="small" type="text" onClick={() => setOpen(false)}>
                  ยกเลิก
                </Button>
              </Space>
            </div>
          )}
        </div>

        {!!data.children?.length && (
          <div style={{ borderLeft: "1px dashed #303030", marginTop: 10, paddingLeft: 12 }}>
            {data.children!.map((c) => (
              <CommentItem key={c.id} data={c} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
