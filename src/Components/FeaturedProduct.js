import { List, Image, Button, message, Popconfirm, Modal, Spin, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import firebase from "firebase/app";
import "firebase/firestore"; 
import AddImage from './AddImage'

const children = ['Street Light']; 
const { Option } = Select;

var data;
var db;
var tags =[]
const imageUrls = []

const FeaturedProduct = ()=> {
    const [visible, setVisible] = useState(false);
    const [spin, setSpin] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [loading, setLoading] = useState(false)
    const [featuredProduct, setFeaturedProduct] = useState([])

    const dataFetch = () =>{
        console.log('datafetch')
        db.collection("featuredProduct")
        .get()
        .then((querySnapshot) => {
          data = []
          querySnapshot.forEach((doc) => {
            data.push({...doc.data(),docId: doc.id});
            console.log(data);
        });
            setFeaturedProduct(data)
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
      }

    useEffect(()=>{
         db = firebase.firestore();
         dataFetch()
    },[])
    const spinner = ()=>{
        setSpin(true)
      }
    const addImages = (url,listLength) => {
        console.log(listLength)
        imageUrls.push(url);
        setSpin(false)
        console.log(imageUrls[0])
      }
    const handleOk = () => {

        if(imageUrls.length === 0){
            message.error('Please upload image !')
        }
        else
        if(tags.length === 0){
            message.error('Please enter a search tag')
        }
        else{
            console.log('tags',tags)
            setConfirmLoading(true);
            db.collection("featuredProduct").add({
                imgUrl: imageUrls[0],
                tags: tags[0],
              })
              .then((docRef) => {
                  message.success('Item added successfully!')
                  setConfirmLoading(false)
                  setVisible(false)
                  dataFetch()
              })
              .catch((error) => {
                 setConfirmLoading(false)
                  message.warning(error)
                  setVisible(false)
              });
        }

      };

    const handleChange = (value)=> {
        console.log(`selected ${value}`);
        tags.push(value);
      }
    const confirm = (docId)=> {
        setLoading(true)
        db.collection("featuredProduct").doc(docId).delete().then(() => {
            message.success("Item successfully deleted!");
            setLoading(false)
            dataFetch()
        }).catch((error) => {
            message.error("Error removing product: ", error);
            setLoading(false)
            dataFetch()
        });
      }
      
    const cancel = ()=>{
        console.log("Cancelled")
      }

    return (
        <>  
        <Spin spinning={loading}>
            <Modal
            title="Add a Featured Product"
            visible={visible}
            onOk={()=>handleOk()}
            confirmLoading={confirmLoading}
            onCancel={() =>setVisible(false)}
        > 
          <Spin spinning={spin}>
          <AddImage addImages={addImages} spinner={spinner} />
          <p style={{marginTop:'45px', fontWeight:'100'}}>Search Tags</p>
          <Select mode="tags" style={{ marginTop:'5px',width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>
               {children.map(item =>{
                   return (
                    <Option key={item}>{item}</Option>
                   )
               })}
            </Select>  
          </Spin>
        </Modal>  
        <Button type="primary" shape="round" icon={<PlusCircleOutlined />} 
            size={'large'}
            style={{marginBottom : '25px'}}
            onClick={() =>{setVisible(true)}}
            >
            Add 
            </Button>
            <List
                itemLayout="horizontal"
                dataSource={featuredProduct}
                renderItem={item => (
                <List.Item
                actions={[<Popconfirm
                    title="Are you sure to delete this item"
                    onConfirm={()=>confirm(item.docId)}
                    onCancel={()=>cancel}
                    okText="Yes"
                    cancelText="No"
                    ><a>delete</a></Popconfirm>]}>
                    <Image
                        width={800}
                        src={item.imgUrl}
                        />
                </List.Item>
                )}
            />
            </Spin>
        </>
    )
}

export default FeaturedProduct