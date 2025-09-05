import { Form, Input, Button } from 'antd';

interface LoginFormValues {
  username: string;
  password: string;
}

interface LoginPageProps {
  onSignup?: () => void;
}

const LoginPage = ({ onSignup }: LoginPageProps) => {
  const onFinish = (values: LoginFormValues) => {
    // Placeholder for login logic
    console.log('Login info:', values);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
        <Form.Item>
          <Button block onClick={onSignup}>
            Sign up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
