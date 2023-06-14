/*
    Koda apraksts:
        Merka izveidosanas logs.
    
    Vlads Muravjovs, 4Ap, Rezeknes Tehnikums, 2023
*/

import React from "react";

import { FormGeneric } from "../Modules/FormModules";

export default function CreateMilestoneWindow(props){
    const _submit = (data) => {
        data.append('project_id', props.projectId);
        data.append('auth', localStorage.getItem('auth'));

        fetch(process.env.NEXT_PUBLIC_API_ADDRESS + "/actions/createmilestone.php", {method:'post', body:data})
            .then(res => res.json())
            .then((result) => {
                props.refresh();
                props.setWindow(null);

                props.addNotif({type:'s', text:'Mērķis tika izveidots veiksmīgi.'});
                console.log(result);
            },
            (error) => {
                props.addNotif({type:'e', text:'Radās kļūda!'});
                console.log(error);
            })
    }

    const dataset = [
        {
            name:'name', 
            prettyname:'Nosaukums', 
            input:{
                type:'text',
                name:'name',
                required:true,
                placeholder:'Mēŗķa nosaukums',
                maxlength:'35'
            }
        },
        /*{
            name:'description', 
            prettyname:'Apraksts', 
            input:{
                type:'text',
                name:'description',
                placeholder:'Mēŗķa apraksts'
            }
        },*/
        {
            name:'submit',
            prettyname:'',
            input:{
                type:'submit',
                value:'Apstiprināt'
            }
        }
    ]
    
    return (
        <div>
            <h3>Mērķa izveidošana</h3>
            <FormGeneric submit={_submit} dataset={dataset} />
        </div>
    )
}