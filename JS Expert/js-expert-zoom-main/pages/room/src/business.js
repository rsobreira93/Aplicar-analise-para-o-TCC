class Business {
  constructor({ room, media, view, socketBuilder, peerBuilder }){
    this.room = room
    this.media = media
    this.view = view
    this.socketBuilder = socketBuilder
    this.peerBuilder = peerBuilder

    this.currentStream = {}
    this.socket = {}
    this.currentPeer = {}

    this.peers = new Map()
    this.userRecordings = new Map()
  }
  static initialize(deps){
    const instante = new Business(deps)
    return instante._init()
  }
  async _init(){
    this.view.configureRecordButton(this.onRecordPressed.bind(this))

    this.currentStream = await this.media.getCamera(true)
    this.socket = this.socketBuilder.setOnUserConnected(this.onUserConnected())
        .setOnUserDisconnected(this.onUserDisconnected())
        .build()


    this.currentPeer = await this.peerBuilder
      .setOnCallError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onPeerCallReceived())
      .setOnPeerStreamReceived(this.onPeerStreamReceived())
      .setOnCallError(this.onPeerCallError())
      .setOnCallClose(this.onPeerCallClose())
      .build()

    this.addVideoStream(this.currentPeer.id)

  }
  addVideoStream(userId, stream = this.currentStream){
    const recorderInstance = new Recorder(userId, stream)
    this.userRecordings.set(recorderInstance.filename, recorderInstance)
    if(this.recordingEnabled){
      console.log('starting recorder')
      recorderInstance.startRecording()
    }
    const isCurrentId =  false
    this.view.renderVideo({
      userId,
      muted:false,
      stream,
      isCurrentId
    })
  }
  onUserConnected (){
    return userId =>{
      this.currentPeer.call(userId, this.currentStream)
    }
  }
  onUserDisconnected (){
    return userId =>{
      console.log('user disconnected', userId)
      if(this.peers.has(userId)){
        this.peers.get(userId).call.close()
        this.peers.delete(userId)
      }
      this.view.setParticipants(this.peers.size)
      this.view.removeVideoElement(userId)
    }
  }
  onPeerError  (){
    return error => {
      console.error('error on peer: ', error)
    }
  }
  onPeerConnectionOpened  (){
    return peer => {
      const id = peer.id
      console.log('pper connected')
      this.socket.emit('join-room', this.room, id)
    }
  }
  onPeerCallReceived  () {
    return call => {
      console.log('answering call', call)
      call.answer(this.currentStream)
    }
  }
  onPeerStreamReceived (){
    return (call, stream)=>{
      const callerId = call.peer
      this.addVideoStream(callerId, stream)
      this.peers.set(callerId, {call})
      this.view.setParticipants(this.peers.size)
    }
  }
  onPeerCallError  () {
    return ( call, error ) => {
      console.log('error on call', call, error)
      this.view.removeVideoElement(call.peer)
    }
  }
  onPeerCallClose  () {
    return ( call ) => {
      console.log('error on call', call, error)
      this.view.removeVideoElement(call.peer)
    }
  }
  onRecordPressed(recordingEnabled){
    this.recordingEnabled = recordingEnabled
    for(const [key, value] of this.userRecordings){
      if(this.recordingEnabled){
        value.startRecording()
        continue
      }
      this.stopRecording(key)
    }
  }

  stopRecording(userId){
    const userRecodings = this.userRecodings
    for(const [key, value] of userRecodings){
      const isContextUser = key.includes(userId)
      if(!isContextUser) continue
      const rec = value
      const isRecordingActive = rec.recordingActive
      if(!isRecordingActive) continue

      await rec.stopRecorder()
    }
  }
}