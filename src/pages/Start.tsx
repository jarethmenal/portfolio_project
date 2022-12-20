import React, { FormEvent,Fragment,useState} from 'react'
import'./styles/start.scss'
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fetchOnDemand from '../functions/fetchOnDemand';


const Start = () => {
    
  const [mode, setMode] = useState<String>('login');
  const [visibility, setVisibility] = useState<Boolean>(false);
  const [input, setInput] = useState<inputData>({input1:'',input2:''});
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const updateInputs = (where:string, data:string) => {
    setInput(prev => ({
        ...prev, [where]:data
    }))
  }

  const resetInputs = () => {
    setInput({input1:'',input2:''});
    setError(null);
    setFeedback(null);
  }

  const modeHandler = (mode:string) => {
    setMode(mode);
    resetInputs();
  }

  const visibilityHandler = () => {
    setVisibility(prev => !prev);
  }
    
  const loginHandler = async(event: FormEvent) => {
    event.preventDefault();
    const resp = await fetchOnDemand({inQuery: loginQuery(input.input1, input.input2), header: headers});
    if (resp.errors){
      setError(resp.errors.message)
      return
    }
    setError(null)
  }

  const registerHandler = async(event: FormEvent) => {
    const resp = await fetchOnDemand({inQuery: sendRegisterLink(input.input2), header: headers});
      if (resp.errors){
        setFeedback(null)
        setError(resp.errors.message)
        return
      }
      setError(null)
      setFeedback(resp.data.sendRegisterLink)
  }

  const recoverHandler = async(event: FormEvent) => {
    const resp = await fetchOnDemand({inQuery: sendRecoveryLink(input.input2), header: headers});
      if (resp.errors){
        setFeedback(null)
        setError(resp.errors.message)
        return
      }
      setError(null)
      setFeedback(resp.data.sendRecoveryLink)
  }

  const registerForm = () => {
    return <div className="input-group input-separation-start">
    <div className='form-floating'> 
      
      <input 
      value={input.input2}
      onChange={e=>updateInputs('input2',e.target.value)}
      type={'text'}
      className="form-control" 
      placeholder="This is a Placeholder"
      />
      
      <label htmlFor="input2" className='start-label' >{'New Email'}</label>
    
    </div>
    
    <button onClick={registerHandler} className="btn btn-primary btn-assist" type="button">
      {`Send Registration`}
    </button>
  </div> 
  }
    
  const loginForm = () => {
    return (     
    <Fragment>              
      <div className='form-floating input-separation-start'>     
        <input
            onChange={e => updateInputs('input1',e.target.value)} 
            value={input.input1} 
            type="text"  
            id="input1" 
            placeholder="Enter email."
            className='input_start form-control'
        />
        <label htmlFor="input1" className='start-label'>Email address</label>
      </div>
    
      <div className="input-group input-separation-start">
        <div className='form-floating'> 
          <input 
          value={input.input2}
          onChange={e=>updateInputs('input2',e.target.value)}
          type={!visibility ? 'password' : 'text'}
          className="form-control" 
          placeholder="This is a Placeholder"
          />
          <label htmlFor="input2" className='start-label' >{'Password'}</label>
        </div>
      
        <button onClick={visibilityHandler} className="btn btn-primary btn-assist" type="button">
          {visibility ? <FontAwesomeIcon size='1x' icon={faEye}/>:<FontAwesomeIcon size='1x' icon={faEyeSlash}/>}
        </button>
      </div>
    </Fragment>)
    }

    const recoverForm = () => {
      return <div className="input-group input-separation-start">
    <div className='form-floating'> 
      
      <input 
      value={input.input2}
      onChange={e=>updateInputs('input2',e.target.value)}
      type={'text'}
      className="form-control" 
      placeholder="This is a Placeholder"
      />
      
      <label htmlFor="input2" className='start-label' >{'Registered Email'}</label>
    
    </div>
    
    <button onClick={recoverHandler} className="btn btn-primary btn-assist" type="button">
      {`Send Recover Email`}
    </button>
  </div> 
    }
    
    interface formType {
      [key:string]:any ;
    }

    const getFormType:formType = {
      'login': loginForm(),
      'register': registerForm(),
      'recover': recoverForm()
    };

    const welcomeMessages:{[key:string]:string} = {
      'login': 'Welcome back!',
      'register': `First time? Let's get started!`,
      'recover': 'Forgot your password? Let us help you.'
    }

    const startOptions = () => {
    return <div className={`options_container_${mode}`}>
        <div className={'left'}>
          {mode === 'login' &&
            <button onClick={loginHandler} className={'btn-go btn '}>Log In</button>
          }
        </div>
        <div className={'right'}>
          <button className={'btn btn-start-mode'} onClick={e => modeHandler(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Go to Register' : 'Go to Login'}
          </button>  
        </div>     
      </div>
    }

    return <div className={`start_bg_${mode}`}>
      <h1 className='start-big-title'>{mode.toUpperCase()}</h1>
      <div className='start_card card'>
        <div className='card-body'>
          <h3 className='start_title'>{welcomeMessages[`${mode}`]}</h3>
          {<div className='error-container'>
              {error && <p className='start-error-text'>{error}</p>}               
              {feedback && <p className='start-feedback-text'>{feedback}</p>}
          </div>}
            <form onSubmit={e => e.preventDefault()}>
              {getFormType[`${mode}`]}
            </form>   
            {startOptions()}
            </div>
            {mode==='login' && 
            <div className='recover_container card-footer text-muted'>
              <button className='recover_password' onClick={e => modeHandler(mode === 'login' ? 'recover' : 'login')}>
                Forgot you password?
              </button>
            </div>}
        </div>
    </div>
} 

export default Start

// GRAPH QUERIES.

interface inputData {
  input1: string,
  input2: string
}

const sendRegisterLink = (email:string) => {
  return {
     "operationName": "Mutation",
    
    "query": `mutation Mutation($email: String!, $baseUrl: String!) {
      sendRegisterLink(email: $email, baseUrl: $baseUrl)
    }`,
  
    "variables": {email: email, baseUrl: `${window.location.origin}/registration/`}
  }
}

const sendRecoveryLink = (inEmail:string) => {
  console.log(inEmail)
  return {
     "operationName": "Mutation",
    
    "query": `mutation Mutation($email: String!, $baseUrl: String!) {
      sendRecoveryLink(email: $email, baseUrl: $baseUrl)
    }`,
  
    "variables": {email: inEmail, baseUrl: `${window.location.origin}/recovery/`}
  }
}

const loginQuery = (email:string, password:string) => {
return {
   "operationName": "Query",
  
  "query": `query Query($user: loginCredentials!) {
    loginUser(user: $user)
  }`,

  "variables": {user: {email: email, password: password}}
}
}

const headers = {
	"content-type": "application/json",
};