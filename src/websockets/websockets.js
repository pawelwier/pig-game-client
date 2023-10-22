import WebSockets from 'websocket'

export const wsConnect = () => {
  const client = new WebSockets.w3cwebsocket('ws://localhost:2323/', 'echo-protocol')

  client.onerror = () => {
    console.log('Connection Error')
  }

  client.onopen = () => {
    console.log('WebSocket Client Connected.')

    const sendNumber = () => {
      if (client.readyState === client.OPEN) {
        var number = Math.round(Math.random() * 0xFFFFFF)
        client.send(number.toString())
        setTimeout(sendNumber, 1000)
      }
  }
  sendNumber()
};

client.onclose = () => {
    console.log('echo-protocol Client Closed')
};

client.onmessage = e => {
  if (typeof e.data === 'string') {
    console.log("Received: '" + e.data + "'")
  }
  }
}