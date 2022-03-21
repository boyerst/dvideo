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
      const videoCount = await dvideo.methods.videoCount().call()
      this.setState({ videoCount })
      console.log(videoCount)

      //Iterate throught videos and add them to the state (by newest)
      for (var i = 1; i <= videoCount; i++) {
        const video = await dvideo.methods.posts(i).call()
        this.setState({
          videos: [...this.state.videos, video]
        })
      }

      //Set latest video and it's title to view as default 
      //Set loading state to false

      //If network data doesn't exisits, log error

    }
  }

  //Get video
  captureFile = event => {

  }

  //Upload video
  uploadVideo = title => {

  }

  //Change Video
  changeVideo = (hash, title) => {

  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      account: '',
      dvideo: null,
      videoCount: 0,
      videos: []
      //set states
    }

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar 
          //Account
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              //states&functions
            />
        }
      </div>
    );
  }
}

export default App;