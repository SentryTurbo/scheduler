import { useEffect, useRef, useState } from "react";

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
    return (
        <div>
            <Comment />
        </div>
    )
}

function Comment(p){
    return (
        <div style={{backgroundColor:'rgba(255,0,0,0.05)', minHeight:100, padding:5}}>
            <div style={{fontWeight:"bold"}}>
                Name
            </div>
            <div style={{marginTop:5}}>
                LMAO
            </div>
        </div>
    )
}

export {PermsForm, Comments, FormGeneric, TinyWindow, InputGeneric, InputButton, EditField};