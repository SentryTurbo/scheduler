import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { FormGeneric } from '../components/Modules/FormModules';
import { useRouter } from 'next/router';

export default function Register(props){
    const router = useRouter();
    
    const _submit = async (data) => {
        const endpoint = 'http://localhost:80/scheduler/auth/register.php';
        
        const options = {
            method:'POST',
            body: data,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        if(result === "true"){
            router.push('/');
        }
        //props.refreshData();
        console.log(result);
    }
    
    const dataset = [
      {
          name:'username', 
          prettyname:'Lietotajvards', 
          input:{
              type:'text',
              name:'username',
              required:true
          }
      },
      {
          name:'pass', 
          prettyname:'Parole', 
          input:{
              type:'password',
              name:'pass',
              required:true
          }
      },
      {
          name:'submit',
          prettyname:'',
          input:{
              type:'submit'
          }
      }
    ]
    
    return (
      <div>
        <FormGeneric submit={_submit} dataset={dataset} />
        <br/>
        <Link href="/">Login</Link>
      </div>
    )
}