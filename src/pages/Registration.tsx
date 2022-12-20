import'./styles/registration.scss'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchOnDemand from '../functions/fetchOnDemand';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CloudImage from '../components/CloudImage';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
const getEmailQuery = () => {
    return {
       "operationName": "Query",
      
      "query": `query Query {
        getEmailRegister
      }`,
    
      "variables": {}
    }
}

const createUserQuery = ( name:string, email:string,password:string, profpic:any, confirmPassword:string) => {
    return {
       "operationName": "Mutation",
      
      "query": `mutation Mutation($user: userInput!) {
        createUser(user: $user) {
          id
        }
      }`,
    
      "variables": {"user": {"name":name, "email": email, "password": password, "profpic": profpic, "confirmPassword":confirmPassword}}
    }
}

// const nonAvailableImageQuery = () => {
//     return {
//        "operationName": "Query",
      
//       "query": `query Query($filter: String, $where: String) {
//         getImageCollection(filter: $filter, where: $where)
//       }`,
    
//       "variables": {"filter": "nonAvailable", "where": "register"}
//     }
// }

interface formData {
    password: string,
    confirmPassword: string,
    profilepic: FileList | any,
    name: string,
    lastName: string
}

const Registration = () => {
    let navigate = useNavigate();
    const params = useParams();
    const [visibility, setVisibility] = useState<Boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [form, setForm] = useState<formData>({password:'', confirmPassword: '',profilepic: null,name:'', lastName:''});
    const [error, setError] = useState<string|null>(null);
    const tokenAuth = `Bearer ${params.token}`;
    const visibilityHandler = () => {
        setVisibility(prev => !prev);
    }

    const getEmail = async() => {
        const valid = await fetchOnDemand({inQuery: getEmailQuery(), header: {Authorization: tokenAuth} });
        
        if(valid.errors){
            
            console.log(valid.errors)
            navigate('/start');
            return
        }

        setEmail(valid.data.getEmailRegister)
    }
    // const {response, error, loading} = useFetchAxios({inQuery: nonAvailableImageQuery(), header: {Authorization: `Bearer ${params.token}`}})

    

    useEffect(()=>{
        (!tokenAuth) && navigate('/start');
        getEmail(); 
   
    },[params])

    const registerHandler = async() => {
        const resp = await fetchOnDemand({inQuery: createUserQuery(`${form.name} ${form.lastName}`, email, form.password,form.profilepic, form.confirmPassword), header: {Authorization: tokenAuth}});
        if (resp.errors){
          console.log(resp)
          setError(resp.errors.message);
          return;
        }
        navigate('/start');
      }

    const updateForm = (updatedInput:string, data:any) => {
        setForm(prevState => ({...prevState,[updatedInput]:data}));
    }

    const transformImage = (id:string, file:any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file[0]);
        reader.onloadend = () => {
            updateForm(id, reader!.result!)
        }
    }
    
    return <div className='registration-background'>
        <div className='registration-form-container'>
            
            <Form className='registration-form' onSubmit={e => e.preventDefault()}> 
            
            <label htmlFor="profilepic" className='profile-pic-container'>
                {form.profilepic  ?
                <img className='registration-preview' src={form.profilepic} alt={'preview'}/>:
                <CloudImage styles='registration-preview' image_id='portfolio_project1/k6o9yedyufldq1fymtuu'></CloudImage>
                }
                
                <div className='insert-image-overlay'>
                    <p className='insert-image-overlay-text'>Change Picture</p>
                </div>
            </label>
            
            <Form.Control 
            className='registration-file-input' 
            type="file" 
            id="profilepic"
            accept="image/png, image/gif, image/jpeg" 
            onChange={e => {
                const {id, files} = e.target as HTMLInputElement;
                transformImage(id, files);
            }}/>

            {error && <p className='register-error-text'>{error}</p>}
            
            <FloatingLabel label='Name' className="input-r">
                <Form.Control 
                type="text" 
                className="form-control" 
                id="name" 
                value={form.name}
                onChange={e => updateForm(e.target.id, e.target.value)}
                placeholder="Sample Name"/>
            </FloatingLabel>

            <FloatingLabel className="input-r" label='Last Name'>
                <Form.Control 
                type="text" 
                className="form-control form-format" 
                id="lastName" 
                value={form.lastName}
                onChange={e => updateForm(e.target.id, e.target.value)}
                placeholder="Sample Last Name"/>
            </FloatingLabel>

            <InputGroup className="input-r">

                <FloatingLabel label='Password'>
                <Form.Control
                    value={form.password}
                    id={'password'}
                    onChange={e => updateForm(e.target.id, e.target.value)}
                    type={visibility ? 'text' :  'password'}
                    className="form-control" 
                    placeholder="This is a Placeholder"/>
                </FloatingLabel>

                {/* <div className='form-floating'> 
                    
                </div> */}
                <Button onClick={visibilityHandler} className="input-assist-button" type="button">
                {(visibility ? <FontAwesomeIcon size='1x' icon={faEye}/>:<FontAwesomeIcon size='1x' icon={faEyeSlash}/>)}
                </Button>
            </InputGroup>     

            <FloatingLabel className="input-r" label='Confirm Password'>
                <Form.Control 
                type={!visibility ? 'password' : 'text'} 
                className="form-control" 
                id="confirmPassword" 
                value={form.confirmPassword}
                onChange={e => updateForm(e.target.id, e.target.value)}
                placeholder="Sample Password"/>
            </FloatingLabel>

            <div className='register-button-container'>
                <Button className='btn-primary btn' onClick={registerHandler}>{'Register'}</Button>
            </div>
            
            </Form> 

                  
   
        </div>
    </div>
}

export default Registration