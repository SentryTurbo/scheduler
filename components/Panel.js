import react from "react";

import styles from '../styles/Main.module.css';
import ProfileWindow from "./Windows/Profile";

export default function Panel(props){
    return(
        <div className={styles['root']}>
            <div className={styles['utils']}>
                <PanelUtility onClick={()=>{props.setWindow(<ProfileWindow setWindow={props.setWindow}/>)}} pad={50}>
                    Profile
                </PanelUtility>
            </div>
            <div className={styles['window']}>
                <div className={styles['window-content']}>
                    {props.content}
                </div>
            </div>
        </div>
    )
}

function PanelUtility(p){
    return(
        <div onClick={p.onClick} style={{width:'100%', height:50, marginTop:p.pad, backgroundColor:'rgba(0,0,0,0.2)'}}>
            <div style={{display:'flex', height:'100%', color:'wheat', flexWrap:'wrap', placeContent:'center'}}>
                {p.children}
            </div>
        </div>
    )
}