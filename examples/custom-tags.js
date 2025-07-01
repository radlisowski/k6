import http from 'k6/http';
import { Counter } from 'k6/metrics';
import { check, sleep } from 'k6';

// Export k6 test options, including thresholds for requests and custom tags
export const options = {
    thresholds: {
        // 95% of all requests should finish in <300ms
        http_req_duration: ['p(95)<300'],
        // 95% of requests with tag page:order should finish in <250ms
        'http_req_duration{page:order}': ['p(95)<250'],
        // No HTTP errors should occur
        http_errors: ['count==0'],
        // No HTTP errors should occur for requests with tag page:order
        'http_errors{page:order}': ['count==0'],
        // At least 99% of checks should pass
        checks: ['rate>=0.99'],
        // At least 99% of checks with tag page:order should pass
        'checks{page:order}': ['rate>=0.99'],
    }
}

let httpErrors = new Counter('http_errors');

export default function () {
    // Make a GET request to the first endpoint
    let res = http.get('https://run.mocky.io/v3/cef9ccd3-7768-45f4-ab95-d2edd7f90db6');

    // Track HTTP errors for the first request
    if (res.error) {
        httpErrors.add(1);
    }

    // Check if the response status is 200
    check(res, {
        'status is 200': (r) => r.status === 200
    });

    // Submit order: make a GET request to the second endpoint with custom tag
    res = http.get(
        'https://run.mocky.io/v3/92e5fe0a-4cf5-4f1d-9356-65410053a22e?mocky-delay=2000ms',
        {
            tags: {
                page: 'order'
            }
        }
    );

    // Track HTTP errors for the order request with the 'order' tag - cutome tag
    // This will increment the custom counter only if there is an error
    if (res.error) {
        httpErrors.add(1, { page: 'order' });
    }

    // Check if the response status is 201, tagged as 'order' - custom tag
    // This will check the response status for the request with the 'order' tag
    check(res, { 'status is 201': (r) => r.status === 201 }, { page: 'order' });

    // Sleep for 1 second between iterations
    sleep(1);
}