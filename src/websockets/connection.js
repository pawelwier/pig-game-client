import { MessageTypes } from "../utils"

export const getSocketConnection = ({
  onAddMessage, onTakeMessage, onRestartMessage
}) => {
  const socket = new WebSocket(process.env.WS_URL, 'pig-game-protocol')
  socket.onmessage = e => {
    const dataParsed = JSON.parse(e.data)
    const { type, currentPlayer, points, isWinner } = dataParsed
    switch (type) {
      case MessageTypes.ADD :
        onAddMessage({ currentPlayer, points })
        break
      case MessageTypes.TAKE :
        onTakeMessage({ currentPlayer, isWinner })
        break
      case MessageTypes.RESTART :
        onRestartMessage({ currentPlayer })
        break
    }
  }
  return socket
}

export const sendAddMessage = ({ socket, gameId, points }) => {
  socket.send(JSON.stringify({
    type: MessageTypes.ADD,
    gameId,
    points
  }))
}

export const sendTakeMessage = ({ socket, gameId }) => {
  socket.send(JSON.stringify({
    type: MessageTypes.TAKE,
    gameId
  }))
}

export const sendRestartMessage = ({ socket, gameId, current }) => {
  socket.send(JSON.stringify({
    type: MessageTypes.RESTART,
    gameId,
    currentPlayer: current
  }))
}
