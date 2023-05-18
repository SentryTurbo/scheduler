import react from "react"

import {BsFillTrophyFill} from 'react-icons/bs';

import styles from '../styles/Conveyor.module.css';

import Link from "next/link";

export default function Conveyor(props){
    console.log(props.data);
    const querySymbol = props.href.includes("?") ? '&' : '?';


    return(
        <div className={styles['root']} style={{width:'100%', maxWidth:'100vw'}}>
            <div className={styles['content']}>
                {
                    props.data &&
                    props.data.map((set) => 
                    <ConveyorElement id={set['id']} title={set['name']} href={props.href + querySymbol + "id=" + set[props.hrefkey]} 
                        titlesub={set['progress'] ? 'Progress: ' + set['progress'] + (set['percent'] ? ' (' + set['percent'] + '%)' : '') : ''}
                        bottsub={set['finish'] ? <BsFillTrophyFill/> : ''}
                    />
                    )
                }
            </div>
        </div>
    )
}

function ConveyorElement(props){    
    return(
        <div className={styles['element']}>
            <Link href={props.href}>
                <div className={styles['element-content']}>
                    <div>
                        <div className={styles['title']}>{props.title}</div>
                        <i>{props.titlesub}</i>
                    </div>
                    
                    <div>{props.bottsub}</div>
                </div>
            </Link>
        </div>
    )
}