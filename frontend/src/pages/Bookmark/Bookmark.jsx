import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Skeleton from '../../components/Skeleton';
import RecommendedBlog from '../../components/RecommendedBlog'
import {toast} from "react-toastify"
import Footer from '../../components/Footer';

const Bookmark = () => {
    const [blogs, setBlogs] = useState([]);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBookmarks = async () => {
            try {
                const response = await fetch(`${BASE_URL}/users/bookmarks`, {
                    method: 'GET',
                    credentials : "include"
                });

                const data = await response.json();
                if(data.success){
                    console.log("fetched all the bookmarks successfully : ", data.data);
                    setBlogs(data.data.bookmarks);
                    setLoading(false);
                }
                else{
                    console.log("error while fetching the bookmarks : ", data.data);
                    toast.error("Error occured while fetching the Bookmarks!!");
                }
            } catch (error) {
                console.error("Error while fetching Bookmarks : ", error);
                toast.error("Error occured while fetching the Bookmarks!!");
            }
        }
        getBookmarks();
    }, [])

    return (
        <div className='bg-slate-950 relative min-h-screen pb-20 sm:pb-20 pt-28 w-screen'>
            <Navbar />
            <div className='flex flex-col justify-start items-center w-full'>
                <div className='flex border rounded-xl px-5 border-slate-500 w-[90%] sm:w-3/5 items-center mb-4 justify-between'>
                    <div className='py-8'>
                        <p className='text-2xl sm:text-3xl font-bold text-white'>Bookmarks</p>
                        <p className='text-slate-500 text-md sm:text-lg'>All blogs you have bookmarked on Curate!!</p>
                    </div>
                    <div className='size-20 pt-3 sm:pt-0 sm:size-24 rouded-lg object-cover overflow-x-hidden overflow-y-hidden'>
                        <img className='rounded-lg' src="https://res.cloudinary.com/dq3linqhb/image/upload/v1731603101/Bookmark_s62e6t.jpg" alt="" />
                    </div>
                </div>

                {loading ? <Skeleton /> : (
                    <div className="w-full flex flex-col justify-center items-center h-full mb-28 sm:mb-4">
                        {blogs.length > 0 ?  blogs.map((blog) => (
                            <RecommendedBlog 
                                key={blog._id}
                                id={blog._id}
                                coverImage={blog.coverImage}
                                title={blog.title}
                                subTitle={blog.subTitle}
                                author={blog.author}
                                content={blog.content}
                                createdAt={blog.createdAt}
                                page={"bookmarks"}
                            />
                        )) : <p className='pt-20 font-bold px-6 text-2xl'>Bookmark blogs to see them here!!👋</p>}
                    </div>
                )}
            </div>
            <div className="bottom-0 mt-4 absolute w-full">
                <Footer/>
            </div>
        </div>
    )
}

export default Bookmark
