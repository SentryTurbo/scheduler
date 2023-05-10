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

        const endpoint = 'http://localhost:80/scheduler/profile.php';

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

    useEffect(()=>{
        requestUserData();
    }, []);
    
    return (
        <div>
            <h3>Profile</h3>
            <p>username: {userData.username}</p>
            <InputButton label="log out" onClick={logout} />
        </div>
    )
}