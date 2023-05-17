import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {BsFillTrash3Fill} from 'react-icons/bs';

function FormGeneric(props){
    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
    
        // You can pass formData as a fetch body directly:
        //fetch('/some-api', { method: form.method, body: formData });
    
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);

        if(props.submit){
            props.submit(formData);
        }
    }
    
    return(
        <form method="post" onSubmit={handleSubmit}>
            {props.dataset.map((set)=>
                <InputGeneric dataset={set} />
            )}
        </form>
    )
}

function InputGeneric(props){
    return(
        <div>
            <div>{props.dataset.prettyname}</div>
            <input {...props.dataset.input} />
        </div>
    )
}

function InputButton(props){
    const _onClick = (e) => {
        if(props.onClick){
            props.onClick();
        }
    }
    
    return(
        <div>
            <button onClick={_onClick}>{props.label}</button>
        </div>
    )
}

function EditField(props){
    const [value, setValue] = useState('');

    useEffect(()=>{
        setValue(props.value);
    }, []);

    const _handleChange = (e) =>{
        setValue(e.target.value);

        if(props.onChange){
            props.onChange({name:props.name, value:e.target.value});
        }
    }

    const _submitChange = e => {
        if(value !== props.value){
            console.log('hehe');

            if(props.onSubmit){
                props.onSubmit({name:props.name, value:e.target.value});
            }
        }
    }

    return(
        <div>
            <input name={props.name} value={value} onChange={_handleChange} onBlur={_submitChange}/>
        </div>
    )
}

function TinyWindow(p){
    return(
        <div style={{position:'absolute', left:'50%', transform:'translate(-50%, 25%)', width:400, minHeight:320, backgroundColor:'rgb(235,235,235)', boxShadow:'rgba(25,0,0,0.2) 0px 5px 20px 5px'}}>
            <div style={{display:'flex', justifyContent:'flex-end', width:'100%', height:25, backgroundColor:'rgba(0,0,0,0.2)'}}>
                <div onClick={()=>{p.setSelf(null)}} style={{width:35, textAlign:'center', paddingTop:5}}>
                    X
                </div>
            </div>
            <div style={{padding:10}}>
                {p.children}
            </div>
        </div>
    )
}

function PermsForm(p){
    const [values, setValues] = useState(
        {
            //a - add, d - delete, e - edit
            //project
            e_p:false,
            d_p:false,
            //milestones
            a_m:false,
            d_m:false,
            e_m:false,
            //assignments
            a_a:false,
            d_a:false,
            e_a:false,
            //members
            a_mb:false,
            d_mb:false,
            e_mb:false,
        }
    );

    p.v(values);

    const parsePerms = () => {
        var perms = p.d.perms.split(",");
        perms = perms.filter((str) => str != '');
        console.log(perms);

        if(perms[0] === "all"){
            //make a copy
            let copy = Object.assign({}, values);
            
            //set all values to true
            for(const[key,value] of Object.entries(copy)){
                copy[key] = true;
            }

            //apply changes
            setValues(copy);
        }else{
            //make a copy
            let copy = Object.assign({}, values);
            
            //set corresponding values to true
            perms.forEach(val => {
                copy[val] = true;
            });

            //apply changes
            setValues(copy);
        }

        console.log(values);
    }

    const dataset = [
        {name:'d_p',    prettyname:'Delete project'},
        {name:'e_p',    prettyname:'Edit project'},
        {name:'a_m',    prettyname:'Add milestones'},
        {name:'d_m',    prettyname:'Delete milestones'},
        {name:'e_m',    prettyname:'Edit milestones'},
        {name:'a_a',    prettyname:'Add assignments'},
        {name:'d_a',    prettyname:'Delete assignments'},
        {name:'e_a',    prettyname:'Edit assignments'},
        {name:'a_mb',   prettyname:'Add members'},
        {name:'d_mb',   prettyname:'Delete members'},
        {name:'e_mb',   prettyname:'Edit members'},
    ]

    useEffect(()=>{
        parsePerms();
    }, []);
    
    return(
        <div style={{display:'grid', gridTemplateColumns:'50% 50%'}}>
            {dataset.map((val) => 
                <PermsCheck values={values} setValues={setValues} d={val} checked={values[val.name]} />
            )}
        </div>
    )
}

function PermsCheck(p){
    const check = (e) => {
        p.setValues({...p.values, [p.d.name]:!p.checked})
    }
    
    return(
        <div onClick={check}>
            <input type="checkbox" readOnly checked={p.checked}/> {p.d.prettyname}
        </div>
    )
}

function Comments(p){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refresh();
    }, []);
    
    const refresh = async () => {
        const sendData = {
            'auth':localStorage.getItem("auth"),
            'link':p.fetch.link,
            'linktype':p.fetch.linktype,
            'action':'view'
        }

        const json = JSON.stringify(sendData);

        const endpoint = 'http://localhost:80/scheduler/actions/comments.php';

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
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <div>Komentāri:</div>
                <InputButton
                    onClick={()=>{p.setOverlay(<CreateCommentWindow fetch={p.fetch} refresh={refresh} setSelf={p.setOverlay}/>)}}
                    label="Pievienot"
                /> 
            </div>
            <div style={{marginTop:10, maxHeight:150, overflowY:'auto', display:'flex', flexDirection:'column', gap:10}}>
                {data.map((set) => <Comment d={set} fetch={p.fetch} refresh={refresh}/>)}
            </div>
        </div>
    )
}

