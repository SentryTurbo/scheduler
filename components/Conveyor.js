import react from "react"

import styles from '../styles/Conveyor.module.css';

import Link from "next/link";

export default function Conveyor(props){
    console.log(props.data);
    const querySymbol = props.href.includes("?") ? '&' : '?';


    return(
        <div className={styles['root']}>
            <div className={styles['content']}>
                    {
                        props.data &&
                        props.data.map((set) => <ConveyorElement id={set['id']} title={set['name']} href={props.href + querySymbol + "id=" + set['id']}/>)
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