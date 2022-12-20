import'./styles/recovery.scss'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchOnDemand from '../functions/fetchOnDemand';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface formData {
    password: string,
    confirmPassword: string,
}

const getEmailQuery = () => {
    return {
       "operationName": "Query",
      
      "query": `query Query {
        getEmailRecovery
      }`,
    
      "variables": {}
    }
}

const Recovery = () => {


    let navigate = useNavigate();
    const params = useParams();
    const [visibility, setVisibility] = useState<Boolean>(false);
    const [form, setForm] = useState<formData>({password:'', confirmPassword: ''});
    const [error, setError] = useState<string|null>(null);
    const [email, setEmail] = useState<string>('');

    const visibilityHandler = () => {
        setVisibility(prev => !prev);
      }

    const getEmail = async() => {
        const valid = await fetchOnDemand({inQuery: getEmailQuery(), header: {Authorization: `Bearer ${params.name}`} });
        
        if(valid.errors){
            
            console.log(valid.errors)
            navigate('/start');
            return
        }

        setEmail(valid.data.getEmailRegister)
    }

    useEffect(()=>{
        (!params.name) && navigate('/start');
        getEmail(); 
   
    },[params])

    const updateForm = (updatedInput:string, data:any) => {
        setForm(prevState => ({...prevState,[updatedInput]:data}));
    }

    return <div className="recovery-background">
        <form className="recovery-form" onSubmit={e => e.preventDefault()}>
        <div className="input-group">
                <div className='form-floating'> 
                    <input 
                    value={form.password}
                    id={'password'}
                    onChange={e => updateForm(e.target.id, e.target.value)}
                    type={visibility ? 'text' :  'password'}
                    className="form-control" 
                    placeholder="This is a Placeholder"
                    />
                    <label htmlFor="input2" >Password</label>
                </div>
                <button onClick={visibilityHandler} className="btn btn-primary" type="button">
                {(visibility ? <FontAwesomeIcon size='1x' icon={faEye}/>:<FontAwesomeIcon size='1x' icon={faEyeSlash}/>)}
                </button>
            </div>  
            <div className="form-floating">
                <input 
                type={!visibility ? 'password' : 'text'} 
                className="form-control" 
                id="confirmPassword" 
                value={form.confirmPassword}
                onChange={e => updateForm(e.target.id, e.target.value)}
                placeholder="Sample Password"/>
                <label htmlFor="lastName">Confirm Password</label>
            </div>
        </form>
    </div>
}

export default Recovery;