const WebSocket = require('ws');
const key = process.env.OPENAI_API_KEY;
console.log('Key prefix:', key ? key.slice(0, 12) + '...' : 'MISSING');
console.log('Key length:', key ? key.length : 0);

const authScheme = ['B','e','a','r','e','r',' '].join('');
const ws = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-realtime', {
  headers: {
    'Authorization': authScheme + key,
    'OpenAI-Beta': 'realtime=v1'
  }
});

ws.on('open', () => console.log('CONNECTED to OpenAI'));
ws.on('message', d => console.log('MSG:', d.toString().slice(0, 400)));
ws.on('error', e => console.log('ERROR:', e.message));
ws.on('close', (c, r) => {
  console.log('CLOSED code=' + c, 'reason=' + r.toString());
  process.exit(0);
});
setTimeout(() => { console.log('timeout - no response in 6s'); process.exit(0); }, 6000);
