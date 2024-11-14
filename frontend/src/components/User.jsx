import React, { useEffect, useState } from "react";
import { getInitials } from "../utils/helper.js";
import { IoBookmarks } from "react-icons/io5";
import { TbNotebook } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const User = () => {
    const currentUser = JSON.parse(localStorage.getItem("User"));
    if(!currentUser) return ;
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users/logout`, {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.removeItem("User");
                navigate("/login");
                console.log("User logged out Successfully", data);
                return;
            } else {
                console.log("Failed to logout user", data);
            }
        } catch (error) {
            console.log("Failed to logout user", data);
        }
    };

    const initials = getInitials(currentUser.fullName);

    return (
        <div className="flex items-center justify-center mr-5">
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button">
                    {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="Avatar" />
                    ) : (
                        <div className="avatar online placeholder">
                            <div className="bg-neutral text-neutral-content w-[52px] rounded-full">
                                <span className="text-lg">{initials}</span>
                            </div>
                        </div>
                    )}
                </div>
                <ul
                    tabIndex={0}
                    className="menu dropdown-content bg-base-100 rounded-lg z-[1] mt-6 w-80 p-2 shadow">
                    <li className="h-auto">
                        <div className="flex gap-5">
                            {currentUser.avatar ? (
                                <img src={currentUser.avatar} alt="Avatar" />
                            ) : (
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content w-12 rounded-full">
                                        <span className="text-lg">{initials}</span>
                                    </div>
                                </div>
                            )}
                            <p>{currentUser.fullName}</p>
                        </div>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                        <div onClick={() => navigate("/bookmarks")} className="flex gap-4 items-center justify-start">
                            <IoBookmarks className="text-lg" />
                            <p>Bookmarks</p>
                        </div>
                    </li>
                    <li>
                        <div onClick={() => navigate("/drafts")} className="flex gap-4 items-center justify-start">
                            <TbNotebook className="text-lg" />
                            <p>My Blogs</p>
                        </div>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                        <div
                            onClick={handleLogout}
                            className="flex gap-4 items-center justify-start">
                            <MdLogout className="text-red-600 text-lg" />
                            <p className="font-medium">Logout</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default User;
