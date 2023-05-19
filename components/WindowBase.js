import React from "react"

export default function WindowBase(props){
    const _close = () => {
        props.setWindow();
    }

    return (
        <div style={{
            display:'flex',
            height:'100%',
            width:'100%',
            flexWrap:'wrap',
            placeContent:'center'
        }}>
            <div style={{
                backgroundColor:'rgba(235,235,235,1)',
                minHeight:550,
                width:'max(540px, 50%)',
                boxShadow:'0px 5px 20px 5px rgba(25, 0, 0, .2)'

            }}>
                <div style={{
                    display:'flex',
                    justifyContent:'flex-end',
                    height:35,
                    width:'100%'
                }}><div style={{width:35, display:'flex', placeContent:'center', flexWrap:'wrap',
                cursor:'pointer'}} onClick={_close}>
                    <div style={{height:'fit-content'}}>X</div>
                </div></div>
                <div style={{padding:20}}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}