import React from 'react';

const ErrorPage = () => {
    return (
        <div>
            <p>Opps! Something went wrong!</p>
            <button onClick={() => window.history.back()}>Go Back!</button>
        </div>
    );
};

export default ErrorPage;
