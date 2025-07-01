import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    {
      duration: '10s',
      target: 10 // should be above the average conditions
    },
    {
      duration: '30s',
      target: 10 // should be above the average conditions
    },
    {
      duration: '5s',
      target: 0
    }
  ]
};

export default function () {
  //console.log(`VU ${__VU} iteration ${__ITER}`);
  http.get('https://test.k6.io');
  sleep(1);
}