// src/pages/PaymentPage.tsx
import { useMemo, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Tag,
  Divider,
  Modal,
  QRCode,
  Upload,
  Input,
  message,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

const THEME_PRIMARY = '#d291ff';

interface CartItem {
  id: string;
  title: string;
  price: number; // THB
  note?: string;
}

const initialItems: CartItem[] = [
  {
    id: 'ark',
    title: 'ARK: Survival Evolved',
    price: 315,
    note: 'ราคาของผลิตภัณฑ์นี้มีการเปลี่ยนแปลง',
  },
  {
    id: 'wt-two-fronts',
    title: 'War Thunder - Two Fronts Pack',
    price: 1299,
    note: 'ผลิตภัณฑ์นี้ไม่มีสิทธิ์ขอคืน',
  },
];

const formatTHB = (n: number) => `฿${n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const PaymentPage = () => {
  const [items] = useState<CartItem[]>(initialItems);
  const [payOpen, setPayOpen] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState('');

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price, 0), [items]);
  const fee = 0;
  const discount = useMemo(() => (discountCode.trim().toUpperCase() === 'SAVE10' ? subtotal * 0.1 : 0), [subtotal, discountCode]);
  const total = useMemo(() => subtotal + fee - discount, [subtotal, discount]);

  const orderId = useMemo(() => `ORD-${Date.now()}`,[payOpen]);

  const handleSubmitSlip = async () => {
    if (!files.length) {
      message.warning('กรุณาแนบสลิปการชำระเงิน');
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 900));
      message.success('ส่งยืนยันการชำระเงินเรียบร้อย');
      setPayOpen(false);
      setFiles([]);
    } catch (e) {
      message.error('ส่งสลิปไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ color: THEME_PRIMARY, textAlign: 'center', marginBottom: 24 }}>
        YOUR GAME CART
      </Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {items.map((it) => (
              <Card key={it.id} hoverable style={{ borderRadius: 14, background: '#fff' }}>
                <Row align="middle" gutter={[12, 12]}> 
                  <Col flex="auto">
                    <Typography.Title level={4} style={{ margin: 0, color: '#333' }}>{it.title}</Typography.Title>
                    <Space size="small" wrap>
                      <Tag color="default" style={{ borderColor: THEME_PRIMARY, color: THEME_PRIMARY }}>สำหรับบัญชีของฉัน</Tag>
                      {it.note && (
                        <Tag color="purple" style={{ backgroundColor: `${THEME_PRIMARY}22`, color: THEME_PRIMARY }}>{it.note}</Tag>
                      )}
                    </Space>
                  </Col>
                  <Col>
                    <Typography.Title level={4} style={{ margin: 0, color: '#333' }}>{formatTHB(it.price)}</Typography.Title>
                  </Col>
                </Row>
              </Card>
            ))}

            <Button
              type="default"
              size="large"
              style={{ width: '100%', borderColor: THEME_PRIMARY, color: THEME_PRIMARY, background: '#fff' }}
            >
              ดำเนินการเลือกซื้อต่อไป
            </Button>
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 16, background: '#fff' }}>
            <Typography.Title level={4} style={{ marginTop: 4, color: '#333' }}>สรุปการสั่งซื้อ</Typography.Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row>
                <Col flex="auto" style={{ color: '#333' }}>ราคารวม</Col>
                <Col style={{ color: '#333' }}>{formatTHB(subtotal)}</Col>
              </Row>
              <Row>
                <Col flex="auto" style={{ color: '#333' }}>ค่าธรรมเนียม</Col>
                <Col style={{ color: '#333' }}>{formatTHB(fee)}</Col>
              </Row>
              {discount > 0 && (
                <Row>
                  <Col flex="auto" style={{ color: '#333' }}>ส่วนลด</Col>
                  <Col style={{ color: 'green' }}>- {formatTHB(discount)}</Col>
                </Row>
              )}
              <Divider style={{ margin: '8px 0' }} />
              <Row>
                <Col flex="auto"><strong style={{ color: '#333' }}>ราคารวมโดยประมาณ</strong></Col>
                <Col>
                  <Typography.Title level={2} style={{ margin: 0, color: '#000' }}>{formatTHB(total)}</Typography.Title>
                </Col>
              </Row>
              <Typography.Paragraph type="secondary" style={{ marginTop: -4, color: '#555' }}>
                หากมีการชำระเงิน ค่าจะถูกกำหนดในขั้นตอนการชำระเงิน
              </Typography.Paragraph>

              <Input
                placeholder="กรอกโค้ดส่วนลด"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                style={{ borderRadius: 8, borderColor: THEME_PRIMARY, color: '#333' }}
              />

              <Button
                type="primary"
                size="large"
                style={{ backgroundColor: THEME_PRIMARY, borderColor: THEME_PRIMARY, color: '#fff' }}
                onClick={() => setPayOpen(true)}
              >
                ดำเนินการต่อไปยังการชำระเงิน
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title={<span style={{ color: THEME_PRIMARY }}>ชำระเงินด้วยคิวอาร์โค้ด</span>}
        open={payOpen}
        onCancel={() => setPayOpen(false)}
        footer={null}
        centered
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <Card bordered={false} style={{ background: '#fff', borderRadius: 16 }}>
            <Row gutter={[16,16]} align="middle" justify="center">
              <Col style={{ textAlign: 'center' }}>
                <QRCode
                  value={`PAY|${orderId}|AMOUNT:${total}|CCY:THB`}
                  size={192}
                  color="#000"
                  bgColor="#fff"
                  bordered
                />
                <Typography.Paragraph style={{ marginTop: 12, color: '#333' }}>
                  <strong>จำนวนเงิน:</strong> <span style={{ color: THEME_PRIMARY }}>{formatTHB(total)}</span>
                </Typography.Paragraph>
                <Typography.Text style={{ color: '#555' }}>สแกนคิวอาร์โค้ดเพื่อชำระเงิน (ระบุอ้างอิง: {orderId})</Typography.Text>
              </Col>
            </Row>
          </Card>

          <div>
            <Typography.Title level={5} style={{ marginBottom: 8, color: '#333' }}>แนบสลิปการชำระเงิน</Typography.Title>
            <Upload.Dragger
              multiple={false}
              fileList={files}
              maxCount={1}
              accept="image/*,.pdf"
              beforeUpload={() => false}
              onChange={({ fileList }) => setFiles(fileList)}
              onRemove={() => { setFiles([]); return true; }}
              style={{ borderColor: THEME_PRIMARY, background: '#fff' }}
            >
              <p className="ant-upload-drag-icon">📎</p>
              <p className="ant-upload-text" style={{ color: '#333' }}>ลาก & วางไฟล์ หรือ คลิกเพื่อเลือกไฟล์</p>
              <p className="ant-upload-hint" style={{ color: '#555' }}>รองรับไฟล์ภาพหรือ PDF ขนาดไม่เกิน ~10MB</p>
            </Upload.Dragger>
          </div>

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => setPayOpen(false)}>ยกเลิก</Button>
            <Button
              type="primary"
              disabled={!files.length}
              loading={submitting}
              style={{ backgroundColor: THEME_PRIMARY, borderColor: THEME_PRIMARY, color: '#fff' }}
              onClick={handleSubmitSlip}
            >
              ส่งยืนยันการชำระเงิน
            </Button>
          </Space>
        </Space>
      </Modal>
    </div>
  );
};

export default PaymentPage;
