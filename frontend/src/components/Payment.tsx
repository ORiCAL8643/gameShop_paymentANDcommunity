// src/pages/PaymentPage.tsx

import { Row, Col, Card, Button } from 'antd';

const PaymentPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#d291ff', textAlign: 'center' }}>YOUR GAME CART</h1>

      <Row gutter={16}>
        <Col span={16}>
          <Card style={{ marginBottom: 16 }}>
            <h3>ARK: Survival Evolved ฿315.00</h3>
            <p>ราคาของผลิตภัณฑ์นี้มีการเปลี่ยนแปลง</p>
            <Button>สำหรับบัญชีของฉัน</Button>
          </Card>

          <Card>
            <h3>War Thunder - Two Fronts Pack ฿1,299.00</h3>
            <p>ผลิตภัณฑ์นี้ไม่มีสิทธิ์ขอคืน</p>
            <Button>สำหรับบัญชีของฉัน</Button>
          </Card>

          <Button type="primary" style={{ marginTop: 16 }}>
            ดำเนินการเลือกซื้อต่อไป
          </Button>
        </Col>

        <Col span={8}>
          <Card>
            <h3>ราคารวมโดยประมาณ</h3>
            <h1>฿1,614.00</h1>
            <p>หากมีการชำระเงิน ค่าจะถูกกำหนดในขั้นตอนการชำระเงิน</p>
            <Button type="primary">ดำเนินการต่อไปยังการชำระเงิน</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentPage;
