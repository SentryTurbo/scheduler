import react from "react"
import { EditField, InputButton } from "../Modules/FormModules"


export default function AssignmentWindow(props){
    const editAssignment = async (e) => {
        var data = {...e, ['id']:props.dataset.id};
        
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
    
    const deleteAssignment = () => {
        fetch("http://localhost:80/scheduler/actions/deleteassignment.php?id="+props.dataset.id, {method:'get'})
            .then(res => res.json())
            .then((result) => {
                props.refreshData();
                props.setWindow(null);
            },
            (error) => {
                console.log(error);
            })
    }
    
    return(
        <div>
            <div style={{display:'flex', justifyContent:'flex-end'}}>
                <InputButton onClick={()=>{
                    props.setConfirm({onConfirm:() => {
                        deleteAssignment();
                    }})
                }} label="Delete Assignment"/>
            </div>
            <div>
                <h2><EditField name='name' value={props.dataset.name} onSubmit={editAssignment}/></h2>
                <p>due date:</p>
                <p>reviewer:</p>
                <div>
                    <div>description:</div>
                    <textarea>{props.dataset.description}</textarea>
                </div>
                <div>
                    <br/>
                </div>
            </div>
        </div>
    )
}