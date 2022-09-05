import React, { useEffect, useState } from "react";
import './App.css';
import MyZombieNFT from "./utils/MyZombieNFT.json";
import SimpleAuction from "./utils/SimpleAuction.json";
import commentRegister from "./utils/commentRegister.json";
import NFTVRFChance from "./utils/NFTVRFChance.json"
import { ethers } from "ethers";

const TOTAL_MINT_COUNT = 100;
// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0xaEe925ad5147d707216CC76c4D240Fd697c83186";
const Auction_CONTRACT_ADDRESS = "0x3D82cf5D339e2BfCC2C172E1FD8dd80b5Be0392B";
const NFT2_CONTRACT_ADDRESS = "0x3A5714142280D2D151c10ca6D0eCAC2A90717A67";
const commentRegister_CONTRACT_ADDRESS = "0x9aD6cf7C4a1D7beb45c174e8b7dFD658B3A50f49";
const Chance_CONTRACT_ADDRESS = "0x4a331A4cA83D90F93F6F98DFFb88cCc63f28Ad7F";
const NFT1_CONTRACT_ADDRESS = "0xA6f8106aB57D2F9982947a045cd1A62F2b211256";

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [highestBid, setHighestBid] = useState("");
     /*
   * All state property to store all waves
   */
  const [allComments, setAllComments] = useState([]);
  const [winStatus, setWinStatus] = useState(false);
  
  const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
					setCurrentAccount(account)
          auctionEventListener()
          chanceEventListener()
          await getAllComments()
          
          // // Setup listener! This is for the case where a user comes to our site
          // // and ALREADY had their wallet connected + authorized.
          // setupEventListener()
      } else {
          console.log("No authorized account found")
      }
  }

    const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // // Setup listener! This is for the case where a user comes to our site
      // // and connected their wallet for the first time.
      // setupEventListener() 
    } catch (error) {
      console.log(error)
    }
  }
///******************************************** Zombie Contract ***************************
         // Setup our listener.
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyZombieNFT.abi, signer);

        // This will essentially "capture" our event when our contract throws it.
        connectedContract.on("NewZombieNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          document.getElementById("openseaTxt").innerHTML = `Your token on OpenSea:`;
          document.getElementById("openseaURL").href = `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`;
          document.getElementById("openseaURL").innerHTML = `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`;
          
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });
        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }

    // return () => {
    //   if (connectedContract) {
    //     wavePortalContract.off("NewZombieNFTMinted", (from, tokenId) => {
    //       console.log(from, tokenId.toNumber())
    //       document.getElementById("openseaURL").href = `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`;
    //       document.getElementById("openseaURL").innerHTML = `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`;
          
    //       alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
    //     });
    //   };
    // };
      
    } catch (error) {
      console.log(error)
    }
  }

    const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      
      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
      	alert("You are not connected to the Rinkeby Test Network!");
      }
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyZombieNFT.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnZombieNFT();

        console.log("Mining...please wait.")
        document.getElementById("openseaTxt").innerHTML = `Mining...please wait.`;
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

        setupEventListener()     
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
///**************************************** Chance Contract *************************
///chanceEventListener
    const chanceEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const chanceContract = new ethers.Contract(Chance_CONTRACT_ADDRESS, NFTVRFChance.abi, signer);


        chanceContract.on("DiceRolled", (requestId, roller) => {
          console.log("Dice Rolled")
          document.getElementById("chanceMiningTxt").innerHTML = "Your request has been sent to the ChainLink, requestId: "+requestId+ " Please wait for the ChainLink comeback transaction";
        });
          chanceContract.off("DiceRolled", (requestId, roller) => {
          console.log("Dice Rolled")
        });

         chanceContract.on("DiceLanded", (requestId, result) => {
          console.log("Dice Landed")
           if (result < 10){
             setWinStatus(true);
             alert('Congratulations! You Won. Press the receive button to transfer this NFT to your wallet.')
           }else {
             alert('Sorry, You did\'nt win. '+ result)
           }
          document.getElementById("chanceMiningTxt").innerHTML = 'Your Chance ' + result.toString().padStart(3, '0');
        });
        chanceContract.off("DiceLanded", (requestId, result) => {
          console.log("Dice Landed")
        });

        chanceContract.on("TokenTransfered", (yourAddr, NFTAddr) => {
          console.log("token is transfered")
           document.getElementById("chanceMiningTxt").innerHTML =  "The Token has been transferred to your address.";
        });
        chanceContract.off("TokenTransfered", (yourAddr, NFTAddr) => {
          console.log("token is transfered")
        });
        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }  
    } catch (error) {
      console.log(error)
    }
  }
