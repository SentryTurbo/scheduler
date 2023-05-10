import react from "react";

import { InputButton } from "../Modules/FormModules";
import { useRouter } from "next/router";

export default function ProfileWindow(props){
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("auth");

        props.setWindow(null);

        router.push('/');
    }
    
    return (
        <div>
            <h3>Profile</h3>
            <p>username: user</p>
            <InputButton label="log out" onClick={logout} />
        </div>
    )
}