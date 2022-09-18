import { Table, Input, Button, Space, message, Popconfirm, Modal, Spin } from 'antd';
import Highlighter from 'react-highlight-words';
import firebase from "firebase/app";
import "firebase/firestore"; 
import { SearchOutlined, PrinterOutlined, CheckOutlined } from '@ant-design/icons';
import {Component} from 'react'
import {Link} from 'react-router-dom'

var db
var orders = [];
var getValue
var docToBeEdited = '';
var user ='' // document of user
var userOrderId = '' //key of the order status of user
const EditValue = () => {
  const onChange = (value)=> {
    console.log('changed', value.target.value);
    getValue = value.target.value;
  }
  return (
    <Input placeholder='Enter tracking number'  onChange={onChange} />
  )
}

class NewOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      searchedColumn: '',
      ordersData: [],
      sortDate:[],
      isModalVisible:false,
      loading: false,
    };

}
  dataFetch = () =>{
    console.log('datafetch')
    orders = []
    db.collection("Orders").where('status', '==', 'unprocessed')
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            orders.push({...doc.data(),docId: doc.id});
            console.log(orders);
        });
    })
    .then(() => {
      this.setState({ordersData: orders});
      console.log(this.state.ordersData)
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

  }
  confirm(docId,userId,fieldId) {
    console.log('done')
    docToBeEdited = docId;
    user = userId
    userOrderId = fieldId
    this.setState({isModalVisible: true})
  }
  
  cancel() {
    console.log('clicked cancel');
  }

  markProcessed = (docId)=>{
    let dataToEdit = ''
    let docToEdit = ''

    db.collection("Orders").doc(docId).update({
      "status": 'processed',
  })
  .then(() => {
    if(user != '' || user !== null || user !== undefined)
    { let docRef = db.collection("Users").doc(user);
      docRef.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          docToEdit = doc.data();
          dataToEdit= docToEdit[userOrderId];
          dataToEdit['status'] = 1
          db.collection("Users").doc(user).update({
            [userOrderId]: dataToEdit
          })
          .then(() => {
              message.success("Order marked processed!");
              this.setState({loading:false});
              this.dataFetch()
          });
      } else {
          // doc.data() will be undefined in this case
          this.setState({loading:false});
          console.log("No such document!");
      }
       }).catch((error) => {
        this.setState({loading:false});
        console.log("Error getting document:", error);
      });}
      else {
        console.log("no user specified")
        message.success("Order marked processed!");
              this.setState({loading:false});
              this.dataFetch()
      }
  });
    
  }

  componentDidMount() {
    db = firebase.firestore();
    this.dataFetch()
    console.log("data ", this.state.ordersData)
    db.collection("Orders")
    .onSnapshot(() => {
      console.log("calling data fetch")
      this.dataFetch()
    });

  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  handleOk = () => {
    if(getValue === null || getValue === undefined){
      message.error('Please enter tracking Id')
    }
    else{
      this.setState({isModalVisible: false, loading: true});
      this.markProcessed(docToBeEdited);
      console.log('userOrder',userOrderId);
    }
  }
  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Order Time (mm/dd/yyyy)',
        dataIndex: 'timestamp',
        key: 'timestamp',
        width: '20%',
        render: (key)=> {return(<p>{new Date(key*1000).toLocaleString()}</p>)}
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Payment Id',
        dataIndex: 'paymentId',
        key: 'paymentId',
        ...this.getColumnSearchProps('paymentId'),
        render: (key)=>
          <Button type="link" onClick={()=>{window.open(`https://dashboard.razorpay.com/app/payments?id=${key}`, '_blank');}}>{key}</Button>
      },
      {
        title: 'Mark Processed',
        dataIndex: 'docId',
        key: 'docId',
        render: (key,dataIndex) => <Popconfirm
            title="Are you sure to mark this order as processed?"
            onConfirm={()=>this.confirm(key, dataIndex.user, dataIndex.paymentId)}
            onCancel={()=>this.cancel()}
            okText="Yes"
            cancelText="No"
            > <Button 
              type="primary" shape="round" 
              icon={<CheckOutlined />} size={'default'}>
              Processed</Button>
              </Popconfirm>
         
      },
      {
        title: 'Print Invoice',
        dataIndex: 'address',
        key: 'address',
        render: (key, dataIndex) => <Link 
        to={{pathname:'/invoice', 
        state:{address:key, order:dataIndex.orders, name:dataIndex.name, number:dataIndex.number, email:dataIndex.email, id:dataIndex.paymentId, date:dataIndex.timestamp, prices:dataIndex.prices, taxes:dataIndex.taxes }}}>

        <Button  type="primary" shape="round" icon={<PrinterOutlined />} size={'default'}>
          Print</Button>
          </Link>
      },
    ];
    return(
      <>
      <Spin spinning={this.state.loading}>
      <Modal title="Enter Tracking Number" visible={this.state.isModalVisible} onOk={() => this.handleOk()} onCancel={()=>this.setState({isModalVisible: false})}>
          <EditValue/>
      </Modal>
     <Table columns={columns} dataSource={this.state.ordersData} />
     </Spin>
   </>
    )  
    
  }
}

export default NewOrders