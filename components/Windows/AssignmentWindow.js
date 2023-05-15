import react from "react"
import { EditField, InputButton } from "../Modules/FormModules"
import SubmissionWindow from "./SubmissionWindow";


export default function AssignmentWindow(props){
    const editAssignment = async (e) => {
        var data = {
            ...e, 
            ['id']:props.dataset.id,
            ['auth']:localStorage.getItem("auth")
        };
        
        console.log(data);

        const JSONdata = JSON.stringify(data);

        const endpoint = 'http://localhost:80/scheduler/actions/editassignment.php';

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

        const endpoint = 'http://localhost:80/scheduler/actions/deleteassignment.php';

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
        props.setWindow(null);
    }
    
    return(
        <div>
            <div style={{display:'flex', justifyContent:'flex-end', gap:10}}>
                <InputButton onClick={() =>{
                    props.setWindow(<SubmissionWindow dataset={props.dataset} setWindow={props.setWindow} setConfirm={props.setConfirm}/>);
                }} label="Apskatīt Risinājumus" />
                <InputButton onClick={()=>{
                    props.setConfirm({onConfirm:() => {
                        deleteAssignment();
                    }})
                }} label="Izdzēst Uzdevumu"/>
            </div>
            <div>
                <h2><EditField name='name' value={props.dataset.name} onSubmit={editAssignment}/></h2>
                <div>
                    <div>Apraksts:</div>
                    <textarea>{props.dataset.description}</textarea>
                </div>
                <div>
                    <br/>
                </div>
            </div>
        </div>
    )
}