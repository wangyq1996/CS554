import React from 'react';
import classes from './Header.module.css';

const Header = (props) => {
    return (
        <div className={classes.container}>
            <h1>{props.title}</h1>
        </div>
    );
};

export default Header;
