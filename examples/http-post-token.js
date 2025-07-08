import http from 'k6/http';
import { check } from 'k6';

export default function () {

    const credentials = {
        username: 'test_' + Date.now(),
        password: 'test_'+ Date.now(),
    }

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }   
    }

    let res = http.post('http://localhost:8000/user/register/',
        JSON.stringify(credentials), 
        params
    )

    res = http.post('http://localhost:8000/auth/token/login/', 
        JSON.stringify(credentials), 
        params
    );

    const access_token = res.json().access
    // console.log(`Access tokens is: ${access_token} `)
    // check(res, {
    //     'status is 200': (r) => r.status === 200
    // });

    // Create a new crocodile
    const myCrocodile = JSON.stringify({
        name: "rado",
        sex: "M",
        date_of_birth: "2000-01-01"
    });

    // Post the new crocodile to the authenticated endpoint  
    res = http.post('http://localhost:8000/my/crocodiles/',
        myCrocodile, 
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        }
    );

    check(res, {
        'creating status is 201': (r) => r.status === 201
    });

    res = http.get('http://localhost:8000/my/crocodiles/', 
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }
    );
    console.log(`Crocodile ID:` + res.json()[0].id)
    const crocodileId = res.json()[0].id;
    console.log(`Response from my crocodiles: ${res.body}`)
    
    //get single priver crockodile

    res = http.get(`http://localhost:8000/my/crocodiles/?id=${crocodileId}/`, 
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }
    );
    check(res, {
        'status is 200': (r) => r.status === 200,
        'check id': (r) => r.json().id === crocodileId
    });

    console.log(`Response from my crocodile: ${res.body}`)

    // Put (update) the new crocodile to the authenticated endpoint  
    http.
    res = http.del(`http://localhost:8000/my/crocodiles/?id=${crocodileId}/`,
        null,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        }
    );

    check(res, {
        'updatedstatus is 200': (r) => r.status === 200,
       //"updated name": (r) => r.json().name === updatedCrocodile.name
    });


}