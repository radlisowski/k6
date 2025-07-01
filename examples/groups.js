// Import required modules from k6
import http from 'k6/http';
import { sleep, group, check } from 'k6';

// Define test options, including a threshold for request duration
export const options = {
    thresholds: {
        http_req_duration: ['p(95)<250'], // 95% of requests must complete below 250ms
        'group_duration{group:::Main page}': ['p(95)<200'], // 95% of requests in the 'Main page' group must complete below 200ms
        'group_duration{group:::Main page::Assets}': ['p(95)<200'], // 95% of requests in the 'Main page' group must complete below 200ms
    
    }
}

// Default function that k6 will execute for each virtual user
export default function () {

    // Group for actions related to the main page
    group('Main page', function () {
        // Send GET request to the main page
        let res = http.get('https://test.k6.io/');
        // Check if the response status is 200
        check(res, { 'status is 200': (r) => r.status === 200 });
    
        // Nested group for loading main page assets
        group('Assets', function () {
            // Request CSS asset
            http.get('https://test.k6.io/static/css/site.css');
            // Request JS asset
            http.get('https://test.k6.io/static/js/prisms.js');
        });
    });

    // Group for actions related to the news page
    group('News page', function () {
        // Send GET request to the news page
        http.get('https://test.k6.io/news.php');
    });

    // Sleep for 1 second between iterations
    sleep(1);
}
