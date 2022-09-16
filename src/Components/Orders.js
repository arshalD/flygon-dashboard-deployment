import { Table, Input, Button, Space, DatePicker, message, Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
import firebase from "firebase/app";
import "firebase/firestore"; 
import { SearchOutlined, PrinterOutlined, FilterOutlined, CheckOutlined } from '@ant-design/icons';
import {Component} from 'react'
import {Link} from 'react-router-dom'

const { RangePicker } = DatePicker;
var db
const timeRange = []
var orders = [];

class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      searchedColumn: '',
      ordersData: [],
      sortDate:[],
    };

}
  dataFetch = (endDate, startDate) =>{
    console.log('datafetch')
    orders = []
    db.collection("Orders").where("timestamp", ">=", startDate).where('timestamp', '<=', endDate).where('status', '==', 'processed')
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            orders.push({...doc.data(),docId: doc.id});
            console.log(orders);
        });
        this.setState({ordersData: orders});
    })
  }

  handleSort = ()=>{
    if(timeRange.length !== 2){
      message.error('Please select a date range!')
    }
    else{
      this.dataFetch(timeRange[1], timeRange[0])
      if(orders.length === 0){
        this.setState({ordersData: []})
      }
    }
    console.log("handlesort", timeRange)
  }

  componentDidMount() {
    db = firebase.firestore();
    const yesterday = new Date(Date.now() - 86400000);
    const today = new Date(Date.now())
    const todayTimestamp = Date.parse(today)/1000
    const yesterdayTimestamp = Date.parse(yesterday)/1000
    console.log(yesterdayTimestamp, yesterday)
    console.log(todayTimestamp, today)
    this.dataFetch(todayTimestamp, yesterdayTimestamp)
    console.log("data ", this.state.ordersData)
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

  onChange(value, dateString) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    timeRange.length = 0;
    dateString.forEach(date => {
      console.log('parsed date',Date.parse(date))
      timeRange.push(Date.parse(date)/1000)
    })
    console.log('Time Range: ', timeRange)
  }

  onOk(value) {
    console.log('onOk: ', value);
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
        title: 'Order Time (mm/dd/yyyy) ',
        dataIndex: 'timestamp',
        key: 'timestamp',
        width: '20%',
        sorter: (a, b) => a.timestamp.length - b.timestamp.length,
        sortDirections: ['descend', 'ascend'],
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
      },
      {
        title: 'Print Invoice',
        dataIndex: 'address',
        key: 'address',
        render: (key,dataIndex) => <Link to={{pathname:'/invoice', state:dataIndex}}><Button  type="primary" shape="round" icon={<PrinterOutlined />} size={'default'}>
          Print</Button>
          </Link>
      },
    ];
    return(
      <>
      <RangePicker
      showTime={{ format: 'HH:mm' }}
      format="YYYY-MM-DD HH:mm"
      onChange={this.onChange}
      onOk={this.onOk}
      style={{marginBottom:'25px'}}
    />
        <Button onClick={() =>this.handleSort()} type="primary" icon={<FilterOutlined />} size={'default'}>
          Sort
        </Button>
     <Table columns={columns} dataSource={this.state.ordersData} />
   </>
    )  
    
  }
}

export default Orders