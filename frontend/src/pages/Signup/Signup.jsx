import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setName] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!password || !email || !fullName){
            setError("All fields are required");
            return;
        }
        if(password.length < 8){
            setError("Please enter a valid password");
            return;
        }

        const formData = {fullName, email, password};
        try {
            const response = await fetch(`${BASE_URL}/users/register`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(formData)
            });
            const data = await response.json();
            if(response.ok){
                navigate("/login");
                setName("");
                setEmail("");
                setPassword("");
                console.log("Signup successful ", data);
            }
            else{
                console.log("Signup failed ", data);
            }
        } catch (error) {
            console.error("Error : ", error);
        }

        setError(null);
    };

    return (
        <div>
            <div class=" bg-slate-900">
                <div class="mx-auto flex w-full items-stretch justify-between gap-10">
                    <div class="min-h-screen flex w-full flex-col items-start justify-center p-6 md:w-1/2 lg:px-10">
                        <div class="mt-10 w-full">
                            <h1 class="mb-2 text-5xl font-extrabold text-white">
                                Register
                            </h1>
                            <p class="text-xs text-slate-400">
                                Before we start, please create your account
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} class="my-10 flex w-full flex-col items-start justify-start gap-4">
                            <div class="flex w-full flex-col items-start justify-start gap-2">
                                <label class="text-xs text-slate-200">
                                    Full Name
                                </label>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name..."
                                    autoComplete="false"
                                    class="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
                                />
                            </div>
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
                            {error ? <p className="font-medium text-red-500">{error}</p> : null}
                            <button
                                type="submit"
                                class="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">
                                Create Account
                            </button>
                            <p class="my-14 text-sm font-light text-white ">
                                Already registered?{" "}
                                <Link
                                    to={"/login"}
                                    className="underline font-medium">
                                    Sign in to your account
                                </Link>
                            </p>
                        </form>
                    </div>
                    <div class=" fixed right-0 z-20 hidden h-full w-1/2 md:block">
                        <img
                            class="max-h-screen h-full w-full object-cover"
                            src="./src/assets/signup.jpg"
                            alt="register_image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
