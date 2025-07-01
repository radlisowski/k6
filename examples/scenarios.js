import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

export const options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete below 500ms
    http_req_duration: ['max<2000'], // Maximum request duration should be less than 1000ms
    http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
    http_reqs: ['count>40'], // At least 100 requests should be made
    http_reqs: ['rate>4'], // At least 4 requests per second
    vus: ['value>=9'], // At least 10 virtual users
    checks: ['rate>0.99'], // At least 99% of checks should pass
    my_counter: ['count>10'] // At least one increment of the custom counter
  }
};

let myCounrter = new Counter('my_counter');
let newsPageResponseTrend = new Trend('response_time_news_page'); // Custom metric to track response time

export default function () {
  const response = http.get('https://quickpizza.grafana.com/test.k6.io/');
  myCounrter.add(1); // Increment the counter by 1 for each request

  const news_response = http.get('https://quickpizza.grafana.com/test.k6.io/news');
  newsPageResponseTrend.add(news_response.timings.duration); // Track response time for the

  // console.log(response.url);
  // console.log(response.status);
  // console.log(`Response time for ${response.url} was ${response.timings.duration} ms`);
  // console.log(`Response status for ${response.url} was ${response.status}`);
  // console.log(`Response body for ${response.url} was ${response.body.slice(0, 100)}...`);

  check(response, {
    'Response status code is 200': (r) => r.status === 200,
    'Page is start page': (r) => r.body.includes('QuickPizza Legacy')
  });
  sleep(2); // Sleep for 1 second between requests

}