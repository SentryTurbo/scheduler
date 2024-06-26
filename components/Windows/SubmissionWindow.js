/*
    Koda apraksts:
        Risinajumu apskates logs. Risinajumu saraksts.
    
    Vlads Muravjovs, 4Ap, Rezeknes Tehnikums, 2023
*/

import { useEffect, useState } from "react";
import { InputButton, TinyWindow, FormGeneric, Comments, FileAttachments } from "../Modules/FormModules";
import AssignmentWindow from "./AssignmentWindow";

import inputStyles from '../../styles/Inputs.module.css';
import styles from '../../styles/Submission.module.css';

export default function SubmissionWindow(p){
    const [overlay, setOverlay] = useState(null);
    const [data, setData] = useState([

    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refresh();
    }, []);
    
    const refresh = async () => {
        const sendData = {
            'auth':localStorage.getItem("auth"),
            'assignment':p.dataset.id,
            'action':'viewall'
        }

        const json = JSON.stringify(sendData);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS + '/actions/submissions.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: json,
        };

        const response = await fetch(endpoint,options);

        const result = await response.json();

        setLoading(false);
        setData(result);

        console.log(result);
    }

    if(loading)
        return(
            <div>loading...</div>
        )

    return (
        <div>
            {overlay != null ? overlay : <></>}
            <div style={{display:'flex', justifyContent:'space-between', gap:10}}>
                <InputButton onClick={() =>{
                    p.setWindow(<AssignmentWindow refreshData={p.refreshData} setWindow={p.setWindow} setConfirm={p.setConfirm} dataset={p.dataset}/>);
                }} label="Atgriezties" />
                {data.add ?
                <InputButton onClick={() => {
                    setOverlay(<SubmissionCreateWindow refreshData={p.refreshData} refresh={refresh} dataset={p.dataset} setConfirm={p.setConfirm} setWindow={p.setWindow} setSelf={setOverlay} />);
                }} label="Izveidot risinājumu" />
                : <></>}
            </div>
            <div style={{marginTop:10}}>
                Risinājumi:
                <div style={{display:'flex', marginTop:10, flexDirection:'column', gap:10,}}>
                    {
                        data.submissions.map((set) => <Submission refreshData={p.refreshData} setConfirm={p.setConfirm} global={p.dataset} setWindow={p.setWindow} d={set} />)
                    }
                </div>
            </div>
        </div>
    )
}

function Submission(p){
    const _onClick = () => {
        p.setWindow(<SubmissionViewWindow refreshData={p.refreshData} setConfirm={p.setConfirm} dataset={p.d} global={p.global} setWindow={p.setWindow}/>);
    }
    
    return (
        <div onClick={_onClick} className={styles['submission']} style={{display:'flex', flexWrap:'wrap', alignContent:'center', height:30, }}>
            <div style={{paddingLeft:10}}>
                {p.d.name}
            </div>
        </div>
    )
}

function SubmissionCreateWindow(p){
    const _submit = async (data) => {
        console.log(p.dataset);

        data.append("auth", localStorage.getItem("auth"));
        data.append("assignment", p.dataset.id);
        data.append("action", "add");

        var object = {};
        data.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);

        console.log(json);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/submissions.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: json,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        p.refresh();
        p.setWindow(<SubmissionViewWindow refreshData={p.refreshData} setConfirm={p.setConfirm} dataset={JSON.parse(result)} global={p.dataset} setWindow={p.setWindow}/>);
        console.log(result);
    }
    
    const dataset = [
        {
            name:'name', 
            prettyname:'Risinājuma nosaukums', 
            input:{
                type:'text',
                name:'name',
                required:true,
                maxlength:'50'
            }
        },
        {
            name:'submit',
            prettyname:'',
            input:{
                type:'submit',
                value:'Apstiprināt'
            }
        }
    ];
    
    return (
        <TinyWindow setSelf={p.setSelf}>
            <h3>Risinājuma izveidošana</h3>
            <FormGeneric submit={_submit} dataset={dataset}/>
        </TinyWindow>
    )
}

