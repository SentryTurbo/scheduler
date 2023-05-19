import { useState } from "react"
import { InputButton } from "../Modules/FormModules";
import Link from "next/link";

const translations = {
    project:'Projekts',
    milestone:'Mērķis',
    assignment:'Uzdevums',
    submission:'Risinājums'
}

export default function SearchWindow(p){
    const [query, setQuery] = useState({
        text:''
    });

    const [result, setResult] = useState([]);
    const [loading,setLoading] = useState(false);

    const handleTextChange = (e) => {
        setQuery({...query, ['text']:e.target.value});
    }

    const requestQuery = async () => {
        const queryData = {
            query:query,
            auth:localStorage.getItem("auth")
        }

        const endpoint = "http://localhost:80/scheduler/actions/search.php";

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(queryData),
        };

        setLoading(true);

        const response = await fetch(endpoint,options);

        const result = await response.json();

        setResult(result);
        setLoading(false);
    }
    
    return (
        <div>
            <div style={{display:'flex', alignContent:'center', flexDirection:'column', flexWrap:'wrap'}}>
                <div style={{textAlign:'center', fontSize:'1.25em', fontWeight:'bold'}}>
                    Meklēšana
                </div>
                <div style={{marginTop:25, width:'70%'}}>
                    <input style={{width:'100%'}} type="text" onChange={handleTextChange} value={query.text}/>
                </div>
                <div style={{marginTop:10, display:'flex', justifyContent:'center'}}>
                    <InputButton onClick={requestQuery} label="Meklēt!"/>
                </div>
            </div>
            <div style={{marginTop:40}}>
                Rezultāti:
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:5, minHeight:300, maxHeight:300, overflowY:'auto'}}>
                {
                    loading ? 'Meklē...' : 
                        result.length > 0 ?
                            result.map((set)=> <SearchResult d={set}/>)
                        : 'Nav rezultātu.'
                }
            </div>
        </div>
        
    )
}

function SearchResult(p){
    const hreftypes = {
        project:'/project?id='+p.d.id,
        milestone:'/milestone?id='+p.d.id,
        assignment:'/milestone?id='+ (p.d.milestone_id ? p.d.milestone_id : '') + '&assignment=' + p.d.id,
        submission:'/milestone?id='+ (p.d.milestone ? p.d.milestone : ''),
    }

    const href = hreftypes[p.d.type];
    
    return (
        <Link href={"/main" + href}>
            <div style={{backgroundColor:'rgba(0,0,0,0.1)', height:30, display:'flex', alignContent:'center', justifyContent:'space-between', flexWrap:'wrap', paddingLeft:10, paddingRight:10}}>
                <div style={{height:'fit-content'}}>{p.d.name}</div>
                <div style={{height:'fit-content'}}>{translations[p.d.type]}</div>
            </div>
        </Link>
    )
}