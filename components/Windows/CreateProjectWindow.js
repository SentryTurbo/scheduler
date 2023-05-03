import React from "react";

import {FormGeneric, InputButton, InputGeneric} from "../Modules/FormModules";

export default function CreateProjectWindow(props){
    const _submit = (data) => {
        fetch("http://localhost:80/scheduler/actions/createproject.php", {method:'post', body:data})
            .then(res => res.json())
            .then((result) => {
                console.log(result);
                props.refresh();
            },
            (error) => {
                console.log(error);
            })
    }
    
    const dataset = [
        {
            name:'name', 
            prettyname:'Project Name', 
            input:{
                type:'text',
                name:'name',
                required:true
            }
        },
        {
            name:'description', 
            prettyname:'Project Description', 
            input:{
                type:'text',
                name:'description'
            }
        },
        {
            name:'submit',
            prettyname:'',
            input:{
                type:'submit'
            }
        }
    ]
    
    return (
        <div>
            <h3>Create a project</h3>
            <FormGeneric submit={_submit} dataset={dataset} />
        </div>
    )
}