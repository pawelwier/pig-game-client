import { MessageTypes } from "../utils"

export const getSocketConnection = ({
  onAddMessage, onTakeMessage
}) => {
  const socket = new WebSocket(process.env.WS_URL, 'pig-game-protocol')
  socket.onmessage = e => {
    const dataParsed = JSON.parse(e.data)
    const { type, currentPlayer, points } = dataParsed
    if (type === MessageTypes.ADD) { onAddMessage({ currentPlayer, points }) }
    if (type === MessageTypes.TAKE) { onTakeMessage({ currentPlayer }) }
  }
  return socket
}

