
import axios from 'axios';

interface params {
    inQuery: any,
    header?: any
}

const fetch = ({inQuery, header}:params) => { 
        const makeRequest = async() => {
        try{
            const res = await axios({url: process.env.REACT_APP_BACKEND, method: 'post', data: inQuery, headers: header})
            return res.data
        }catch(error:any){
            console.log(error);
            return error.response.data;
        }
    };
    
    return makeRequest();
}

export default fetch;

// const graphqlQuery = {
//   "operationName": "QUERY",
  
//   "query": `query QUERY {
//     getAllUsers{
//       name
//     }
//   }`,

//   "variables": {}
// }