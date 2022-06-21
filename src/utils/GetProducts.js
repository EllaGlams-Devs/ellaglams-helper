import axios from 'axios';

export const GetProductsAPI = async (element) => {
    try {
        const { data } = await axios.get(
            'https://ellaglams-strapi-production-7a1b.up.railway.app/products'
        );
        // const  data  = "axios"
        return data;
    }
    catch (error) {
        console.log(error);
    }
}