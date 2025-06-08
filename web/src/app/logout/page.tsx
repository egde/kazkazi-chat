import React from "react";

const Logout = () => {
    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-6 text-center">Thank you for using Kazkazi Chat!</h1>
            <p className="text-lg mb-8 text-center">
                We appreciate your time. Hope to see you again soon.
            </p>
            <a
                href="/#"
                className="px-8 py-3 text-lg rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
                Go to Login
            </a>
        </div>
    );
};

export default Logout;
