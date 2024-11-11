import React, { useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import { FaImage } from "react-icons/fa6";
import Paragraph from "@editorjs/paragraph";
import CodeTool from "@editorjs/code";
import ImageTool from "@editorjs/image";
import { RxCross1 } from "react-icons/rx";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [coverImg, setCoverImg] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [blog, setBlog] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        let existingBlog = localStorage.getItem("Blog");
        if(existingBlog){
            existingBlog = JSON.parse(existingBlog);
            setBlog(existingBlog);
            setTitle(existingBlog.title);
            setSubTitle(existingBlog.subTitle);
            setCoverImg(existingBlog.coverImage);
            setCoverUrl(existingBlog.coverImage);
            setContent(existingBlog.content)
        }
    }, [])


    const editorInstance = useRef(null);
    const editorContainer = useRef(null);

    const removeCoverImg = () => {
        setCoverUrl("");
        setCoverImg("");
    };

    const handleCoverImg = async () => {
        const data = new FormData();
        data.append("cover-img", coverImg[0]);
        try {
            const response = await fetch(`${BASE_URL}/blog/cover-img`, {
                method: "POST",
                body: data,
            });

            const res = await response.json();
            if (response.ok) {
                setCoverUrl(res.url);
                console.log("Cover image uploaded successfully", res);
            } else {
                console.log("Failed to upload Cover image", res);
            }
        } catch (error) {
            console.error("Error : ", error);
        }
    };

    // Editor
    useEffect(() => {
        if (!editorInstance.current) {
            editorInstance.current = new EditorJS({
                holder: editorContainer.current,
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true, // Enable inline toolbar for better editing experience
                        config: {
                            placeholder: "Enter a header",
                            levels: [1, 2, 3],
                            defaultLevel: 2,
                        },
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                    code: {
                        class: CodeTool,
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                /**
                                 * Upload function that sends image to the backend and uploads it to Cloudinary.
                                 */
                                uploadByFile: async (file) => {
                                    const formData = new FormData();
                                    formData.append("image", file);

                                    return await fetch(
                                        `${BASE_URL}/blog/uploadImage`,
                                        {
                                            method: "POST",
                                            body: formData,
                                        }
                                    )
                                        .then((response) => response.json())
                                        .then((result) => {
                                            if (result.success) {
                                                return {
                                                    success: 1,
                                                    file: {
                                                        url: result.url,
                                                    },
                                                };
                                            } else {
                                                throw new Error(
                                                    "Upload failed"
                                                );
                                            }
                                        })
                                        .catch((error) => {
                                            console.error(
                                                "Error uploading image:",
                                                error
                                            );
                                            return { success: 0 };
                                        });
                                },
                            },
                            caption : false,
                        },
                    },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                },
                placeholder: "Write your blog here...",
                data : blog?.content,
                onChange: async () => {
                    const outputData = await editorInstance.current.save();
                    setContent(outputData);
                },
            });
        }

        return () => {
            if (
                editorInstance.current &&
                typeof editorInstance.current.destroy === "function"
            ) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, []);
    
    const onDraft = async () => {
        const savedData = await editorInstance.current.save();
        console.log("Saved Data: ", savedData);
        setContent(savedData);
        const blogId = blog?.id;
        const form = {
            coverImage: coverUrl,
            title: title,
            subTitle: subTitle,
            content: JSON.stringify(content),
            blogId : blogId
        };

        try {
            let response = {};
            console.log("blogid : ", blogId);
            if(blogId){
                response = await fetch(`${BASE_URL}/blog/updateDraft`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                });
            }
            else{
                response = await fetch(`${BASE_URL}/blog/draft`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                });
            }

            const data = await response.json();
            if(data.success){
                console.log("Saved as draft successfully : ", data);
                toast.success("Saved as draft Successfully");
                localStorage.removeItem("Blog");
                navigate('/');
            }
            else{
                console.log("Error saving draft : ", data);
                toast.error("Error saving draft");
            }
        } catch (error) {
            console.log("Error saving draft : ", error);
            toast.error("Error saving draft");
        }
    }

    const onPublish = async () => {
        const savedData = await editorInstance.current.save();
        console.log("Saved Data: ", savedData);
        setContent(savedData);
        const blogId = blog?.id;
        const form = {
            coverImage: coverUrl,
            title: title,
            subTitle: subTitle,
            content: JSON.stringify(content),
            blogId : blogId
        };
        console.log(form);
        try {
            let response = {};
            console.log("blogid : ", blogId);
            if (blogId) {
                response = await fetch(`${BASE_URL}/blog/publishDraft`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                });
            } else {
                response = await fetch(`${BASE_URL}/blog/publish`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                });
            }

            const data = await response.json();
            if(data.success){
                console.log("Blog saved successfully : ", data);
                toast.success("Blog published Successfully");
                localStorage.removeItem("Blog")
                navigate('/');
            }
            else{
                console.log("Error publishing the blog : ", data);
                toast.error("Error publishing the blog");
            }
        } catch (error) {
            console.log("Error publishing the blog : ", error);
            toast.error("Error publishing the blog");
        }
    };

    return (
        <div className="min-h-fit relative pt-20 pb-10 w-full bg-slate-900">
            <Navbar
                hideSearch={true}
                hideCreate={true}
            />
            <div className="my-10 min-h-screen w-11/12 sm:w-9/12 mx-auto flex flex-col gap-5">
                {coverUrl != "" ? (
                    <div className="relative w-fit">
                        <div
                            onClick={removeCoverImg}
                            className="absolute cursor-pointer right-0 m-2 sm:m-5 rounded-xl p-1 sm:p-5 top-0 z-40 bg-slate-600">
                            <RxCross1 className="text-black text-2xl sm:text-3xl font-extrabold" />
                        </div>
                        <img
                            src={coverUrl}
                            alt="Cover Image"
                            className="-z-40 rounded-md"
                        />
                    </div>
                ) : (
                    <div className="flex cursor-pointer gap-3 items-center bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg px-3 py-2 w-fit justify-center">
                        <FaImage className="text-white text-xl" />
                        <input
                            onChange={(e) => setCoverImg(e.target.files)}
                            type="file"
                            placeholder="Add Cover"
                            className="hidden"
                            id="cover"
                        />
                        <label className="font-semibold cursor-pointer text-white text-lg" htmlFor="cover">Cover</label>
                        {coverImg ? (
                            <button onClick={handleCoverImg}>Upload</button>
                        ) : null}
                    </div>
                )}
                <div>
                    {/* Title field */}
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full outline-none text-3xl p-4 font-semibold bg-slate-800 rounded-lg"
                        type="text"
                        placeholder="Title"
                        value={title}
                    />
                </div>
                <div>
                    {/* Subtitle field */}
                    <input
                        onChange={(e) => setSubTitle(e.target.value)}
                        className="w-full flex items-center placeholder:text-2xl outline-none text-xl p-4 font-semibold bg-slate-800 rounded-lg"
                        type="text"
                        placeholder="Subtitle"
                        value={subTitle}
                    />
                </div>
                <div className="w-full">
                    {/* Editor.js container */}
                    <div
                        id="editorjs"
                        ref={editorContainer}
                        className="bg-slate-800 w-full px-7 py-4 min-h-[500px] rounded-xl"
                    />
                </div>
                <button
                    onClick={onDraft}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white mb-1 text-md font-semibold">
                    Save as Draft
                </button>
                <button
                    onClick={onPublish}
                    className="px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white transition-colors mb-10 text-md font-semibold">
                    Publish
                </button>
            </div>
        </div>
    );
};

export default CreateBlog;
