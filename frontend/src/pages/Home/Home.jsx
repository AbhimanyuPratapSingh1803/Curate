import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import RecommendedBlog from "../../components/RecommendedBlog";
import Footer from "../../components/Footer";

const Home = () => {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [blogs, setBlogs] = useState([]);

    // To fetch all the blogs
    useEffect(() => {
        const getAllBlogs = async () => {
            try {
                const response = await fetch(`${BASE_URL}/blog/getAllBlogs`, {
                    method : "GET",
                    credentials : "include",
                });

                const data = await response.json();
                console.log("Fetched all the blogs succsessfully");
                setBlogs(data.data);
                console.log(data.data);
            } catch (error) {
                console.error("Error fetching all the blogs ", error)
            }
        }

        getAllBlogs();
    }, []);

    // To fetch the current user
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${BASE_URL}/users/current-user`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                if (data && data.success) {
                    const user = JSON.stringify(data.data);
                    localStorage.setItem("User", user);
                    console.log(JSON.parse(localStorage.getItem("User")));
                    console.log("fetched current user successfully ", data);
                } else {
                    console.log("Current user not found", data);
                    navigate("/login");
                }
            } catch (error) {
                console.error("error fetching current user data ", error);
                localStorage.removeItem("User");
                navigate("/login");
            }
        }

        fetchData();
    }, []);


    return (
        <div className="bg-slate-950 relative min-h-screen pb-20 sm:pb-20 pt-20 w-screen">
            <Navbar/>
            <div className="w-full h-full mt-10 mb-28 sm:mb-4">
                {blogs.map((blog) => (
                    <RecommendedBlog 
                        key={blog._id}
                        id={blog._id}
                        coverImage={blog.coverImage}
                        title={blog.title}
                        subTitle={blog.subTitle}
                        author={blog.author}
                        content={blog.content}
                        createdAt={blog.createdAt}
                        page={"home"}
                    />
                ))}
            </div>
            <div className="bottom-0 mt-4 absolute w-full">
                <Footer/>
            </div>
        </div>
    );
};

export default Home;
