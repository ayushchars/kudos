import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Kudos() {
  const badges = ['Helping Hand', 'Excellence', 'Above the Beyond', "Client Focus"];
  const [users, setUsers] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const selected = event.target.value;
    setSelectedName(selected);
  };

  const handleChangeBadge = (event) => {
    setSelectedBadge(event.target.value);
  };

  const getAllUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/auth/getAllUser`);

      const resData = response.data;
      if (resData.status === 1) {
        setUsers(resData.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleSubmit = async () => {
    const from = localStorage.getItem('user');
    const selectedUser = users.find((user) => user.name === selectedName);

    if (!from) {
      alert('User not logged in.');
      return;
    }

    if (!selectedUser) {
      alert('Please select a valid recipient.');
      return;
    }

    if (!selectedBadge || !message) {
      alert('Please select a badge and enter a message.');
      return;
    }

    const to = selectedUser._id;
    const payload = {
      from,
      to,
      message,
      badges: selectedBadge,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASEURL}/kudos/sendkudos`, payload);
      if (response.data.status === 1) {
        alert('Kudos sent successfully!');
      } else {
        alert('Failed to send Kudos. Please try again.');
      }
    } catch (error) {
      console.error('Error sending Kudos:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Kudos</h1>
      
      <label htmlFor="name-select" style={{ marginRight: '10px' }}>
        Select a name:
      </label>
      <select
        id="name-select"
        value={selectedName}
        onChange={handleChange}
        style={{ padding: '5px', borderRadius: '5px' }}
      >
        <option value="" disabled>
          Select
        </option>
        {users.map((user, index) => (
          <option key={index} value={user.name}>
            {user.name}
          </option>
        ))}
      </select>

      <label htmlFor="badge-select" style={{ marginRight: '10px', marginLeft: '20px' }}>
        Select a badge:
      </label>
      <select
        id="badge-select"
        value={selectedBadge}
        onChange={handleChangeBadge}
        style={{ padding: '5px', borderRadius: '5px' }}
      >
        <option value="" disabled>
          Select
        </option>
        {badges.map((badge, index) => (
          <option key={index} value={badge}>
            {badge}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="message-input" style={{ marginRight: '10px' }}>
          Enter a message:
        </label>
        <input
          id="message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: '5px', borderRadius: '5px', width: '300px' }}
        />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          borderRadius: '5px',
          background: 'blue',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default Kudos;
