import React, { useContext, useState } from 'react'
import userCart from '../../hooks/userCart';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { AuthContext } from '../../contexts/AuthProvider';

const CartPage = () => {
  const [cart, refetch] = userCart();
  const {user} = useContext(AuthContext);
  const [cartItems, setCartitems] = useState([]);
  //calculate price
  const calculatePrice = (item) => {
    return item.price * item.quantity
  }


  //handle decrese function
  const handleDecrease = (item) => {
   if(item.quantity > 1){
    fetch(`http://localhost:6001/carts/${item._id}`, {
        method: "PUT",
        headers: {
           "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({quantity: item.quantity - 1 })
      }).then((res) => res.json()).then((data) => {
        const updatedCart = cartItems.map((cartItem)=> {
          if(cartItem.id === item.id){
            return {
              ...cartItem,
              quantity: cartItem.quantity - 1
            }
          }
          return cartItem;
        })
        refetch();
        setCartitems(updatedCart)
      });
      refetch();
   } else{
    alert("quantity can not be 0");
   }
  }
  //handle increase function
  const handleIncrease = (item) => {
      fetch(`http://localhost:6001/carts/${item._id}`, {
        method: "PUT",
        headers: {
           "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({quantity: item.quantity + 1})
      }).then((res) => res.json()).then((data) => {
        const updatedCart = cartItems.map((cartItem)=> {
          if(cartItem.id === item.id){
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1
            }
          }
          return cartItem;
        })
        refetch();
        setCartitems(updatedCart)
      });
      refetch();
  }
//handle delete btn
const handleDelete = (item) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:6001/carts/${item._id}`, {
        method: "DELETE"
      }).then(res=> res.json()).then(data => {
        if(data.deletedCount > 0){
          refetch()
          Swal.fire({
            title: "Deleted!",
            text: "Your item has been deleted",
            icon: "success"
          });
        }
      })
    }
  });
}
// calculate total price
const cartSubTotal = cart.reduce((total, item)=> {
    return total + calculatePrice(item);
}, 0);

const orderTotal = cartSubTotal;

  return (
    <div className='section-container'>


        {/* banner */}
       <div className="bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
      <div className="py-36 flex flex-col  items-center justify-center gap-8">

     
        

        {/* texts */}
        <div className="px-4 space-y-7">
        <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
            Items Added to the <span className="text-green">Cart</span>
          </h2>
          <p className="text-[#4A4A4A] text-xl">
            Where Each Plate Weaves a Story of Culinary Mastery and Passionate
            Craftsmanship
          </p>
          <button className="bg-green font-semibold btn text-white px-8 py-3 rounded-full">
            Order Now
          </button>
        </div>
        
      </div>
    </div>

    {/* table for the cart*/}
    <div>
    <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead className='bg-green text-white rounded-sm'>
      <tr>
        <th>#</th>
        <th>Food</th>
        <th>Item Name</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      
     {
      cart.map((item,index)=> (<tr key={index}>
        <td>{index+1}</td>
         <td>
           <div className="flex items-center gap-3">
             <div className="avatar">
               <div className="mask mask-squircle w-12 h-12">
                 <img src={item.image}
                 alt="" />
               </div>
             </div>
             
           </div>
         </td>
         <td className='font-medium'>
          {item.name}
         </td>
         <td><button className='btn btn-xs' onClick={()=>handleDecrease(item)}>-</button>
         <input type="number" className='w-10 mx-2 text-center overflow-hidden appearance-none' value={item.quantity}
         onChange={() => caonsole.log(item.quantity)} />
         <button className='btn btn-xs' onClick={()=> handleIncrease(item)}>+</button>
         </td>
         <td>${calculatePrice(item).toFixed(2)}</td>
         <th>
           <button className="btn btn-ghost text-red btn-xs" onClick={()=> handleDelete(item)}><FaTrash/></button>
         </th>
       </tr>))
     }
    </tbody>
    
  
    
  </table>
</div>
    </div>
      {/* cutomer details */}
      <div className='my-12 flex flex-col md:flex-row justify-between items-start'>
        <div className='md:w-1/2 spacw-y-3'>
          <h3 className='font-medium'>
            Customer Details
          </h3>
          <p>Name: {user?.displayName}</p>
          <p>Email: {user?.email}</p>
          <p>User_id: {user?.uid}</p>
          
        </div>
        <div className='md:w-1/2 spacw-y-3'>
        <h3 className='font-medium'>
            Shopping Details
          </h3>
          <p>Total Items: {cart.length}</p>
          <p>Total Price: {orderTotal.toFixed(2)}</p>
          <button className='btn bg-green text-white'>Proceed checkout</button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
