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

function App() {

    const routes = (
        <Router>
            <Routes>
                <Route path='/' exact element={<Home/>} />
                <Route path='/signup' exact element={<Signup/>} />
                <Route path='/login' exact element={<Login/>} />
                <Route path='/create' exact element={<CreateBlog/>} />
                <Route path='/drafts' exact element={<Drafts/>} />
                <Route path='/published' exact element={<Published/>} />
                <Route path='/blog/:id' exact element={<Blog/>} />
                <Route path='published/blog/:id' exact element={<Blog/>} />
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
