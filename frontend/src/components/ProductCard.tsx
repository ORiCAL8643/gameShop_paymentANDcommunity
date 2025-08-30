import { Card, Button } from 'antd';

const ProductCard = () => {
  return (
    <Card
      style={{ background: '#1f1f1f', color: 'white', borderRadius: 10 }}
      cover={<div style={{ height: 150, background: '#3f3f3f' }} />}
    >
      <Card.Meta title="Product Name" description="Category" />
      <div style={{ marginTop: 10, color: '#9254de' }}>$0.00</div>
      <Button block style={{ marginTop: 10 }}>Add to Cart</Button>
    </Card>
  );
};

export default ProductCard;
