import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getInitials } from '../../utils/helper';

const Blog = () => {
    const [blog, setBlog] = useState({});
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const {id} = useParams();
    const blogId = {_id : id};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${BASE_URL}/blog/fetch-blog`, {
                    method : "POST",
                    credentials : "include",
                    headers : {
                        "Content-type" : "application/json"
                    },
                    body : JSON.stringify(blogId)
                })
    
                const data = await response.json();
                if(data.success){
                    console.log("Fetched the blog successfully : ", data);
                    setBlog(data.data);
                    setLoading(false);
                }
                else{
                    console.log("Error while fetching the blog : ", data);
                    toast.error("Specified blog can't be fetched!");
                }
            } catch (error) {
                console.error("Error fetching blog : ", error);
            }
        }

        fetchBlog();
    }, [])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${BASE_URL}/users/current-user`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                if (data.success) {
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
    
    if(loading){
        return(
            <div className='w-screen h-screen flex items-center justify-center bg-slate-950'>
                <span className="text-blue-600 loading loading-infinity loading-lg"></span>
            </div>
        );
    }

    const initials = getInitials(blog.author.fullName);
    let date = new Date(blog.createdAt);

    let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    let formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
    const blocks = (JSON.parse(blog.content).blocks);
    console.log(blocks);

    return(
        <div className='w-screen bg-slate-950 pt-16 relative pb-10 min-h-screen'>
            <Navbar hideCreate = {true} hideSearch = {true}/>
            <div className='my-10 min-h-screen w-9/12 mx-auto items-center flex flex-col gap-8'>
                {blog.coverImage ? 
                    <div className='w-full mx-auto h-3/4 mb-4'>
                        <img className='rounded-lg' src={blog.coverImage} alt="Blog-image" />
                    </div> 
                    : 
                    null
                }

                <div className='px-5 w-full h-full flex flex-col gap-5'>
                    <div className='flex flex-col gap-4 w-full h-fit'>
                        <p className='text-5xl text-white font-bold text-center'>{blog.title}</p>
                        <p className='text-slate-400 font-md text-center'>{blog.subTitile}</p>
                    </div>

                    <div className="flex justify-center items-center gap-5 mb-5">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content w-14 rounded-full">
                                <span className="text-lg">{initials}</span>
                            </div>
                        </div>
                        <p className='text-xl text-white font-semibold'>{blog.author.fullName}</p>
                        <p>{formattedDate}</p>
                    </div>

                    <div className='flex flex-col gap-8 min-h-screen items-center justify-center px-28'>
                        {blocks.map((block) => (
                            <div key={block.id} className='w-full flex justify-start text-white'>
                                {block.type === "paragraph" && <p className='text-lg'>{block.data.text}</p>}
                                {block.type === "image" && <img className='rounded-lg' src={block.data.file.url} />}
                                {block.type === "header" && 
                                    block.data.level === 1 && <p className='text-5xl font-bold text-white'>{block.data.text}</p>
                                }
                                {block.type === "header" && 
                                    block.data.level === 2 && <p className='text-4xl font-bold text-white'>{block.data.text}</p>
                                }
                                {block.type === "header" && 
                                    block.data.level === 3 && <p className='text-3xl font-bold text-white'>{block.data.text}</p>
                                }
                                {block.type === "list" && 
                                    <ul className='mb-5 list-disc'>
                                        {block.data.items.map((item, index) => (
                                            <li key={index} dangerouslySetInnerHTML={{__html:item}} />
                                        ))}
                                    </ul>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Blog
