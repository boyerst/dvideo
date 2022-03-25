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
              {/* Video... */}
            </div>
            <h3>{/* Code... */}</h3>
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
              {/* Input for video file*/}
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
            {/* Map Video...*/}
              {/* Return Video...*/}
              <div style={{ width: '175px'}}>
                <div className="card-title bg-dark">
                  <small className="text-white"><b>{/*Video title*/}</b></small>
                </div>
                  <div>
                    {/* Change Video...*/}
                    {/* Return Side Videos...*/}
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;