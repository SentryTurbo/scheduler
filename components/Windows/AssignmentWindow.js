import react, { useEffect, useState } from "react"
import { EditField, InputButton, Comments, FileAttachments } from "../Modules/FormModules"
import SubmissionWindow from "./SubmissionWindow";

import inputStyles from '../../styles/Inputs.module.css';

export default function AssignmentWindow(props){
    const [overlay, setOverlay] = useState(null);
    const [edititing, setEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const [dataset, setDataset] = useState({});

    useEffect(() => {
        setDataset(props.dataset);
        setEditData(props.dataset);
    }, []);

    const toggleEdit = () => {
        setEdit(!edititing);

        if(edititing){
            editAssignment(editData);

            setDataset(editData);
        }else{
            setEditData(dataset);
        }
    }

    const handleEdit = (e) => {
        if(edititing)
            setEditData({...editData, [e.target.name]:e.target.value});
    }
    
    const editAssignment = async (e) => {
        var data = {
            ...e, 
            ['id']:props.dataset.id,
            ['auth']:localStorage.getItem("auth")
        };
        
        console.log(data);

        const JSONdata = JSON.stringify(data);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/editassignment.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSONdata,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        props.refreshData();
        console.log(result);
    }
    
    const deleteAssignment = async () => {
        var sendData = {
            'id':props.dataset.id,
            'auth':localStorage.getItem("auth")
        };
        
        const JSONdata = JSON.stringify(sendData);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/deleteassignment.php';

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

        props.refreshData();
        props.setWindow(null);
    }

    const finishAssignment = async () => {
        var sendData = {
            'id':props.dataset.id,
            'auth':localStorage.getItem("auth"),
            'set':props.dataset.finish_date === null || props.dataset.finish_date == '0000-00-00' ? 'finish' : 'remove'
        };
        
        const JSONdata = JSON.stringify(sendData);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/finishassignment.php';

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

        props.refreshData();
        props.setWindow(null);
    }
    
    return(
        <div>
            {overlay != null ? overlay : <></>}
            <div style={{display:'flex', justifyContent:'space-between', gap:10}}>
                <InputButton onClick={() =>{
                    props.setWindow(<SubmissionWindow refreshData={props.refreshData} dataset={props.dataset} setWindow={props.setWindow} setConfirm={props.setConfirm}/>);
                }} label="Apskatīt Risinājumus" />
                <div style={{display:'flex', gap:5}}>
                    <InputButton onClick={() =>{
                        props.setConfirm({onConfirm:()=>{finishAssignment()}})
                    }} label={props.dataset.finish_date === null || props.dataset.finish_date == '0000-00-00' ? "Pabeigt Uzdevumu" : "Atcelt pabeigšanu"} />
                    <InputButton onClick={() =>{
                        toggleEdit();
                    }} label={edititing ? "Apstiprināt" : "Rediģēt"} />
                    <InputButton onClick={()=>{
                        props.setConfirm({onConfirm:() => {
                            deleteAssignment();
                        }})
                    }} label="Izdzēst Uzdevumu"/>
                </div>
            </div>
            <div style={{marginTop:20, display:'flex', flexDirection:'column', gap:10}}>
                {!edititing ?
                    <div style={{fontSize:'1.4em', fontWeight:'bold', wordWrap:'break-word'}}>{dataset.name}</div>
                    :
                    <input name="name" value={editData['name']} onChange={handleEdit} maxLength={"50"} className={inputStyles['input-generic']}/>
                }
                <div>
                    <div>Apraksts:</div>
                    <textarea name="description" value={edititing ? editData['description'] : dataset.description} onChange={handleEdit} style={{minHeight:100}} className={inputStyles['description']}>{dataset.description}</textarea>
                </div>
                <div>
                    <FileAttachments fetch={{
                        'link':props.dataset.id,
                        'linktype':'a'
                    }} 
                        setOverlay={setOverlay}
                        edit={edititing}
                    />
                </div>
                <div>
                    <Comments fetch={{
                        'link':props.dataset.id,
                        'linktype':'a'
                    }} 
                        setOverlay={setOverlay}
                    />
                </div>
            </div>
        </div>
    )
}