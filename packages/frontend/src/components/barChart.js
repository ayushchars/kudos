import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function BarChart() {
  const [badgeData, setBadgeData] = useState({});
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASEURL}/kudos/analytics`);
        const resData = response.data;

        if (resData.status === 1) {
          const { badges } = resData.data;
          setBadgeData(badges);

          const labels = Object.keys(badges);
          const values = Object.values(badges);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Kudos given',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Analytics</h1>
      {chartData ? (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Count',
                  },
                  ticks: {
                    stepSize: 2,
                  },

                },
              },
            }}
          />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default BarChart;
