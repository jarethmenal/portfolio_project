import { useEffect, useState } from 'react';
import './App.css';

const USERS_QUERY = `
{
  getAllUsers {
    name
    id
  }
}
`

function App() {

  const [users, setUsers] = useState()

  useEffect(()=>{
    fetch('https://portfolio-project1-backend.herokuapp.com/graphql',
    {
      method: 'POST',
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({query: USERS_QUERY})
    }).then(res => res.json()).then(procRes => setUsers(procRes.data.getAllUsers))
  }, [])

  useEffect (()=>{
    console.log(users)
  },[users])
  
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
