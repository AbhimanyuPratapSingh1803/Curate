import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    // const {currentUser, isLoggedIn} = useSelector((state) => state.user);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(!password || !email){
            setError("All fields are required");
            return;
        }
        if(password.length < 8){
            setError("Please enter a valid password");
            return;
        }

        const formData = {email, password};
        try {
            const response = await fetch(`${BASE_URL}/users/login`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify(formData),
                credentials : "include"
            });

            const data = await response.json();
            // console.log(data.data.user.loggedInuser);
            if(response.ok){
                const user = JSON.stringify(data.data.user.loggedInuser);
                console.log(user);
                localStorage.setItem("User", user);
                const current = data.data.user.loggedInuser;
                console.log(typeof(current))
                navigate("/");
                setEmail("");
                setPassword("");
                console.log("login successful ", data);
                toast.success("Logged in Successfully!")
            }
            else{
                console.log("login failed ", data);
                toast.error("Failed to Login!")
            }
        } catch (error) {
            console.error("Error : ", error);
            toast.error("Failed to Login!")
        }
    }

    return (
        <div>
            <div class="min-h-screen bg-slate-900">
                <div class="mx-auto flex w-full items-stretch justify-between gap-10">
                    <div class="mt-20 flex w-full flex-col items-start justify-start p-6 md:w-1/2 lg:px-10">
                        <div class="w-full">
                            <h1 class="mb-2 text-5xl font-extrabold text-white">
                                Log in
                            </h1>
                            <p class="text-xs text-slate-400">
                                Before we start, please log into your account
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} class="my-14 flex w-full flex-col items-start justify-start gap-4">
                            <div class="flex w-full flex-col items-start justify-start gap-2">
                                <label class="text-xs text-slate-200">
                                    Email
                                </label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter an email..."
                                    autoComplete="false"
                                    class="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
                                />
                            </div>
                            <div class="flex w-full flex-col items-start justify-start gap-2">
                                <label class="text-xs text-slate-200">
                                    Password
                                </label>
                                <input
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter a password..."
                                    autoComplete="false"
                                    type="password"
                                    class="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
                                />
                            </div>
                            {error ? <p className="font-medium text-red-500 my-2">{error}</p> : null}
                            <button class="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">
                                Log in
                            </button>
                            <p class="my-14 text-sm font-light text-white">
                                Don&#x27;t have an account?{" "}
                                <Link to={"/signup"} className="underline font-medium">Create an account</Link>
                            </p>
                        </form>
                    </div>
                    <div class="fixed right-0 z-20 hidden h-screen w-1/2 md:block">
                        <img
                            class="h-full w-full object-cover"
                            src="./src/assets/login.jpg"
                            alt="register_image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
