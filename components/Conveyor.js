/*
    Koda apraksts:
        Modulis, kurs ietver sevi informacijas blokus.
    
    Vlads Muravjovs, 4Ap, Rezeknes Tehnikums, 2023
*/

import react, { useState } from "react"

import {BsFillTrophyFill} from 'react-icons/bs';
import { BsFilter } from "react-icons/bs";

import { InputGeneric } from "./Modules/FormModules";

import styles from '../styles/Conveyor.module.css';
import inputStyles from '../styles/Inputs.module.css';

import Link from "next/link";

export default function Conveyor(props){
    const [filter, setFilter] = useState({
        showFinished:true,
        searchQuery:'',
        sortByProgress:false,
        sortDescend:false
    });
    
    console.log(props.data);
    const querySymbol = props.href.includes("?") ? '&' : '?';

    let sortedData = [];
    if(props.data){
        props.data.map((set) => {
            sortedData.push(set);
        });
    }
    
    function sortByProgress(){
        if(filter.sortByProgress && props.data){
            for(var i=0; i<sortedData.length-1; ++i){
                for(var j=0; j<sortedData.length-i-1;++j){
                    
                    var curProgress = parseFloat(sortedData[j]['percent']);
                    var nexProgress = parseFloat(sortedData[j+1]['percent']);

                    var expression = filter.sortDescend ? curProgress < nexProgress : curProgress > nexProgress;

                    if(expression){
                        var temp = sortedData[j];
                        sortedData[j] = sortedData[j+1];
                        sortedData[j+1] = temp;
                    }
                }
            }
        }
    }
    sortByProgress();

    let filterData = [];
    function applyFilter(){
        if(props.data){ 
            sortedData.map((set) => {
                let filterCheck = true;
                
                if(!filter.showFinished && set['finish'])
                    filterCheck = false;
    
                if(filter.searchQuery !== '' && !set['name'].toLowerCase().includes(filter.searchQuery.toLowerCase()))
                    filterCheck = false;
    
                if(filterCheck)
                    filterData.push(set);
            });
        }
    }
    applyFilter();
    

    return(
        <div className={styles['root']} style={{width:'100%', maxWidth:'100vw', position:'relative'}}>
            <div style={{position:'absolute', width:'100%', display:'flex', justifyContent:'flex-end'}}>
                <FilterButton filter={filter} setFilter={setFilter}/>
            </div>
            <div className={styles['content']}>
                {
                    props.data &&
                    filterData.map((set) => 
                        <ConveyorElement id={set['id']} title={set['name']} href={props.href + querySymbol + "id=" + set[props.hrefkey]} 
                            titlesub={set['progress'] ? 'Progress: ' + set['progress'] + (set['percent'] ? ' (' + set['percent'] + '%)' : '') : ''}
                            bottsub={set['finish'] ? <BsFillTrophyFill/> : ''}
                        />
                    )
                }
            </div>
        </div>
    )
}

function ConveyorElement(props){    
    return(
        <div className={styles['element']}>
            <Link href={props.href}>
                <div className={styles['element-content']}>
                    <div>
                        <div className={styles['title']}>{props.title}</div>
                        <i>{props.titlesub}</i>
                    </div>
                    
                    <div>{props.bottsub}</div>
                </div>
            </Link>
        </div>
    )
}

function FilterButton(p){
    const [panel, setPanel] = useState(false);

    const handleChangeQuery = (e) => {
        p.setFilter({...p.filter, ['searchQuery']:e.target.value})
    }

    return (
        <div className={styles['filter-button']}>
            <BsFilter style={{fontSize:'1.7em'}} onClick={()=>{setPanel(!panel)}}/>
            {panel &&
            <div style={{height:120, width:185, backgroundColor:'rgb(235,235,235)', boxShadow:'0px 2px 20px 2px rgba(25, 0, 0, .2)', position:'absolute', right:50, padding:3, display:'flex', flexDirection:'column', gap:6, fontSize:'0.9em'}}>
                <div style={{fontWeight:'bold'}}>Filtrs</div>
                <input onChange={handleChangeQuery} style={{height:18}} placeholder="Meklēt..." className={inputStyles['input-generic']} value={p.filter.searchQuery}/>
                <FilterCheckbox filter={p.filter} setFilter={p.setFilter} value='showFinished'>
                    Rādīt pabeigtos
                </FilterCheckbox>
                <FilterCheckbox filter={p.filter} setFilter={p.setFilter} value='sortByProgress'>
                    Kārtot pēc progresa
                </FilterCheckbox>
                <FilterCheckbox filter={p.filter} setFilter={p.setFilter} value='sortDescend'>
                    Kārtot dilstošajā secībā
                </FilterCheckbox>
            </div>
            }
        </div>
    )
}

function FilterCheckbox(p){
    const _onClick = () => {
        p.setFilter({...p.filter, [p.value]:!p.filter[p.value]});
    }
    
    return (
        <div style={{display:'flex', justifyContent:'flex-start', gap:5, height:20}} onClick={_onClick}>
            <input type="checkbox" checked={p.filter[p.value]} readOnly/>
            <div>{p.children}</div>
        </div>
    )
}