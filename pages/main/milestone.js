import react, { useEffect, useState } from "react"
import Conveyor from "../../components/Conveyor";
import Panel from "../../components/Panel";
import Link from "next/link";
import { useRouter } from 'next/router'

import { InputButton } from "../../components/Modules/FormModules";

import {BsPlusCircle} from 'react-icons/bs';
import CreateAssignmentWindow from "../../components/Windows/CreateAssignmentWindow";
import AssignmentWindow from "../../components/Windows/AssignmentWindow";

import styles from '../../styles/Milestone.module.css';

export default function Milestone(props){
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
    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState({name:'name'});

    const [data, setData] = useState(
        {
            'milestone':{},
            'unfinishedassignments':[

            ],
            'finishedassignments':[

            ]
        }
    );

    const deleteMilestone = () => {
        fetch("http://localhost:80/scheduler/actions/deletemilestone.php?id="+router.query.id, {method:'get'})
            .then(res => res.json())
            .then((result) => {
                router.push('/main/');
                console.log(result);
            },
            (error) => {
                console.log(error);
            })
    }

    const refreshData = () => {
        fetch("http://localhost:80/scheduler/milestone.php?id="+router.query.id)
            .then(res => res.json())
            .then((result) => {
                console.log(result);

                setData(result);
                setLoading(false);
            },
            (error) => {
                console.log(error);
                //setLoading(false);
            }
        )
    }

    const toggleEdit = async () => {
        setEdit(!edit);

        if(edit){
            const sendData = {...editData,['id']:data.milestone.id};

            const JSONdata = JSON.stringify(sendData);
            const endpoint = 'http://localhost:80/scheduler/actions/editmilestone.php';

            const options = {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSONdata,
            };

            const response = await fetch(endpoint,options);
            const result = await response.text();

            console.log(result);

            refreshData();
        }

        if(!edit){
            setEditData({'name':data.milestone.name});
        }
    }

    const _handleChange = (e) => {
        setEditData({...editData, [e.target.name]:e.target.value});
    }

    useEffect(()=>{
        refreshData();

        setEditData({'name':data.milestone.name});
    },[router]);
    
    if(loading)
        return(
            <h1>loading</h1>
        )

    return(
        <div>
            <Link href={router.query.project ? "/main/project?id="+router.query.project : "/main"}>Atpakaļ</Link>
            <div style={{display:'flex', justifyContent:'space-between', paddingRight:110}}>
                <h1>{edit ? <input name="name" onChange={_handleChange} value={editData.name}/> : data.milestone.name}</h1>
                <div style={{display:'flex', gap:10}}>
                    <InputButton label={edit ? "Apstiprināt" : "Rediģēt mērķi"} onClick={()=>{toggleEdit();}} />
                    <InputButton onClick={()=>{
                        props.props.setConfirm({onConfirm:() => {
                            deleteMilestone();
                        }})
                    }} label='Izdzēst mērķi' />
                </div>
            </div>
            <h1>Nepabeigti uzdevumi <BsPlusCircle onClick={() => {props.props.setWindow(<CreateAssignmentWindow setWindow={props.props.setWindow} refresh={refreshData} milestoneId={router.query.id} />);} } /></h1>
            <div>
                <AssignmentList refreshData={refreshData} setConfirm={props.props.setConfirm} setWindow={props.props.setWindow} data={data.unfinishedassignments}/>
            </div>
            <h1>Pabeigti uzdevumi</h1>
            <div>
                <AssignmentList refreshData={refreshData} setConfirm={props.props.setConfirm} setWindow={props.props.setWindow} data={data.finishedassignments}/>
            </div>
        </div>
    )
}

function AssignmentList(props){
    return(
        <div className={styles['list']}>
            {props.data.map((set) => <Assignment refreshData={props.refreshData} dataset={set} setConfirm={props.setConfirm} setWindow={props.setWindow} title={set.name}/>)}
        </div>
    )
}

function Assignment(props){
    return(
        <div className={styles['assignment']} onClick={() => {props.setWindow(<AssignmentWindow refreshData={props.refreshData} dataset={props.dataset} setConfirm={props.setConfirm} setWindow={props.setWindow}/>)}}>
            <div className={styles['assignment-info']}>
                {props.title}
            </div>
        </div>
    )
}