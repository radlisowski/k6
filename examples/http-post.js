import http from 'k6/http';
import { check } from 'k6';

export default function () {

    const body = JSON.stringify({
        username: 'testuser_' + Date.now(),
        password: 'testpassword'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }   
    }

    let res = http.post('http://localhost:8000/user/register/', body, params);

    check(res, {
        'status is 201': (r) => r.status === 201
    });
}