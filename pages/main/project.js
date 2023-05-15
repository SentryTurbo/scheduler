import react, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Conveyor from "../../components/Conveyor";
import Panel from "../../components/Panel";
import Link from "next/link";

import {BsPlusCircle} from 'react-icons/bs';

import styles from '../../styles/Project.module.css';

import { InputButton } from "../../components/Modules/FormModules";
import CreateMilestoneWindow from "../../components/Windows/CreateMilestoneWindow";
import ProjectMembers from "../../components/Windows/ProjectMembers";

export default function Project(props){
    return(
        <Panel setWindow={props.setWindow} setConfirm={props.setConfirm} content={
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
    const [editData, setEditData] = useState({});

    const [data, setData] = useState(
        {
            'project':{},
            'milestones':[

            ]
        }
    );

    const deleteProject = async () => {
        var sendData = {
            'id':router.query.id,
            'auth':localStorage.getItem("auth")
        };
        
        const JSONdata = JSON.stringify(sendData);

        const endpoint = 'http://localhost:80/scheduler/actions/deleteproject.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSONdata,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        router.push('/main/');
    }

    const refreshData = () => {
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
        );
    }

    const editProject = async () => {
        const sendData = {...editData,
            ['auth']:localStorage.getItem("auth")
        }
        
        const JSONdata = JSON.stringify(sendData);

        const endpoint = 'http://localhost:80/scheduler/actions/editproject.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSONdata,
        };

        const response = await fetch(endpoint,options);

        const result = await response.json();

        refreshData();

        console.log(result);
    }

    const toggleEdit = () => {
        if(edit){
            console.log(editData);
            console.log('done');

            editProject();

            setEdit(false);
        }else{
            console.log(editData);
            
            setEditData({'id':data.project.id, 'name':data.project.name});
            setEdit(true);
        }
    }

    const handleEdit = (e) => {
        setEditData({...editData,[e.target.name]:e.target.value});
    }

    useEffect(()=>{
        console.log(router.query.id);
        
        refreshData();
    },[router]);
    
    if(loading)
        return(
            <h1>loading</h1>
        )

    return(
        <div>
            <Link href="/main/">Atpakaļ</Link>
            <div style={{display:'flex', justifyContent:'space-between', paddingRight:110}}>
                <h1>
                    {
                        edit ? <input name='name' onChange={handleEdit} value={editData['name']}/> : data.project.name
                    }
                </h1>
                <div style={{display:'flex', gap:10}}>
                    <InputButton onClick={()=>{
                        props.props.setWindow(<ProjectMembers setConfirm={props.props.setConfirm} data={data}/>);
                    }} label="Pārvaldīt projekta dalībniekus"/>
                    <InputButton onClick={()=>{
                        toggleEdit();
                    }} label={edit ? "Apstiprināt" : "Rediģēt projektu" }/>
                    <InputButton onClick={()=>{
                        props.props.setConfirm({onConfirm:() => {
                            deleteProject();
                        }})
                    }} label='Izdzēst projektu' />
                </div>
            </div>
            <div className={styles['grid']}>
                <div style={{display:'grid', gridTemplateRows:60}}>
                    <h2>Pašlaik aktīvais mērķis:</h2>
                    <Milestone/>
                </div>
                <div style={{display:'grid', gridTemplateRows:60}}>
                    <h2>Nākamais mērķis:</h2>
                    <Milestone/>
                </div>
            </div>
            <div style={{paddingTop:60}}>
                <div>
                    <h1>Mērķi <BsPlusCircle onClick={()=>{props.props.setWindow(<CreateMilestoneWindow setWindow={props.props.setWindow} refresh={refreshData} projectId={router.query.id}/>);}} /></h1>
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