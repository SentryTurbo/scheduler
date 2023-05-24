import { useState } from 'react';
import WindowBase from '../components/WindowBase';
import ConfirmWindow from '../components/Windows/ConfirmWindow';
import NotificationList from '../components/Notification';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    const [windowContent, setWindowContent] = useState(null);
    const [confirmation, setConfirmation] = useState({
        onConfirm:null
    });
    const [notifications,setNotifications] = useState(null);

    const addNotification = (p) =>{
        setNotifications(p);
    }

    return(
        <div style={{position:'relative'}}>
            <NotificationList notifs={notifications} setNotifs={setNotifications}/>
            {
                confirmation.onConfirm != null &&
                <div style={{position:'absolute', width:'100%', zIndex:101, height:'100%'}}>
                    <WindowBase setWindow={() => {setConfirmation({onConfirm:null})}}>
                        {<ConfirmWindow confirmation={{read:confirmation, set:setConfirmation}}/>}
                    </WindowBase>
                </div>
            }
            {
                windowContent &&
                <div style={{position:'absolute', width:'100%', zIndex:100, height:'100%'}}>
                    <WindowBase setWindow={() => {setWindowContent(null)}}>
                        {windowContent}
                    </WindowBase>
                </div>
            }
            <Component addNotif={addNotification} setWindow={setWindowContent} setConfirm={setConfirmation} {...pageProps} />
        </div>
    ) 
}