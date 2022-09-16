import { Button, Col, Form, Image, Input, message, Row } from "antd"
import image from '../login.svg'
import firebase from "firebase/app";
import "firebase/auth";
import { useHistory } from "react-router-dom";

const Login = (props)=>{
    const history = useHistory()
    const onFinish = (values) => {
        firebase.auth()
        // .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .signInWithEmailAndPassword(values.email, values.password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user);
            history.push('/')
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            message.error(errorMessage)
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
                    offset: 8,
                    span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                    Login
                    </Button>
                </Form.Item>
                </Form>
            </Col>
        </Row>
        </>
    )
}

export default Login