import './css/base.css'
import './css/QRgen.css'
import { useState } from 'react';
import { auth, newCode, getCode } from "./database.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { ReactQRCode } from '@lglab/react-qr-code'

export default function QRgen(props) {
    const [user, loading] = useAuthState(auth); // get session data
    const [event, setEvent] = useState(false); // for clickEvent conditioned display
    const [code, setCode] = useState("");

    const makeRandom = (seed) => { // function makes a random string out of seed
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        characters += seed;
        let charactersLength = characters.length;
        let seedLength       = seed.length;
        charactersLength += seedLength;
        for ( let i = 0; i < seedLength; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async function clickEvent() { // handle click event
        if (!event) {
            setEvent(true);
            while (loading); // wait for session data to load
            newCode(makeRandom(user.email));
            setCode(await getCode());
        }
        else {
            setEvent(false);
            newCode("none");
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
                <div className='display-box'>
                    <h1 className='title'>Generate QR code</h1>
                    <div className='display-column'>
                        {!event && 
                        <p>
                            Clicking on the button will generate a QR login code for SmartBin. 
                            Code will be available for 5 minutes, after that, you will be required to generate a new one.
                        </p>}
                        {event && <ReactQRCode size={512} value={ code }/>}
                        <button className="pageButton" onClick={clickEvent}>
                            {!event && "Generate"}
                            {event && "Reset"}
                        </button>
                    </div>
                </div>
            </div>
            <footer>
                <p>© Smart Bin 2026</p> 
            </footer>
        </>
    )
}