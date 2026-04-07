import './css/base.css'
import './css/Account.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "./database.js";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Account(props) {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [value, setValue] = useState("");
    const [number1, setNumber1] = useState(0);
    const [number2, setNumber2] = useState(0);
    
    const ClickEvent = (name) => {
        if (name == "email1"){
            if (number1 == 0){
                setShow1(!show1);
                setNumber1(1);
            }
            else {
                setShow1(!show1);
                setNumber1(0);
            }
        }
        if (name == "email2"){
            setShow1(!show1);
            setNumber1(0);
        }
        if (name == "password1"){
            if (number2 == 0){
                setShow2(!show2);
                setNumber2(1);
            }
            else {
                setShow2(!show2);
                setNumber2(0);
            }
        }
        if (name == "password2"){
            setShow2(!show2);
            setNumber2(0);
        }
    }

    const logOut = () => {
        signOut(auth)
        .then(
            navigate('/')
        );
    }

    function handleChange(e) {
        setValue(e.target.value);
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
                        <label>Email: {!loading && !show1 && user.email} </label>
                        {show1 && <input type="text" value={value} onChange={handleChange}></input>}
                        {!show1 && <button className="pageButton" onClick={() => ClickEvent("email1")}>Reset email</button>}
                    </div>
                    {show1 && <div className='display-row'>
                        <button className="pageButton" onClick={() => ClickEvent("email1")}>Confirm</button>
                        <button className="pageButton" onClick={() => ClickEvent("email2")}>Cancel</button>
                    </div>}
                    <div className='display-row'>
                        {show2 && <label>New password: </label>}
                        {show2 && <input type="text" value={value} onChange={handleChange}></input>}
                        {!show2 && <button className="pageButton" onClick={() => ClickEvent("password1")}>Reset password</button>}
                    </div>
                    {show2 && <div className='display-row'>
                        <button className="pageButton" onClick={() => ClickEvent("password1")}>Confirm</button>
                        <button className="pageButton" onClick={() => ClickEvent("password2")}>Cancel</button>
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