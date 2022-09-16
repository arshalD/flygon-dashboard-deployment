import './App.css';
import { Layout } from 'antd';
import 'antd/dist/antd.css'
import Tab from './Components/Tab'
import React, {Component} from 'react'
import Orders from './Components/Orders'
import NewOrders from './Components/NewOrders'
import Products from './Components/Products'
import AddProduct from './Components/AddProduct'
import FeaturedProduct from './Components/FeaturedProduct'
import InvoicePrinter from './Components/InvoicePrinter'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { OrdersProvider } from './OrdersContext' 
import Deals from './Components/Deals';
import Category from './Components/Category';
import Login from './Components/Login';
import { ProtectedRoute } from './ProtectedRoute';
const { Sider, Content } = Layout;
// var products =[]
var db


class App extends Component {
  state = {orders : [],}

  render() {
    return (
      <OrdersProvider order={this.state.orders}>
      <Router>
      <Switch>  
         <Route exact path='/login' component={Login}></Route>
      <Layout>
        <Sider style={{width:'350px'}}>
          <Tab />
        </Sider>
        <Layout style={{height:'100vh'}}>
          <Content
            style={{
              margin: '26px 12vh',
              padding: 24,
              minHeight: 280,
            }}
          >
                        <ProtectedRoute exact path='/' component={NewOrders}></ProtectedRoute>
                        <Route exact path='/login' component={Login}></Route>
                        <ProtectedRoute exact path='/processed' component={Orders}></ProtectedRoute>
                        <ProtectedRoute exact path='/products' component={Products}></ProtectedRoute>
                        <ProtectedRoute exact path='/invoice' component={InvoicePrinter}></ProtectedRoute>
                        <ProtectedRoute exact path='/addproduct' component={AddProduct}></ProtectedRoute>
                        <ProtectedRoute exact path='/featuredproduct' component={FeaturedProduct}></ProtectedRoute>
                        <ProtectedRoute exact path='/deals' component={Deals}></ProtectedRoute>
                        <ProtectedRoute exact path='/categories' component={Category}></ProtectedRoute>
          </Content>
        </Layout>
      </Layout>
      </Switch>
    </Router>
    </OrdersProvider>
    );
  }
}

export default App