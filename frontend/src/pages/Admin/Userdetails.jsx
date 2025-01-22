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

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [credit, setCredit] = useState("");
  const [debit, setDebit] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [currency, setCurrency] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (userdata && userdata._id) {
      setName(userdata.name);
      setNumber(userdata.number);
      setCredit(userdata.credit);
      setDebit(userdata.debit);
      setNote(userdata.note);
      setDate(userdata.date);
      setCurrency(userdata.currency);
    }
  }, [userdata]);

  useEffect(() => {
    if (date) {
      setFormattedDate(date.split("T")[0]);
    }
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name,
        number,
        credit,
        debit,
        note,
        date,
        currency,
      };

      console.log("Updating user data:", userData); // Log the data being sent

      const { data } = await updateUserdata({
        userdataId: params.id,
        ...userData,
      });

      console.log("Response data:", data); // Log the response data

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
      console.log("Error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const result = await deleteUserdata(params.id);
      console.log(result);

      if (result.error) {
        throw new Error(result.error.message);
      }

      const { data } = result;
      if (data && data.name) {
        toast.success(`"${data.name}" is deleted`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/");
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container xl:mx-[] sm:mx-[2px] mt-10">
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="md:w-3/4 p-3">
          <div className="h-12 mt-6 text-center font-bold text-2xl">
            Update and Delete Product
          </div>
          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
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
              <label
                htmlFor="number"
                className="block text-sm font-medium text-gray-600"
              >
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
              <label
                htmlFor="credit"
                className="block text-sm font-medium text-gray-600"
              >
                Credit
              </label>
              <input
                type="credit"
                name="credit"
                className="mt-1 p-2 w-full border rounded-md"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="debit"
                className="block text-sm font-medium text-gray-600"
              >
                Debit
              </label>
              <input
                type="text"
                id="debit"
                name="debit"
                className="mt-1 p-2 w-full border rounded-md"
                value={debit}
                onChange={(e) => setDebit(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-600"
              >
                Note
              </label>
              <input
                type="text"
                placeholder="edit notes..."
                className="mt-1 p-2 w-full border rounded-md"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-600"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                className="mt-1 p-2 w-full border rounded-md"
                value={formattedDate}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-600"
              >
                Currency
              </label>
              <select
                className="mt-1 p-2 text-black w-full border rounded-md"
                onChange={(e) => setCurrency(e.target.value)}
                value={currency}
              >
                <option className="text-black" value="">
                  Choose Subscription
                </option>
                <option>Weekly</option>
                <option> Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <div className="mb-10">
              <button
                type="submit"
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 mr-6"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-blue-600"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Userdetails;
