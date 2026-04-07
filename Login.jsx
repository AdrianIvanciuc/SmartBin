import './css/base.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "./database.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login(props) {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData,[name]: value});
    };

    async function handleSubmit(event) {
        event.preventDefault();
        signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
            const user = userCredential.user;
            setMessage('');
            alert("Login successful! Going back to main page...");
            navigate('/');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setMessage("Invalid email/password!");
        }); 
    };

    return(
        <>
            <div id="header">
                <div className="header-element">
                    <button id="menuButton" onClick={props.sidebar}>☰</button>
                    <h1>Welcome to Smart Bin!</h1>
                </div>
            </div>
            <div id="main">
                <div className='display-box'>
                    <h1 className='title'>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <p>{ message }</p>
                        <label>Email:</label>
                        <input 
                            type='email' 
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <label>Password:</label>
                        <input 
                            type='password' 
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button type='submit' className='pageButton'>Submit</button>
                    </form>
                </div>
            </div>
            <footer>
                <p>© Smart Bin 2026</p> 
            </footer>
        </>
    )
}