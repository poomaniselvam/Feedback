import React, { useState } from 'react';
import axios from 'axios';

const Header = () => {
    const [image, setImage] = useState(null);
    const [bodyImage, setBodyImage] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [bodyBackgroundColor, setBodyBackgroundColor] = useState('#ffffff');
    const [cname, setCname] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [message, setMessage] = useState('');
    const [useBodyImage, setUseBodyImage] = useState(false);
    const [imageAlignment, setImageAlignment] = useState('left');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleBodyImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBodyImage(file);
            setUseBodyImage(true);
        } else {
            setBodyImage(null);
            setUseBodyImage(false);
        }
    };

    const handleRemoveBodyImage = () => {
        setBodyImage(null);
        setUseBodyImage(false);
        setBodyBackgroundColor('#ffffff');
    };

    const handleColorChange = (e) => {
        setBackgroundColor(e.target.value);
    };

    const handleBodyColorChange = (e) => {
        setBodyBackgroundColor(e.target.value);
    };

    const handleImageAlignmentChange = (e) => {
        setImageAlignment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image || !backgroundColor) {
            setMessage('Logo and navbar background color are required.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('background_color', backgroundColor);
        formData.append('cname', cname);
        formData.append('email', email);
        formData.append('contact', contact);

        // Ensure `logochange` is set
        formData.append('logochange', imageAlignment || 'left'); // Provide a default value

        if (useBodyImage && bodyImage) {
            formData.append('body_image', bodyImage);
            formData.append('body_background_color', ''); // Assuming this is handled correctly by the backend
        } else {
            formData.append('body_image', '');
            formData.append('body_background_color', bodyBackgroundColor);
        }

        try {
            // Log FormData for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            const response = await axios.post('https://mediumblue-jellyfish-250677.hostingersite.com/api/navbar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Upload successful!');
        } catch (error) {
            console.error('Error details:', error);
            if (error.response) {
                setMessage(`Error: ${error.response.data.message}`);
            } else {
                setMessage('Network Error: Could not reach the server.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header fbb">
                    Upload Logo, Set Background Colors, and Company Information
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className="mb-3 col-lg-3">
                                <label htmlFor="image" className="form-label fbb">Upload Logo (required)</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required
                                />
                            </div>
                            <div className="mb-3 col-lg-3">
                                <label htmlFor="imageAlignment" className="form-label fbb">Image Alignment</label>
                                <select
                                    className="form-select"
                                    id="imageAlignment"
                                    value={imageAlignment}
                                    onChange={handleImageAlignmentChange}
                                >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div className="mb-3 col-lg-3">
                                <label htmlFor="background_color" className="form-label fbb">Background Color for Nav (required)</label>
                                <input
                                    className="form-control"
                                    type="color"
                                    id="background_color"
                                    value={backgroundColor}
                                    onChange={handleColorChange}
                                    required
                                />
                            </div>
                            <div className="mb-3 col-lg-3">
                                <label htmlFor="body_image" className="form-label fbb">Upload Body Background Image</label>
                                <input
                                    className="form-control fbb"
                                    type="file"
                                    id="body_image"
                                    accept="image/*"
                                    onChange={handleBodyImageChange}
                                    disabled={useBodyImage && !bodyImage}
                                />
                                {bodyImage && <button type="button" onClick={handleRemoveBodyImage} className="btn btn-danger mt-2">Remove Body Background Image</button>}
                            </div>
                        </div>
                        <div className='row'>
                            <div className="mb-3 col-lg-3">
                                <label htmlFor="body_background_color" className="form-label fbb">Body Background Color</label>
                                <input
                                    className="form-control"
                                    type="color"
                                    id="body_background_color"
                                    value={bodyBackgroundColor}
                                    onChange={handleBodyColorChange}
                                    disabled={useBodyImage}
                                />
                            </div>
                            <div className="mb-3 col-lg-3">
                                <label htmlFor="cname" className="form-label fbb">Company Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="cname"
                                    value={cname}
                                    onChange={(e) => setCname(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 col-lg-3">
                                <label htmlFor="email" className="form-label fbb">Email</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 col-lg-3">
                                <label htmlFor="contact" className="form-label fbb">Contact Number</label>
                                <input
                                    className="form-control"
                                    type="tel"
                                    id="contact"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    {message && <div className="mt-3 alert alert-info">{message}</div>}
                </div>
            </div>

            {/* Navbar Preview */}
            {image && (
                <div className="mt-4">
                    <h3>Navbar Preview</h3>
                    <nav className="navbar" style={{ backgroundColor }}>
                        <div className={`container-fluid d-flex justify-content-${imageAlignment}`}>
                            <a className="navbar-brand" href="#">
                                <img 
                                    src={URL.createObjectURL(image)} 
                                    alt="Logo" 
                                    className="d-inline-block align-text-top navbar-logo" 
                                    style={{ 
                                        width: 'auto', 
                                        height: '40px', // Adjust height as needed
                                    }} 
                                />
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Header;
