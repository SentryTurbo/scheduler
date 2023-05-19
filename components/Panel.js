import react from "react";

import styles from '../styles/Main.module.css';
import ProfileWindow from "./Windows/Profile";

import { BsPerson, BsSearch } from "react-icons/bs";
import SearchWindow from "./Windows/Search";

export default function Panel(props){
    return(
        <div className={styles['root']}>
            <div className={styles['utils']}>
                <PanelUtility onClick={()=>{props.setWindow(<ProfileWindow setWindow={props.setWindow}/>)}} pad={50}>
                    <BsPerson style={{fontSize:'2em'}}/>
                </PanelUtility>
                <PanelUtility onClick={()=>{props.setWindow(<SearchWindow setWindow={props.setWindow}/>)}} pad={50}>
                    <BsSearch style={{fontSize:'1.6em'}}/>
                </PanelUtility>
            </div>
            <div className={styles['window']}>
                <div className={styles['window-content']} style={{maxWidth:'90vw'}}>
                    {props.content}
                </div>
            </div>
        </div>
    )
}

function PanelUtility(p){
    return(
        <div onClick={p.onClick} style={{width:'100%', height:50, marginTop:p.pad, backgroundColor:'rgba(0,0,0,0.2)', cursor:'pointer'}}>
            <div style={{display:'flex', height:'100%', color:'rgba(255,225,225,0.9)', flexWrap:'wrap', placeContent:'center'}}>
                {p.children}
            </div>
        </div>
    )
}