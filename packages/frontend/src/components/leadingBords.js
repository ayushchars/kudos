import axios from 'axios';
import React, { useEffect, useState } from 'react';

function LeadingBoard() {
  const [receivers, setReceivers] = useState([]);

  const fetchReceivers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/kudos/analytics`);

      const resData = response.data;
      if (resData.status === 1) {
        const receiversArray = Object.entries(resData?.data?.receivers || {});
        setReceivers(receiversArray);
      }
    } catch (err) {
      console.error('Error fetching receivers:', err);
    }
  };

  useEffect(() => {
    fetchReceivers();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Kudos Leaderboard</h1>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                backgroundColor: '#f2f2f2',
              }}
            >
              Name
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                backgroundColor: '#f2f2f2',
              }}
            >
              Kudos Received
            </th>
          </tr>
        </thead>
        <tbody>
          {receivers.length > 0 ? (
            receivers.map(([name, kudosReceived], index) => (
              <tr key={index}>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  {name}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  {kudosReceived}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="2"
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeadingBoard
