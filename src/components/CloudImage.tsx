import {AdvancedImage} from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";

interface PROPS {
    image_id: string
    styles: string
}

const cloud_data = new Cloudinary({
    cloud: {
        cloudName: 'denvesqmo'
    }
})


const CloudImage = (props:PROPS) => {
    const image = cloud_data.image(props.image_id);
    return <AdvancedImage className={props.styles} cldImg={image}></AdvancedImage>
};

export default CloudImage