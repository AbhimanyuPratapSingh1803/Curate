import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import RecommendedBlog from "../../components/RecommendedBlog";
import {useSelector, useDispatch} from "react-redux"
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const Published = () => {
    const [published, setPublished] = useState([]);
    const [loading, setLoading] = useState(true);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const {deletedBlog} = useSelector((state) => state);
    console.log(deletedBlog);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPublished = async () => {
            const user = JSON.parse(localStorage?.getItem("User"));
            const id = { id: user._id };
            console.log(id.id);

            try {
                const response = await fetch(`${BASE_URL}/blog/fetch-published`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(id),
                });

                const data = await response.json();
                if (data.success) {
                    console.log("Fetched all the published blogs : ", data);
                    setPublished(data.data);
                    setLoading(false);
                    console.log(published);
                }
            } catch (error) {
                console.error("Error fetching published blogs : ", error);
            }
        };

        fetchPublished();
    }, [deletedBlog]);

    if(loading){
        return(
            <div className='w-screen h-screen flex items-center justify-center bg-slate-950'>
                <span className="text-blue-600 loading loading-infinity loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 top-0 relative min-h-screen pt-20 pb-28 sm:pb-10 w-screen">
            <Navbar hideSearch={true}/>
            <div role="tablist" className="tabs mt-5 ml-5 tabs-bordered">
                <input
                    type="radio"
                    name="my_tabs_1"
                    role="tab"
                    className="tab font-medium text-gray-300"
                    aria-label="Drafts"
                    onClick={() => navigate("/drafts")}
                />
                {/* <div role="tabpanel" className=" p-10">Tab content 1</div> */}
                <div
                    role="tabpanel"
                    className="size-full tab-content mr-5 mt-10">
                    <div></div>
                </div>

                <input
                    type="radio"
                    name="my_tabs_1"
                    role="tab"
                    className="tab font-medium text-gray-300"
                    aria-label="Published"
                    defaultChecked
                    onClick={() => navigate("/published")}
                />
                <div
                    role="tabpanel"
                    className="size-full tab-content px-auto pr-3 mr-4 mt-10">
                    {published.length > 0 ? (
                        published.map((draft) => (
                            <RecommendedBlog
                                key={draft._id}
                                id={draft._id}
                                coverImage={draft.coverImage}
                                title={draft.title}
                                subTitle={draft.subTitle}
                                author={draft.author}
                                content={draft.content}
                                createdAt={draft.createdAt}
                                status={draft.status}
                                page={"myblogsPublished"}
                            />
                        ))
                    ) : (
                        <div className="mt-10 px-auto pr-2">
                            <p className="text-white text-center text-2xl font-semibold">
                                You haven't published any blog yet!!
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="bottom-0 w-full absolute">
                <Footer />
            </div>
        </div>
    );
};

export default Published;
