import React from "react";

import {FormGeneric, InputButton, InputGeneric} from "../Modules/FormModules";

export default function CreateProjectWindow(props){
    const _submit = async (data) => {
        var sendData = data;
        sendData.append("auth", localStorage.getItem("auth"));
        
        const endpoint = 'http://localhost:80/scheduler/actions/createproject.php';

        const options = {
            method:'POST',
            body: sendData,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        console.log(result);

        props.refresh();
        props.setWindow(null);
    }
    
    const dataset = [
        {
            name:'name', 
            prettyname:'Nosaukums', 
            input:{
                type:'text',
                name:'name',
                required:true,
                placeholder:'Projekta nosaukums'
            }
        },
        {
            name:'description', 
            prettyname:'Apraksts', 
            input:{
                type:'text',
                name:'description',
                placeholder:'Projekta apraksts'
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
            <h3>Projekta izveidošana</h3>
            <FormGeneric submit={_submit} dataset={dataset} />
        </div>
    )
}