import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { useCreateUserdataMutation } from "../redux/api/userdataApiSlice";

const Form = () => {
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmout] = useState("");
  const [currency, setCurrency] = useState("");
 
  const navigate = useNavigate();

   
  const [createuserdata] = useCreateUserdataMutation();
  // const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = new FormData();
      userData.append("day", day);
      userData.append("date", date);
      userData.append("name", name);
      userData.append("number", number);
      userData.append("email", email);
      userData.append("amount", amount);
      userData.append("currency", currency);  // Use currency instead of setCurrency



      const { data } = await createuserdata(userData);
      console.log(data)

      if (data.error) {
        toast.error("data creatation failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("data creation failed. Try Again.");
    }
  };

  
  

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl text-center mb-8">Customer Details Form</h1>
   
    
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="day" className="block text-sm font-medium text-gray-600">
            Day
          </label>
          <input
            type="text"
            placeholder="day of the week"
            className="mt-1 p-2 w-full border rounded-md"
            value={day}
            onChange={(e) => setDay(e.target.value)}
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
          <label htmlFor="currency" className="block text-sm font-medium text-gray-600">
            Currency
          </label>
          <select
  className="mt-1 p-2 text-black w-full border rounded-md"
  onChange={(e) => setCurrency(e.target.value)}
  value={currency}
>
  <option className="text-black" value="" >
    Choose Currency
  </option >
  <option value="usd">&#36; - US Dollar</option>
    <option value="eur">&#128; - Euro</option>
    <option value="gbp">&#163; - British Pound</option>
    <option value="jpy">&#165; - Japanese Yen</option>
    <option value="cny">&#165; - Chinese Yuan</option>
    <option value="inr">&#8377; - Indian Rupee</option>
    <option value="ghs">&#8373; - Ghanaian Cedi</option>
    <option value="ngn">&#8358; - Nigerian Naira</option>
    <option value="aud">&#36; - Australian Dollar</option>
    <option value="cad">&#36; - Canadian Dollar</option>
    <option value="chf">&#67; - Swiss Franc</option>
    <option value="sek">&#107; - Swedish Krona</option>
    <option value="nok">&#107; - Norwegian Krone</option>
    <option value="nzd">&#36; - New Zealand Dollar</option>
    <option value="mxn">&#36; - Mexican Peso</option>
    <option value="sgd">&#36; - Singapore Dollar</option>
    <option value="hkd">&#36; - Hong Kong Dollar</option>
    <option value="krw">&#8361; - South Korean Won</option>
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
