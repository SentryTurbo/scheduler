import react, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Conveyor from "../../components/Conveyor";
import Panel from "../../components/Panel";
import Link from "next/link";

import {BsPlusCircle, BsFlag} from 'react-icons/bs';
import {HiOutlineFlag, HiFlag} from 'react-icons/hi2';

import inputStyles from '../../styles/Inputs.module.css';
import styles from '../../styles/Project.module.css';

import { InputButton, SpeechBubble } from "../../components/Modules/FormModules";
import CreateMilestoneWindow from "../../components/Windows/CreateMilestoneWindow";
import ProjectMembers from "../../components/Windows/ProjectMembers";

export default function Project(props){
    return(
        <Panel addNotif={props.addNotif} setWindow={props.setWindow} setConfirm={props.setConfirm} content={
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

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/deleteproject.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSONdata,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        if(result != "perms")
            props.props.addNotif({type:'s',text:'Projekts tika izdzēsts veiksmīgi!'});
        else if(result == "perms")
            props.props.addNotif({type:'e',text:'Jums nav atļauju izpildīt šo operāciju!'});

        console.log(result);

        router.push('/main/');
    }

    const refreshData = () => {
        fetch(process.env.NEXT_PUBLIC_API_ADDRESS +  "/project.php?id="+router.query.id)
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

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/editproject.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSONdata,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        if(result != "perms")
            props.props.addNotif({type:'s',text:'Projekts tika rediģēts veiksmīgi!'});
        else
            props.props.addNotif({type:'e',text:'Jums nav atļauju izpildīt šo operāciju!'});

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

    const leaveProject = async () => {
        const sendData = {
            'auth':localStorage.getItem("auth"),
            'project':router.query.id
        }
        
        const JSONdata = JSON.stringify(sendData);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/leaveproject.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSONdata,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        if(result != "error"){
            router.push('/main/');
            props.props.addNotif({type:'s',text:'Projekts tika pamests veiksmigi.'});
        }else{
            props.props.addNotif({type:'e',text:'Radās kļūda.'});
        }

        console.log(result);
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
                    <div style={{fontSize:'3em', fontWeight:'bold', overflow:'hidden', maxWidth:600, textOverflow:'ellipsis'}}>
                        {
                            edit ? <input name='name' onChange={handleEdit} value={editData['name']} maxLength={'20'} className={inputStyles['input-generic']}/> : data.project.name
                        }
                    </div>
                    <div style={{display:'flex', flexWrap:'wrap', alignContent:'flex-end'}}><i>{data.stats.finishedcount + '/' + data.stats.milestonecount + ' (' + data.stats.percent + '%)'}</i></div>
                </div>
                <div style={{display:'flex', gap:10}}>
                    <InputButton onClick={()=>{
                        props.props.setConfirm({onConfirm:() => {
                            leaveProject();
                        }})
                    }} label='Pamest projektu' />
                    <InputButton onClick={()=>{
                        props.props.setWindow(<ProjectMembers addNotif={props.props.addNotif} setConfirm={props.props.setConfirm} data={data}/>);
                    }} label="Pārvaldīt projekta dalībniekus"/>
                    <InputButton onClick={()=>{
                        toggleEdit();
                    }} label={edit ? "Apstiprināt" : "Rediģēt projektu" }/>
                    <InputButton onClick={()=>{
                        props.props.setConfirm({onConfirm:() => {
                            deleteProject();
                        }, extra:'Projekta datus nebūs iespējams atjaunot pēc izdzēšanas!'})
                    }} label='Izdzēst projektu' />
                </div>
            </div>
            {
                data.milestones.length > 1 &&

                <div style={{position:'relative', display:'flex', justifyContent:'center', alignContent:'flex-end', flexWrap:'wrap', marginTop:60, backgroundColor:'rgba(100,0,0,0.05)', height:180, width:'100%'}}>
                    <div style={{position:'absolute', left:40, top:20, color:'rgba(0,0,0,0.5)', fontWeight:'bold', fontSize:'1.5em'}}>Roadmap</div>
                    <div style={{position:'relative', marginBottom:50, width:'90%', backgroundColor:'rgba(0,0,0,0.1)', height:2, display:'flex', justifyContent:'space-between'}}>
                        {data.milestones.map((set)=> <Milestone d={set}/>)}
                    </div>
                </div>
            }
            <div style={{paddingTop:60}}>
                <div>
                    <h1>Mērķi <BsPlusCircle style={{cursor:'pointer'}} onClick={()=>{props.props.setWindow(<CreateMilestoneWindow addNotif={props.props.addNotif} setWindow={props.props.setWindow} refresh={refreshData} projectId={router.query.id}/>);}} /></h1>
                    <Conveyor href={"/main/milestone?project="+router.query.id} data={data.milestones} hrefkey="id"/>
                </div>
            </div>
        </div>
    )
}

function Milestone(props){
    const [show,setShow] = useState(false);
    const router = useRouter();

    const offset = 35;

    return(
        <div style={{position:'relative'}}>
            <SpeechBubble show={show} text={props.d.progress} offset={'-70px'} />
            <Link href={"/main/milestone?project="+router.query.id + "&id=" + props.d.id}>
            <div style={{position:'absolute', width:40, height:40, transform:'translate(-10px,-32px)', zIndex:100}} 
                onMouseEnter={()=>{setShow(true)}} 
                onMouseLeave={() => {setShow(false)}}
            ></div>
            {props.d.finish ? 
                <HiFlag style={{position:'absolute', transform:'translate(1px,-35px)', fontSize:'2em', color:'#988181'}}/> :
                <HiOutlineFlag style={{position:'absolute', transform:'translate(1px,-35px)', fontSize:'2em', color:'#988181'}}/>
            }
            </Link>
            <div style={{position:'absolute', width:80, textAlign:'center', transform:'translate(-'+ offset +'px,5px)', overflow:'hidden', textOverflow:'ellipsis'}}>
                {props.d.name}
            </div>
            <div style={{fontSize:'2.2em', transform:'translate(0,-4px)', color:'#CCBFBF', fontWeight:'bold'}}>
                <div style={{borderRadius:'50%', backgroundColor:'#988181', width:10, height:10}} />
            </div>
        </div>
    )
}