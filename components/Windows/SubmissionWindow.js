import { useEffect, useState } from "react";
import { InputButton, TinyWindow, FormGeneric, Comments } from "../Modules/FormModules";
import AssignmentWindow from "./AssignmentWindow";

export default function SubmissionWindow(p){
    const [overlay, setOverlay] = useState(null);
    const [data, setData] = useState([

    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refresh();
    }, []);
    
    const refresh = async () => {
        const sendData = {
            'auth':localStorage.getItem("auth"),
            'assignment':p.dataset.id,
            'action':'viewall'
        }

        const json = JSON.stringify(sendData);

        const endpoint = 'http://localhost:80/scheduler/actions/submissions.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: json,
        };

        const response = await fetch(endpoint,options);

        const result = await response.json();

        setLoading(false);
        setData(result);

        console.log(result);
    }

    if(loading)
        return(
            <div>loading...</div>
        )

    return (
        <div>
            {overlay != null ? overlay : <></>}
            <div style={{display:'flex', justifyContent:'flex-end', gap:10}}>
                <InputButton onClick={() => {
                    setOverlay(<SubmissionCreateWindow refresh={refresh} dataset={p.dataset} setSelf={setOverlay} />);
                }} label="Izveidot risinājumu" />
                <InputButton onClick={() =>{
                    p.setWindow(<AssignmentWindow setWindow={p.setWindow} setConfirm={p.setConfirm} dataset={p.dataset}/>);
                }} label="Atgriezties pie uzdevuma apraksta" />
            </div>
            <div>
                Risinājumi:
                <div style={{display:'flex', marginTop:10, flexDirection:'column', gap:10,}}>
                    {
                        data.map((set) => <Submission global={p.dataset} setWindow={p.setWindow} d={set} />)
                    }
                </div>
            </div>
        </div>
    )
}

function Submission(p){
    const _onClick = () => {
        p.setWindow(<SubmissionViewWindow dataset={p.d} global={p.global} setWindow={p.setWindow}/>);
    }
    
    return (
        <div onClick={_onClick} style={{display:'flex', flexWrap:'wrap', alignContent:'center', height:30, backgroundColor:'rgba(0,0,0,0.2)'}}>
            <div style={{paddingLeft:10}}>
                {p.d.name}
            </div>
        </div>
    )
}

function SubmissionCreateWindow(p){
    const _submit = async (data) => {
        console.log(p.dataset);

        data.append("auth", localStorage.getItem("auth"));
        data.append("assignment", p.dataset.id);
        data.append("action", "add");

        var object = {};
        data.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);

        console.log(json);

        const endpoint = 'http://localhost:80/scheduler/actions/submissions.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: json,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        p.refresh();
        console.log(result);
    }
    
    const dataset = [
        {
            name:'name', 
            prettyname:'Risinājuma nosaukums', 
            input:{
                type:'text',
                name:'name',
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
    ];
    
    return (
        <TinyWindow setSelf={p.setSelf}>
            <h3>Risinājuma izveidošana</h3>
            <FormGeneric submit={_submit} dataset={dataset}/>
        </TinyWindow>
    )
}

function SubmissionViewWindow(p){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        refresh();
    }, []);

    const refresh = async () => {
        const sendData = {
            'auth':localStorage.getItem("auth"),
            'assignment':p.global.id,
            'id':p.dataset.id,
            'action':'view'
        }

        const json = JSON.stringify(sendData);

        const endpoint = 'http://localhost:80/scheduler/actions/submissions.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: json,
        };

        const response = await fetch(endpoint,options);

        const result = await response.json();

        setLoading(false);
        setData(result);

        console.log(result);
    }

    if(loading)
        return(
            <div>Loading..</div>
        )

    return (
        <div>
            <InputButton onClick={() =>{
                    p.setWindow(<SubmissionWindow setWindow={p.setWindow} setConfirm={p.setConfirm} dataset={p.global}/>);
            }} label="Atgriezties" />
            <div style={{display:'flex', flexDirection:'column', gap:20}}>
                <h2>{p.dataset.name}</h2>
                <div>
                    <div>Apraksts:</div>
                    <textarea style={{marginTop:10, width:'100%', height:60, backgroundColor:'rgba(0,0,0,0.1)', border:'none', paddingLeft:5, paddingTop:5}} value={'banans'}/>
                </div>
                <div>
                    <div>Pielikumi:</div>
                    <div style={{display:'grid', gridTemplateColumns:'48% 48%', padding:10, justifyContent:'space-between', marginTop:10, backgroundColor:'rgba(0,0,0,0.02)', minHeight:50, maxHeight:100, overflowY:'auto', rowGap:10}}>
                        <FileAttachment/>
                        <FileAttachment/>
                        <FileAttachment/>
                        <FileAttachment/>
                        <FileAttachment/>
                        <FileAttachment/>
                        <FileAttachment/>
                        <FileAttachment/>
                        <FileAttachment/>
                    </div>
                </div>
                <div>
                    <Comments />
                </div>
            </div>
            
        </div>
    )
}

function FileAttachment(p){
    return (
        <div style={{backgroundColor:'rgba(255,0,0,0.1)', height:35}}>
            <div style={{display:'flex', flexWrap:'wrap', alignContent:'center', paddingLeft:5, height:'100%'}}>
            Pielikums (piemērs)
            </div>
            
        </div>
    )
}