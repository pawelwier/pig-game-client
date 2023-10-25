export const diceOptions = {
  0: [],
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 1, 2, 6, 7, 8]
}

export const getRandomResult = () => Math.floor(Math.random() * 6) + 1

export const MessageTypes = {
  // START: 'start',
  ADD: 'add',
  TAKE: 'take'
}