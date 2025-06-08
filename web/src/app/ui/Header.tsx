"use client";
import { Button } from "./Button";

import { useEffect, useState } from "react";

export default function Header() {
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && window.location.pathname !== "/logout") {
            setShowLogout(true);
        }
    }, []);

    return (
        <div id="header">
            <nav className="fixed w-full z-10 top-0 bg-white" >

                <div className="w-full flex flex-wrap items-center justify-between mt-0 py-3 px-4">

                    <div className="pr-4">
                        <a className="text-gray-900 no-underline hover:no-underline font-extrabold text-xl" href="#">
                            Kazkazi Chat
                        </a>
                    </div>
                    {showLogout && (
                        <Button size="small" variant="secondary" href="/logout">
                            Logout
                        </Button>
                    )}
                </div>
            </nav>
        </div>
    );
}
