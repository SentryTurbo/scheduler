import react, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Conveyor from "../../components/Conveyor";
import Panel from "../../components/Panel";
import Link from "next/link";

import {BsPlusCircle, BsFlag} from 'react-icons/bs';
import {HiOutlineFlag, HiFlag} from 'react-icons/hi2';

import styles from '../../styles/Project.module.css';

import { InputButton, SpeechBubble } from "../../components/Modules/FormModules";
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
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <div style={{display:'flex', alignContent:'center', flexWrap:'wrap', gap:20}}>
                    <div style={{fontSize:'3em', fontWeight:'bold'}}>
                        {
                            edit ? <input name='name' onChange={handleEdit} value={editData['name']}/> : data.project.name
                        }
                    </div>
                    <div style={{display:'flex', flexWrap:'wrap', alignContent:'flex-end'}}><i>{data.stats.finishedcount + '/' + data.stats.milestonecount + ' (' + data.stats.percent + '%)'}</i></div>
                </div>
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
            {
                data.milestones.length > 1 &&

                <div style={{position:'relative', display:'flex', justifyContent:'center', alignContent:'flex-end', flexWrap:'wrap', marginTop:60, backgroundColor:'rgba(100,0,0,0.05)', height:150, width:'100%'}}>
                    <div style={{position:'relative', marginBottom:50, width:'90%', backgroundColor:'rgba(0,0,0,0.1)', height:2, display:'flex', justifyContent:'space-between'}}>
                        {data.milestones.map((set)=> <Milestone d={set}/>)}
                    </div>
                </div>
            }
            <div style={{paddingTop:60}}>
                <div>
                    <h1>Mērķi <BsPlusCircle onClick={()=>{props.props.setWindow(<CreateMilestoneWindow setWindow={props.props.setWindow} refresh={refreshData} projectId={router.query.id}/>);}} /></h1>
                    <Conveyor href={"/main/milestone?project="+router.query.id} data={data.milestones} hrefkey="id"/>
                </div>
            </div>
        </div>
    )
}

function Milestone(props){
    const [show,setShow] = useState(false);

    return(
        <div style={{position:'relative'}}>
            <SpeechBubble show={show} text={props.d.name} offset={'-80px'} />
            
            <div style={{position:'absolute', width:40, height:40, transform:'translate(-10px,-32px)', zIndex:100}} 
                onMouseEnter={()=>{setShow(true)}} 
                onMouseLeave={() => {setShow(false)}}
            ></div>
            {props.d.finish ? 
                <HiFlag style={{position:'absolute', transform:'translate(1px,-35px)', fontSize:'2em', color:'#988181'}}/> :
                <HiOutlineFlag style={{position:'absolute', transform:'translate(1px,-35px)', fontSize:'2em', color:'#988181'}}/>
            }
            
            <div style={{fontSize:'2.2em', transform:'translate(0,-4px)', color:'#CCBFBF', fontWeight:'bold'}}>
                <div style={{borderRadius:'50%', backgroundColor:'#988181', width:10, height:10}} />
            </div>
        </div>
    )
}