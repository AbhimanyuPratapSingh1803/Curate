import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5";

const Search = ({handleSearch}) => {

    const [value, setValue] = useState("")

    return (
        <div className='w-auto'>
            <div className='flex items-center w-[400px] relative'>
                <input
                    className='w-full outline-none text-white rounded-md px-5 py-1.5 bg-slate-500'
                    type="text"
                    placeholder='Search'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <IoSearch className='text-slate-700 text-xl right-3 absolute'/>
            </div>
            
        </div>
    )
}

export default Search