function SubmissionViewWindow(p){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const [overlay, setOverlay] = useState(null);
    
    useEffect(()=>{
        refresh();

        setEditData(data);
    }, []);

    const toggleEdit = () => {
        setEdit(!edit);

        if(!edit){
            //set to false
            setEditData(data);
            console.log(editData);
        }else{
            //set to true
            submitEdit();
        }
    }

    const handleEdit = (e) => {
        if(edit){
            setEditData({...editData, [e.target.name]:e.target.value});
        }
    }

    const refresh = async () => {
        const sendData = {
            'auth':localStorage.getItem("auth"),
            'assignment':p.global.id,
            'id':p.dataset.id,
            'action':'view'
        }

        const json = JSON.stringify(sendData);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/submissions.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: json,
        };

        const response = await fetch(endpoint,options);

        const result = await response.json();

        setLoading(false);
        setData(result);
        setEditData(result);

        console.log(result);
    }

    const submitEdit = async () => {
        const sendData = {
            'auth':localStorage.getItem("auth"),
            'assignment':p.global.id,
            'id':p.dataset.id,
            'data':JSON.stringify(editData),
            'action':'edit'
        }

        const json = JSON.stringify(sendData);
        console.log(json);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/submissions.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: json,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        setLoading(false);
        refresh();

        console.log(result);
    }

    const deleteSubmission = async () =>{
        const sendData = {
            'auth':localStorage.getItem("auth"),
            'assignment':p.global.id,
            'id':p.dataset.id,
            'action':'delete'
        }

        const json = JSON.stringify(sendData);
        console.log(json);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/submissions.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: json,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();
        console.log(result);

        p.setWindow(<SubmissionWindow refreshData={p.refreshData} dataset={p.global} setWindow={p.setWindow} setConfirm={p.setConfirm} />);
    }

    if(loading)
        return(
            <div>Loading..</div>
        )

    return (
        <div>
            {overlay != null ? overlay : <></>}
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <InputButton onClick={() =>{
                    p.setWindow(<SubmissionWindow refreshData={p.refreshData} setWindow={p.setWindow} setConfirm={p.setConfirm} dataset={p.global}/>);
                }} label="Atgriezties" />
                <div style={{display:'flex', gap:5}}>
                    {data.own ? 
                    <InputButton onClick={() =>{
                        toggleEdit();
                    }} label={edit ? "Apstiprināt" : "Rediģēt"}/>
                    : <></> }
                    {data.own ? 
                    <InputButton onClick={() =>{
                        p.setConfirm({onConfirm:() => {
                            deleteSubmission();
                        }})
                    }} label="Dzēst" />
                    : <></> }
                </div>
            </div>
            
            <div style={{display:'flex', flexDirection:'column', gap:20}}>
                <div style={{marginTop:10, fontWeight:'bold', fontSize:'1.4em', wordWrap:'break-word'}}>
                    {edit ? <input name="name" onChange={handleEdit} value={editData['name']} maxLength={50} className={inputStyles['input-generic']} /> : 
                        <div>{data.name}</div>}
                </div>
                <div>
                    <div>Apraksts:</div>
                    <textarea name="description" style={{marginTop:10, width:'100%', height:60, backgroundColor:'rgba(255,0,0,0.05)', border:'none', paddingLeft:5, paddingTop:5}} value={editData['description']} onChange={handleEdit}/>
                </div>
                <div>
                    <FileAttachments fetch={{
                        'link':data.id,
                        'linktype':'s'
                    }} 
                        setOverlay={setOverlay} 
                        edit={edit}
                    />
                </div>
                <div>
                    <Comments fetch={{
                        'link':data.id,
                        'linktype':'s'
                    }} 
                        setOverlay={setOverlay}
                    />
                </div>
            </div>
        </div>
    )
}