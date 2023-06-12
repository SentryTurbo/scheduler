/*
    Koda apraksts:
        Uzdevuma izveidosanas logs.
    
    Vlads Muravjovs, 4Ap, Rezeknes Tehnikums, 2023
*/

import React from "react";

import { FormGeneric } from "../Modules/FormModules";

export default function CreateAssignmentWindow(props){
    const _submit = (data) => {
        data.append('milestone_id', props.milestoneId);
        data.append('auth', localStorage.getItem("auth"));

        fetch(process.env.NEXT_PUBLIC_API_ADDRESS + "/actions/createassignment.php", {method:'post', body:data})
            .then(res => {
                if(!res.ok) return res.text()
                else return res.json()})
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
            prettyname:'Nosaukums', 
            input:{
                type:'text',
                name:'name',
                required:true,
                placeholder:'Uzdevuma nosaukums',
                maxlength:'50'
            }
        },
        {
            name:'description', 
            prettyname:'Apraksts', 
            input:{
                type:'text',
                name:'description',
                placeholder:'Uzdevuma apraksts'
            }
        },
        {
            name:'approx_date', 
            prettyname:'Izpildes gala datums', 
            input:{
                type:'date',
                name:'approx_date'
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
            <h3>Uzdevuma izveidošana</h3>
            <FormGeneric submit={_submit} dataset={dataset} />
        </div>
    )
}