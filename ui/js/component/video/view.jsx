import React from 'react';
import FilePrice from 'component/filePrice'
import Link from 'component/link';
import Modal from 'component/modal';

class VideoPlayButton extends React.Component {
  onPurchaseConfirmed() {
    this.props.closeModal()
    this.props.startPlaying()
    this.props.loadVideo(this.props.uri)
  }

  onWatchClick() {
    this.props.purchaseUri(this.props.uri).then(() => {
      if (!this.props.modal) {
        this.props.startPlaying()
      }
    })
  }

  render() {
    const {
      button,
      label,
      className,
      metadata,
      metadata: {
        title,
      },
      uri,
      modal,
      closeModal,
      isLoading,
      costInfo,
      fileInfo,
    } = this.props

    /*
     title={
     isLoading ? "Video is Loading" :
     !costInfo ? "Waiting on cost info..." :
     fileInfo === undefined ? "Waiting on file info..." : ""
     }
     */

    const disabled = isLoading || fileInfo === undefined || (fileInfo === null && (!costInfo || costInfo.cost === undefined))

    return (<div>
      <Link button={ button ? button : null }
            disabled={disabled}
            label={label ? label : ""}
            className="video__play-button"
            icon="icon-play"
            onClick={this.onWatchClick.bind(this)} />
      {modal}
      <Modal contentLabel="Not enough credits" isOpen={modal == 'notEnoughCredits'} onConfirmed={() => { this.closeModal() }}>
        You don't have enough LBRY credits to pay for this stream.
      </Modal>
      <Modal
        type="confirm"
        isOpen={modal == 'affirmPurchase'}
        contentLabel="Confirm Purchase"
        onConfirmed={this.onPurchaseConfirmed.bind(this)}
        onAborted={closeModal}>
        This will purchase <strong>{title}</strong> for <strong><FilePrice uri={uri} look="plain" /></strong> credits.
      </Modal>
      <Modal
        isOpen={modal == 'timedOut'} onConfirmed={() => { this.closeModal() }} contentLabel="Timed Out">
        Sorry, your download timed out :(
      </Modal>
    </div>);
  }
}

const plyr = require('plyr')

class Video extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isPlaying: false }
  }

  startPlaying() {
    this.setState({
      isPlaying: true
    })
  }

  render() {
    const {
      metadata,
      isLoading,
      isDownloading,
      fileInfo,
    } = this.props
    const {
      isPlaying = false,
    } = this.state

    const isReadyToPlay = fileInfo && fileInfo.written_bytes > 0

    let loadStatusMessage = ''

    if(fileInfo && fileInfo.completed && !fileInfo.written_bytes) {
      loadStatusMessage = "It looks like you deleted or moved this file. We're rebuilding it now. It will only take a few seconds."
    } else if (isLoading) {
      loadStatusMessage = "Requesting stream... it may sit here for like 15-20 seconds in a really awkward way... we're working on it"
    } else if (isDownloading) {
      loadStatusMessage = "Downloading stream... not long left now!"
    }

    return (
      <div className={"video " + this.props.className + (isPlaying ? " video--active" : " video--hidden")}>{
        isPlaying || isLoading ?
          (!isReadyToPlay ?
            <span>this is the world's worst loading screen and we shipped our software with it anyway... <br /><br />{loadStatusMessage}</span> :
            <VideoPlayer poster={metadata.thumbnail} autoplay={isPlaying} downloadPath={fileInfo.download_path} />) :
        <div className="video__cover" style={{backgroundImage: 'url("' + metadata.thumbnail + '")'}}>
          <VideoPlayButton startPlaying={this.startPlaying.bind(this)} {...this.props} />
        </div>
      }</div>
    );
  }
}

class VideoPlayer extends React.Component {
  componentDidMount() {
    const elem = this.refs.video
    const {
      autoplay,
      downloadPath,
      contentType,
    } = this.props
    const players = plyr.setup(elem)
    if (autoplay) {
      players[0].play()
    }
  }

  render() {
    const {
      downloadPath,
      contentType,
      poster,
    } = this.props

    return (
      <video controls id="video" ref="video" style={{backgroundImage: "url('" + poster + "')"}} >
        <source src={downloadPath} type={contentType} />
      </video>
    )
  }
}

export default Video