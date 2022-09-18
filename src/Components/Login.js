import { Button, Col, Form, Image, Input, message, Row, Typography } from "antd"
import image from '../login.svg'
import firebase from "firebase/app";
import "firebase/auth";
import { useHistory } from "react-router-dom";
import { useState } from "react";
const { Title } = Typography;

const Login = (props)=>{
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const history = useHistory()
    const resetPassword = ()=>{
        setResetLoading(true)
        firebase.auth().sendPasswordResetEmail("arshaldmathew@gmail.com").then(() => {
            // Password reset email sent!
            message.info("Password reset email sent!")
            setResetLoading(false)
            // ..
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
            message.error(errorMessage)
            setResetLoading(false)

          });
    }
    const onFinish = (values) => {
        setLoading(true)
        firebase.auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user);
            sessionStorage.setItem("user", user);
            history.push('/')
            setLoading(false);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            message.error(errorMessage)
            setLoading(false);
        });
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return(
        <>
        <Row>
            <Col span={12} style={{display: 'flex', alignItems: 'center'}}>
            <Image preview={false} src={image} alt="Image"></Image>
            </Col>
            <Col span={12} style={{display: 'flex', alignItems: 'center',justifyContent: 'center'}}>
            <Form
                style={{width:'50vh'}}
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                layout={'vertical'}
                requiredMark={false}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your email!',
                    },
                    ]}
                >
                    <Input size={'large'} style={{borderRadius: '10px'}}/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                >
                    <Input.Password size={'large'} style={{borderRadius: '10px'}} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    offset: 5,
                    span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" loading={loading}>
                    Login
                    </Button>
                    <Button type="link" onClick={() =>resetPassword()} loading={resetLoading}>
                    Forgot Password?
                    </Button>
                </Form.Item>
                </Form>
            </Col>
        </Row>
        </>
    )
}

export default Login