import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    {
      duration: '5m',
      target: 1000
    },
    {
      duration: '12h',
      target: 1000 
    },
    {
      duration: '5m',
      target: 0
    }
  ]
};

export default function () {
  //console.log(`VU ${__VU} iteration ${__ITER}`);
  http.get('https://test.k6.io');
  sleep(1);
}