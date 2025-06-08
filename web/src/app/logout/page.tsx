import React from "react";
import { Button } from "../ui/Button";

const Logout = () => {
    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-6 text-center">Thank you for using Kazkazi Chat!</h1>
            <p className="text-lg mb-8 text-center">
                We appreciate your time. Hope to see you again soon.
            </p>
            <Button href='/' size="large" variant="primary">Go to Login</Button>
        </div>
    );
};

export default Logout;
