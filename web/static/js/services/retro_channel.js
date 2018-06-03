import { Socket } from "phoenix"

class RetroChannel {
  static configure({ userToken, retroUUID }) {
    const socket = new Socket("/socket", { params: { userToken } })
    socket.connect()

    return socket.channel(`retro:${retroUUID}`)
  }
}

export default RetroChannel
