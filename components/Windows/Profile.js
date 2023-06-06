/*
    Koda apraksts:
        Profila logs, kur tiek raditi projekta dati, kurus
        atsuta serveris.
    
    Vlads Muravjovs, 4Ap, Rezeknes Tehnikums, 2023
*/

import react, { useEffect, useState } from "react";

import { InputButton } from "../Modules/FormModules";
import { useRouter } from "next/router";

export default function ProfileWindow(props){
    const [userData, setUser] = useState({username:'unknown'});
    
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("auth");

        props.setWindow(null);

        router.push('/');
    }

    const requestUserData = async () => {
        const JSONdata = await localStorage.getItem("auth");

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/profile.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSONdata,
        };

        const response = await fetch(endpoint,options);

        const result = await response.json();

        setUser(result);

        console.log(result);
    }

    const deleteUserData = async () => {
        const JSONdata = JSON.stringify({auth:localStorage.getItem("auth")});

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  '/actions/deleteprofile.php';

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSONdata,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        console.log(result);

        if(result == "true")
            logout();
        else
            props.addNotif({type:'e',text:'Radās kļūda.'})
    }

    useEffect(()=>{
        requestUserData();
    }, []);
    
    return (
        <div>
            <h3>Profils</h3>
            <p>Lietotājvārds: {userData.username}</p>
            <div style={{display:'flex', gap:20}}>
                <InputButton label="Atrakstīties" onClick={logout} />
                <InputButton label="Izdzēst profilu" onClick={()=>{
                    props.setConfirm({onConfirm:()=>{
                        deleteUserData();
                    }})
                }} />
            </div>
            
        </div>
    )
}