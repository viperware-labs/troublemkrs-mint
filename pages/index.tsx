import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ENS from "@ensdomains/ensjs";
// import withVideos from 'next-videos';

import logo from '../public/LOGO.png';
// import pass from '/pass.png';
import pass from '../public/PassGif.gif';
import twitter from '../public/twitterLogo.png';
import pfp1 from '../public/trbl1.png';
import pfp2 from '../public/trbl2.png';
import pfp3 from '../public/trbl3.png';
import pfp4 from '../public/trbl4.png';
import loading from '../public/LoadingGifFinal.gif';
// import loadingvid from '../public/PassMP4';

function fade(element: any) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
      if (op <= 0.1){
          clearInterval(timer);
          element.style.display = 'none';
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op -= op * 0.1;
  }, 50);
}

const getRemainingTime = (_deadline: Date) => {
  let now = new Date().getTime();

  let deadline = new Date(_deadline).getTime();

  let remainTime = (Number(deadline) - Number(now) + 1000) / 1000,
  remainSeconds = ('0' + Math.floor(remainTime % 60)).slice(-2),
  remainMinutes = ('0' + Math.floor(remainTime / 60 % 60)).slice(-2),
  remainHours = ('0' + Math.floor(remainTime / 3600 % 24)).slice(-2),
  remainDays = Math.floor(remainTime / (3600 * 24));

  return {
    remainSeconds,
    remainMinutes,
    remainHours,
    remainDays,
    remainTime
  }
};

const countdown = (deadline: any,elem: string,finalMessage: string) => {
  let el: HTMLElement | null | undefined = undefined;
  try {
    el = document.getElementById(elem);

    const timerUpdate = setInterval( () => {
      let t = getRemainingTime(deadline);
      // if (el != null) el.innerHTML = `${t.remainDays}D ${t.remainDays}H ${t.remainMinutes}M`;
  
      if (el != null) el.innerHTML = 
      ((Number(t.remainDays) != 0) ? `${t.remainDays}D` : ``) + ` `
      + ((Number(t.remainHours) != 0) ? `${t.remainHours}H` : ``) + ` `
      + ((Number(t.remainMinutes) != 0) ? `${t.remainMinutes}M` : ``) + ` `;
  
      if(t.remainTime <= 1) {
        clearInterval(timerUpdate);
        if (el != null) el.innerHTML = finalMessage;
      }
  
    }, 1000)
  } catch (e) {
    console.log("error");
  }
};

const callAPI = async (address: string) => {
	try {
		const res = await fetch(`https://api.opensea.io/user/` + address);
		const data = await res.json();
		console.log(data);
    return data;
	} catch (err) {
		console.log(err);
	}
};

async function getNames() {
  let address = "0x05da517b1bf9999b7762eaefa8372341a1a47559";
  let etherscanProvider = new ethers.providers.EtherscanProvider();
  let list: string[] = [];

  let fromBlock = 15914250;

  etherscanProvider.getHistory(address, fromBlock).then((history) => {
    console.log(history.length);
    let i = 0;
    const listLength = 4;

    // history.forEach((tx) => {
    history.slice().reverse().slice(0, listLength).forEach(async (tx) => {
      if (i < listLength) {
        i++

        let pfp = document.getElementById("pfp" + i);
        let item = document.getElementById("item" + i);

        // let pfpUrl = "https://i.seadn.io/gae/tNnkm9SWrFFYdC9VczshcGIUPZv0An-gnPSqnv10AM1HlwN_JRbOzcJvr1-gGxXzWoHxPQzeFb6Z8ITK08P7fjjj_ChrtHMfdpo21w?w=500&auto=format";
        
        // let contents = await fs.readFile("https://api.opensea.io/user/0x844a4641a3fbf2235da99667568140370d72fd45", 'utf8');

        let contents = await callAPI(tx.from);

        if (pfp != null) pfp.innerHTML = `<img
            width="48"
            height="48"
            src="` + contents.account.profile_img_url + `"
            />`;

        let setTo = await handleAddress(tx.from);
        
        if (item != null) item.innerHTML = '<a target="_blank" rel="noopener noreferrer" href="https://opensea.io/' + tx.from + '">' + setTo + '<br/>RESERVED 1X CREW PASS</a>';
      }
    })

  });
}

