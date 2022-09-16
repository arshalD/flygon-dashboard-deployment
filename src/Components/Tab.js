import { Button, Menu, Space, Switch } from 'antd';
import {Component} from 'react'
import { ToolOutlined, FundViewOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useHistory, Redirect, Route } from 'react-router-dom'
import firebase from "firebase/app";
import "firebase/auth";

const { SubMenu } = Menu;

export default class Tab extends Component {
  state = {
    theme: 'dark',
    current: '1',
    isLoggedIn:true,
  };

  changeTheme = value => {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  };
  logout = () => {
    firebase.auth().signOut().then(() => {
      console.log('logout');
      console.log(this.props.history);
      this.setState({isLoggedIn: false})
    }).catch((error) => {
      // An error happened.
    });
  }
  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
    // if(this.state.current==14) this.logout();
  };

  render() {
    if(this.state.isLoggedIn){
    return (
        <>
        <Menu
          theme={this.state.theme}
          onClick={this.handleClick}
          style={{ width: 250, height: '100%' }}
          defaultOpenKeys={['sub1']}
          selectedKeys={[this.state.current]}
          mode="inline"
        >

          <SubMenu key="sub1" icon={<ToolOutlined />} title="Manage">
            <Menu.Item key="1"><Link to={'/'}>New Orders</Link></Menu.Item>
            <Menu.Item key="2"><Link to={'/processed'}>Processed Orders</Link></Menu.Item>
            <Menu.Item key="3"><Link to={'/products'}>Products</Link></Menu.Item>
            <Menu.Item key="4"><Link to={'/featuredproduct'}>Featured Product</Link></Menu.Item>
            <Menu.Item key="13"><Link to={'/deals'}>Deals</Link></Menu.Item>
            <Menu.Item key="17"><Link to={'/categories'}>Categories</Link></Menu.Item>
            {/* <Menu.Item key="4">Option 4</Menu.Item> */}
          </SubMenu>
          <SubMenu key="sub2" icon={<FundViewOutlined />} title="Apps">
            <Menu.Item key="6">Razorpay</Menu.Item>
            <Menu.Item key="9">Facebook Chat</Menu.Item>
          </SubMenu>

              <Switch
              checked={this.state.theme === 'dark'}
              onChange={this.changeTheme}
              style={{
                margin: '20px',
              }}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
            <br />
            <Menu.Item key="14" onClick={()=>this.logout()}>
              <Space>
                Logout 
                <LogoutOutlined />
              </Space>
            </Menu.Item>
    
        </Menu>
      </>
    )}
    else {
      return(
        <Redirect to='/login' />
      )
    }
  }
}