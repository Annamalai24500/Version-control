import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Register() {
   const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    const res = await axios.post('http://localhost:5001/api/users/register',{name,email,password});
    if(res.data.success && res.data.token){
      localStorage.setItem("token",res.data.token);
      navigate("/");
    }
    else{
      console.log("registration failed");
    }
    }catch(error){
      console.log(error.message);
    }
  
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          onChange={(e)=>{setname(e.target.value)}}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          onChange={(e)=>{setemail(e.target.value)}}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          onChange={(e)=>{setpassword(e.target.value)}}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
