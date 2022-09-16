import { Table, Input, Button, Space, Popconfirm, message, Spin, Modal, InputNumber, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import firebase from "firebase/app";
import "firebase/firestore"; 
import { SearchOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {Component} from 'react'
import { Link } from 'react-router-dom'

const children = ['Street Light']; 
const { Option } = Select;
var db
var products = []
var productsName = []
var deals = []
var docToBeEdited = '';
var getValue 
var getItem = ''
var newTags
var newDeal = ''
const EditValue = () => {
  const onChange = (value)=> {
    console.log('changed', value);
    getValue = value;
  }
  return (
    <InputNumber min={1} onChange={onChange} />
  )
}
const AddDeal = (props) => {
  const onChange = (value)=> {
    console.log('changed', value);
    getItem = value;
  }
  return (
    <Select style={{ width: '100%' }} onChange={onChange} >
               {props.names.map(item =>{
                   return (
                    <Option key={item}>{item}</Option>
                   )
               })}
    </Select>
  )
}

class Deals extends Component {
  state = {
    searchText: '',
    searchedColumn: '',
    productData: [],
    loading: false,
    isPriceModalVisible:false,
    isOfferModalVisible:false,
    isItemsModalVisible:false,
    isTagsModalVisible:false,
    ischargesKeralaModalVisible: false,
    ischargesOtherModalVisible: false,
  };

  dataFetch = () =>{
    console.log('datafetch')
    db.collection("products")
    .get()
    .then((querySnapshot) => {
      products = []
      querySnapshot.forEach((doc) => {
        products.push({...doc.data(),docId: doc.id});
        console.log(products);
        console.log(this.state.productData)
    })
        
    }).then(() => {
      deals = [];
        products.forEach(product => {
            if (product.category === 'Deals'){
                deals.push(product)
              }
            productsName.push(product.name);
        })
        this.setState({productData: deals});
        this.forceUpdate()
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
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

  componentDidMount() {
    db = firebase.firestore();
    if(this.state.productData.length === 0) {
      this.dataFetch()
    }
  }

  confirm(status,docId) {
    this.setState({loading: true});
    console.log('done')
    if(status)
    {this.markUnavailable(docId);  }
    else  { this.markAvailable(docId);}
  }

  confirmDelete(docId) {
    this.setState({loading: true});
    db.collection("products").doc(docId).delete().then(() => {
      message.success("Product successfully deleted!");
      this.setState({loading: false})
      this.dataFetch()
  }).catch((error) => {
      message.error("Error removing product: ", error);
      this.setState({loading: false})
      this.dataFetch()
  });
  }
  
  cancel() {
    console.log('clicked cancel');
  }

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
  handlePriceChange = (docId,item)=>{
    docToBeEdited = docId;
    console.log('docToBeEdited',docToBeEdited);
    if (item === 'price')
    this.setState({ isPriceModalVisible: true });
    if (item === 'offer')
    this.setState({ isOfferModalVisible: true })
    if (item === 'tax')
    this.setState({ isTaxModalVisible: true })
    if (item === 'chargesKerala')
    this.setState({ ischargesKeralaModalVisible: true })
    if (item === 'chargesOther')
    this.setState({ ischargesOtherModalVisible: true })
  }

  handlePriceOk = () => {//function to edit price or offer called from modal
    if(getValue===null){
      message.error('Please enter a price!')
    }
    else{
      this.setState({loading: true,isPriceModalVisible: false});
      console.log(getValue)
      db.collection("products").doc(docToBeEdited).update({
        "price": getValue,
    })
    .then(() => {
        message.success("Product price updated");
        this.dataFetch()
        this.setState({loading: false});
    });
    }
  }

  handleOfferOk = () => {//function to edit price or offer called from modal
    if(getValue===null){
      message.error('Please enter a number!')
    }
    else{
      this.setState({loading: true,isOfferModalVisible: false});
      console.log(getValue)
      db.collection("products").doc(docToBeEdited).update({
        "offer": getValue,
    })
    .then(() => {
        message.success("Offer updated");
        this.dataFetch()
        this.setState({loading: false});
    });
    }
  }

  handleChargesKeralaOk = () => {//function to edit price or offer called from modal
    if(getValue===null){
      message.error('Please enter a number!')
    }
    else{
      this.setState({loading: true,ischargesKeralaModalVisible: false});
      console.log(getValue)
      db.collection("products").doc(docToBeEdited).update({
        "chargesKerala": getValue,
    })
    .then(() => {
        message.success("Delivery Charge Updated");
        this.dataFetch()
        this.setState({loading: false});
    });
    }
  }
  handleChargesOtherOk = () => {//function to edit price or offer called from modal
    if(getValue===null){
      message.error('Please enter a number!')
    }
    else{
      this.setState({loading: true,ischargesOtherModalVisible: false});
      console.log(getValue)
      db.collection("products").doc(docToBeEdited).update({
        "chargesOther": getValue,
    })
    .then(() => {
        message.success("Tax Percentage updated");
        this.dataFetch()
        this.setState({loading: false});
    });
    }
  }
  handleItemsOk = () => {
    if(getItem == null){
      message.error('Please select an item')
    }
    else{
      this.setState({loading: true,isItemsModalVisible:false});
      products.forEach(product => {
        if(product.name === getItem){
          newDeal = product;
          newDeal.category = 'Deals'
          console.log(newDeal);
        }
      });
      db.collection("products").add(newDeal).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        message.success("Deal added successfully !");
        this.dataFetch();
        this.setState({loading: false})
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        this.setState({loading: false})
        message.error(error)
    });
    }
  }
  showAddDeal = () => {
    console.log('called')
    this.setState({isItemsModalVisible: true});
  }
  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (key, dataIndex)=><Button 
        shape="round"
        onClick={() =>this.handlePriceChange(dataIndex.docId,'price')} 
        size={'default'}>
        {key}</Button>
      },
      {
        title: 'Offer',
        dataIndex: 'offer',
        key: 'offer',
        render: (key, dataIndex)=><Button 
        shape="round"
        onClick={() =>this.handlePriceChange(dataIndex.docId,'offer')} 
        size={'default'}>
        {key}</Button>
      },
      {
        title: 'Delivery Charge in Kerala',
        dataIndex: 'chargesKerala',
        key: 'chargesKerala',
        render: (key, dataIndex)=><Button 
        shape="round"
        onClick={() =>this.handlePriceChange(dataIndex.docId,'chargesKerala')} 
        size={'default'}>
        {key}</Button>
      },
      {
        title: 'Delivery Charge outside Kerala',
        dataIndex: 'chargesOther',
        key: 'chargesOther',
        render: (key, dataIndex)=><Button 
        shape="round"
        onClick={() =>this.handlePriceChange(dataIndex.docId,'chargesOther')} 
        size={'default'}>
        {key}</Button>
      },
      {
        title: 'Delete',
        dataIndex: 'docId',
        key: 'docId',
        render: (key) =><Popconfirm
        title="Are you sure to delete the product?"
        onConfirm={()=>this.confirmDelete(key)}
        onCancel={()=>this.cancel()}
        okText="Yes"
        cancelText="No"
        > <Button 
          danger shape="round" 
          size={'default'}>
          Delete</Button>
          </Popconfirm>
      },
    ];
    return (
      <>
      <Button type="primary" shape="round" icon={<PlusCircleOutlined />} 
      size={'large'}
      style={{marginBottom : '25px'}}
      onClick={() =>{this.showAddDeal()}}
      >
        Add Deal
      </Button>
      <Spin spinning={this.state.loading}>
      <Modal title="Edit Price" visible={this.state.isPriceModalVisible} onOk={() => this.handlePriceOk()} onCancel={()=>this.setState({isPriceModalVisible: false})}>
          <EditValue/>
      </Modal>
      <Modal title="Edit Offer" visible={this.state.isOfferModalVisible} onOk={() => this.handleOfferOk()} onCancel={()=>this.setState({isOfferModalVisible:false})}>
          <EditValue/>
      </Modal>
      <Modal title="Edit Delivery Charges" visible={this.state.ischargesKeralaModalVisible} onOk={() => this.handleChargesKeralaOk()} onCancel={()=>this.setState({ischargesKeralaModalVisible:false})}>
          <EditValue/>
      </Modal>
      <Modal title="Edit Delivery Charges" visible={this.state.ischargesOtherModalVisible} onOk={() => this.handleChargesOtherOk()} onCancel={()=>this.setState({ischargesOtherModalVisible:false})}>
          <EditValue/>
      </Modal>
      <Modal title="Add Items" visible={this.state.isItemsModalVisible} onOk={()=>this.handleItemsOk()} onCancel={()=>this.setState({isItemsModalVisible:false})}>
          <AddDeal names={productsName} />
      </Modal>
      <Table columns={columns} dataSource={this.state.productData} />
      </Spin>
      </>
    )
  }
}

export default Deals
