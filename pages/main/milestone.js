import react, { useEffect, useState } from "react"
import Conveyor from "../../components/Conveyor";
import Panel from "../../components/Panel";
import Link from "next/link";
import { useRouter } from 'next/router'

import styles from '../../styles/Milestone.module.css';

export default function Milestone(props){
    return(
        <Panel content={
            (
                <Page/>
            )
        }/>
    )
}

function Page(props){
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState(
        {
            'milestone':{},
            'unfinishedassignments':[

            ],
            'finishedassignments':[

            ]
        }
    );

    useEffect(()=>{
        fetch("http://localhost:80/scheduler/milestone.php?id="+router.query.id)
            .then(res => res.json())
            .then((result) => {
                console.log(result);

                setData(result);
                setLoading(false);
            },
            (error) => {
                //console.log(error);
                //setLoading(false);
            }
        )
    },[]);
    
    if(loading)
        return(
            <h1>loading</h1>
        )

    return(
        <div>
            <Link href={router.query.project ? "/main/project?id="+router.query.project : "/main"}>back</Link>
            <h1>{data.milestone.name}</h1>
            <h1>Unfinished Assignments</h1>
            <div>
                <AssignmentList data={data.unfinishedassignments}/>
            </div>
            <h1>Finished Assignments</h1>
            <div>
                <AssignmentList data={data.finishedassignments}/>
            </div>
        </div>
    )
}

function AssignmentList(props){
    return(
        <div className={styles['list']}>
            {props.data.map((set) => <Assignment title={set.name}/>)}
        </div>
    )
}

function Assignment(props){
    return(
        <div className={styles['assignment']}>
            <div className={styles['assignment-info']}>
                {props.title}
            </div>
        </div>
    )
}