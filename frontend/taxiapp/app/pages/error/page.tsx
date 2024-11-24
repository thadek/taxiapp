import React from 'react';

const ErrorPage: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Oops! Something went wrong.</h1>
            <p>The page you were looking for doesn&apos;t exist.</p>
            <a href="/">Go back to Home</a>
        </div>
    );
};

export default ErrorPage;