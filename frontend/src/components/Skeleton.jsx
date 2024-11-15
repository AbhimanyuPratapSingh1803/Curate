import React from "react";

const Skeleton = () => {
    return (
        <div className="w-[80%] sm:w-3/5 h-fit flex flex-col pb-24 gap-7 justify-start items-center">
            <div className="flex flex-col items-center sm:justify-between sm:flex-row w-full gap-8">
                <div className="w-full sm:w-[60%] flex flex-col pt-2 gap-4">
                    <div className="flex items-center gap-4">
                            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-4">
                            <div className="skeleton h-4 w-20"></div>
                            <div className="skeleton h-4 w-28"></div>
                        </div>
                    </div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                </div>
                <div className="skeleton h-36 w-full sm:w-1/3"></div>
            </div>
            <div className="flex flex-col items-end sm:justify-between sm:flex-row w-full gap-8">
                <div className="w-full sm:w-[60%] flex flex-col pt-2 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-4">
                            <div className="skeleton h-4 w-20"></div>
                            <div className="skeleton h-4 w-28"></div>
                        </div>
                    </div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                </div>
                <div className="skeleton h-36 w-full sm:w-1/3"></div>
            </div>
        </div>
    );
};

export default Skeleton;
