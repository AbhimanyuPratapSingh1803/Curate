import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    deletedBlog : false,
}

export const userSlice = createSlice({
    name : "user",
    initialState : initialState,

    reducers : {
        setDeletedBlog : (state) => {
            state.deletedBlog = !state.deletedBlog;
        }
    }
});

export const {setDeletedBlog} = userSlice.actions;
export default userSlice.reducer;