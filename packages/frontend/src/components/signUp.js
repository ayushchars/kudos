import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASEURL}/auth/register`, { name, email });

            const resData = response.data
            console.log(resData,"dssd")
            if(resData.status ===1 ){
                navigate("/")
              
            }

        } catch (err) {
            console.error("Error during login:", err);
        }
    };

    const token = localStorage.getItem("token");
    useEffect(() => {
        if (token) {
          navigate("/Dashbord");
        }
      }, []);

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome to KudoSpot</h1>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                    >
                        register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
