import { SearchBox} from '@mapbox/search-js-react';
import { Label } from '@radix-ui/react-dropdown-menu';

const theme = {

    variables: {     
     
      padding: '0.5em',
      borderRadius: '0.25em',
      boxShadow: '0 0 0 1px silver',
      colorBackground: '#fff',
     

    }
  };



const SearchMapBox = ({text, setRetrieve}:{text:string, setRetrieve:any}) => {

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const handleRetrieve = (result: any) => {
        if(result){
            setRetrieve(result.features[0])
        }
    }


    return (
        <div>
       <Label className='text-sm'>{text}</Label>
        
         {/*@ts-ignore */}
        <SearchBox 
            
            theme={theme}
            onRetrieve={handleRetrieve}
            accessToken={token}
            options={
            {
                proximity:[-38.952531,-68.059168],
                language:"es",
                country:"AR",
                limit:5, 
                
            }
            }
            placeholder="Buscar dirección o lugar..."
          
            
        />
        </div>
    );
}

export default SearchMapBox;