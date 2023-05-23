import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { FormGeneric } from '../components/Modules/FormModules';
import { cookies } from 'next/headers';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const _submit = async (data) => {
        const endpoint = process.env.NEXT_PUBLIC_API_ADDRESS + '/auth/login.php';
      
        const options = {
            method:'POST',
            body: data,
        };

        const response = await fetch(endpoint,options);

        const result = await response.text();

        if(result != "ERROR"){
          localStorage.setItem('auth', result);

          router.push('/main/');
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
              required:true,
              placeholder:'Lietotājvārds'
          },
      },
      {
          name:'pass', 
          prettyname:'Parole', 
          input:{
              type:'password',
              name:'pass',
              required:true,
              placeholder:'******'
          },
          div:{
            style:{
              marginTop:10
            }
          }
      },
      {
          name:'submit',
          prettyname:'',
          input:{
              type:'submit'
          },
          div:{
            style:{
              marginTop:10
            }
          }
      }
    ]
  
  return (
    <div style={{display:'flex', placeContent:'center', height:'100vh', flexWrap:'wrap', backgroundColor:'rgba(255,0,0,0.03)'}}>
      <div style={{backgroundColor:'rgba(0,0,0,0.04)', borderRadius:'10%', padding:60}}>
        <div style={{marginBottom:25, fontWeight:'bold', fontSize:'1.2em'}}>Pierakstīšanās</div>
        <FormGeneric submit={_submit} dataset={dataset} />
        <br/>
        <Link style={{fontSize:'0.85em', color:'rgba(0,0,0,0.6)'}} href="/register">Reģistrācija</Link>
      </div>
    </div>
  )
}
