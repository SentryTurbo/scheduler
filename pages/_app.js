import { useState } from 'react';
import WindowBase from '../components/WindowBase';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    const [windowContent, setWindowContent] = useState(null);
    
    return(
        <div style={{position:'relative'}}>
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