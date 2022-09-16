import {useState, createContext, useEffect} from "react";


export const OrdersContext = createContext()

export const OrdersProvider = (props) =>{
    const ordersData = props.order || []
    console.log(ordersData)
    const [orders, setorders] = useState([]);
    useEffect(() =>{
        setorders(ordersData)
    },
    [ordersData])

    return (
        <OrdersContext.Provider value={[orders, setorders]}>
            {props.children}
        </OrdersContext.Provider>
    )
}