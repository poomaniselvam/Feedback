import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbardisplay = () => {
    const [navbarData, setNavbarData] = useState({});

    useEffect(() => {
        // Fetch data from the API when the component mounts
        axios.get('https://mediumblue-jellyfish-250677.hostingersite.com/api/navbar')
            .then(response => {
                const data = response.data;
                const lastItem = data.sort((a, b) => b.id - a.id)[0];
                const baseUrl = 'https://mediumblue-jellyfish-250677.hostingersite.com';
                lastItem.image = lastItem.image.startsWith('http') ? lastItem.image : baseUrl + lastItem.image;
                setNavbarData(lastItem);
            })
            .catch(error => {
                console.error('Error fetching navbar data:', error);
            });
    }, []);

    // Function to determine the alignment style for the logo and cname
    const getAlignmentStyle = () => {
        if (!navbarData.logochange) {
            return { justifyContent: 'left' }; // Default to center if undefined
        }

        switch (navbarData.logochange.toLowerCase()) {
            case 'left':
                return { justifyContent: 'flex-start' };
            case 'right':
                return { justifyContent: 'flex-end' };
            case 'center':
            default:
                return { justifyContent: 'center' };
        }
    };

    // Apply body background color dynamically
    useEffect(() => {
        if (navbarData.body_background_color) {
            document.body.style.backgroundColor = navbarData.body_background_color;
        }
    }, [navbarData.body_background_color]);

    return (
        <div style={{ position: 'relative' }}>
            {/* Top-right corner for contact and email */}
            <div style={{ position: 'fixed', top: '10px', right: '10px', textAlign: 'right' }}>
                {navbarData.contact && (
                    <div style={{ marginBottom: '0.5rem' }}>
                        {navbarData.contact}
                    </div>
                )}
                {navbarData.email && (
                    <div style={{ marginBottom: '0.5rem' }}>
                        {navbarData.email}
                    </div>
                )}
            </div>

            {/* Navbar with logo and cname beside each other */}
            <div style={{
                display: 'flex', 
                alignItems: 'center', 
                ...getAlignmentStyle(), 
                width: '100%', 
                padding: '0.5rem 0',
                backgroundColor: navbarData.background_color || '#fff'  // Set navbar background color
            }}>
                {/* Logo */}
                {navbarData.image && (
                    <div style={{ marginRight: '1rem' }}>
                        <img 
                            src={navbarData.image} 
                            alt="Logo" 
                            style={{
                                maxWidth: '100px',  // Adjust size based on your preference
                                width: '100%',
                                height: 'auto'
                            }} 
                        />
                    </div>
                )}

                {/* cname beside the logo */}
                {navbarData.cname && (
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'left' }}>
                        {navbarData.cname}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbardisplay;
