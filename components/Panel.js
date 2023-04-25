import react from "react";

import styles from '../styles/Main.module.css';

export default function Panel(props){
    return(
        <div className={styles['root']}>
            <div className={styles['utils']}>
                utils
            </div>
            <div className={styles['window']}>
                <div className={styles['window-content']}>
                    {props.content}
                </div>
            </div>
        </div>
    )
}