import React from "react";
import { useState, useEffect } from "react";
import { MdChat } from "react-icons/md";
import { AiTwotoneLike } from "react-icons/ai";
import { IoBookmarks } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getInitials } from "../utils/helper";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { setDeletedBlog } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

const RecommendedBlog = ({
    id,
    coverImage,
    title,
    subTitle,
    author,
    content,
    createdAt,
    status,
    page,
}) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [isBookmarked, setIsBookmarked] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        Aos.init();
    }, []);

    const removeBookmark = async () => {
        const blogId = { id: id };
        try {
            const response = await fetch(`${BASE_URL}/users/removeBookmark`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(blogId),
            });

            const data = await response.json();
            if (data.success) {
                console.log(
                    "Blog removed from bookmarks successfully : ",
                    data
                );
                setIsBookmarked(false);
            } else {
                console.log("Error removing from bookmarks : ", data);
                toast.error("Error removing from bookmarks!");
            }
        } catch (error) {
            console.log("Error removing from bookmarks : ", error);
            toast.error("Error removing from bookmarks!");
        }
    };

    const addBookmark = async () => {
        const blogId = { id: id };
        try {
            const response = await fetch(`${BASE_URL}/users/add-bookmark`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(blogId),
            });

            const data = await response.json();
            if (data.success) {
                console.log("Blog bookmarked successfully : ", data);
                setIsBookmarked(true);
            } else {
                console.log("Error bookmarking the blog : ", data);
                toast.error("Error bookmarking the blog!");
            }
        } catch (error) {
            console.log("Error bookmarking the blog : ", error);
            toast.error("Error bookmarking the blog!");
        }
    };

    useEffect(() => {
        const bookmarked = async () => {
            const blogId = { id: id };
            try {
                const response = await fetch(`${BASE_URL}/users/isBookmarked`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(blogId),
                });

                const data = await response.json();
                if (data.success) {
                    console.log("Fetched isBookmarked successfully : ", data);
                    if (data.data) setIsBookmarked(true);
                    else setIsBookmarked(false);
                } else {
                    console.log("Error fetching isBookmarked : ", data);
                    toast.error("Error fetching isBookmarked");
                }
            } catch (error) {
                console.log("Error fetching isBookmarked : ", error);
                toast.error("Error fetching isBookmarked!");
            }
        };

        bookmarked();
    }, []);

    const handleDelete = async (newblogId) => {
        const blogId = { _id: newblogId };
        console.log(blogId);
        try {
            const response = await fetch(`${BASE_URL}/blog/delete-blog`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(blogId),
            });

            const data = await response.json();
            if (data.success) {
                console.log("Blog deleted successfully : ", data);
                toast.success("Blog deleted successfully");
                dispatch(setDeletedBlog());
                localStorage.removeItem("del");
            }
        } catch (error) {
            console.log("Error deleting the blog : ", error);
            toast.error("Error deleting the blog!");
        }
    };

    const initials = getInitials(author.fullName);

    let para = "";
    content = JSON.parse(content);
    const paragraphBlock = content?.blocks?.find(
        (block) => block.type === "paragraph"
    );
    if (paragraphBlock) {
        para =
            paragraphBlock.data.text.substring(
                0,
                Math.min(200, paragraphBlock.data.text.length)
            ) + " . . .";
    }

    let date = new Date(createdAt);

    let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    let formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

    const handleNavigate = () => {
        if (page !== "myblogsDraft") {
            navigate(`blog/${id}`);
        } else {
            const blog = {
                id,
                coverImage,
                title,
                subTitle,
                author,
                content,
                createdAt,
                status,
            };
            console.log(page);
            localStorage.setItem("Blog", JSON.stringify(blog));
            navigate("/create");
        }
    };

    return (
        <div
            data-aos="fade-down"
            data-aos-offset="100"
            data-aos-easing="ease-in-out-sine"
            data-aos-duration="1000"
            className="flex flex-col xl:max-h-[325px] rounded-xl w-[90%] sm:w-3/5 px-6 my-6 mx-auto border-[0.1px] bg-slate-950 border-slate-100 border-opacity-30">
            <div className="w-full flex justify-between items-center">
                <div className="flex flex-start  gap-4 items-center justify-start mt-5 mb-4">
                    <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-12 rounded-full">
                            <span className="text-lg">{initials}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center sm:gap-1">
                        <p className="font-semibold cursor-pointer text-md ">
                            {author.fullName}
                        </p>
                        <p className="text-sm">{formattedDate}</p>
                    </div>
                </div>
                {page === `myblogsDraft` || page === `myblogsPublished` ? (
                    <div>
                        {/* The button to open modal */}
                        <label
                            onClick={() => localStorage.setItem("del", id)}
                            htmlFor="my_modal_6"
                            className="btn">
                            <RiDeleteBin6Line className="text-lg" />
                        </label>

                        {/* Put this part before </body> tag */}
                        <input
                            type="checkbox"
                            id="my_modal_6"
                            className="modal-toggle modal-backdrop"
                        />
                        <div className="modal" role="dialog">
                            <div className="modal-box">
                                <h3 className="text-lg text-gray-300 font-bold">
                                    Alert!
                                </h3>
                                <p className="py-4">
                                    Are you sure you want to delete this blog!
                                </p>
                                <div className="modal-action">
                                    <label
                                        onClick={() =>
                                            handleDelete(
                                                localStorage.getItem("del")
                                            )
                                        }
                                        htmlFor="my_modal_6"
                                        className="btn btn-error">
                                        Delete
                                    </label>
                                    <label
                                        onClick={() =>
                                            localStorage.removeItem("del")
                                        }
                                        htmlFor="my_modal_6"
                                        className="btn">
                                        Close
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="flex  flex-col lg:flex-row gap-8 justify-start xl:justify-between items-center mb-5">
                <div className="flex flex-col h-full w-full items-start justify-center gap-2">
                    <p
                        onClick={handleNavigate}
                        className="text-xl sm:text-2xl cursor-pointer text-white font-bold">
                        {title}
                    </p>
                    <p className="text-slate-400 text-[13px] sm:text-base">
                        {para}
                    </p>
                </div>
                {coverImage ? (
                    <div className="w-full box-border xl:w-2/4">
                        <img
                            className="rounded-md"
                            src={coverImage}
                            alt="Blog Image"
                            onClick={handleNavigate}
                        />
                    </div>
                ) : null}
            </div>
            {status !== "draft" ? (
                <div className="flex  items-center justify-between mb-5">
                    <div className="flex justify-center items-center gap-5">
                        <div className="flex cursor-pointer gap-1 items-center justify-center">
                            <p>Likes</p>
                            <AiTwotoneLike />
                            <p>50</p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-3">
                        {!isBookmarked ? (
                            <div className="text-lg cursor-pointer tooltip tooltip-bottom tooltip-info" data-tip="Add to Bookmarks">
                                <IoBookmarks
                                    onClick={addBookmark}
                                />
                            </div>
                        ) : (
                            <div className="text-lg cursor-pointer tooltip tooltip-bottom tooltip-warning" data-tip="Remove from Bookmarks">
                                <BsFillBookmarkCheckFill
                                    onClick={removeBookmark}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default RecommendedBlog;
