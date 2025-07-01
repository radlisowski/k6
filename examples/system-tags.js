import http from 'k6/http';

// K6 test options, including custom thresholds for HTTP request durations
export const options = {
    thresholds: {
        // Global threshold: 95% of all HTTP requests should complete below 1000ms
        http_req_duration: ['p(95)<1000'],
        // Threshold for requests with status 200: 95% should complete below 1000ms - system tags
        'http_req_duration{status:200}': ['p(95)<1000'],
        // Threshold for requests with status 201: 95% should complete below 1000ms - system tags
        // Note: This is just an example; you can adjust the status code as needed
        'http_req_duration{status:201}': ['p(95)<1000']
    }
}

export default function () {
    http.get('https://run.mocky.io/v3/cef9ccd3-7768-45f4-ab95-d2edd7f90db6'); //res:200
    http.get('https://run.mocky.io/v3/92e5fe0a-4cf5-4f1d-9356-65410053a22e?mocky-delay=2000ms');//res:201
}