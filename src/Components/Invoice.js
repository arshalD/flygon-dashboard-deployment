import React  from "react";
import { PageHeader, Divider, Descriptions, Row, Col, Table} from "antd"
// name: key,
// qty: order[key],
// price:prices[key],
// tax: taxes[key]
const columns = [
  {
    title: 'Description',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Qty',
    dataIndex: 'qty',
    key: 'qty',
  },
  {
    title: 'Amount',
    dataIndex: 'price',
    key: 'price',
    render: (key)=>{return(<p> ₹{key}</p>)}
  },
];

export class Invoice extends React.PureComponent {

   render() { 
      return (
        <div>
        <PageHeader
        className="site-page-header"
        title="Invoice"
       />
       <Divider />
       <Row style={{margin:'5px 45px'}}>
        <Col span={12}>       
          <Descriptions size={'small'} column={1} title="From">
          <Descriptions.Item >Flygon Industrial Services</Descriptions.Item>
          <Descriptions.Item >
                  Industrial area, Angamaly South<br/>
                  Angamaly Po ,Ernakulam<br/>
                  Kerala, India 683572
          </Descriptions.Item>
          <Descriptions.Item >9947228846  </Descriptions.Item>
          <Descriptions.Item >info@flygon.in</Descriptions.Item>
        </Descriptions></Col>
        <Col span={12}>       
        <Descriptions size={'small'} column={1} title="Bill To">
        <Descriptions.Item >{this.props.name}</Descriptions.Item>
        <Descriptions.Item >{this.props.address}</Descriptions.Item>
        <Descriptions.Item >{this.props.number}</Descriptions.Item>
        <Descriptions.Item >{this.props.email}</Descriptions.Item>
      </Descriptions></Col>
      </Row>
      <Divider />
      <Descriptions size={'small'} style={{margin:'5px 45px'}} column={1}>
        <Descriptions.Item label="Invoice No">{this.props.id}</Descriptions.Item>
        <Descriptions.Item label="Date of issue">{new Date(this.props.date*1000).toLocaleDateString()}</Descriptions.Item>
      </Descriptions>
      <Divider />

      <Table pagination={false} style={{margin:'5px 45px'}} dataSource={this.props.order} columns={columns} />
      <Divider />
      <Descriptions size={'small'} style={{margin:'2px 45px'}} column={1}>
        <Descriptions.Item label="Subtotal">₹ {this.props.totalPrice - this.props.totalTax}</Descriptions.Item>
        <Descriptions.Item label="Tax">₹ {this.props.totalTax}</Descriptions.Item>
        <Descriptions.Item label="Invoice Total">₹ {this.props.totalPrice}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions size={'small'} style={{margin:'2px 45px'}}column={1} title="Shipping Address">
        <Descriptions.Item >{this.props.name}</Descriptions.Item>
        <Descriptions.Item >{this.props.address}</Descriptions.Item>
        <Descriptions.Item >{this.props.number}</Descriptions.Item>
        <Descriptions.Item >{this.props.email}</Descriptions.Item>
      </Descriptions>
        </div>
      );
    }
  }
