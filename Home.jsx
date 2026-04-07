import './css/base.css'

export default function Home(props){
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
                    <h1 className='title'>What is SmartBin?</h1>
                    <p>
                        Taking care of our environment is an ever growing concern in today’s world. Ecological
                        policies have been implemented to combat this issue but most of them fall short. I
                        believe the best way to ensure that people recycle is to make it as convenient as
                        possible for them to do so. Smart Bin aims to be a device that can achieve this goal.
                    </p>
                    <p>
                        In Romania there already exists SGR, which was my main inspiration in coming up
                        with this idea. Smart bin will be an improvement to that system. Instead of getting
                        a voucher to a store you might not frequent, Smart Bin will send you money directly
                        to your bank account. Only a prior account creation on a web app linked to the
                        physical bin will be required. 
                    </p>
                    <p>
                        I will now give a summary of all the components that
                        would make up the final Smart Bin product: a web app that will serve as an account
                        creation tool for the physical bin, the physical prototype itself which will be connected
                        to the internet and have components such as a camera, and the final component, a
                        database that will store data about recyclable objects and user credentials.
                    </p>
                </div>
            </div>
            <footer>
                <p>© Smart Bin 2026</p> 
            </footer>
        </>
    )
}