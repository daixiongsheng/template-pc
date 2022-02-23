import { io } from 'socket.io-client'

{
  // const socket = io('ws://127.0.0.1:9002/user')
  const socket = io('ws://127.0.0.1:9001')
  socket.on('myEventResult', (data) => {
    console.log('myEventResult111')
    console.log(data)
  })

  let a = 0
  setInterval(() => {
    socket.emit('myEvent', {
      username: 'username',
      a: a++,
    })
  }, 10000)
  document.addEventListener('click', () => {
    // socket
    socket.emit('myEvent', {
      username: 'username',
      a: a++,
    })
  })
}
{
  const socket = io('ws://127.0.0.1:9001')
  socket.on('myEventResult', (data) => {
    console.log('myEventResult22222')
    console.log(data)
  })
}