function Comment(p){
    const deleteComment = async () => {
        const sendData = {
            'id':p.d.id,
            'auth':localStorage.getItem("auth"),
            'link':p.fetch.link,
            'linktype':p.fetch.linktype,
            'action':'delete'
        }

        const json = JSON.stringify(sendData);

        const endpoint = 'http://localhost:80/scheduler/actions/comments.php';

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

        p.refresh();
    }
    
    return (
        <div style={{backgroundColor:'rgba(255,0,0,0.05)', height:'fit-content', padding:5}}>
            <div style={{display:'flex', justifyContent:'space-between', fontWeight:"bold"}}>
                <div>{p.d.username}</div>
                {p.d.own ?
                <div><BsFillTrash3Fill style={{color:'rgba(90,0,0,0.5)'}} onClick={deleteComment}/></div>
                :
                <></>
                }
            </div>
            <div style={{marginTop:2, wordWrap:'break-word'}}>
                {p.d.content}
            </div>
        </div>
    )
}

function CreateCommentWindow(p){
    const _submit = async (data) => {
        data.append("auth", localStorage.getItem("auth"));
        data.append("link", p.fetch.link);
        data.append("linktype", p.fetch.linktype);
        data.append("action", "add");

        var object = {};
        data.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);

        console.log(json);

        const endpoint = 'http://localhost:80/scheduler/actions/comments.php';

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


        p.refresh();
        p.setSelf(null);
    }
    
    const dataset = [
        {
            name:'content', 
            prettyname:'Komentārs', 
            input:{
                type:'text',
                name:'content',
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

    return(
        <TinyWindow setSelf={p.setSelf}>
            <h3>Komentāra pievienošana</h3>
            <FormGeneric submit={_submit} dataset={dataset}/>
        </TinyWindow>
    )
}

function FileAttachments(p){
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(true);

    const refresh = async () => {
        const sendData = {
            'auth':localStorage.getItem("auth"),
            'link':p.fetch.link,
            'linktype':p.fetch.linktype,
            'action':'view'
        }

        const json = JSON.stringify(sendData);

        const endpoint = 'http://localhost:80/scheduler/actions/files.php';

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

    useEffect(()=>{
        refresh();
    }, [])

    if(loading)
        return(
            <div>loading..</div>
        )

    return (
        <div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <div>Pielikumi:</div>
                {p.edit ?
                    <InputButton
                        onClick={()=>{p.setOverlay(<AddFileAttachmentWindow refresh={refresh} setSelf={p.setOverlay} fetch={p.fetch}/>)}}
                        label="Pievienot"
                    />
                : <></>}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'32% 32% 32%', padding:10, justifyContent:'space-between', marginTop:10, backgroundColor:'rgba(0,0,0,0.02)', minHeight:50, maxHeight:100, overflowY:'auto', rowGap:10}}>
                {data.map((set) => <FileAttachment refresh={refresh} d={set} />)}
            </div>
        </div>
    )
}

function FileAttachment(p){
    const deleteAttachment = async () => {
        const sendData = {
            'id':p.d.id,
            'url':p.d.url,
            'auth':localStorage.getItem("auth"),
            'action':'delete'
        }

        const json = JSON.stringify(sendData);

        const endpoint = 'http://localhost:80/scheduler/actions/files.php';

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

        p.refresh();
    }
    
    return (
        <div style={{backgroundColor:'rgba(255,0,0,0.1)', height:35}}>
            <div style={{display:'flex', flexWrap:'wrap', alignContent:'center', paddingLeft:5, paddingRight:5, height:'100%'}}>
                <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                    <div>
                        <a href={"http://localhost:80/scheduler/scheduler/"+p.d.url} target="blank">{p.d.type}</a>
                    </div>
                    <div>
                        <BsFillTrash3Fill style={{color:'rgba(90,0,0,0.5)'}} onClick={deleteAttachment}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AddFileAttachmentWindow(p){
    const _submit = async (data) => {
        data.append("auth", localStorage.getItem("auth"));
        data.append("link", p.fetch.link);
        data.append("linktype", p.fetch.linktype);
        data.append("action", "upload");

        const endpoint = 'http://localhost:80/scheduler/actions/files.php';

        const options = {
            method:'POST',
            body: data,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();
        console.log(result);

        p.refresh();
        p.setSelf(null);
    }

    const dataset = [
        {
            name:'upfile', 
            prettyname:'Pielikums', 
            input:{
                type:'file',
                name:'upfile',
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
            <h3>Pielikuma pievienošana</h3>
            <FormGeneric submit={_submit} dataset={dataset}/>
        </TinyWindow>
    )
}

export {PermsForm, Comments, FileAttachments, FormGeneric, TinyWindow, InputGeneric, InputButton, EditField};