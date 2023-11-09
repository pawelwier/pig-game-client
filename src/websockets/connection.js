import { MessageTypes } from "../utils"

export const getSocketConnection = ({
  onAddMessage, onTakeMessage, onRestartMessage
}) => {
  const socket = new WebSocket(process.env.WS_URL, 'pig-game-protocol')
  socket.onmessage = e => {
    const dataParsed = JSON.parse(e.data)
    const { type, currentPlayer, points, isWinner } = dataParsed
    if (type === MessageTypes.ADD) { onAddMessage({ currentPlayer, points }) }
    if (type === MessageTypes.TAKE) { onTakeMessage({ currentPlayer, isWinner }) }
    if (type === MessageTypes.RESTART) { onRestartMessage({ currentPlayer }) }
  }
  return socket
}

