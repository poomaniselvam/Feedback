import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AdminLogin = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    axios
      .get('https://mediumblue-jellyfish-250677.hostingersite.com/api/admin_login/1')
      .then(response => {
        setAdminEmail(response.data.email);
      })
      .catch(error => {
        console.error('Error fetching admin email:', error);
      });
  }, []);

  const updateEmail = () => {
    const updatedEmail = emailRef.current.value;
    axios
      .put('https://mediumblue-jellyfish-250677.hostingersite.com/api/admin_login/1', {
        email: updatedEmail
      })
      .then(response => {
        setAdminEmail(updatedEmail);
        setEditing(false);
      })
      .catch(error => {
        console.error('Error updating admin email:', error);
      });
  };

  return (
    <div className='container mt-5'>
     <div className='row'>
     <div className='col-lg-12 card px-0'>
     <div className="card-header">
    Admin Email
  </div>
     <div className=' p-4'>
      {editing ? (
        <div>
          <div>
            <label className="form-label">Email:</label>
            <input
            className="form-control"
              type="email"
              ref={emailRef}
              defaultValue={adminEmail}
            />
          </div>
          <button className='btn btn-primary d-block mt-3' onClick={updateEmail}>Save</button>
        </div>
      ) : (
        <div>
           <label className="form-label">Email: {adminEmail}</label> 
          <button className='btn btn-primary d-block mt-3' onClick={() => setEditing(true)}>Edit Email</button>
        </div>
      )}

     </div>

     </div>

     </div>
    </div>
  );
};

export default AdminLogin;