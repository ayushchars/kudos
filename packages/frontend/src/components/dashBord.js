import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

function DashBoard() {
  const [kudosFeed, setkudosFeed] = useState([]);
  const [likedKudosIds, setLikedKudosIds] = useState([]);

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/kudos/getKudosFeed`);
      const resData = response.data;
      if (resData.status === 1) {
        setkudosFeed(resData.data);
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  const fetchLikedKudos = async () => {
    const userId = localStorage.getItem("user");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASEURL}/kudos/getLikedKudos`, { userId });
      const resData = response.data;
      if (resData.status === 1) {
        const likedIds = resData.data.map((kudo) => kudo._id);
        setLikedKudosIds(likedIds);
      }
    } catch (err) {
      console.error("Error fetching liked kudos:", err);
    }
  };

  useEffect(() => {
    handleLogin();
    fetchLikedKudos();
  }, []);

  const toggleLike = async (kudoId, like) => {
    const userId = localStorage.getItem("user");
    try {
      const payload = { kudoId, userId, like };
      const response = await axios.post(`${process.env.REACT_APP_BASEURL}/kudos/likeKudos`, payload);
      const resData = response.data;
      if (resData.status === 1) {
        setLikedKudosIds((prevLikedIds) =>
          like ? [...prevLikedIds, kudoId] : prevLikedIds.filter((id) => id !== kudoId)
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const username = localStorage.getItem("usename")

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Welcome, {username}!</h1>

      <div className="mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          onClick={() => navigate("/Kudos")}
        >
          Give Kudo
        </button>
      </div>

      <div className="bg-white p-4 shadow-md rounded-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Kudos Feed</h2>
        <div className="space-y-4">
          {kudosFeed.map((kudo) => (
            <div
              key={kudo.id}
              className="p-4 border border-gray-200 rounded-md flex items-center justify-between"
            >
              <div>
                <p className="text-gray-800 font-medium">
                  <span className="font-bold">{kudo.sender}</span> gave{' '}
                  <span className="font-bold">"{kudo.badge}"</span> Badge to{' '}
                  <span className="font-bold">{kudo.receiver}</span>
                </p>
                <p className="text-gray-600">{kudo.message}</p>
              </div>

              <button
                className="text-red-500 hover:text-red-600 transition duration-300 text-2xl"
                onClick={() => toggleLike(kudo?.id, !likedKudosIds.includes(kudo.id))}
              >
                {likedKudosIds.includes(kudo.id) ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          onClick={() => navigate("/Analytics")}
        >
          Analytics
        </button>
      </div>
    </div>
  );
}

export default DashBoard;
