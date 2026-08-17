import 'dotenv/config';
import analyzeBrandBriefHandler from '../api/analyze-brand-brief.js';

async function testAnalyze() {
  const req = {
    method: 'POST',
    body: {
      clientName: 'ZeroX',
      website: '',
      notes: ''
    }
  };

  const res = {
    status: (code) => {
      console.log('HTTP Status Code:', code);
      return res;
    },
    json: (data) => {
      console.log('\n=== API JSON Output ===');
      console.log(JSON.stringify(data, null, 2));
      return res;
    }
  };

  await analyzeBrandBriefHandler(req, res);
}

testAnalyze();
