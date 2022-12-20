import React, { FormEvent,Fragment,MouseEventHandler,ReactElement,useEffect,useState} from 'react'
import'./styles/start.scss'
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fetchOnDemand from '../functions/fetchOnDemand';
import fetchImageList from '../functions/fetchImageList';
import CloudCarousel from '../components/CloudCarousel';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

interface formType {
  [key:string]:any ;
}

const Start = () => {
    
  const [mode, setMode] = useState<string>('login');
  const [visibility, setVisibility] = useState<Boolean>(false);
  const [input, setInput] = useState<inputData>({input1:'',input2:''});
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [bgImgs, setBgImgs] = useState<string[]| null>(null);

  const updateInputs = (where:string, data:string) => {
    setInput(prev => ({
        ...prev, [where]:data
    }))
  }

  useEffect(()=>{
    getImageList();
  }, [])
  
  const getImageList = async() => {
    const imgs = await fetchImageList('start');
    setBgImgs(imgs.data.getImageCollection);
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
    
  const loginHandler = async() => {
    const resp = await fetchOnDemand({inQuery: loginQuery(input.input1, input.input2), header: headers});
    if (resp.errors){
      setError(resp.errors.message)
      return
    }
    setError(null)
  }

  const registerHandler = async() => {
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
    event.preventDefault();
    const resp = await fetchOnDemand({inQuery: sendRecoveryLink(input.input2), header: headers});
      if (resp.errors){
        setFeedback(null)
        setError(resp.errors.message)
        return
      }
      setError(null)
      setFeedback(resp.data.sendRecoveryLink)
  }

  interface modeVariantData {
    handler: any,
    welcomeMsg: string,
    secondaryBtnContent: ReactElement<any, any> | string ,
    secondaryInLabel: string,
    secondaryType: string,
    index:number
  }

  interface modeTypes {
    [name:string]:modeVariantData
  }

  const formModeVariant:modeTypes = {
    'login': {
      'handler': visibilityHandler, 
      'welcomeMsg': 'Welcome back!', 
      'secondaryBtnContent':<>{visibility ? <FontAwesomeIcon size='1x' icon={faEye}/>:<FontAwesomeIcon size='1x' icon={faEyeSlash}/>}</>,
      'secondaryInLabel': 'Password',
      'secondaryType':!visibility ? 'password' : 'text',
      'index':1},
    
    'register': {
      'handler':registerHandler,
      'welcomeMsg':`First time? Let's get started!`,
      'secondaryBtnContent':'Send Register Link',
      'secondaryInLabel':'New Email',
      'secondaryType': 'text',
      'index':2},

    'recover': {
      'handler':recoverHandler,
      'welcomeMsg':'Forgot your password? Let us help you.',
      'secondaryBtnContent':'Send Recover Link',
      'secondaryInLabel':'Registered Email',
      'secondaryType': 'text',
      'index':0}
  }

  const modeData:modeVariantData = formModeVariant[mode];

  const startForm = () => {
    return (     
    <Form onSubmit={e => e.preventDefault()}>

      {mode==='login' && <FloatingLabel controlId='input1' label='Email Address'>
        <Form.Control 
          type='text' 
          placeholder=' ' 
          onChange={e => updateInputs('input1',e.target.value)} 
          value={input.input1}
          className='input_start'/>
      </FloatingLabel>}
      
      <InputGroup className="input-separation-start">    
        <FloatingLabel controlId='input2' label={modeData.secondaryInLabel}>
          <Form.Control 
            type={modeData.secondaryType} 
            placeholder=' ' 
            onChange={e => updateInputs('input2',e.target.value)} 
            value={input.input2}
            className='input_start'/>
        </FloatingLabel>
        <Button onClick={modeData.handler} className="input-assist-button" type="button">
          {modeData.secondaryBtnContent}
        </Button>
      </InputGroup>
    
    </Form>)
    }
    
    const bottomStartCard = () => {
    return <div className={`options_container_${mode}`}>
        <div className={'left'}>
          {mode === 'login' &&
            <Button onClick={loginHandler} className={'btn-go btn '}>Log In</Button>
          }
        </div>
        <div className={'right'}>
          <Button className={'btn btn-start-mode'} onClick={e => modeHandler(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Go to Register' : 'Go to Login'}
          </Button>  
        </div>     
      </div>
    }

    return( 
    <div className={`start_bg_${mode}`}>   
      { bgImgs && <CloudCarousel index={modeData.index} image_list={bgImgs} carousel_styles={'bg-carousel'} indicators={false} controls={false}/>}
      <h1 className='start-big-title'>{mode.toUpperCase()}</h1>
      <Card className='start-card'>
        <Card.Body className='card-body'>
          <h3 className='start_title'>{modeData.welcomeMsg}</h3>
          {<div className='error-container'>
              {error && <p className='start-error-text'>{error}</p>}               
              {feedback && <p className='start-feedback-text'>{feedback}</p>}
          </div>}
            {startForm()}
            {bottomStartCard()}
          </Card.Body>
            {mode==='login' && 
            <div className='recover_container card-footer text-muted'>
              <Button className='recover_password' onClick={e => modeHandler(mode === 'login' ? 'recover' : 'login')}>
                Forgot you password?
              </Button>
            </div>}
        </Card>     
    </div>)
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