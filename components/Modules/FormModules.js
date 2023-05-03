import { useEffect } from "react";

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

export {FormGeneric, InputGeneric, InputButton};