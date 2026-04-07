import './css/base.css'
import './css/Account.css'
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, updateEmail, updatePassword } from "firebase/auth";
import { auth } from "./database.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { makeRandom, sendMail } from './mail.js';

export default function Account(props) {
    
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [emailEvent1, setEmailEvent1] = useState(false);
    const [emailEvent2, setEmailEvent2] = useState(false);
    const [newMail, setNewMail] = useState('');
    const [passwordEvent, setPasswordEvent] = useState(false);
    const [message1, setMessage1] = useState('');
    const [message2, setMessage2] = useState('');
    const instructions = "Type the new password twice in order to reset the password, the password must be at least 8 characters long, contain at least a letter and at least a number.";
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const code = useMemo(() => {
        return makeRandom();
    }, []);
    
    const ClickEvent = (name) => {
        // reset email
        if (name == "email") {
            setMessage1("A verification code will be sent to the new email adress.");
            setEmailEvent1(!emailEvent1);
        }
        // new email input
        if (name == "emailConfirm1") {
            sendMail(input1, code);
            setNewMail(input1);
            setMessage1("Please confirm the verification code received on the new adress.");
            setEmailEvent1(!emailEvent1);
            setEmailEvent2(!emailEvent2);
        }
        // new email input cancel
        if (name == "emailCancel1") {
            setMessage1('');
            setEmailEvent1(!emailEvent1);
        }
        // email code input
        if (name == "emailConfirm2") {
            if (input1 == code) {
                updateEmail(auth.currentUser, newMail).then(() => {
                    setMessage1("Email reset successful.");
                    setEmailEvent2(!emailEvent2);
                }).catch((error) => {
                    setMessage1("Something went wrong, please try again.");
                    setEmailEvent2(!emailEvent2);
                });
            }
            else {
                setMessage1("Wrong input code! Try again.")
            }
        }
        // email code input cancel
        if (name == "emailCancel2") {
            setMessage1('');
            setEmailEvent2(!emailEvent2);
        }
        // reset password
        if (name == "password"){
            setPasswordEvent(!passwordEvent);
        }
        // new password input
        if (name == "passwordConfirm"){
            if (input2 == input3) {
                if (input2.length < 8)
                {
                    setMessage2("Password must be at least 8 characters long!");
                }
                else if (input2.search(/[a-z]/i) < 0)
                {
                    setMessage2("Password must have at least one letter!");
                }
                else if (input2.search(/[0-9]/) < 0)
                {
                    setMessage2("Password must have at least one number!");
                }
                else {
                    updatePassword(auth.currentUser, input2).then(() => {
                        setMessage2("Password updated succesfully.");
                        setPasswordEvent(!passwordEvent);
                    }).catch((error) => {
                        setMessage2("You have to re-authentificate in order to complete this process, log out and log in again.");
                        setPasswordEvent(!passwordEvent);
                    })
                }
            }
            else {
                setMessage2("Passwords do not match!");
            }
        }
        if (name == "passwordCancel"){
            setMessage2('');
            setPasswordEvent(!passwordEvent);
        }
    }

    const logOut = () => {
        signOut(auth)
        .then(
            navigate('/')
        );
    }

    function handleInput1(e) {
        setInput1(e.target.value);
    }
    function handleInput2(e) {
        setInput2(e.target.value);
    }
    function handleInput3(e) {
        setInput3(e.target.value);
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
                <div className='display-container'>
                    <h1 className='title'>Account</h1>
                    <h2 className='subtitle'>Personal Data</h2>
                    <div className='display-row'>
                        <label>{ message1 }</label>
                        {!emailEvent1 && !emailEvent2 && <label>Email: {!loading && user.email} </label>}
                        {!emailEvent1 && !emailEvent2 && <button className="pageButton" onClick={() => ClickEvent("email")}>Reset email</button>}
                    </div>
                    <div className='display-column'>
                        {emailEvent1 && <label>New email adress:</label>}
                        {emailEvent1 && <input type="text" onChange={handleInput1}></input>}
                        {emailEvent2 && <label>Code:</label>}
                        {emailEvent2 && <input type="text" onChange={handleInput1}></input>}
                    </div>
                    {emailEvent1 && <div className='display-row'>
                        <button className="pageButton" onClick={() => ClickEvent("emailConfirm1")}>Confirm</button>
                        <button className="pageButton" onClick={() => ClickEvent("emailCancel1")}>Cancel</button>
                    </div>}
                    {emailEvent2 && <div className='display-row'>
                        <button className="pageButton" onClick={() => ClickEvent("emailConfirm2")}>Confirm</button>
                        <button className="pageButton" onClick={() => ClickEvent("emailCancel2")}>Cancel</button>
                    </div>}
                    <div className='display-row'>
                        <label>{ message2 }</label>
                        {!passwordEvent && <button className="pageButton" onClick={() => ClickEvent("password")}>Reset password</button>}
                    </div>
                    {passwordEvent && <div className='display-column'>
                        <p>{ instructions }</p>
                        <label>New password: </label>
                        <input type="text" onChange={handleInput2}></input>
                        <label>Repeat new password: </label>
                        <input type="text" onChange={handleInput3}></input>
                    </div>}
                    {passwordEvent && <div className='display-row'>
                        <button className="pageButton" onClick={() => ClickEvent("passwordConfirm")}>Confirm</button>
                        <button className="pageButton" onClick={() => ClickEvent("passwordCancel")}>Cancel</button>
                    </div>}
                    <h2 className='subtitle'>Usage Metrics</h2>
                    <label>Recycled packages:</label>
                    <div className='display-row'>
                        <label>No rewards available.</label>
                        <button className="pageButton">Get Rewards</button>
                    </div>
                    <button className="pageButton" onClick={logOut}>Log out</button>
                </div>
            </div>
            <footer>
                <p>© Smart Bin 2026</p> 
            </footer>
        </>
    );
}