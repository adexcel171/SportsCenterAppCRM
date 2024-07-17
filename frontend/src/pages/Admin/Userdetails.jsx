import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useGetUserdataDetailsQuery,
    useDeleteUserdataMutation,
    useUpdateUserdataMutation,
  } from "../../redux/api/userdataApiSlice";

const Userdetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Fetch user data using RTK Query
  const { data: userdata, error } = useGetUserdataDetailsQuery(params.id);
  

  // Define the update user data mutation
  const [updateUserdata] = useUpdateUserdataMutation();

  // Define the delete user data mutation
  const [deleteUserdata] = useDeleteUserdataMutation();

  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmout] = useState("");
  const [currency, setCurrency] = useState("");
  const [formattedDate, setFormattedDate] = useState('');

    // const navigate = useNavigate();
    // const params = useParams();
 
  useEffect(() => {
    if (userdata && userdata._id) {
      setDay(userdata.day);
      setDate(userdata.date);
      setName(userdata.name);
      setNumber(userdata.number);
      setEmail(userdata.email);
      setAmout(userdata.amount);
      setCurrency(userdata.currency);
    }
  }, [userdata]);

  useEffect(() => {
    if (date) {
        setFormattedDate(date.split('T')[0]);
    }
}, [date]);

  

 
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formattedDate = date.split('T')[0]; // Format date to "yyyy-MM-dd"

        const userData = new FormData();
        userData.append("day", day);
        userData.append("date", formattedDate);
        userData.append("name", name);
        userData.append("number", number);
        userData.append("email", email);
        userData.append("amount", amount);
        userData.append("currency", currency);

        // Ensure all required fields are present
        if (!name) {
            throw new Error('Name is required');
        }

        const { data } = await updateUserdata({ userdataId: params.id, userData });

        if (data?.error) {
            toast.error(data.error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        } else {
            toast.success("User data successfully updated", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            navigate("/");
        }
    } catch (err) {
        console.log(err);
        toast.error(err.message || "User data update failed. Try again.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
        });
    }
};
  const handleDelete = async () => {
    try {
      let answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;
  
      const { data } = await deleteUserdata(params.id );
      toast.success(`"${data.name}" is deleted`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div className="container xl:mx-[] sm:mx-[2px] mt-10">
        <div className="flex  flex-col md:flex-row justify-center items-center">
        
          <div className="md:w-3/4 p-3">
            <div className="h-12 mt-6 text-center font-bold text-2xl">Update / Delete Product</div>

            
            <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="day" className="block text-sm font-medium text-gray-600">
            Day
          </label>
          <input
          
            type="text"
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
            value={formattedDate}
            // value={date}
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
  <option value="basic">Basic</option>
  <option value="standard">Standard</option>
  <option value="premium">Premium</option>
</select>
        </div>

              <div className=" mb-10">
                <button
                  // onClick={handleSubmit}
                  type="submit"
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-green-600 mr-6"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-blue-600"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Userdetails;
