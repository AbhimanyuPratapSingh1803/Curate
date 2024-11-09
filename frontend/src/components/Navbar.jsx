import React from "react";
import User from "./User";
import Search from "./Search";
import Modal from "./Modal";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { TfiInfinite } from "react-icons/tfi";

const Navbar = ({ hideSearch = false, hideCreate = false }) => {
    const navigate = useNavigate();

    return (
        <nav className="w-screen z-50 top-0 mb-5 backdrop-blur-xl fixed text-white border-b-2 border-slate-800 items-center flex justify-between">
            <div className="flex left-5 items-center">
                <Link to={"/"}>
                    <div className="flex gap-2 items-center py-5 ml-5 mr-5">
                        <TfiInfinite className="text-3xl font-bold text-blue-500" />
                        <p className="text-2xl cursor-pointer font-semibold">
                            Curate
                        </p>
                    </div>
                </Link>
            </div>
            <div className="flex gap-3 items-center mr-2">
                {hideSearch ? null : <Search />}
                {hideCreate ? null : (
                    <Link to={"/create"}>
                        {/* <button className="flex justify-center px-auto h-[38px] w-24 gap-2 transition-all active:h-[40px] active:w-[100px] items-center rounded-lg bg-blue-600 text-md font-semibold">
                            <HiMiniPencilSquare className="text-xl font-semibold" />
                            <p className="text-base">Write</p>
                        </button> */}
                        <button className="btn btn-circle bg-blue-600">
                            <HiMiniPencilSquare className="text-xl font-semibold text-white" />
                        </button>
                    </Link>
                )}
                <User />
            </div>
        </nav>
    );
};

export default Navbar;
