import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ENS from "@ensdomains/ensjs";
import cors from 'cors';
import express from 'express';
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

const faqResponsive = () => {
  var questions = (document.querySelectorAll(".Home_faqQuestionCorner__I7Qh4") as unknown as HTMLCollectionOf<HTMLElement>);

  console.log(questions.length);

  for(let i=0; i<questions.length; i++){
      questions[i].addEventListener("click", function() {
          if(questions[i].id=="Home_faqQuestionActive__ejv6_"){
            questions[i].id="";
            questions[i].style.paddingBottom="0px";
          } else{
              if( document.querySelector(".Home_faqQuestionCorner__I7Qh4#Home_faqQuestionActive__ejv6_") ) {
                let item = (document.querySelector(".Home_faqQuestionCorner__I7Qh4#Home_faqQuestionActive__ejv6_") as unknown as HTMLElement);
                if (item != null) item.id="";
                if (item != null) item.style.paddingBottom="0px";
              }
              questions[i].id="Home_faqQuestionActive__ejv6_";
              let body = questions[i].querySelector(".Home_faqBody__AYoUh");
              if (body != null) questions[i].style.paddingBottom = body.clientHeight + 15 +"px";
          }
      })
  }
}

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



// function onGet(address: string) {
//   const url = "http://localhost:8000/api/" + address + "/messages";
//   var headers = {}
  
//   fetch(url, {
//       method : "GET",
//       mode: 'cors',
//       headers: headers
//   })
//   .then((response) => {
//       if (!response.ok) {
//           throw new Error(response.error)
//       }
//       return response.json();
//   })
//   .then(data => {
//       document.getElementById('messages').value = data.messages;
//   })
//   .catch(function(error) {
//       document.getElementById('messages').value = error;
//   });
// }

