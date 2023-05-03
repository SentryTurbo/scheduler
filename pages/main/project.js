import react, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Conveyor from "../../components/Conveyor";
import Panel from "../../components/Panel";
import Link from "next/link";

import {BsPlusCircle} from 'react-icons/bs';

import styles from '../../styles/Project.module.css';

import CreateMilestoneWindow from "../../components/Windows/CreateMilestoneWindow";

export default function Project(props){
    return(
        <Panel content={
            (
                <Page props={props}/>
            )
        }/>
    )
}

function Page(props){
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState(
        {
            'project':{},
            'milestones':[

            ]
        }
    );

    useEffect(()=>{
        console.log(router.query.id);
        
        fetch("http://localhost:80/scheduler/project.php?id="+router.query.id)
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
    },[router]);
    
    if(loading)
        return(
            <h1>loading</h1>
        )

    return(
        <div>
            <Link href="/main/">back</Link>
            <h1>{data.project.name}</h1>
            <div className={styles['grid']}>
                <div style={{display:'grid', gridTemplateRows:60}}>
                    <h2>Currently active milestone in progress:</h2>
                    <Milestone/>
                </div>
                <div style={{display:'grid', gridTemplateRows:60}}>
                    <h2>Up next:</h2>
                    <Milestone/>
                </div>
            </div>
            <div style={{paddingTop:60}}>
                <div>
                    <h1>Milestones <BsPlusCircle onClick={()=>{props.props.setWindow(<CreateMilestoneWindow projectId={router.query.id}/>);}} /></h1>
                    <Conveyor href={"/main/milestone?project="+router.query.id} data={data.milestones}/>
                </div>
            </div>
        </div>
    )
}

function Milestone(props){
    return(
        <div className={styles['grid-milestone']}>
            <div className={styles['grid-milestone-content']}>
                <div className={styles['title']}>Version 0.06b</div>
                <div>milestone</div>
            </div>
        </div>
    )
}