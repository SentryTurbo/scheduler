/*
    Koda apraksts:
        Merka panelis. (uzdevumu atlase)
    
    Vlads Muravjovs, 4Ap, Rezeknes Tehnikums, 2023
*/

import react, { useEffect, useState } from "react"
import Conveyor from "../../components/Conveyor";
import Panel from "../../components/Panel";
import Link from "next/link";
import { useRouter } from 'next/router'

import { InputButton } from "../../components/Modules/FormModules";

import {BsPlusCircle, BsCheckCircle, BsFilter} from 'react-icons/bs';
import CreateAssignmentWindow from "../../components/Windows/CreateAssignmentWindow";
import AssignmentWindow from "../../components/Windows/AssignmentWindow";

import conveyorStyles from '../../styles/Conveyor.module.css';
import inputStyles from '../../styles/Inputs.module.css';
import styles from '../../styles/Milestone.module.css';

export default function Milestone(props){
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
    const [editData, setEditData] = useState({name:'name'});

    const [searchSettings, setSearchSettings] = useState({
        unfinished:{search:''},
        finished:{search:''}
    });

    const [data, setData] = useState(
        {
            'milestone':{},
            'unfinishedassignments':[

            ],
            'finishedassignments':[

            ]
        }
    );

    const deleteMilestone = async () => {
        var sendData = {
            'id':router.query.id,
            'auth':localStorage.getItem("auth"),
            'project_id':data.milestone.project_id
        };
        
        const JSONdata = JSON.stringify(sendData);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/deletemilestone.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSONdata,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        if(result == "true")
            props.props.addNotif({type:'s',text:'Mērķis tika izdzēsts veiksmīgi!'});
        else if(result == "perms")
            props.props.addNotif({type:'e',text:'Jums nav atļauju izpildīt šo operāciju!'});

        router.push('/main/');
    }

    const refreshData = () => {
        fetch(process.env.NEXT_PUBLIC_API_ADDRESS + "/milestone.php?id="+router.query.id)
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
            const sendData = {
                ...editData,
                ['id']:data.milestone.id,
                ['auth']:localStorage.getItem("auth"),
                ['project_id']:data.milestone.project_id
            };

            const JSONdata = JSON.stringify(sendData);
            const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/editmilestone.php';

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
                props.props.addNotif({type:'s',text:'Mērķis tika rediģēts veiksmīgi!'});
            else if(result == "perms")
                props.props.addNotif({type:'e',text:'Jums nav atļauju izpildīt šo operāciju!'});

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
    
    if(loading || data.milestone === null)
        return(
            <h1>loading</h1>
        )

    return(
        <div>
            <Link href={router.query.project ? "/main/project?id="+router.query.project : "/main"}>Atpakaļ</Link>
            <div style={{display:'flex', justifyContent:'space-between', paddingRight:110}}>
                <h1>{edit ? <input name="name" onChange={_handleChange} value={editData.name} maxLength={'35'} className={inputStyles['input-generic']}/> : data.milestone.name}</h1>
                <div style={{display:'flex', gap:10}}>
                    <InputButton label={edit ? "Apstiprināt" : "Rediģēt mērķi"} onClick={()=>{toggleEdit();}} />
                    <InputButton onClick={()=>{
                        props.props.setConfirm({onConfirm:() => {
                            deleteMilestone();
                        }})
                    }} label='Izdzēst mērķi' />
                </div>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', width:'90%'}}>
                <h1>Nepabeigti uzdevumi <BsPlusCircle style={{cursor:'pointer'}} onClick={() => {props.props.setWindow(<CreateAssignmentWindow setWindow={props.props.setWindow} refresh={refreshData} milestoneId={router.query.id} />);} } /></h1>
                <div style={{display:'flex', flexWrap:'wrap', placeContent:'center', position:'relative'}}>
                    <FilterButton search={searchSettings} setSearch={setSearchSettings} target={'unfinished'}/>
                </div>
            </div>
            <div>
                <AssignmentList search={searchSettings.unfinished.search} refreshData={refreshData} setConfirm={props.props.setConfirm} setWindow={props.props.setWindow} data={data.unfinishedassignments}/>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', width:'90%'}}>
                <h1>Pabeigti uzdevumi</h1>
                <div style={{display:'flex', flexWrap:'wrap', placeContent:'center', position:'relative'}}>
                    <FilterButton search={searchSettings} setSearch={setSearchSettings} target={'finished'}/>
                </div>
            </div>
            <div>
                <AssignmentList search={searchSettings.finished.search} refreshData={refreshData} setConfirm={props.props.setConfirm} setWindow={props.props.setWindow} data={data.finishedassignments}/>
            </div>
        </div>
    )
}

function AssignmentList(props){
    let filteredArray = [];
    if(props.search != ''){
        props.data.map((set) => {
            if(set.name.toLowerCase().includes(props.search.toLowerCase())) 
                filteredArray.push(set);
            });
    }
    else{
        filteredArray = props.data;
    }
    
    return(
        <div className={styles['list']}>
            {filteredArray.map((set) => <Assignment refreshData={props.refreshData} dataset={set} setConfirm={props.setConfirm} setWindow={props.setWindow} title={set.name}/>)}
        </div>
    )
}

function Assignment(props){
    return(
        <div className={styles['assignment']} onClick={() => {props.setWindow(<AssignmentWindow refreshData={props.refreshData} dataset={props.dataset} setConfirm={props.setConfirm} setWindow={props.setWindow}/>)}}>
            <div className={styles['assignment-info']} style={{display:'flex', justifyContent:'space-between', width:'100%', paddingRight:20}}>
                <div>{props.title}</div>
                <div style={{fontSize:'0.8em'}}>{(props.dataset.finish_date != "0000-00-00" && props.dataset.finish_date != null) ? <div><BsCheckCircle /> {props.dataset.finish_date}</div> : ''}</div>
            </div>
        </div>
    )
}

function FilterButton(p){
    const [toggle,setToggle] = useState(false);
    
    const _toggle = () => {
        setToggle(!toggle);
    }

    const handleChangeQuery = (e) => {
        p.setSearch({...p.search, [p.target]:{search:e.target.value}});
    }

    return (
        <div className={conveyorStyles['filter-button']}>
            <BsFilter style={{fontSize:'1.7em'}} onClick={_toggle}/>
            {
                toggle &&
                <div style={{position:'absolute', minWidth:150, backgroundColor:'rgb(240,240,240)', boxShadow:'0px 2px 20px 2px rgba(25, 0, 0, .2)', right:60, height:'fit-content', padding:10, display:'flex', alignItems:'flex-end'}}>
                    <div>
                        <input onChange={handleChangeQuery} style={{height:18}} placeholder="Meklēt..." className={inputStyles['input-generic']} value={p.search[p.target].search}/>
                    </div>
                </div>
            }
        </div>
    )
}