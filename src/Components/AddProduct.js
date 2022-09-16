import React, { useState, useEffect, useReducer } from 'react';
import {
  Form, Spin,
  Input,
  Button,
  Select, Space,
  InputNumber,
  message,
} from 'antd';
import AddImage from './AddImage'
import firebase from "firebase/app";
import {PlusCircleOutlined,MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
const { Option } = Select;
const imageUrls = []
const children = ['Street Light']; 
var  db

const AddProduct = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [dataArray, setDataArray] = useState([])
  const dataFetch = () =>{
    var docRef = db.collection("category").doc("category");

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                let catData = Object.keys(doc.data());
                setDataArray(catData)
                forceUpdate()

            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

  useEffect(() =>{
    db = firebase.firestore();
    dataFetch()
  },[])
  const [form] = Form.useForm();
  const [componentSize, setComponentSize] = useState('large');
  const [spin, setSpin] = useState(false);
  const [buttonSpin, setButtonSpin] = useState(false);

  const onFinish = (item) => {
    if (imageUrls.length > 0) {
      console.log(item);
      setButtonSpin(true);
      let lowercaseTags = item.searchTags.map((item)=>{
        return item.toLowerCase();
      })
      db.collection("products").doc(item.productName).set({
        category: item.category,
        description: item.description,
        imgUrl: imageUrls[0],
        name: item.productName,
        offer: item.offer,
        price: item.price,
        tax:item.tax,
        chargesKerala: item.chargesKerala,
        chargesOther: item.chargesOther,
        tags:lowercaseTags,
        images : imageUrls,
        status:true
      })
      .then((docRef) => {
          message.success('Product added successfully!')
          form.resetFields();
          setButtonSpin(false)
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
          setButtonSpin(false)
          message.warning('Error adding product: ', error)
      });
    }
    else{
      message.warning('Please wait for images to be uploaded')
    }
  };
  const spinner = ()=>{
    setSpin(true)
  }
  const addImages = (url,listLength) => {
    console.log(listLength)
    imageUrls.push(url);
    if(imageUrls.length === listLength) setSpin(false);
    console.log('urls ', imageUrls)
  }
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const handleChange = (value)=> {
    console.log(`selected ${value}`);
  }

  return (
    <>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: 'large',
        }}
        form={form}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        onFinish={onFinish}
      >

        <Form.Item label="Name of Product"
        name='productName'
        rules={[
          {
            required: true,
          },
        ]}>
          <Input />
        </Form.Item>
        <Form.Item label="Upload Images" name='images' rules={[
          {
            required: true,
          },
        ]}>
        <Spin spinning={spin}>
          <AddImage addImages={addImages} spinner={spinner} />
        </Spin>  
        </Form.Item >
        <Form.Item label="Category"
         name="category"
         rules={[
          {
            required: true,
          },
        ]}>
          <Select>
            {dataArray.map((category, i) =>{
              return <Select.Option value={category}>{category}</Select.Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Price" name="price" rules={[
          {
            required: true,
          },
        ]}>
            <InputNumber />
        </Form.Item>
        <Form.Item label="Offer" name="offer" rules={[
          {
            required: true,
          },
        ]}>
            <InputNumber />
        </Form.Item>
        <Form.Item label="Tax Percentage" name="tax" rules={[
          {
            required: true,
          },
        ]}>
            <InputNumber />
        </Form.Item>
        <Form.Item label="Delivery Charge inside Kerala" name="chargesKerala" rules={[
          {
            required: true,
          },
        ]}>
            <InputNumber />
        </Form.Item>
        <Form.Item label="Delivery Charge outside Kerala" name="chargesOther" rules={[
          {
            required: true,
          },
        ]}>
            <InputNumber />
        </Form.Item>

        <Form.List name="description">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'specName']}
                  fieldKey={[fieldKey, 'specName']}
                  rules={[{ required: true, message: 'Missing specification name' }]}
                >
                  <Input placeholder="Spec Name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'specInfo']}
                  fieldKey={[fieldKey, 'specInfo']}
                  rules={[{ required: true, message: 'Missing specification' }]}
                >
                  <Input placeholder="Specification" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

        <Form.Item label="Youtube Video Id" name="youtubeVideoId" rules={[
          {
            required: true,
          },
        ]}>
          <Input />
        </Form.Item>
        <Form.Item label="Search Tags" name='searchTags' rules={[
          {
            required: true,
          },
        ]}>
            <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>
               {children.map(item =>{
                   return (
                    <Option key={item}>{item}</Option>
                   )
               })}
            </Select>        
        </Form.Item>
        <Form.Item>
        <Spin spinning={buttonSpin}>
          <Button type="primary"  htmlType="submit" icon={<PlusCircleOutlined />}>Add</Button>
        </Spin>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddProduct