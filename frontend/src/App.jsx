import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home/Home'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import CreateBlog from './pages/CreateBlog/CreateBlog'
import Drafts from './pages/Drafts/Drafts'
import Blog from './pages/BlogPage/Blog'
import Published from './pages/Published/Published'
import Bookmark from './pages/Bookmark/Bookmark'

function App() {

    const routes = (
        <Router>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/signup' element={<Signup/>} />
                <Route path='/login'  element={<Login/>} />
                <Route path='/create' element={<CreateBlog/>} />
                <Route path='/drafts' element={<Drafts/>} />
                <Route path='/bookmarks' element={<Bookmark/>} />
                <Route path='/published' element={<Published/>} />
                <Route path='/blog/:id' element={<Blog/>} />
                <Route path='published/blog/:id' element={<Blog/>} />
                <Route path='bookmarks/blog/:id' element={<Blog/>} />
            </Routes>
        </Router>
    );

    return (
      <div className='min-h-screen'>
        {routes}
      </div>
    )
}

export default App
