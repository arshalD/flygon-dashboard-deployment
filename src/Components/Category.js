import { List, Image, Button, message, Popconfirm, Modal, Spin, Select, Input } from 'antd';
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

const Category = ()=> {
    const [visible, setVisible] = useState(false);
    const [spin, setSpin] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [loading, setLoading] = useState(false)
    const [catName, setCatName] = useState('')
    const [data, setData] = useState({})
    const [dataArray, setDataArray] = useState([])

    const dataFetch = () =>{
        var docRef = db.collection("category").doc("category");

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                let catData = Object.keys(doc.data());
                setData(doc.data())
                setDataArray(catData)

            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
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
        if(catName.length === 0){
            message.error('Please enter the name of the category')
        }
        else{
            setConfirmLoading(true);
            let catRef = db.collection("category").doc("category");
            return catRef.update({
                [catName]: {
                    image: imageUrls[0],
                    name: catName,
                }
            })
            .then(() => {
                console.log("Document successfully updated!");
                message.success('Category added successfully!')
                  setConfirmLoading(false)
                  setVisible(false)
                  dataFetch()
            })
            .catch((error) => {
                setConfirmLoading(false)
                  message.warning(error)
                  setVisible(false)
                console.error("Error updating document: ", error);
            });
        }
      };

    const handleChange = (value)=> {
        console.log(`selected ${value}`);
        tags.push(value);
      }
    const confirm = (docId)=> {
        setLoading(true)
        db.collection("products").where("category", "==", docId)
        .get()
        .then((querySnapshot) => {
            if(querySnapshot.length === 0){
                let catRef = db.collection("category").doc("category");
                return catRef.update({
                    [docId]: firebase.firestore.FieldValue.delete()
                })
                .then(() => {
                    message.success("Category successfully deleted!");
                    setLoading(false)
                    dataFetch()
                }).catch((error) => {
                    message.error("Error removing category: ", error);
                    setLoading(false)
                    dataFetch()
                });
            }
            else{
                message.error("Error removing category! Please remove all products belonging to this category",);
                setLoading(false)
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        
      }
      
    const cancel = ()=>{
        console.log("Cancelled")
      }

    return (
        <>  
        <Spin spinning={loading}>
            <Modal
            title="Add a new Category"
            visible={visible}
            onOk={()=>handleOk()}
            confirmLoading={confirmLoading}
            onCancel={() =>setVisible(false)}
        > 
          <Spin spinning={spin}>
          <AddImage addImages={addImages} spinner={spinner} />
          <p style={{marginTop:'45px', fontWeight:'100'}}>Category Name</p>
          <Input placeholder="Enter name of the Category" onChange={(e) =>{
            setCatName(e.target.value); console.log(e.target.value)
          }}/>
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
                dataSource={dataArray}
                renderItem={item => (
                <List.Item
                actions={[<Popconfirm
                    title="Are you sure to delete this item"
                    onConfirm={()=>confirm(item)}
                    onCancel={()=>cancel}
                    okText="Yes"
                    cancelText="No"
                    ><a>delete</a></Popconfirm>]}>
                    <Image
                        width={200}
                        src={data[item].image}
                        />
                    <h4>{item}</h4>
                </List.Item>
                )}
            />
            </Spin>
        </>
    )
}

export default Category