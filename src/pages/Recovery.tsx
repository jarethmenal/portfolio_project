import'./styles/recovery.scss'
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchOnDemand from '../functions/fetchOnDemand';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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

const updatePassword = (email:string, newPassword: string, confirmPassword:string, location:string) => {
    return {
       "operationName": "Mutation",
      
      "query": `mutation Mutation($email: String!, $newPassword: String!, $confirmPassword: String!, $location: String!) {
        updatePassword(email: $email, newPassword: $newPassword, confirmPassword: $confirmPassword, location: $location)
      }`,
    
      "variables": {email, newPassword, confirmPassword, location}
    }
  }

const Recovery = () => {

    let navigate = useNavigate();

    const tokenAuth = `Bearer ${useParams().token}`
    
    const [visibility, setVisibility] = useState<Boolean>(false);
    const [form, setForm] = useState<formData>({password:'', confirmPassword: ''});
    const [error, setError] = useState<string|null>(null);
    const [email, setEmail] = useState<string>('');

    const visibilityHandler = () => {
        setVisibility(prev => !prev);
    }

    const getEmail = async() => {
        const valid = await fetchOnDemand({inQuery: getEmailQuery(), header: {Authorization: tokenAuth} });
        
        if(valid.errors){
            
            console.log(valid)
            navigate('/start');
            return
        }
        setEmail(valid.data.getEmailRecovery);
    }

    useEffect(()=>{
        (!tokenAuth) && navigate('/start');
        getEmail(); 
   
    },[])
    
    const updateForm = (updatedInput:string, data:any) => {
        setForm(prevState => ({...prevState,[updatedInput]:data}));
    }

    const updatePasswordHandler =  async() => {
        const resp = await fetchOnDemand({inQuery: updatePassword(email, form.password, form.confirmPassword, 'recover'), header: {Authorization: tokenAuth}});
        if (resp.errors){
            setError(resp.errors.message);
            return;
        }
        navigate('/start');
    }

    const submitHandler = (e:FormEvent) => {
        e.preventDefault();
        updatePasswordHandler();
    }

    return <div className="recovery-background">
        <h2 className='recovery-title'>Password Change</h2>
        <h4 className='recovery-subtitle'>{email} </h4>
        <p className='recovery-feedback'>{error}</p>
        <Form className="recovery-form" onSubmit={e => submitHandler(e)}>
        
        <InputGroup className="recovery-input">
                
            <FloatingLabel className='form-floating' label='New Password'> 
                <Form.Control
                value={form.password}
                id={'password'}
                onChange={e => updateForm(e.target.id, e.target.value)}
                type={visibility ? 'text' :  'password'} 
                placeholder=" "
                />
            </FloatingLabel>

            <Button onClick={visibilityHandler} className="input-assist-button" type="button">
                {(visibility ? <FontAwesomeIcon size='1x' icon={faEye}/>:<FontAwesomeIcon size='1x' icon={faEyeSlash}/>)}
            </Button>
        </InputGroup> 

        <FloatingLabel className="form-floating" label='Confirm New Password'>
            <Form.Control
            type={!visibility ? 'password' : 'text'} 
            id={'confirmPassword'}
            className="recovery-input" 
            value={form.confirmPassword}
            onChange={e => updateForm(e.target.id, e.target.value)}
            placeholder=" "/>
        </FloatingLabel>
            
        <Form.Control type={'submit'} className='recovery_submit'></Form.Control>
        </Form>

    </div>
}

export default Recovery;