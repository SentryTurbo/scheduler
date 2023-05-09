import { InputButton } from "../Modules/FormModules"

export default function ConfirmWindow(props){
    return(
        <div>
            <h2>Vai esat pārliecināti?</h2>
            <div style={{display:'flex', justifyContent:'center'}}>
                <div style={{display:'flex', justifyContent:'space-between', width:'40%'}}>
                    <InputButton 
                        onClick={() => {
                            props.confirmation.read.onConfirm();
                            props.confirmation.set({onConfirm:null});
                        }} 
                        
                        label="Jā"
                    />
                    <InputButton onClick={() => {props.confirmation.set({onConfirm:null})}} label="Nē"/>
                </div>
            </div>
        </div>
    )
}