import { Form, Input, Button, DatePicker, InputNumber } from 'antd';

interface SignupFormValues {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: string;
  roleID: number;
}

const SignupPage = () => {
  const onFinish = (values: SignupFormValues) => {
    // Placeholder for signup logic
    console.log('Signup info:', values);
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
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter your first name' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter your last name' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Birthday" name="birthday" rules={[{ required: true, message: 'Please select your birthday' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Role ID" name="roleID" rules={[{ required: true, message: 'Please enter your role ID' }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignupPage;
