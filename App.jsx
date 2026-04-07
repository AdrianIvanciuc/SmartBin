import './css/base.css'
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { auth } from "./database.js";
import Home from './Home.jsx'
import Account from './Account.jsx'
import QRgen from './QRgen.jsx';
import Login from './Login.jsx'
import Register from './Register.jsx'
import emailjs from "@emailjs/browser"

export default function App(){

    useEffect(() => { // initialize mail function
    emailjs.init({
        publicKey: import.meta.env.VITE_PUBLIC_KEY,
    });
    }, []);

    const [user] = useAuthState(auth);
    let bool = 0;

    const sidebar = () => {
        if (bool == 0){
            document.getElementById('sidebar').style.width = "15vw";
            document.getElementById('main').style.marginLeft = "15vw";
            document.getElementById('header').style.marginLeft = "15vw";
            document.querySelector('footer').style.marginLeft = "15vw";
            bool = 1;
        }
        else{
            document.getElementById('sidebar').style.width = "0";
            document.getElementById('main').style.marginLeft = "0";
            document.getElementById('header').style.marginLeft = "0";
            document.querySelector('footer').style.marginLeft = "0";
            bool = 0;
        }
    }
    
    return(
        <BrowserRouter>
            <div id="sidebar">
                <Link to="/" onClick={sidebar}>Home</Link>
                {user && <Link to="/Account" onClick={sidebar}>Account</Link>}
                {user && <Link to="/QRgen" onClick={sidebar}>Use SmartBin</Link>}
                {!user && <Link to="/Login" onClick={sidebar}>Login</Link>}
                {!user && <Link to="/Register" onClick={sidebar}>Register</Link>}
            </div>
            <Routes>
                <Route path="/" element={<Home sidebar={sidebar}/>}/>
                {user && <Route path="/Account" element={<Account sidebar={sidebar}/>}/>}
                {user && <Route path="/QRgen" element={<QRgen sidebar={sidebar}/>}/>}
                {!user && <Route path="/Login" element={<Login sidebar={sidebar}/>}/>}
                {!user && <Route path="/Register" element={<Register sidebar={sidebar}/>}/>}
            </Routes>
        </BrowserRouter>
    )
}