import react, { useEffect, useState } from "react"
import Conveyor from "../../components/Conveyor";
import Panel from "../../components/Panel";
import Link from "next/link";

import CreateProjectWindow from "../../components/Windows/CreateProjectWindow";

import {BsPlusCircle} from 'react-icons/bs';

export default function Index(props){
    return(
        <Panel content={
            (
                <Page props={props}/>
            )
        }/>
    )
}

function Page(props){
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState(
        {
            'assignments':[

            ],
            'milestones':[

            ],
            'projects':[

            ]
        }
    );

    useEffect(()=>{
        fetch("http://localhost:80/scheduler/main.php")
            .then(res => res.json())
            .then((result) => {
                console.log(result);

                setData(result);
                setLoading(false);
            },
            (error) => {
                console.log(error);
                setLoading(false);
            }
        )
    },[]);
    
    if(loading)
        return(
            <h1>loading</h1>
        )

    return(
        <div>
            <div>
                <h1>Dashboard</h1>
            </div>
            <div style={{paddingTop:20}}>
                <h2>Projects <BsPlusCircle onClick={()=>{props.props.setWindow(<CreateProjectWindow/>);}}/></h2>
                <div>
                    <Conveyor href="/main/project" data={data.projects}/>
                </div>
            </div>
            <div style={{paddingTop:20}}>
                <h2>Milestones</h2>
                <div>
                    <Conveyor href="/main/milestone" data={data.milestones}/>
                </div>
            </div>
            <div style={{paddingTop:20}}>
                <h2>Assignments</h2>
                <div>
                    <Conveyor href="/main/milestone" data={data.assignments}/>
                </div>
            </div>
        </div>
    );
}