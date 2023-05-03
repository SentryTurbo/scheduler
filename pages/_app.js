import { useState } from 'react';
import WindowBase from '../components/WindowBase';
import ConfirmWindow from '../components/Windows/ConfirmWindow';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    const [windowContent, setWindowContent] = useState(null);
    const [confirmation, setConfirmation] = useState({
        onConfirm:() => console.log('hi')
    });

    return(
        <div style={{position:'relative'}}>
            {
                confirmation.onConfirm != null &&
                <div style={{position:'absolute', width:'100%', zIndex:101, height:'100%'}}>
                    <WindowBase>
                        {<ConfirmWindow confirmation={{read:confirmation, set:setConfirmation}}/>}
                    </WindowBase>
                </div>
            }
            {
                windowContent &&
                <div style={{position:'absolute', width:'100%', zIndex:100, height:'100%'}}>
                    <WindowBase setWindow={setWindowContent}>
                        {windowContent}
                    </WindowBase>
                </div>
            }
            <Component setWindow={setWindowContent} {...pageProps} />
        </div>
    ) 
}