import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { Button } from 'antd'
import  {Invoice}  from './Invoice';
import { PrinterOutlined } from '@ant-design/icons'

const InvoicePrinter = (props) => {
  const componentRef = useRef();
  console.log(props.location.state)
  const {address, orders, name, number, email, paymentId, timestamp, prices, taxes} = props.location.state
  console.log(address, orders)
  const orderTable = []
  var totalPrice = 0;
  var totalTax = 0;
  let objKeys = Object.keys(orders)
  console.log(objKeys)
  objKeys.forEach(key => {
    let obj={
      name: key,
      qty: orders[key],
      price:prices[key],
      tax: taxes[key]
    }
    totalPrice += prices[key]
    totalTax += taxes[key]
    orderTable.push(obj)
  })
 
  console.log('order:', orderTable)
  return (
    <div>
        
      <ReactToPrint
        trigger={() =><Button type="primary" shape="round" icon={<PrinterOutlined />} /> }
        content={() => componentRef.current}
      />
      <Invoice address={address} order={orderTable} totalPrice={totalPrice} totalTax={totalTax} name={name} number={number} email={email} id={paymentId} date={timestamp} ref={componentRef} />
    </div>
  );
};

export default InvoicePrinter