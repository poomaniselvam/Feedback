import React, { useRef } from 'react';
import axios from 'axios';

export default function Home() {
  const email = useRef(null);
  const password = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emails = email.current.value;
    const passwords = password.current.value;

    try {
      const response = await axios.get('https://mediumblue-jellyfish-250677.hostingersite.com/api/admin_login');
      const foundUser = response.data.data.find(u => u.email === emails && u.password === passwords);
      
      if (foundUser) {
        window.location.href = '/rating-table';
      } else {
        alert('Please enter the correct email and password');
      }
    } catch (err) {
      alert('There was an error during login. Please try again.');
      console.error('Error during login:', err);
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-light  text-dark" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Admin Login</h2>
                  <p className="text-dark-50 mb-5">Please enter your login and password!</p>

                  <form onSubmit={handleSubmit}>
                    <div className="form-outline form-white mb-4">
                      <label className="form-label" htmlFor="typeEmailX">Email</label>
                      <input
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        ref={email}
                      />
                    </div>

                    <div className="form-outline form-white mb-4">
                      <label className="form-label" htmlFor="typePasswordX">Password</label>
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        ref={password}
                      />
                    </div>


                    <button className="btn btn-outline-light text-dark border btn-lg px-5" type="submit">Login</button>
                  </form>


                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
