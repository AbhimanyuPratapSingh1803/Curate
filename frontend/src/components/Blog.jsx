import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const Blog = ({ title, subtitle, owner, date, tags, image }) => {
    const [content, setContent] = useState("");

    const handleEditorChange = (content) => {
        setContent(content);
        console.log("Content was updated:", content);
    };

    return (
        <div className="text-center w-4/5">
            <div className="w-full my-10">
                <img src={image} alt="Blog Image" />
            </div>
            <div className="w-full">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="text-md text-slate-700 ">{subtitle}</p>
            </div>
            <div className="flex gap-3">
                <div className="w-full xl:w-1/3 ">
                    <img
                        src="../src/assets/FrostyLogo.jpg"
                        alt="Avatar"
                        className="size-10 rounded-full"
                    />
                    <p>{owner}</p>
                    <p>{date}</p>
                </div>
            </div>

            <div>
                <Editor
                    apiKey="your-api-key" // Optional: Add your API key for more features
                    value={content}
                    init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                            "codesample image", // Include codesample and image plugins
                        ],
                        toolbar:
                            "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help | \
            codesample image", // Add codesample and image to the toolbar
                        codesample_languages: [
                            { text: "HTML/XML", value: "markup" },
                            { text: "JavaScript", value: "javascript" },
                            { text: "CSS", value: "css" },
                            { text: "PHP", value: "php" },
                            { text: "Ruby", value: "ruby" },
                            { text: "Python", value: "python" },
                            { text: "Java", value: "java" },
                            { text: "C", value: "c" },
                            { text: "C#", value: "csharp" },
                            { text: "C++", value: "cpp" },
                        ],
                    }}
                    onEditorChange={handleEditorChange}
                />
            </div>

            <div className="flex justify-center items-center gap-5 mb-8">
                <div className="flex gap-1 items-center justify-center">
                    <MdChat />
                </div>
                <div className="flex gap-1 items-center justify-center">
                    <AiTwotoneLike />
                    <p>50</p>
                </div>
                <IoBookmarks className="text-lg" />
            </div>

            <div className="mx-auto flex items-center justify-center">
                {tags.array.forEach((tag) => {
                    <div>
                        <p className="rounded-full font-medium p-[6px] bg-blue-400">
                            {tag}
                        </p>
                    </div>;
                })}
            </div>
        </div>
    );
};

export default Blog;
