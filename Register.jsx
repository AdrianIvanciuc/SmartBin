import './css/base.css'
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, validateEmail, newUser } from "./database.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import emailjs from "@emailjs/browser"

export default function Register(props) {
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        repeatPassword: '',
        emailCode: ''
    });
    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData,[name]: value});
    }
    const [emailEvent, setEmailEvent] = useState(false);
    const [message, setMessage] = useState('');
    
    const makeRandom = () => { // function makes a random 16 char string
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < 16; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const code = useMemo(() => {
        return makeRandom();
    }, []);

    async function handleSubmit(event) { // submit for register form
        event.preventDefault();
        if (formData.password == formData.repeatPassword) { // if passwords match
            if (formData.password.length < 8)
            {
                setMessage("Password must be at least 8 characters long!");
            }
            else if (formData.password.search(/[a-z]/i) < 0)
            {
                setMessage("Password must have at least one letter!");
            }
            else if (formData.password.search(/[0-9]/) < 0)
            {
                setMessage("Password must have at least one number!");
            }
            else {
                let emailParams = {
                message: code,
                to_email: formData.email
                }
                let result = await validateEmail(formData.email);
                if (result == false)
                {
                    setMessage("There already is an account bound to the provided email adress, try signing in instead!");
                }
                else
                {
                    setMessage('');
                    emailjs.send(import.meta.env.VITE_SERVICE_ID, import.meta.env.VITE_TEMPLATE_ID, emailParams).then(
                        (response) => {
                            console.log('SUCCESS!', response.status, response.text);
                        },
                        (error) => {
                            console.log('FAILED...', error);
                        },
                    );
                    setEmailEvent(!emailEvent);
                }
            }
        } 
        else {
            setMessage("Passwords do not match!");
        }
    };

    async function handleEmailSubmit(event) { // second form for email validation
        event.preventDefault();
        if (formData.emailCode == code) {
            alert("Email verification successful! Going back to main page...");
            createUserWithEmailAndPassword(auth, formData.email, formData.password) // we create new fb user
            .then((userCredential) => {
                const user = userCredential.user;
                newUser();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
            navigate('/');
        }
        else {
            setMessage("Wrong input code! Try again.");
        }
    }

    return(
        <>
            <div id="header">
                <div className="header-element">
                    <button id="menuButton" onClick={props.sidebar}>☰</button>
                    <h1>Welcome to Smart Bin!</h1>
                </div>
            </div>
            <div id="main">
                {!emailEvent && <div className='display-box'>
                    <h1 className='title'>Register</h1>
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
                        <label>Repeat Password:</label>
                        <input 
                            type='password' 
                            name='repeatPassword'
                            value={formData.repeatPassword}
                            onChange={handleChange}
                        />
                        <p>Password must be 8 characters long, have at least one letter and one numeral.</p>
                        <button type='submit' className='pageButton'>Submit</button>
                    </form>
                </div>}
                {emailEvent && <div className='display-box'>
                    <h1 className='title'>Verify email</h1>
                    <form onSubmit={handleEmailSubmit}>
                        <p>A verification code was sent to the provided email adress: { formData.email }</p>
                        <p>To complete the register procedure, input the code you received in the field below.</p>
                        <p>{ message }</p>
                        <label>Code:</label>
                        <input 
                            type='text' 
                            name='emailCode'
                            value={formData.emailCode}
                            onChange={handleChange}
                        />
                        <button type='submit' className='pageButton'>Submit</button>
                    </form>
                </div>}
            </div>
            <footer>
                <p>© Smart Bin 2026</p> 
            </footer>
        </>
    )
}