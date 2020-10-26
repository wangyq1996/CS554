import React from 'react';
import classes from './Navbar.module.css';
import { Button } from 'react-bootstrap';

const Navbar = () => {
    return (
        <div className={classes.navbar}>
            <Button className={classes.btn} variant="outline-light" href="/">Home</Button>
        </div>
    );
};

export default Navbar;
