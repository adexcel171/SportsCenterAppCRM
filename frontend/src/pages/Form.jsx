import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCreateUserdataMutation } from "../redux/api/userdataApiSlice";

const Form = () => {
  
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmout] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [currency, setCurrency] = useState("");
 
  const navigate = useNavigate();

   
  const [createuserdata] = useCreateUserdataMutation();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = new FormData();
      userData.append("name", name);
      userData.append("number", number);
      userData.append("email", email);
      userData.append("amount", amount);
      userData.append("note", note);
      userData.append("date", date);
      userData.append("currency", currency);  // Use currency instead of setCurrency



      const { data } = await createuserdata(userData);
      

      if (data.error) {
        toast.error("data creatation failed. Try Again."); 
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("data creation failed. Try Again.");
    }
  };

  
  

  return (
    <div className="container mx-auto p-8 mt-8">
      <h1 className="text-4xl text-center mb-8">Customer Details Form</h1>
   
    
      <form className="max-w-md mx-auto" >
       

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="enter name"
            className="mt-1 p-2 w-full border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="number" className="block text-sm font-medium text-gray-600">
            Number
          </label>
          <input
            type="text"
            id="number"
            name="number"
            placeholder="enter number..."
            className="mt-1 p-2 w-full border rounded-md"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            // id="email"
            name="email"
            placeholder="enter email address..."
            className="mt-1 p-2 w-full border rounded-md"
            value={email}
             onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-600">
            Amount
          </label>
          <input
            type="text"
            placeholder="enter amount"
            id="amount"
            name="amount"
            className="mt-1 p-2 w-full border rounded-md"
            value={amount}
            onChange={(e) => setAmout(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="day" className="block text-sm font-medium text-gray-600">
            Note
          </label>
          <input
            type="text"
            placeholder="enter note"
            className="mt-1 p-2 w-full border rounded-md"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-600">
            Date
          </label>
          <input
            
        type="date"
            name="date"
            className="mt-1 p-2 w-full border rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-600">
            Subscription
          </label>
          <select
  className="mt-1 p-2 text-black w-full border rounded-md"
  onChange={(e) => setCurrency(e.target.value)}
  value={currency}
>
  <option className="text-black" value="" >
    Choose Subscription
  </option >
 
    <option value="basic">Basic</option>
  <option value="standard">Standard</option>
  <option value="premium">Premium</option>
</select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white mb-8 p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>

    
      
    </div>
  );
};

export default Form;
