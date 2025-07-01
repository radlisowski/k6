import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    {
      duration: '2m',
      target: 1000
    },
    {
      duration: '1m',
      target: 0
    }
  ]
};

export default function () {
  //console.log(`VU ${__VU} iteration ${__ITER}`);
  http.get('https://test.k6.io');
  sleep(1);
}