import { useEffect, useState } from "react";

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

export {FormGeneric, TinyWindow, InputGeneric, InputButton, EditField};