/// rollDice function
  const getChance = async () => {
    try {
      const { ethereum } = window;
      
      if (ethereum) {

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      
      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
      	alert("You are not connected to the Rinkeby Test Network!");
      }
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const chanceContract = new ethers.Contract(Chance_CONTRACT_ADDRESS, NFTVRFChance.abi, signer);

        try{
        let addr = signer.getAddress( )
        var rollTxn = await chanceContract.rollDice(addr, {gasLimit: 300000 });
        console.log(`Mining, see transaction: https://rinkeby.etherscan.io/tx/${rollTxn.hash}`);
        document.getElementById("chanceMiningTxt").innerHTML = "...Mining";
        await rollTxn.wait();
        chanceEventListener()
        // document.getElementById("miningTxt").innerHTML = "Mined.";
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${rollTxn.hash}`); 

        } catch(err) {
        document.getElementById("chanceMiningTxt").innerHTML = "";
        if (rollTxn.hash){
        alert(`Go to the transaction link to see the reason for the error: https://rinkeby.etherscan.io/tx/${rollTxn.hash}`)
        }
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  /// win function
  const winFunc = async () => {
    try {
      const { ethereum } = window;
      
      if (ethereum) {

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      
      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
      	alert("You are not connected to the Rinkeby Test Network!");
      }
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const chanceContract = new ethers.Contract(Chance_CONTRACT_ADDRESS, NFTVRFChance.abi, signer);

        try{
        let addr = signer.getAddress( )
        let winTxn = await chanceContract.win_nft(addr, NFT1_CONTRACT_ADDRESS, "0", {gasLimit: 300000 });
        console.log("Mining...please wait.")
        document.getElementById("chanceMiningTxt").innerHTML = "...Mining";
        await winTxn.wait();
        chanceEventListener()
        // document.getElementById("miningTxt").innerHTML = "Mined.";
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${winTxn.hash}`); 

        } catch(err) {
        document.getElementById("chanceMiningTxt").innerHTML = "";
        if (winTxn.hash){
        alert(`Go to the transaction link to see the reason for the error: https://rinkeby.etherscan.io/tx/${winTxn.hash}`)
        }
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
///******************************************** Auction Contract *************************
  /// Auction 
  const auctionEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const aucContract = new ethers.Contract(Auction_CONTRACT_ADDRESS, SimpleAuction.abi, signer);

        // This will essentially "capture" our event when our contract throws it.
        let highest = await aucContract.highestBid();
        setHighestBid(ethers.utils.formatEther(highest));
        
        aucContract.on("HighestBidIncreased", (from, val) => {
          console.log("Highest Bid Increased")
          setHighestBid(ethers.utils.formatEther(val))
        });
         aucContract.off("HighestBidIncreased", (from, val) => {
           console.log("Highest Bid Increased")
        });

         aucContract.on("AuctionEnded", (highestBidder, highestBid) => {
          console.log("Auction Ended")
          document.getElementById("miningTxt").innerHTML =" The auction ended with winning:" + highestBidder + "  and the highest bid:  " + ethers.utils.formatEther(highestBid)
        });
         aucContract.off("AuctionEnded", (highestBidder, highestBid) => {
           console.log("Auction Ended")
          document.getElementById("miningTxt").innerHTML =" The auction ended with winning:" + highestBidder + "  and the highest bid:  " + ethers.utils.formatEther(highestBid)
        });
        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }  
    } catch (error) {
      console.log(error)
    }
  }


    const submitBid = async () => {
    try {
      const { ethereum } = window;
      
      if (ethereum) {

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      
      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
      	alert("You are not connected to the Rinkeby Test Network!");
      }
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(Auction_CONTRACT_ADDRESS, SimpleAuction.abi, signer);

        try{
        let bidTxn = await connectedContract.bid({value:  ethers.utils.parseEther(document.getElementById("bid").value), gasLimit: 300000 })
        console.log("Mining...please wait.")
        document.getElementById("miningTxt").innerHTML = "...Mining";
        await bidTxn.wait();
        auctionEventListener()
        document.getElementById("miningTxt").innerHTML = "Mined.";
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${bidTxn.hash}`); 

        } catch(err) {
        document.getElementById("miningTxt").innerHTML = "";
        if (bidTxn.hash){
        alert(`Go to the transaction link to see the reason for the error: https://rinkeby.etherscan.io/tx/${bidTxn.hash}`)
        }
      }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  /// Auction
  //Withdraw 
    const withdrawBid = async () => {
    try {
      const { ethereum } = window;
      
      if (ethereum) {

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      
      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
      	alert("You are not connected to the Rinkeby Test Network!");
      }
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(Auction_CONTRACT_ADDRESS, SimpleAuction.abi, signer);


        let withdrawTxn = await connectedContract.withdraw();
        console.log("Mining...please wait.")
        document.getElementById("miningTxt").innerHTML = "...Mining";
        await withdrawTxn.wait();
        document.getElementById("miningTxt").innerHTML = "Mined";
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${withdrawTxn.hash}`);          
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  //auction End 
    const auctionEnd = async () => {
    try {
      const { ethereum } = window;
      
      if (ethereum) {

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      
      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
      	alert("You are not connected to the Rinkeby Test Network!");
      }
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(Auction_CONTRACT_ADDRESS, SimpleAuction.abi, signer);

        try {
        let endTxn = await connectedContract.auctionEnd(NFT2_CONTRACT_ADDRESS, 0, {gasLimit: 300000});
        console.log("Mining...please wait.")
        auctionEventListener()
        document.getElementById("miningTxt").innerHTML = "...Mining";
        await endTxn.wait();
        document.getElementById("miningTxt").innerHTML = "Mined";
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${endTxn.hash}`);          }catch(err) {
        document.getElementById("miningTxt").innerHTML = "";
        if (endTxn.hash){
        alert(`Go to the transaction link to see the reason for the error: https://rinkeby.etherscan.io/tx/${endTxn.hash}`)
        }
      }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
///******************************* Comment Register Contract ******************************
const Register = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const commentRegisterContract = new ethers.Contract(commentRegister_CONTRACT_ADDRESS, commentRegister.abi, signer);
       
        let msgTxt = document.getElementById("comment").value;
        const msgTxn = await commentRegisterContract.register(msgTxt, { gasLimit: 300000 });
        console.log("Mining...", msgTxn.hash);

        await msgTxn.wait();
        console.log("Mined -- ", msgTxn.hash);
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}

     /*
   * Create a method that gets all comments from my contract
   */
  const getAllComments = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const commentRegisterContract = new ethers.Contract(commentRegister_CONTRACT_ADDRESS, commentRegister.abi, signer);

        const comments = await commentRegisterContract.getAllComments();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let commentsCleaned = [];
        comments.forEach(comment => {
          commentsCleaned.push({
            address: comment.user,
            timestamp: new Date(comment.timestamp * 1000),
            message: comment.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllComments(commentsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

///****************************************************************************************
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

    /**
 * Listen in for emitter comment register events!
 */
  useEffect(() => {
    let commentRegisterContract;
  
    const onNewComment = (from, timestamp, message) => {
      console.log("NewComment", from, timestamp, message);
      setAllComments(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      commentRegisterContract = new ethers.Contract(commentRegister_CONTRACT_ADDRESS, commentRegister.abi, signer);
      commentRegisterContract.on("NewComment", onNewComment);
    }
  
    return () => {
      if (commentRegisterContract) {
        commentRegisterContract.off("NewComment", onNewComment);
      }
    };
  }, []);

    const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button mint-button">
      Mint NFT
    </button>
  )

  const renderChanceUI = () => (
    <button onClick={getChance} className="cta-button mint-button">
      Luck button
    </button>
  )

  const renderWinUI = () => (
    <button onClick={winFunc} className="cta-button mint-button">
      Receive
    </button>
  )
  
  const renderBidUI = () => (
    <div className="btmPosition">
      <button onClick={submitBid} className="cta-button mint-button" style={{marginBottom: "20px"}}>Bid Register</button>
      Withdraw the past bids(except of the highest bid)
      <button onClick={withdrawBid} className="cta-button mint-button" style={{marginBottom: "20px"}}>withdraw</button>
     This option can be used only once at the end of the auction to assign NFT to the winner and also transfer ETH to the organizer.
      <button onClick={auctionEnd} className="cta-button mint-button">END</button>
    </div>
  )

  const renderCommentInputUI = () => (
  <div>
  <label for="comment">Your comment: </label>
  <input type="text" id="comment" className="comment"/><br></br>
  <button onClick={Register} className="cta-button mint-button">Register</button>
  </div>
  )

  
  return (
    <body>
      
     <div className="mainContainer">
       
       <div className="title">
         <img src="https://gateway.pinata.cloud/ipfs/QmdduR3fvv9xFCVKfXCvtFv261fCStUxa2F6epQkLwwMQE" alt="solidity logo" width="50" height="50" />
        <img src="https://gateway.pinata.cloud/ipfs/QmdduR3fvv9xFCVKfXCvtFv261fCStUxa2F6epQkLwwMQE" alt="solidity logo" width="50" height="50" />
        <img src="https://gateway.pinata.cloud/ipfs/QmdduR3fvv9xFCVKfXCvtFv261fCStUxa2F6epQkLwwMQE" alt="solidity logo" width="50" height="50" />
       <img src="https://gateway.pinata.cloud/ipfs/QmdduR3fvv9xFCVKfXCvtFv261fCStUxa2F6epQkLwwMQE" alt="solidity logo" width="50" height="50" />
      <b> Solidity Projects </b>
       <img src="https://gateway.pinata.cloud/ipfs/QmdduR3fvv9xFCVKfXCvtFv261fCStUxa2F6epQkLwwMQE" alt="solidity logo" width="50" height="50" />
        <img src="https://gateway.pinata.cloud/ipfs/QmdduR3fvv9xFCVKfXCvtFv261fCStUxa2F6epQkLwwMQE" alt="solidity logo" width="50" height="50" />
        <img src="https://gateway.pinata.cloud/ipfs/QmdduR3fvv9xFCVKfXCvtFv261fCStUxa2F6epQkLwwMQE" alt="solidity logo" width="50" height="50" />
         <img src="https://gateway.pinata.cloud/ipfs/QmdduR3fvv9xFCVKfXCvtFv261fCStUxa2F6epQkLwwMQE" alt="solidity logo" width="50" height="50" />
       </div>
       
       <div className="parag">
       <ul className="mainParagraph" dir="rtl">
         This is a Web3 Site that Contains Several Solidity Smart Contracts:
         <li>
          <a href="#sellNFT">Mint a Zombie Token (NFT Token)</a>
          </li>
         <li><a href="#randGeneratorContainer">
         Generate a random number by ChainlinkVRF to win NFT
           </a>
         </li>
         <li><a href="#auctionContainer">
         Participate in the NFT auction
           </a>
         </li>
         <li><a href="#voteContainer">
         Register your comment
          </a>
         </li>
         <div className="rinkebyHelp">
           <h2>Note</h2>
           <p>All smart contracts on this site are deployed on the Rinkeby Testnet. To interact with these you need:</p>
           <ol>
             <li>
                After connecting to the MetaMask wallet, set the network to Rinkeby Test Network.
             </li>
             <li>
              Having some fake ETH (To get fake ETH, first you need to connect your MetaMask Wallet to site
               <a target="_blank" rel="noreferrer" class="chakra-link css-t3sbfb" href="https://app.mycrypto.com/faucet?utm_source=buildspace.so&amp;utm_medium=buildspace_project"> https://app.mycrypto.com/faucet </a> and create an account there. Then click the same link again and ask for money.)   
             </li>
          </ol>
         </div>
       </ul>
      </div>
      
      <div className="mintContainer">
        
        <div id="sellNFT">
        <div className="leftSide">
          <img src="https://gateway.pinata.cloud/ipfs/QmakyVsBdrio9Cd65B4x6CcNHkv8GhFS2eE6ZwEErro8yM" alt="Zombie Token" width="300" height="300" />
          <div id="openseaTxt"></div>
          <a id='openseaURL'></a>
        </div>

        <div className="rightSide">
          <h2><b>Mint a Zombie Token</b></h2>
          <p>This is my zombie that I got from tutorial <a href="https://cryptozombies.io/"> https://cryptozombies.io </a>
        and converted to an NFT. You can mint a copy of it by pressing the button below. Then it will place in your wallet. The link that will appear below the image shows your NFT on OpenSea.
            </p>
          <div className="btmPosition">
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
            </div>
        </div>
      </div> 

      <div id="randGeneratorContainer">
        <div className="rightSide">
          <h2><b>Try your Chance</b></h2>
          <p>You can get a random number from Chainlink VRF by pressing the button below. If this number starts with 2 zeros then you are won, and you can get this NFT by pressing the receive button (that will appear after you win)</p>
          <div className="btmPosition">
          {currentAccount === "" ? renderNotConnectedContainer() : renderChanceUI()}
          <div id="chanceMiningTxt" style={{textAlign: 'center', marginTop:"10px"}}></div>
          {winStatus === false ? <div></div> : renderWinUI()}
            </div>
        </div>
        <div className="leftSide">
          <img src="https://gateway.pinata.cloud/ipfs/QmXKrXDGoBqgrVD2LGKoFX9yDNZZe9PwhrgBQ5ySSgNBGR" alt="build-space token0" width="300" height="300" />
        </div>
      </div>

      <div id="auctionContainer">
        <div className="leftSide">
          <img src="https://gateway.pinata.cloud/ipfs/QmZnKAjhr7MJgE5BemCg15jmZEZSk5Pd2zK17GbGciHS2y" alt="build-space token1" width="300" height="300" />
        </div>
        <div className="rightSide">
          <h2><b>Participate in this NFT Auction</b></h2>
          <p>This is a picture of my NFT that I got from tutorial  <a href="https://buildspace.so/p/mint-nft-collection"> https://buildspace.so/p/mint-nft-collection </a>
           . I made an NFT token out of it on the Rinkeby testnet and am putting it up for auction here. 😊
            </p>
          <p>The end of the auction: 23/5/2022  00:00 </p>
          <div id="bidUntilNow" style={{marginBottom: "10px"}}> Highest bid ever: ${highestBid}   ETH</div>
          <form action="/action_page.php">
          <label for="bid">Please enter your bid: </label>
            <input type="number" id="bid" name="bid" step="any"/><br></br> 
          </form>
            {currentAccount === "" ? renderNotConnectedContainer() : renderBidUI()}
          <div id="miningTxt" style={{textAlign: 'center', marginTop:"10px"}}></div>
        </div>
        
      </div> 

      <div id="voteContainer">
        <div>
          <h2><b>Comments</b></h2>
          <p>Please register your comment. Your comment will be registered on the blockchain forever.😉</p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderCommentInputUI()}
          <div className="commentCenter">
          {allComments.map((comment, index) => {
            return (
              <div className="commentBox" key={index} style={{marginTop: "10px", padding: "8px", width: "500px", boxShadow: "3px 3px 3px 3px gray"}}>
                <div>address:  {comment.address}</div>
                <div>timestamp:  {comment.timestamp.toString()}</div>
                <div>comment:  {comment.message}</div>
              </div>)
          })}
          </div>
        </div>
      </div>

    </div>
       
    </div>
    </body>
  );
}

export default App;