import WebSockets from 'websocket'

export const client = new WebSockets.w3cwebsocket('ws://localhost:2323/', 'echo-protocol')

client.onerror = () => {
  console.log('Connection Error')
}

client.onopen = () => {
  console.log('WebSocket Client Connected.')
}

client.onclose = () => {
  console.log('echo-protocol Client Closed')
}

// client.onmessage = e => {
//   if (typeof e.data === 'string') {
//     
//   }
// }