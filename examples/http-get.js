import http from 'k6/http';
import { check } from 'k6';

export default function () {
    // corelating test data
    let res = http.get('http://localhost:8000/public/crocodiles');
    const crocodiles = res.json();
    const crocodile_id = crocodiles[0].id;
    const crocodile_name = crocodiles[0].name;

    //accessing response headers
    console.log(res.headers['Content-Type']);
    
    res = http.get(`http://localhost:8000/public/crocodiles/${crocodile_id}/`); 
    
    check(res, {
        'status is 200': (r) => r.status === 200,
        'crocodile name is correct': (r) => r.json().name === crocodile_name
    });
    
    
} 