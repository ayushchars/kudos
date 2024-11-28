import React, { useEffect, useState } from 'react';
import BarChart from './barChart';
import LeadingBoard from './leadingBords';
import axios from 'axios';

function Analytics() {

  const [mostLiked, setmostLiked] = useState([])
  const fetchedFeed = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/kudos/getKudosFeed`);
      const resData = response.data;
      if (resData.status === 1) {
        setmostLiked(resData.data[0]);
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  useEffect(() => {
    fetchedFeed()
  }, [])

  console.log(mostLiked)
  return (
    <>
      <div className="flex flex-row gap-6 p-6 items-start">
        <div className="flex-1 h-[500px] w-full ">
          <BarChart />
        </div>

        <div className="flex-1 h-[500px] w-full ">
          <LeadingBoard />
        </div>


      </div>
      <h1>most liked post :</h1>
      <p className="text-gray-800 font-medium">
        <span className="font-bold">{mostLiked.sender}</span> gave{' '}
        <span className="font-bold">"{mostLiked.badge}"</span> Badge to{' '}
        <span className="font-bold">{mostLiked.receiver}</span>
      </p>
      <p className="text-gray-600">{mostLiked.message}</p>
    </>
  );
}

export default Analytics;
