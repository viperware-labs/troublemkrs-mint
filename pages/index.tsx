import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useEffect, useState } from "react";

import logo from './assets/LOGO.png';
import pass from './assets/pass.png';
import twitter from './assets/twitterLogo.png';

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
  } catch (e) {
    
  }

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
};

countdown('Nov 8 2022 00:59:59 GMT-0700', 'clock', 'LIVE ●');


const Home: NextPage = () => {

  const [mintAmount, setMintAmount] = useState(1);

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

  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Troublemkrs Mint</title>
        <meta
          name="description"
          content="A Place to Connect, a Space to Empower."
        />
        <link rel="shortcut icon" href="./assets/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="./assets/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="./assets/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="./assets/favicon-16x16.png"/>

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
            <div style={{
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
            <br/>
            <button className={styles.mintButton}>Reserve Your Pass</button>
            <br/>
            <div style={{
              color: "#a0a0a0",
            }}>Only 1 will be available for the guaranteed round and will cost a total of .2E/ea</div>

          </div>

        </h1>

        <div className={styles.faqContainer}>
          <h1>
            PRESALE FAQ //
          </h1>
          <h2>
            FREQUENTLY ASKED QUESTIONS
          </h2>
          
          <div className={styles.faqContainerQuestions}>

            <div className={styles.faqContainerColumn}>
              <h1>
                1. What is the founders Crew Pass?
              </h1>
              <div>
                The Founders Crew Pass is the key to our ecosystem and your early access to the
                <a href="https://twitter.com/TroubleMkrsNFT" target="_blank" rel="noopener noreferrer" style={{
                  color: "#ffcc00",
                }}> @TroubleMkrsNFT</a> community. 
                Pass holders will benefit greatly from everything we drop now and in perpetuity + bonus utility involving our upcoming PFPs.
              </div>
              <br/>

              <h1>
                2. What is the cost of the presale? 
              </h1>
              <div>
                Troublemakers that submitted their wallet prior will be able to reserve their Troublemakers Founders Crew Pass at 0.2E/each.
              </div>
              <br/>

              <h1>
                3. When will I get my Founders Crew Pass?
              </h1>
              <div>
                TBA, within a week after presale.<br/>
              </div>
            </div>

            <div className={styles.faqContainerColumn}>
              <h1>
                4. What will the holders get?
              </h1>
              <div>
                - 1x Troublemakers Crew Pass<br/>
                - 2x Troublemakers PFP (Future Airdrop)<br/>
                - 1x Troublemakers PFP WL Nomination<br/>
                - 1x Troublemakers PFP WL<br/>
                - Top-Tier NFT & Crypto Alpha Calls<br/>
                - Exclusive Weekly Classes & Community Events<br/>
                - Exclusive AMAs & Educational Content<br/>
                - Daily Market Updates (Everything you need to know daily in 1 post)<br/>
                - Daily Curated WL Raffles (Not random bs, higher quality WLs)<br/>
                - Troublemakers Networking Group (Meet founders, collab managers, get connected!)<br/>
                - Team/Job Opportunities<br/>
                <br/>
                Troublemakers are for visionaries, dreamers & doers looking for a like-minded community alive and kicking in
                the bear—people who want high-quality content without all the noise.<br/>
                <br/>
                The above mentions are just the tip of the iceberg; we&apos;ll build and grow this together as a family.<br/>
              </div>
              <br/>
            </div>

          </div>
        </div>
        <div style={{
          display: "flex",
          width: "90%",
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
  );
};

export default Home;

