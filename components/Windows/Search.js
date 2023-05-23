import { useState } from "react"
import { InputButton } from "../Modules/FormModules";
import { BsFilter } from "react-icons/bs";
import Link from "next/link";

import styles from "../../styles/Inputs.module.css";

const translations = {
    project:'Projekts',
    milestone:'Mērķis',
    assignment:'Uzdevums',
    submission:'Risinājums'
}

export default function SearchWindow(p){
    const [query, setQuery] = useState({
        text:'',
        filters:{
            project:true,
            milestone:true,
            assignment:true,
            submission:true
        }
    });

    const [result, setResult] = useState([]);
    const [loading,setLoading] = useState(false);

    const [filter, setFilter] = useState(false);

    const toggleFilter = () => {
        setFilter(!filter);
    }

    const handleTextChange = (e) => {
        setQuery({...query, ['text']:e.target.value});
    }

    const requestQuery = async () => {
        const queryData = {
            query:query,
            auth:localStorage.getItem("auth")
        }

        console.log(queryData);

        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS +  "/actions/search.php";

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
                <div style={{marginTop:25, display:'grid', gridTemplateColumns:'auto 30px', width:'70%', gap:10 }}>
                    <input placeholder="Vaicājums..." className={styles['input-generic']} style={{width:'100%'}} type="text" onChange={handleTextChange} value={query.text}/>
                    <div onClick={toggleFilter} className={styles['input-generic']} style={{display:'flex', flexWrap:'wrap', placeContent:'center', borderBottom:'solid', borderWidth:1, height:'auto'}}>
                        <BsFilter style={{fontSize:'1.5em'}}/>
                    </div>
                </div>
                {filter &&
                    <div style={{display:'flex', justifyContent:'space-between', marginTop:10}}>
                        <FilterPick setValues={setQuery} query={query} values={query.filters} name="project" label="Projekti"/>
                        <FilterPick setValues={setQuery} query={query} values={query.filters} name="milestone" label="Mērķi"/>
                        <FilterPick setValues={setQuery} query={query} values={query.filters} name="assignment" label="Uzdevumi"/>
                        <FilterPick setValues={setQuery} query={query} values={query.filters} name="submission" label="Risinājumi"/>
                    </div>
                }
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

function FilterPick(p){
    const toggleValue = (e) => {
        p.setValues({...p.query, ['filters']:{...p.query.filters, [p.name]:!p.query.filters[p.name]}})
    }

    return (
        <div style={{display:'flex', alignContent:'center', flexWrap:'wrap'}} onClick={toggleValue}>
            <input type="checkbox" checked={p.values[p.name]}></input>
            <div style={{fontSize:'0.8em'}}>{p.label}</div>
        </div>
    )
}