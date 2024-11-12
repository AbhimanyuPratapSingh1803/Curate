import React, { useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { getInitials } from "../utils/helper";
import { Link, useNavigate } from "react-router-dom";

const Search = () => {
    const [value, setValue] = useState("");
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [blogs, setBlogs] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const keyUpTimer = useRef(null);
    const navigate = useNavigate();

    const fetchRes = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/blog/search?query=${encodeURI(value)}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await response.json();
            if (data.success) {
                console.log(
                    "Fetched search results successfully : ",
                    data.data
                );
                setBlogs(data.data);
                setSearching(false);
                setSearched(true);
            } else {
                console.log("Error while searching blogs : ", data);
            }
        } catch (error) {
            console.log("Error searching blogs : ", error);
        }
    };

    const keyUp = () => {
        setSearching(true);
        setSearched(false);
        if (keyUpTimer.current) clearTimeout(keyUpTimer.current);

        
            (keyUpTimer.current = setTimeout(() => {
                fetchRes();
            }, 1000));
    };

    let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    const handleCancel = () => {
        setBlogs([]);
        setValue("");
    }

    return (
        <div className="w-full">
            <button
                className="btn btn-circle bg-neutral"
                onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                }>
                <IoSearch className="text-xl" />
            </button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box w-11/12 min-h-[100px] max-h-[600px] sm:w-3/4 max-w-4xl flex items-center gap-4 justify-center flex-col bg-slate-950">
                    <div className="w-full backdrop-blur-xl top-2 mb-2 fixed z-40">
                        <div className="w-full h-full px-5 flex flex-col justify-center items-end">
                            <form method="dialog" className="" onClick={handleCancel}>
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost">
                                    ✕
                                </button>
                            </form>
                            <input
                                type="text"
                                value={value}
                                onKeyUp={value !== "" ? keyUp : undefined}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Start typing to search"
                                className="outline-0 ring-1 mb-3 backdrop-blur-xl bg-inherit ring-blue-600 placeholder-slate-500 w-full rounded-md px-4 py-1.5"
                            />
                        </div>
                    </div>
                    {searching ? (
                        <div className="w-11/12 pt-12">
                            <div className="flex flex-col sm:flex-row w-full gap-4 pt-5">
                                <div className="w-full flex flex-col pt-2 gap-4">
                                    <div className="skeleton h-4 w-28"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                </div>
                                <div className="skeleton h-32 w-full sm:w-1/2"></div>
                            </div>
                            <div className="flex flex-col sm:flex-row w-full gap-4 pt-5">
                                <div className="w-full flex flex-col pt-2 gap-4">
                                    <div className="skeleton h-4 w-28"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                </div>
                                <div className="skeleton h-32 w-full sm:w-1/2"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[500px] pt-12 overflow-y-auto">
                            {blogs.map((blog) => (
                                    <div
                                    key={blog._id}
                                    className="flex mt-5 sm:mt-0 flex-col sm:flex-row border-b-2 border-slate-700 min-h-[100px] w-11/12 items-center justify-center sm:justify-between gap-4 py-3">
                                        <div className="w-full flex-col gap-4 justify-center items-start">
                                            <div className="flex items-center justify-start mb-3 gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content w-12 rounded-full">
                                                        <span className="text-lg">
                                                            {getInitials(
                                                                blog.author.fullName
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start justify-center sm:gap-1">
                                                    <p className="font-semibold cursor-pointer text-[12px] ">
                                                        {blog.author.fullName}
                                                    </p>
                                                    <p className="text-sm">
                                                        {new Intl.DateTimeFormat(
                                                            "en-US",
                                                            options
                                                        ).format(
                                                            new Date(blog.createdAt)
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link to={`/blog/${blog._id}`}>
                                                <div className="h-fit w-full">
                                                    <p className="text-md sm:text-2xl cursor-pointer text-white font-semibold">
                                                        {blog.title}
                                                    </p>
                                                </div>     
                                            </Link>
                                        </div>
                                        {blog.coverImage ? (
                                                <div className="h-36 w-full sm:pt-7 sm:w-1/3">
                                                    <img
                                                        className="rounded-md cursor-pointer"
                                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                                        src={blog.coverImage}
                                                        alt="Blog-cover"
                                                    />
                                                </div>
                                            
                                        ) : null}
                                    </div>
                                
                            ))}
                        </div>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default Search;
