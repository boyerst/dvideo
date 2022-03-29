import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid text-monospace">
      <br></br>
      &nbsp;
      <br></br>
        <div className="row">
          <div className="col-md-10">
            <div className="embed-responsive embed-responsive-16by9" style={{ maxHeight: '768px'}}>
              <video 
                src={`https://ipfs.infura.io/ipfs/${this.props.currentHash}`}
                controls
              >
              </video>
            </div>
            <h3><b><i>{this.props.currentTitle}</i></b></h3>
          </div>
          <div className="col-md-2 overflow-auto text-center" style={{ maxHeight: '768px', minWidth: '175px' }}>
            <h5><b> Share Video </b></h5>
            {/* Capture the video title */}
            <form onSubmit={(event) => {
              event.preventDefault()
              const title = this.videoTitle.value
              // Pass the video title to uploadVideo
              this.props.uploadVideo(title)
            }} >
              &nbsp;
              {/* Input for video file
                  onChange Event: As soon as an event in which the input 'changes' it will execute the event handler this.props.captureFile
              */}
              <input type="file" accept=".mp4, .mkv, .ogg, .wmv" onChange={this.props.captureFile} style={{ width: '250px' }} />
              {/* div and Input for videoTitle */}
              <div className="form-group mr-sm-2">
                <input 
                  id="videoTitle"
                  type="text"
                  className="form-control-sm"
                  placeholder="Title..."
                  // The ref attribute is a callback function that receives the underlying DOM element or class instance (depending on the type of element) as its argument
                  // The callback function here is receiving the <input> DOM element as its argument
                  // In this case we declare that the input to the <input> DOM element will ref this.videoTitle
                  // Then in our onSubmit event we target the value of the input and capture the video title that the user inputs by referencing this.video.value IE input.value
                  ref={(input) => { this.videoTitle = input }}
                  required />
              </div>

              <button type="submit" className="btn btn-danger btn-block btn-sm">Upload!</button>
              &nbsp;
            </form>
            { this.props.videos.map((video, key) => {
              return(
                <div className="card mb-4 text-center bg-secondary mx-auto" style={{ width: '175px'}} key={key} >
                  <div className="card-title bg-dark">
                        <small className="text-white"><b>{video.title}</b></small>
                  </div>
                  <div>
                    <p onClick={() => this.props.changeVideo(video.hash, video.title)}>
                      <video
                        src={`https://ipfs.infura.io/ipfs/${video.hash}`}
                        style={{ width: '150px' }}
                      />
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;