async function handleAddress(address: string) {
  let provider = new ethers.providers.InfuraProvider();
  const ensName = await provider.lookupAddress(address);
  
  if (ensName != null) {
    console.log(ensName);
    return ensName;
  } else {
    console.log((address.slice(0, 6) + "...." + address.slice(address.length - 4, address.length)));
    return((address.slice(0, 6) + "...." + address.slice(address.length - 4, address.length)));
  }
}

const Home: NextPage = () => {

  const [loaded, setLoaded] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);

  const [depositList, setDepositList] = useState<string[]>([]);

  function loaderListen() {
    let loader = document.getElementById('loader');
  
    if (loader != null) loader.addEventListener('ended', handleLoader, false);
  }
  
  function handleLoader() {
    setLoaded(true);
  }

  const decrementMintAmount = () => {
      let newMintAmount = mintAmount - 1;
      if (newMintAmount < 1) {
          newMintAmount = 1;
      }
      setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
      let newMintAmount = mintAmount + 1;
      if (newMintAmount > 3) {
          newMintAmount = 3;
      }
      setMintAmount(newMintAmount);
  };

  useEffect(() => {
    if (!loaded) getNames();

    loaderListen();
    
    // setTimeout( () => {
    //   setLoaded(true);
    //   console.log("true");
    // }, 4500)
  }, []);

  return (
    <>
      <div
      style={ loaded ? { display:'none'} : {display : ''} }
      className={styles.loading}>
        <video id="loader" autoPlay muted height="60%" width="60%">
          <source src="/Loading.mp4" type="video/mp4"/>
       </video>
          {/* <Image
            src={loading}
          /> */}
      </div>
      <div 
      style={ loaded ? { display:''} : {display : 'none'} }
      className={styles.container}>
        <Head>
          <title>Troublemkrs Mint</title>
          <meta
            name="description"
            content="A Place to Connect, a Space to Empower."
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>

        </Head>

        <main className={styles.main}>

          <div className={styles.headerflex}>

            <div className={styles.logo}>
              <Image
                src={logo}
              />
            </div>

            <div className={styles.connect}>
              <ConnectButton />
            </div>

          </div>

          <h1 className={styles.mintcontainer}>

            <div className={styles.pass}>
              {/* <video className={styles.passimg} autoPlay muted width="100%">
                  <source src="/Pass.mp4" type="video/mp4"/>
              </video> */}
              <Image
                className={styles.passimg}
                src={pass}
              />
              <div className={styles.salestatus}>
                <div className={styles.left}>
                  GUARANTEED PRESALE IS:
                  <div className={styles.live}><div id="clock"></div></div>
                </div>
              </div>
              
            </div>

            <div className={styles.mint}>
              {/* <div className={styles.yellow}>Ahoy, been waiting for months to mint!</div> */}
              {/* <div style={{
                color: "#eee",
                textTransform: "uppercase",
                display: "flex",
                fontSize: "20px",
                alignContent: "center",
              }}>
                
                Select Quantity:

                <button 
                  onClick={() => {
                    decrementMintAmount()
                  }}
                  style={{
                    margin: "auto 25px",
                    fontWeight: "900",
                    padding: "0 0 6px 0",
                    fontSize: "20px",
                  }} className={styles.roundButton}>—</button>

                <div style={{
                  // border: "1px solid red",
                  margin: "auto 0",
                }}>
                  {mintAmount}
                </div>

                <button 
                  onClick={() => {
                    incrementMintAmount()
                  }}
                  style={{
                    margin: "auto 25px",
                    fontSize: "32px",
                    padding: "0 0 2px 0",
                  }} className={styles.roundButton}>+</button>

              </div>
              <br/>
              <br/> */}
              <button className={styles.mintButton}>Reserve Your Pass</button>
              <br/>
              <div style={{
                color: "#a0a0a0",
              }}>Only 1 will be available for the guaranteed round and will cost a total of .2E/ea</div>

            </div>

          </h1>
              <div className={styles.reservationsTitleContainer}>
                <h1 className={styles.reservationsTitle}>
                  RECENT RESERVATIONS
                </h1>
              </div>

          <div className={styles.reservationsContainer}>
            <div className={styles.reservationBorder}>
              <div className={styles.reservePfp} id="pfp1">
                {/* <Image
                  className={styles.reservePfp}
                  width="48"
                  height="48"
                  src={pfp1}
                  /> */}
              </div>
                  <div id="item1" className={styles.reservationName}>Loading...</div>
            </div>
            <div className={styles.reservationBorder}>
              <div className={styles.reservePfp} id="pfp2">
                {/* <Image
                  width="48"
                  height="48"
                  src={pfp2}
                  /> */}
              </div>
                  <div id="item2" className={styles.reservationName}>Loading...</div>
            </div>
            <div className={styles.reservationBorder}>
              <div className={styles.reservePfp} id="pfp3">
                {/* <Image
                  width="48"
                  height="48"
                  src={pfp4}
                  /> */}
              </div>
                  <div id="item3" className={styles.reservationName}>Loading...</div>
            </div>
            <div className={styles.reservation}>
              <div className={styles.reservePfp} id="pfp4">
                {/* <Image
                  width="48"
                  height="48"
                  src={pfp4}
                  /> */}
              </div>
                  <div id="item4" className={styles.reservationName}>Loading...</div>
            </div>
          </div>

          <div className={styles.faqContainer}>
            <h1>
              PRESALE FAQ //
            </h1>
            <h2>
              FREQUENTLY ASKED QUESTIONS
            </h2>
            
            <div className={styles.faqContainerQuestions}>

              <div className={styles.faqContainerColumn}>
                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    1. What is the founders Crew Pass?
                  </div>
                  <div className={styles.faqBody}>
                    The Founders Crew Pass is the key to our ecosystem and your early access to the
                    <a href="https://twitter.com/TroubleMkrsNFT" target="_blank" rel="noopener noreferrer" style={{
                      color: "#ffcc00",
                    }}> @TroubleMkrsNFT</a> community. 
                    Pass holders will benefit greatly from everything we drop now and in perpetuity + bonus utility involving our upcoming PFPs.
                  </div>
                </div>
                <br/>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    2. What is the cost of the presale? 
                  </div>
                  <div className={styles.faqBody}>
                    Troublemakers that submitted their wallet prior will be able to reserve their Troublemakers Founders Crew Pass at 0.2E/each.
                  </div>
                </div>
                <br/>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    3. When will I get my Founders Crew Pass?
                  </div>
                  <div className={styles.faqBody}>
                    TBA, within a week after presale.<br/>
                  </div>
                </div>
              </div>

              <div className={styles.faqContainerColumn}>
                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    4. What will the holders get?
                  </div>
                  <div className={styles.faqBody}>
                    As a Crew Pass holder, you are guaranteed:<br/>
                    <br/>
                    •  Troublemakers Crew Pass<br/>
                    •  2x Free Troublemakers PFP (Future Airdrop) <br/>
                    •  Troublemakers PFP WL Nomination<br/>
                    •  Top-Tier NFT & Crypto Alpha Calls<br/>
                    •  Exclusive Weekly Classes & Community Events<br/>
                    •  Exclusive AMAs & Educational Content<br/>
                    •  Daily Market Updates (Everything you need to know daily in 1 post)<br/>
                    •  Daily Curated WL Raffles (Such as Homa games, MitsubishiNFT and Owange)<br/>
                    •  Troublemakers Networking Group (Meet founders, collab managers, get connected!)<br/>
                    •  Team/Job Opportunities<br/>
                    <br/>
                    For more information, refers to the Troublemakers discord.<br/>
                  </div>
                </div>
                <br/>
              </div>

            </div>
          </div>
          <div style={{
            display: "flex",
            width: "89%",
            margin: "30px 0",
          }}>
            <div style={{
              textTransform: "uppercase",
            }}>
              A place to connect, a space to empower.
            </div>
            <div style={{
              margin: "0 0 0 auto",
            }}>
              <a href="https://twitter.com/TroubleMkrsNFT" target="_blank" rel="noopener noreferrer">
                <Image
                  width="39px"
                  height="32px"
                  src={twitter}
                />
              </a>
            </div>
          </div>

          {/* <h1 className={styles.title}>
            PRESALE FAQ // faq
          </h1>

          <div className={styles.grid}>
            <a href="https://rainbowkit.com" className={styles.card}>
              <h2>RainbowKit Documentation &rarr;</h2>
              <div>Troublemakers Troublemakers Troublemakers</div>
            </a>

            <a href="https://wagmi.sh" className={styles.card}>
              <h2>wagmi Documentation &rarr;</h2>
              <div>Learn how to interact with Ethereum.</div>
            </a>
          </div> */}
        </main>

        <footer className={styles.footer}>
          <a href="https://twitter.com/ViperwareLabs" target="_blank" rel="noopener noreferrer">
            Made with ❤️ by Viperware Labs
          </a>
        </footer>
      </div>
    </>
  );
};

countdown('Nov 8 2022 00:59:59 GMT-0700', 'clock', 'LIVE ●');

export default Home;