const callAPI = async (address: string) => {
	try {
		const res = await fetch(`https://api.opensea.io/user/` + address, {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': `https://api.opensea.io/user/${address}`,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
        
      }
    });
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

        // let contents = await callAPI(tx.from);

        // if (pfp != null) pfp.innerHTML = `<img
        //     width="48"
        //     height="48"
        //     src="` + pfp1 + `"
        //     />`;

        let setTo = await handleAddress(tx.from);
        
        if (item != null) item.innerHTML = '<a target="_blank" rel="noopener noreferrer" href="https://opensea.io/' + tx.from + '">' + setTo + '<br/>RESERVED 1X CREW PASS</a>';

        let tickerbar = document.getElementById("tickerbar");

        console.log(tickerbar);

        let tickeritem = document.createElement('a');
        tickeritem.className = styles.tickeritem;
        tickeritem.target = "_blank";
        tickeritem.rel = "noopener noreferrer";
        tickeritem.href = "https://opensea.io/" + tx.from;
        tickeritem.innerHTML = setTo + " RESERVED 1X CREW PASS";

        tickerbar?.appendChild(tickeritem);
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
    faqResponsive();
    
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
              <div>{/* <div className={styles.yellow}>Ahoy, been waiting for months to mint!</div> */}
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
              <br/> */}</div>

              <div className={styles.reservationHolder}>
                <div className={styles.reservationHolderTexts}>
                  <h2>TROUBLEMAKERS FOUNDERS CREW PASS</h2>
                  <p>A pass to short description short description short description short description short description</p>
                </div>
                <div className={styles.reservationPhasesHolder} id={styles.phase1}>
                  <div className={styles.reservationPhases}>
                    <div className={styles.reservationPhaseBox}>
                      <p className={styles.reservationHeader}>
                        <span className={styles.reservationPhase}>PHASE 1</span><span className={styles.reservationActive}></span>
                      </p>
                      <p className={styles.reservationDesc}>Guaranteed Mint</p>
                      <p className={styles.reservationEnd}>Ends in <span id={styles.phase1End}>6D 9H</span></p>
                    </div>
                    <div className={styles.reservationPhaseBox}>
                      <p className={styles.reservationHeader}>
                        <span className={styles.reservationPhase}>PHASE 2</span><span className={styles.reservationActive}></span>
                      </p>
                      <p className={styles.reservationDesc}>Leftover (FCFS)</p>
                      <p className={styles.reservationEnd}>Ends in <span id={styles.phase1End}>6D 9H</span></p>
                    </div>
                    <div className={styles.reservationPhaseBox} id={styles.reservationActive}>
                      <p className={styles.reservationHeader}>
                        <span className={styles.reservationPhase}>PHASE 3</span><span className={styles.reservationActive}></span>
                      </p>
                      <p className={styles.reservationDesc}>Acceptence Mint</p>
                      <p className={styles.reservationEnd}>Ends in <span id={styles.phase1End}>6D 9H</span></p>
                    </div>
                  </div>
                  <div className={styles.reservationReserveBox}>
                    <p>Reserved Price: <span id={styles.reservedPrice}>0.2 ETH</span></p>
                    <button className={styles.mintButton}>Reserve Pass</button>
                  </div>
                </div>
              </div>

            </div>

          </h1>
              <div className={styles.reservationsTitleContainer}>
                <h1 className={styles.reservationsTitle}>
                  RECENT RESERVATIONS
                </h1>
              </div>
          
          
          <div className={styles.tickerwrapwrap}>
            <div className={styles.tickerwrap}>
              <div id="tickerbar" className={styles.ticker}>
                {/* <a className={styles.tickeritem}>
                  Loading...
                </a> */}
              </div>
            </div>
          </div>
          
          {/* <div className={styles.reservationsContainer}>
            <div className={styles.reservationBorder}>
              <div className={styles.reservePfp} id="pfp1">
                <Image
                  className={styles.reservePfp}
                  width="48"
                  height="48"
                  src={pfp1}
                  />
              </div>
                  <div id="item1" className={styles.reservationName}>Loading...</div>
            </div>
            <div className={styles.reservationBorder}>
              <div className={styles.reservePfp} id="pfp2">
                <Image
                  width="48"
                  height="48"
                  src={pfp2}
                  />
              </div>
                  <div id="item2" className={styles.reservationName}>Loading...</div>
            </div>
            <div className={styles.reservationBorder}>
              <div className={styles.reservePfp} id="pfp3">
                <Image
                  width="48"
                  height="48"
                  src={pfp3}
                  />
              </div>
                  <div id="item3" className={styles.reservationName}>Loading...</div>
            </div>
            <div className={styles.reservation}>
              <div className={styles.reservePfp} id="pfp4">
                <Image
                  width="48"
                  height="48"
                  src={pfp4}
                  />
              </div>
                  <div id="item4" className={styles.reservationName}>Loading...</div>
            </div>
          </div> */}

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
                    <p><span>1. What is the founders Crew Pass?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff"/></g></svg></span></p>
                    <div className={styles.faqBody}>
                      The Founders Crew Pass is the key to our ecosystem and your early access to the
                      <a href="https://twitter.com/TroubleMkrsNFT" target="_blank" rel="noopener noreferrer" style={{
                        color: "#ffcc00",
                      }}> @TroubleMkrsNFT</a> community. 
                      Pass holders will benefit greatly from everything we drop now and in perpetuity + bonus utility involving our upcoming PFPs.
                    </div>
                  </div>
                </div>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>2. What is the cost of the Presale?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff"/></g></svg></span></p>
                    <div className={styles.faqBody}>
                      The cost to reserve a Founders Crew Pass is at 0.2E/each.
                    </div>
                  </div>
                </div>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>3. Why a presale instead of the standard minting process?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff"/></g></svg></span></p>
                    <div className={styles.faqBody}>
                      Based on various considerations, this is a better way than the traditional minting process, where everyone who reserved their Crew Pass will be airdropped simultaneously. 
                    </div>
                  </div>
                </div>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>4. How does Phase 1/2/3 works?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff"/></g></svg></span></p>
                    <div className={styles.faqBody}>
                      Phase 1 will be guaranteed reserve for all our WL members.<br/>
                      Phase 2 will be FCFS for whatever that&apos;s leftover.<br/>
                      Phase 3 will be for 100 selected public applicants.
                    </div>
                  </div>
                </div>

              </div>

              <div className={styles.faqContainerColumn}>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>5. Who is eligible to reserve a Founders Crew Pass?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff"/></g></svg></span></p>
                    <div className={styles.faqBody}>
                      The initial 200 invited to the Troublemakers discord are eligible to reserve their 1x Crew Pass. And another 100 will be selected via a Public Application shortly after.
                    </div>
                  </div>
                </div>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>6. Is there a discord?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff"/></g></svg></span></p>
                    <div className={styles.faqBody}>
                      Yes, the discord is closed strictly for handpicked members but will be opened up for new Crew Pass Holders after the end of the Presale.
                    </div>
                  </div>
                </div>


                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>7. What are some perks for holding a Crew Pass?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff"/></g></svg></span></p>
                    <div className={styles.faqBody}>
                      As a Crew Pass holder, you are guaranteed:<br/>
                      <br/>
                      •  2x Free Troublemakers PFP (Airdrop) <br/>
                      •  Troublemakers PFP WL Nomination<br/>
                      •  Top-Tier NFT & Crypto Alpha Calls<br/>
                      •  Exclusive Weekly Classes & Community Events<br/>
                      •  Exclusive AMAs & Educational Content<br/>
                      •  Daily Market Updates (Everything you need to know daily in 1 post)<br/>
                      •  Daily Curated WL Raffles (Such as Homa games, MitsubishiNFT and Owange)<br/>
                      •  Troublemakers Networking Group (Meet founders, Collab managers)<br/>
                      •  Team/Job Opportunities<br/>
                      <br/>
                      For more information, refers to the Troublemakers discord.<br/>
                    </div>
                  </div>
                </div>

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

countdown('Nov 12 2022 00:59:59 GMT-0700', 'clock', 'LIVE ●');

export default Home;

