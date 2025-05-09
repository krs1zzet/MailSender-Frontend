import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const RootLayout = () => {
    return (
        <>
            <Navigation />
            <Outlet />
        </>
    );
};

export default RootLayout; 