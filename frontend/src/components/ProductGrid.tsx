import { Row, Col } from 'antd';
import ProductCard from './ProductCard';

const ProductGrid = () => {
  return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Col xs={24} sm={12} md={8} lg={6} key={index}>
          <ProductCard />
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
