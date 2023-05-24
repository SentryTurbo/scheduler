import { useEffect } from "react";

export default function NotificationList(p){
    return (
        <div style={{position:'absolute',}}>
            <div style={{position:'fixed', bottom:25, right:25}}>
                {p.notifs &&
                     <Notification setNotifs={p.setNotifs} d={p.notifs}/>
                }
            </div>
        </div>
    )
}

function Notification(p){
    const invis = () => {
        p.setNotifs(null);
    }

    useEffect(()=>{
        setTimeout(()=>{
            invis();
        }, 3000);
    }, []);

    const types = {
        's':{backgroundColor:'rgb(0,175,0)', color:'white',},
        'e':{backgroundColor:'rgb(175,0,0)', color:'white',}
    }  

    return (
        <div style={{minWidth:100, marginTop:10, padding:10, fontWeight:'bold', ...types[p.d.type]}}>
            {p.d.text}
        </div>
    )
}