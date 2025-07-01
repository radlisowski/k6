import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

export const options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete below 500ms
    my_counter: ['count>10'], // At least one increment of the custom counter
    response_time_news_page: ['p(95)<110', 'p(99)<108'] // 95% of news page response times should be below 500ms
  }
};

let myCounrter = new Counter('my_counter');
let newsPageResponseTrend = new Trend('response_time_news_page'); // Custom metric to track response time

export default function () {
  let response = http.get('https://quickpizza.grafana.com/test.k6.io/');
  myCounrter.add(1); // Increment the counter by 1 for each request
  sleep(1); // Sleep for 1 second between requests

  response = http.get('https://quickpizza.grafana.com/news.php');
  newsPageResponseTrend.add(response.timings.duration); // Track response time for the
  sleep(1); // Sleep for 1 second between requests
}