import CloudImage from './CloudImage';
import Carousel from 'react-bootstrap/Carousel';

interface PROPS {
    image_list: string[]
    image_styles?: string
    carousel_styles?: string
    controls?: boolean
    indicators?: boolean
    index?: number
}

const CloudCarousel = ({index, controls,indicators,image_list,image_styles='',carousel_styles=''}:PROPS) => {

    const listAsComponents:JSX.Element[] = image_list.map(img=>{
        return <Carousel.Item data-bs-interval="200" >
            <CloudImage image_id={img} styles={`carousel-image ${image_styles}`}/>
        </Carousel.Item> 
    })

    return (
        <Carousel activeIndex={index} className={carousel_styles} controls={controls} indicators ={indicators}>
            {listAsComponents}
        </Carousel>
    );
}

export default CloudCarousel;