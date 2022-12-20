import fetchOnDemand from '../functions/fetchOnDemand';
const getImageListQuery = (filter:string) => {
    return {
       "operationName": "Query",
      
      "query": `query Query($filter: String!) {
        getImageCollection(filter: $filter)
      }`,
    
      "variables": {filter}
    }
  }

  interface response {
    data: {
        getImageCollection: string[];
    },
    error: {
        message: string;
    }
  }

const headers = {
	"content-type": "application/json",
};
const fetchImageList = async(imageCollection:string) => {
    const response:response = await fetchOnDemand({inQuery: getImageListQuery(imageCollection),header:headers});
    return response;
};

export default fetchImageList;