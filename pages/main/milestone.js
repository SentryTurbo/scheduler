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

import {BsPlusCircle, BsCheckCircle, BsFilter, BsExclamationLg} from 'react-icons/bs';
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
        unfinished:{
            search:'',
            showNoApprox:true,
            sortDesc:false,
        },
        finished:{
            search:'',
            showNoApprox:true,
            sortDesc:false,
        }
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
                    <FilterButton extra={true} search={searchSettings} setSearch={setSearchSettings} target={'unfinished'}/>
                </div>
            </div>
            <div>
                <AssignmentList settings={searchSettings.unfinished} search={searchSettings.unfinished.search} refreshData={refreshData} setConfirm={props.props.setConfirm} setWindow={props.props.setWindow} data={data.unfinishedassignments}/>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', width:'90%'}}>
                <h1>Pabeigti uzdevumi</h1>
                <div style={{display:'flex', flexWrap:'wrap', placeContent:'center', position:'relative'}}>
                    <FilterButton search={searchSettings} setSearch={setSearchSettings} target={'finished'}/>
                </div>
            </div>
            <div>
                <AssignmentList settings={searchSettings.finished} search={searchSettings.finished.search} refreshData={refreshData} setConfirm={props.props.setConfirm} setWindow={props.props.setWindow} data={data.finishedassignments}/>
            </div>
        </div>
    )
}

function AssignmentList(props){
    let filteredArray = [];

    const parseEntry = (entry) => {
        //is current entry good to go?
        //if yes, return true, else, return false.

        if(props.search != ''){
            if(!entry.name.toLowerCase().includes(props.search.toLowerCase())){
                return false;
            }
        }

        //don't show entries with no approximate finish date
        if(!props.settings.showNoApprox && (entry.approx_date === null || entry.approx_date == "0000-00-00")){
            return false;
        }

        return true;
    }

    props.data.map((set) => {
        if(parseEntry(set)){
            filteredArray.push(set);
        }
    });

    //bubble sort by the approximate finish date.
    let sortedArray = [];
    if(true/*props.sort != ''*/){
        filteredArray.map((set) => sortedArray.push(set));
        
        for(var i=0; i<sortedArray.length-1; ++i){
            for(var j=0; j<sortedArray.length-i-1;++j){
                //should we shift the current element to the next index?
                var shift = false;
                var cancel = false;

                //automatically shift forward if current has no approx date
                if(sortedArray[j].approx_date === null || sortedArray[j].approx_date == "0000-00-00")
                    shift = true;
                
                if(sortedArray[j+1].approx_date === null || sortedArray[j+1].approx_date == "0000-00-00")
                    cancel = true;

                if(!shift && !cancel){
                    //first, separate all the values
                    var curDate = sortedArray[j].approx_date.split("-"); // parseFloat(sortedData[j]['percent']);
                    var nexDate = sortedArray[j+1].approx_date.split("-");

                    //array keys - 0: year, 1: month, 2: day
                    var curAssoc = {year:parseInt(curDate[0]), month:parseInt(curDate[1]), day:parseInt(curDate[2])};
                    var nexAssoc = {year:parseInt(nexDate[0]), month:parseInt(nexDate[1]), day:parseInt(nexDate[2])};

                    //check year
                    if(curAssoc.year > nexAssoc.year){
                        shift = true;
                    }
                    if(curAssoc.month > nexAssoc.month){
                        shift = true;
                    }
                    if(curAssoc.day > nexAssoc.day){
                        shift = true;
                    }
                }

                if(props.settings.sortDesc)
                    shift = !shift;

                if(shift){
                    var temp = sortedArray[j];
                    sortedArray[j] = sortedArray[j+1];
                    sortedArray[j+1] = temp;
                }
            }
        }
    }else{
        sortedArray = filteredArray;
    }
    
    return(
        <div className={styles['list']}>
            {sortedArray.map((set) => <Assignment refreshData={props.refreshData} dataset={set} setConfirm={props.setConfirm} setWindow={props.setWindow} title={set.name}/>)}
        </div>
    )
}

function Assignment(props){
    var dateSubtitle = '';

    if(props.dataset.approx_date != "0000-00-00" && props.dataset.approx_date != null){
        dateSubtitle = <div>
            <BsExclamationLg /> {props.dataset.approx_date}
        </div>;
    }

    if(props.dataset.finish_date != "0000-00-00" && props.dataset.finish_date != null){
        dateSubtitle = <div>
            <BsCheckCircle /> {props.dataset.finish_date}
        </div>;
    }

    return(
        <div className={styles['assignment']} onClick={() => {props.setWindow(<AssignmentWindow refreshData={props.refreshData} dataset={props.dataset} setConfirm={props.setConfirm} setWindow={props.setWindow}/>)}}>
            <div className={styles['assignment-info']} style={{display:'flex', justifyContent:'space-between', width:'100%', paddingRight:20}}>
                <div>{props.title}</div>
                <div style={{fontSize:'0.8em'}}>
                    {dateSubtitle}
                </div>
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
        p.setSearch({...p.search, [p.target]:{...p.search[p.target], search:e.target.value}});
    }

    const handleChangeFilter = (e) => {
        p.setSearch({...p.search, [p.target]:{...p.search[p.target], [e.target]:e.value}})
    }

    return (
        <div className={conveyorStyles['filter-button']}>
            <BsFilter style={{fontSize:'1.7em'}} onClick={_toggle}/>
            {
                toggle &&
                <div style={{position:'absolute', minWidth:150, backgroundColor:'rgb(240,240,240)', boxShadow:'0px 2px 20px 2px rgba(25, 0, 0, .2)', right:60, height:'fit-content', padding:10, display:'flex', alignItems:'flex-end'}}>
                    <div style={{display:'flex', flexDirection:'column', gap:10}}>
                        <input onChange={handleChangeQuery} style={{height:18}} placeholder="Meklēt..." className={inputStyles['input-generic']} value={p.search[p.target].search}/>
                        {p.extra &&
                            <div>
                                <FilterCheckbox target={'showNoApprox'} setFilter={handleChangeFilter} value={p.search[p.target].showNoApprox}>Rādīt uzdevumus bez datuma</FilterCheckbox>
                                <FilterCheckbox target={'sortDesc'} setFilter={handleChangeFilter} value={p.search[p.target].sortDesc}>Kārtot dilstoši</FilterCheckbox>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

function FilterCheckbox(p){
    const _onClick = () => {
        p.setFilter(
            {
                target:p.target,
                value:!p.value
            }
        );
    }
    
    return (
        <div style={{display:'flex', justifyContent:'flex-start', gap:5, height:'fit-content'}} onClick={_onClick}>
            <input type="checkbox" checked={p.value} readOnly/>
            <div style={{height:'fit-content'}}>{p.children}</div>
        </div>
    )
}