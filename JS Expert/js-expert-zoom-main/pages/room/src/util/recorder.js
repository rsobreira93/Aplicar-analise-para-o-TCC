class Recorder {
  constructor(userName, stream){
    this.userName = userName
    this.stream = stream
    this.filename = `id${userName}-when:${Date.now()}`
    this.videoType ='video/webm'
    this.mediaRecorder = {}
    this.recorderBlobs = []
    this.recordingActive = false

    this.compeleteRecordings = []
  }
  _setup(){
    const commonCodecs = [
      "codecs=vp9, opus",
      "codecs=vp9, opus",
      ""
    ]
    const options = commonCodecs
            .map(codec => ({mimeType: `${this.videoType};${codec}`}))
            .find(options=> MediaRecorder.isTypeSupported(options))
    if(!options){
      throw new Error(`None of the codecs: ${commonCodecs.join(',')} are supported`)
    }
    return options
  }
  startRecording(){
    console.log('hey')
    const options = this._setup()
    if(!this.stream.active) return
    this.mediaRecorder = new MediaRecorder(this.stream, options)
    this.mediaRecorder.onstop = (event)=>{
      console.log('recorded blobs', this.recorderBlobs)
    }
    this.mediaRecorder.ondataavailable = (event)=>{
      if(!event.data || !event.data.size) return
      this.recorderBlobs.push(event.data)
    }
    this.mediaRecorder.start()
    this.recordingActive = true
    console.log('recording',this.userName, this.filename)
  }
  async stopRecorder(){
    if(!this.recordingActive) return
    if(this.mediaRecorder.state === 'inactive') return

    this.mediaRecorder.stop()
    this.recordingActive = false
    await Util.sleep(200) 
    this.compeleteRecordings.push([...this.recorderBlobs])
    this.recorderBlobs = []
  }
}