import React from "react";

import { FormGeneric } from "../Modules/FormModules";

export default function CreateMilestoneWindow(props){
    const _submit = (data) => {
        data.append('project_id', props.projectId)

        fetch("http://localhost:80/scheduler/actions/createmilestone.php", {method:'post', body:data})
            .then(res => res.json())
            .then((result) => {
                console.log(result);
            },
            (error) => {
                console.log(error);
            })
        
    }

    const dataset = [
        {
            name:'name', 
            prettyname:'Milestone Name', 
            input:{
                type:'text',
                name:'name',
                required:true
            }
        },
        {
            name:'description', 
            prettyname:'Milestone Description', 
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
            <h3>Create a milestone</h3>
            <FormGeneric submit={_submit} dataset={dataset} />
        </div>
    )
}