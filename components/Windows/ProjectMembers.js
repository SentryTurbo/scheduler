import react, { useEffect, useState } from "react";
import { FormGeneric, InputButton, PermsForm, TinyWindow } from "../Modules/FormModules";

export default function ProjectMembers(p){
    const [members, setMembers] = useState([]);
    const [overlay, setOverlay] = useState(null);
    
    const refresh = async () => {
        const data = {'project':p.data.project.id}

        console.log(p.data.project.id);

        const endpoint = 'http://localhost:80/scheduler/views/projectmembers.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(data),
        };

        const response = await fetch(endpoint,options);

        const result = await response.json();

        setMembers(result);
        console.log(result);
    }
    
    useEffect(() => {
        refresh();
    }, []);

    return(
        <div style={{position:"relative"}}>
            {overlay != null ? overlay : <></>}
            <div style={{display:'flex', justifyContent:'flex-end'}}>
                <InputButton label="Pievienot dalībnieku" onClick={()=>{
                    setOverlay(<AddMemberOverlay data={p.data} refresh={refresh} setOverlay={setOverlay}/>)
                }}/>
            </div>
            <div>
                Project Members:
            </div>
            <br/>
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
                {members.map((val)=>
                    <Member refresh={refresh} global={p.data} setConfirm={p.setConfirm} setOverlay={setOverlay} d={val}/>
                )}
            </div>
        </div>
    )
}

function Member(p){
    const remove = async () => {
        const data = {
            action:'remove',
            user:p.d.id,
            project:p.global.project.id,
            auth:localStorage.getItem("auth"),
        }

        const endpoint = 'http://localhost:80/scheduler/actions/membersproject.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(data),
        };

        const response = await fetch(endpoint,options);

        const result = await response.json();

        console.log(result);

        p.refresh();
    }
    
    return(
        <div style={{height:30, backgroundColor:'rgba(0,0,0,0.1)', display:'flex', flexWrap:'wrap', alignContent:'center', justifyContent:'space-between', paddingLeft:10, paddingRight:10}}>
            <div>{p.d.username}</div>
            <div style={{display:'flex', gap:10}}>
                <InputButton label="Atļaujas" onClick={() => {p.setOverlay(<SetPermsOverlay refresh={p.refresh} global={p.global} d={p.d} setOverlay={p.setOverlay} />)}}/>

                <InputButton label="Izmest" onClick={() => { p.setConfirm({onConfirm:() => {
                remove();
            }})}}/></div>
        </div>
    )
}

function AddMemberOverlay(p){
    const dataset = [
        {
            name:'user', 
            prettyname:'Lietotājvārds', 
            input:{
                type:'text',
                name:'user',
                required:true
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

    const _submit = async (e) => {

        let data = e;
        data.append("action", "add");
        data.append("project", p.data.project.id);
        data.append("perms", "all");
        data.append("auth", localStorage.getItem("auth"));

        var object = {};
        data.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);

        console.log(json);

        const endpoint = 'http://localhost:80/scheduler/actions/membersproject.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: json,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        console.log(result);

        p.setOverlay(null);
        p.refresh();
    }

    return (
        <TinyWindow setSelf={p.setOverlay}>
            <h3>Lietotāja pievienošana</h3>
            <FormGeneric submit={_submit} dataset={dataset}/>
        </TinyWindow>
    )
}

function SetPermsOverlay(p){
    const [values, setValues] = useState({});

    const submit = async () => {
        const data = {
            action:'edit',
            perms:JSON.stringify(values),
            user:p.d.id,
            project:p.global.project.id,
            auth:localStorage.getItem("auth"),
        }

        const endpoint = 'http://localhost:80/scheduler/actions/membersproject.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(data),
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        p.refresh();
        p.setOverlay(null);

        console.log(result);
    }
    
    return (
        <TinyWindow setSelf={p.setOverlay}>
            <h4>Lietotāja  atļauju pārvalde</h4>
            <PermsForm v={setValues} d={p.d}/>
            <br/>
            <InputButton onClick={submit} label="Apstiprināt" />
        </TinyWindow>
    )
}