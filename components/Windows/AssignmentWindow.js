import react from "react"
import { InputButton } from "../Modules/FormModules"


export default function AssignmentWindow(props){
    const deleteAssignment = () =>{
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
                <h2>{props.dataset.name}</h2>
                <p>due date:</p>
                <p>reviewer:</p>
                <div>
                    <div>description:</div>
                    <textarea></textarea>
                </div>
                <div>
                    <br/>
                </div>
            </div>
        </div>
    )
}