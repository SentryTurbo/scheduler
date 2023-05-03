import { InputButton } from "../Modules/FormModules"

export default function ConfirmWindow(props){
    return(
        <div>
            <h2>Are you sure?</h2>
            <div style={{display:'flex', justifyContent:'center'}}>
                <div style={{display:'flex', justifyContent:'space-between', width:'40%'}}>
                    <InputButton onClick={props.confirmation.read.onConfirm} label="Yes"/>
                    <InputButton onClick={() => {props.confirmation.set({onConfirm:null})}} label="No"/>
                </div>
            </div>
        </div>
    )
}