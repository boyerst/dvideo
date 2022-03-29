import React, { Component } from 'react';
import DVideo from '../abis/DVideo.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    console.log(web3)
    //Load accounts
    const accounts = await web3.eth.getAccounts()
    console.log("account", accounts[0])

    //Add first account the the state
    this.setState({ account: accounts[0] })
    console.log(this.state)

    //Get network ID
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    //Get network data
    const networkData = DVideo.networks[networkId]
    console.log(networkData)
    //Check if net data exists, then
    if(networkData) {
      //Assign dvideo contract to a variable and add to state
      const dvideo = new web3.eth.Contract(DVideo.abi, networkData.address)
      console.log(dvideo) 
      this.setState({ dvideo })
      console.log(this.state)

      //Check videoAmounts and add to state
      const videosCount = await dvideo.methods.videoCount().call()
      this.setState({ videosCount })
      console.log(videosCount)

      //Iterate throught videos and add them to the state (by newest)
      for (var i = 1; i <= videosCount; i++) {
        const video = await dvideo.methods.videos(i).call()
        this.setState({
          videos: [...this.state.videos, video]
        })
      }
      //Set latest video and it's title to view as default 
      // Fetch the last video added
      const latest = await dvideo.methods.videos(videosCount).call()
      this.setState({
        currentHash: latest.hash, 
        currentTitle: latest.title
      })
      // Turn off loader
      this.setState({ loading: false })


      //Set loading state to false
      this.setState({ loading: false })
      //If network data doesn't exisits, log error
    } else {
      window.alert('DVideo contract not deployed to the detected network.')
    }
  }

  // captureFile preprocesses the file
  // captureFile converts the file into the correct format (an array buffer) to be put on IPFS
    // Eventually we want it to be a buffer object?
  captureFile = event => {
    // Prevent page from reloading when submit video
    event.preventDefault()
    // Capture the file from the synthetic event object created in the onChange event in the form field
      // The synthetic event contains all of the properties of the files listed in state
      // So we target the first file in the files array at index 0 ❓❓❓
    const file = event.target.files[0]
    // Declare how we will use the file - we use the native file reader from the JS window object
    const reader = new window.FileReader()
    // Read the file -> this method then triggers loadend event -> which triggers the onloadend event
      // Returns an ArrayBuffer representing the file's data
    reader.readAsArrayBuffer(file)
    // loadend event triggered by onloadend event above
    reader.onloadend = () => {
    // Set state with the ArrayBuffer representing the file's data
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)    
    }
  }

  //Upload video
  uploadVideo = title => {
    console.log("Uploading video to IPFS")
    // ipfs.add(file, callback)
      // File = needs to be in buffer format, which it done in captureFile
      // Callback = tells to execute more code once the file has been added
    ipfs.add(this.state.buffer, (error, result) => {
    // Basic error handling
      console.log('IPFS result', result)
      if(error) {
        console.error(error)
        return
      }
      // Once we have waited and it has been added,  we put it on the blockchain    
      this.setState({ loading: true })
      // Video hash = result[0].hash
        // Where 0 targets the first object in the array and .hash targets the value in the object
      // Must invoke .send() in order to create transaction
        // Then tell it who the sender is
        // Then what to do upon transation completion
      this.state.dvideo.methods.uploadVideo(result[0].hash, title).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
          loading: false
        })
      })

    })
  }

  //Change Video
  changeVideo = (hash, title) => {

  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      account: '',
      dvideo: null,
      videosCount: 0,
      videos: [],
      currentHash: null, 
      currentTitle: null
 
    }

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar 
          //Account
          account={this.state.account}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              //states&functions
              videos={this.state.videos}
              uploadVideo={this.uploadVideo}
              captureFile={this.captureFile}
              currentHash={this.state.currentHash}
              currentTitle={this.state.currentTitle}
            />
        }
      </div>
    );
  }
}

export default App;