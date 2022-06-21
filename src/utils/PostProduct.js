import axios from 'axios';

export const PostProductAPI = async (element) => {
    // let body = JSON.stringify(element);
    let body = element;

    try {
        const { data } = await axios.post('https://ellaglams-strapi-production-7a1b.up.railway.app/products', body, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNmM0Mjk4OGQwNzRlMWNiYzA3NDRiOCIsImlhdCI6MTY1NTQ0MDYzOSwiZXhwIjoxNjU4MDMyNjM5fQ.2PXI9D8mX00bJ7OIsyxdwxLHwblIfHslZlz0-RzHWQQ',
                'Content-Type': 'application/json'
            }
        })
        return data;
    }
    catch (error) {
        console.log(error);
    }
}