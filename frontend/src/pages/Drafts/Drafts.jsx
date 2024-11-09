import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import RecommendedBlog from "../../components/RecommendedBlog";
import {useSelector, useDispatch} from "react-redux"
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const Drafts = () => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const {deletedBlog} = useSelector((state) => state);
    console.log(deletedBlog);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDrafts = async () => {
            const user = JSON.parse(localStorage?.getItem("User"));
            const id = { id: user._id };
            console.log(id.id);

            try {
                const response = await fetch(`${BASE_URL}/blog/fetch-drafts`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(id),
                });

                const data = await response.json();
                if (data.success) {
                    console.log("Fetched all the drafts : ", data);
                    setDrafts(data.data);
                    setLoading(false);
                    console.log(drafts);
                }
            } catch (error) {
                console.error("Error fetching drafts : ", error);
            }
        };

        fetchDrafts();
    }, [deletedBlog]);

    if(loading){
        return(
            <div className='w-screen h-screen flex items-center justify-center bg-slate-950'>
                <span className="text-blue-600 loading loading-infinity loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 top-0 relative min-h-screen pt-20 pb-10 w-screen">
            <Navbar hideSearch={true}/>
            <div role="tablist" className="tabs mt-5 ml-5 tabs-bordered">
                <input onClick={() => navigate("/drafts")} type="radio" name="my_tabs_1" role="tab" className="tab font-medium text-gray-300" aria-label="Drafts" defaultChecked/>
                <div role="tabpanel" className="size-full tab-content mr-5 pr-3 mt-10">
                    {drafts.length > 0 ? 
                        drafts.map((draft) => (
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
                                page={"myblogsDraft"}
                            />
                        )) : 
                        <div className="mt-10 px-auto pr-2">
                            <p className="text-white text-2xl font-semibold">You haven't created any drafts yet!!</p>
                        </div>
                    }
                </div>

                <input onClick={() => navigate("/published")} type="radio" name="my_tabs_1" role="tab" className="tab font-medium text-gray-300" aria-label="Published"/>
                <div role="tabpanel" className="size-full tab-content px-auto mr-5 mt-10">
                    <div></div>
                </div>

            </div>
            <div className="bottom-0 w-full absolute">
                <Footer/>
            </div>
        </div>
    );
};

export default Drafts;
