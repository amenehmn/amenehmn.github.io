import React, { useEffect, useState } from "react";
import './App.css';
import MyZombieNFT from "./utils/MyZombieNFT.json";
import { ethers } from "ethers";

const TOTAL_MINT_COUNT = 100;
// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0x272D90a1EE1FEA9fFeFA8893FFe4B0f335CAdD00";

function App() {

  const [currentAccount, setCurrentAccount] = useState("");

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

  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

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

  
  return (
    <body>
      
     <div className="mainContainer">
       
       <div className="title">
         <img src="./Solidity_logo.svg.png" alt="solidity logo" width="50" height="50" />
        <img src="./Solidity_logo.svg.png" alt="solidity logo" width="50" height="50" />
        <img src="./Solidity_logo.svg.png" alt="solidity logo" width="50" height="50" />
       <img src="./Solidity_logo.svg.png" alt="solidity logo" width="50" height="50" />
      <b> نمونه پروژه های سالیدیتی  </b>
       <img src="./Solidity_logo.svg.png" alt="solidity logo" width="50" height="50" />
        <img src="./Solidity_logo.svg.png" alt="solidity logo" width="50" height="50" />
        <img src="./Solidity_logo.svg.png" alt="solidity logo" width="50" height="50" />
         <img src="./Solidity_logo.svg.png" alt="solidity logo" width="50" height="50" />
       </div>
       
       <div className="parag">
       <ul className="mainParagraph" dir="rtl">
         این یک وبسایت Web3 شامل چند قرارداد هوشمند به زبان برنامه نویسی سالیدیتی است. قراردادها به شرح زیر هستند:
         <li>
          <a href="#sellNFT">ضرب کردن یک توکن زامبی(NFT Token)</a>
          </li>
         <li><a href="#randGeneratorContainer">
         تولید عدد رندوم (با استفاده از Chainlink) برای برنده شدن یک توکن NFT
           </a>
         </li>
         <li><a href="#auctionContainer">
         حراج یک توکن NFT
           </a>
         </li>
         <li><a href="#voteContainer">
         رأی دادن و ثبت نظر
          </a>
         </li>
         <div className="rinkebyHelp">
           <h2>توجه!</h2>
           <p>تمامی قراردادهای هوشمند در این وبسایت، برروی شبکه تست Rinkeby مستقر هستند. برای تعامل با این اپلیکیشن ها لازم است:</p>
           <ol>
             <li>
                بعد از اتصال به کیف پول متامسک، شبکه را برروی Rinkeby Test Network تنظیم فرمایید.
             </li>
             <li>
               اتریوم جعلی (fake ETH) داشته باشید.
              برای دریافت اتریوم جعلی ابتدا می بایست کیف پول خود را به سایت   
               <a target="_blank" rel="noreferrer" class="chakra-link css-t3sbfb" href="https://app.mycrypto.com/faucet?utm_source=buildspace.so&amp;utm_medium=buildspace_project"> https://app.mycrypto.com/faucet </a>
               متصل فرمایید و یک حساب کاربری ایجاد کنید و بعد از آن دوباره روی همین پیوند کلیک کنید تا  وجه درخواست کنید.
              
             </li>
          </ol>
         </div>
       </ul>
      </div>
      
      <div className="mintContainer">
        
        <div id="sellNFT">
        <div className="leftSide">
          <img src="./NFT0.PNG" alt="Zombie Token" width="300" height="300" />
          <div id="openseaTxt"></div>
          <a id='openseaURL'></a>
        </div>
        <div className="center">
        </div>
        <div className="rightSide">
          <h2><b>یک توکن زامبی ضرب کنید.</b></h2>
          <p>این تصویر زامبی منه که از آموزش <a href="https://cryptozombies.io/"> https://cryptozombies.io </a>
          گرفتم و اونو تبدیل به NFT کردم. شما میتونید با فشار دادن دکمه زیر یه نسخه از اون را ضرب کنید. بعدش اون در والتتون قرار میگیره. لینکی که زیر عکس ظاهر میشه NFT شما را برروی سایت OpenSea نشون میده.(البته همه اینا روی تست نت هست. 😉)
            </p>
          <div className="btmPosition">
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
            </div>
          <h3>توجه!</h3>
          <p>اگر تصویر بر روی سایت OpenSea نمایش داده نشد، تقصیر اون سایت هست🤷‍♀️ من از شما میخوام چند دقیقه منتظر بمونید، اگر بازم ظاهر نشد، من از طرف اونا از شما عذرخواهی میکنم.😄 </p>
        </div>
      </div> 

      <div id="randGeneratorContainer">
        <div className="rightSide">
          <h2><b>شانس خود را برای برنده شدن این توکن امتحان کنید.</b></h2>
          <p>به زودی</p>
        </div>
        <div className="center">
        </div>
        <div className="leftSide">
          <img src="./NFT0.PNG" alt="build-space token0" width="300" height="300" />
        </div>
      </div>

      <div id="auctionContainer">
        <div className="leftSide">
          <img src="./NFT0.PNG" alt="build-space token1" width="300" height="300" />
        </div>
        <div className="center">
        </div>
        <div className="rightSide">
          <h2><b>در حراج توکن روبرو شرکت کنید.</b></h2>
          <p>به زودی</p>
        </div>
      </div> 

      <div id="voteContainer">
          <h2><b>لطفاً به وبسایت من رأی بدید و نظرتون را بنویسید.</b></h2>
          <p>به زودی</p>
      </div>

    </div>
       
    </div>
    </body>
  );
}

export default App;