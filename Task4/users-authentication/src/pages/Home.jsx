import React from 'react';
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export const Home = () => {
    return (
        <div className="container text-center mt-5">
            <h1>Home</h1>
            <h2>Welcome</h2>
            <NavLink to="/login" className="btn btn-primary mt-3">Login</NavLink>
        </div>
    );
};