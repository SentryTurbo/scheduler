import React from "react";

import { FormGeneric } from "../Modules/FormModules";

export default function CreateAssignmentWindow(props){
    const _submit = (data) => {
        data.append('milestone_id', props.milestoneId);

        fetch("http://localhost:80/scheduler/actions/createassignment.php", {method:'post', body:data})
            .then(res => res.json())
            .then((result) => {
                props.refresh();
                props.setWindow(null);
                console.log(result);
            },
            (error) => {
                console.log(error);
            })
    }

    const dataset = [
        {
            name:'name', 
            prettyname:'Assignment Name', 
            input:{
                type:'text',
                name:'name',
                required:true
            }
        },
        {
            name:'description', 
            prettyname:'Assignment Description', 
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
            <h3>Create an assignment</h3>
            <FormGeneric submit={_submit} dataset={dataset} />
        </div>
    )
}