import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import logo from './assets/LOGO.png';
import pass from './assets/pass.png';

const getRemainingTime = (_deadline: Date) => {
  let now = new Date().getTime();

  let deadline = new Date(_deadline).getTime();

  console.log(now);

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
  return (
    <div className={styles.container}>
      <Head>
        <title>Troublemkrs Mint</title>
        <meta
          name="description"
          content="A Place to Connect, a Space to Empower."
        />
        <link rel="icon" href="./assets/favicon.ico" />
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
            {/* <p className={styles.yellow}>Ahoy, been waiting for months to mint!</p> */}
            <p style={{
              color: "#eee",
              textTransform: "uppercase",

            }}>Select Quantity</p>
            <br/>
            <br/>
            <button className={styles.mintButton}>Reserve Your Pass</button>
            <br/>
            <p style={{
              color: "#a0a0a0",
            }}>Only 1 will be available for the guaranteed round and will cost a total of .2E/ea</p>

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
              <p>
                The Founders Crew Pass is the key to our ecosystem and your early access to the @TroubleMkrsNFT community. 
                Pass holders will benefit greatly from everything we drop now and in perpetuity. + bonus utility involving our upcoming PFPs.
              </p>
              <br/>

              <h1>
                2. What is the cost of the presale? 
              </h1>
              <p>
                Troublemakers and submitted their wallet prior will be able to reserve their Troublemakers Founders Crew Pass at 0.2E/each.
              </p>
              <br/>

              <h1>
                3. When will I get my Founders Crew Pass?
              </h1>
              <p>
                TBA, within a week after presale.
              </p>
              <br/>
            </div>

            <div className={styles.faqContainerColumn}>
              <h1>
                4. What will the holders get?
              </h1>
              <p>
                1x Troublemakers Crew Pass<br/>
                2x Troublemakers PFP (Future Airdrop)<br/>
                1x Troublemakers PFP WL Nomination<br/>
                1x Troublemakers PFP WL<br/>
                Top-Tier NFT & Crypto Alpha Calls<br/>
                Exclusive Weekly Classes & Community Events<br/>
                Exclusive AMAs & Educational Content<br/>
                Daily Market Updates(Everything you need to know daily in 1 post)<br/>
                Daily Curated WL Raffles(not random bs, higher quality WLs)<br/>
                Troublemakers Networking Group(Meet founders, collab managers, get connected!)<br/>
                Team/Job Opportunities<br/>
                <br/>
                Troublemakers are for visionaries, dreamers & doers looking for a like-minded community alive and kicking in
                the bear—people who want high-quality content without all the noise.<br/>
                <br/>
                The above mentions are just the tip of the iceberg; we'll build and grow this together as a family.<br/>
              </p>
              <br/>
            </div>

          </div>
        </div>

        {/* <h1 className={styles.title}>
          PRESALE FAQ // faq
        </h1>

        <div className={styles.grid}>
          <a href="https://rainbowkit.com" className={styles.card}>
            <h2>RainbowKit Documentation &rarr;</h2>
            <p>Troublemakers Troublemakers Troublemakers</p>
          </a>

          <a href="https://wagmi.sh" className={styles.card}>
            <h2>wagmi Documentation &rarr;</h2>
            <p>Learn how to interact with Ethereum.</p>
          </a>
        </div> */}
      </main>

      <footer className={styles.footer}>
        <a href="https://viperware.xyz" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by Viperware Labs
        </a>
      </footer>
    </div>
  );
};

export default Home;
