import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import ENS from "@ensdomains/ensjs";
import cors from 'cors';
import express from 'express';
// import withVideos from 'next-videos';

import logo from '../public/LOGO.png';
// import pass from '/pass.png';
import pass from '../public/PassNew2.gif';
import twitter from '../public/Twitter_Logo.png';
import pfp1 from '../public/trbl1.png';
import pfp2 from '../public/trbl2.png';
import pfp3 from '../public/trbl3.png';
import pfp4 from '../public/trbl4.png';
import loading from '../public/LoadingNew.gif';
import { useContractRead, useContractWrite, usePrepareContractWrite, usePrepareSendTransaction } from 'wagmi';
import { keccak256, parseEther } from 'ethers/lib/utils';
import error from 'next/error';
import { useConnect, useDisconnect, useAccount, useNetwork } from "wagmi";

import importedABI from '../public/config/abi.json';
import MerkleTree from 'merkletreejs';

/* Merkle Root */

// const addresses = ["0xd6e67ce446dC04dcF3F3556B8150F370D4c52A62", "0x9d3F56186CE4bA86214AE9127e07491f2449D698"]

const addresses = ["0xa173325CE21827B22F4e573CE9990D639e5D7e0f", "0x4Ba83871fA90f5d899098f350dF695b88154651d", "0xa652d02215D9464F629A63eDCECaa6595af1534E", "0x2C0067DB5FFA048a4bEA0AaEfF5AF6F36214d4Da", "0x3692b3e6Ee63f217791175B9B40B6CCca2456aF8", "0x6C24CC6e1C75Dfeb4D272Fe9f4D45C0fb1729C0b", "0x9740CE6D98609B06849CDee18adfe98cE627b63e", "0x64eDc71B5A87134f3391906cE7e6624E32883C10", "0x8586f84717710939158c22fb23a73a2d24ca4627", "0x876F764c6D7caE73782cba6a86E9722b9a9618Fb", "0x37DaB172685Ae81513Fc2CB245d4e1b62e92Fc5c", "0x7e82c068f5414FCe968c37A55606A784054b2aF4", "0x2000D8d7cfa5edAF64271b8719579bd9cd56f3E0", "0x9d3F56186CE4bA86214AE9127e07491f2449D698", "0x08a7bcC503C5a2bF49f320F7C298C958DBD09Fa1", "0x2Be2C0F632F69d3E5DAdB32b4DeC2689e1A77887", "0x5191410D10E5d9c493D6247A752DC38D0bDC6024", "0xCe4D778c2dfF304743baAda2bCe8E6cf16Fb2481", "0xf4769f50C9436178737874A9380531503a71D532", "0xAD963df730Fad06668C9acf0922f13A19fC19993", "0xa2A9Ea797C49f161eB6eC7b5549c2F8b6701B074", "0xb19C8Bf34a82E1684023928AB0F44c7DAfbCC2FC", "0x239D0D84B95602e640DdC58aC23f38b2A2EA752f", "0x5D24f04BE6192d7F4790709d3E415c6a685CFA27", "0x85b826B5eB230D03Ce1BB41DED646909bF0c3F4E", "0x428155ADDE9887459dA60a2FDF9F3aAC9043F9B5", "0xA9852147ee8Bbd4B5bb4cb0Bc65d6C1E960E606a", "0x8c799dD8b4e1D95692e1aCde37d67F0212f5E8D8", "0xC709c2e280f246123d0bb72394BC79f10fBDAb4c", "0x43fBf3CfCe4a5028b3d1421383e2776d83D720d9", "0x508fc1c68602A7043Cec0300e0a4E7a9b8530019", "0x176Caa48E5b2d6be10E56A9E602Df93ed20F2C1E", "0xd6De065069632B7871208016e6f7bF57E32a30dc", "0x6FacA6E427471C948C0F9Cc8f2A91A65dB6e2Dd0", "0xE3A3D7Ea7C25c18977201E995141431868757891", "0xe18a8D3702BA1C4e1fd96042F84d9Df740277C89", "0x63885eFAFe86d5B91800a2748756530A480A5043", "0x30c53b7693D7318d8a45Fcf43A7d4Bc9c3c4ff3D", "0x44DfB3B32B08fefA9BE0A9BEd66f3D8a58005564", "0x2f4b568b8d23df36b37D303567f59fDb37148668", "0x3B02f2B103c5F07abE8DD6171e51B7291da9dF7b", "0xD531FCF7968cebE0e58Bb23105759d9e448eE91c", "0x11fBDdc4e34C6bCf0DF96D6AEcd01d52E252098c", "0x8086d265eaa3fac05607869603430a8Da0609Cdd", "0xEA143346Bd8eCa087d33eE68C104Ee7e36928B65", "0xedFa1D118BE25aEb1Cf0B35355B5c697096D896E", "0xa651Ab767dfD8beeC267aBC3b4E7f29A3300Fb6A", "0x6fA350c7ADc39E29df32E6edB4eB89B29b652C66", "0x555fab084Bd0ccf53370a02b1B637DbBBacDDB8F", "0x0148e6033d8b65b679659F63c88954a6D36e7184", "0x1731A1e2053FCA86Cf11163220c7B1868C429dB4", "0x2cC5bF0b0EDAC7f0f430F415847322265d928D8B", "0x5C9E2A6fEc34b510996a8e2a3d1e2c47A382a8b9", "0xf755847e7170b09B655654d2328E2231b2E7D5D3", "0xaFd56Aa1412ceD162cE93bb2E4091207567F2171", "0x8464dCf46952c0FCa18Bc1df3a7E7B75Ada93F6d", "0xB767864f566F97BBB4cD83A0C90B5D9050B27D19", "0x18297C502C0a0a7c50D096be03Ec1FC6bcc5D98e", "0xd72ca63d867DdB56C2bB46161D083e2B315101B0", "0x4C3dD50a1eF7D82Be242da23D49CCBf4A3d9AAd9", "0x1f655Fbf8bD6008251B5286cCc9DfEBCc4CEaC3A", "0x823BdfC62340512ed9B0a8DA40128C5A27EEaeb6", "0x9e2f51f603E2674888FdB76FC25CE1E624E45433", "0x4a4FF863d78EBc55dE480cac6b0E1ef13898281A", "0xB75d68F4300bAE0169D5f9CFe618eDBBbceF1DE3", "0x64ff8A32bd2b2746ed2A42Ce46eb1Bd74C59f70C", "0xF4EbF1061d7Fb49D66F1c07c23D27a07234A8Eeb", "0x83532f37Ef4C23767d042f55dD1A1098ea47b823", "0x7B9ceE7a68880f1261f4691A8a0BfB88f9DFA1BE", "0x666ea87254d4357E864993f6E67AebC803806DdB", "0x89A02b98B3776ce4b4af075D3c25c72454122E31", "0x62509e6f1FA4c2D82ae0D9dbDB4d7CB3b5EF5a1a", "0xC972E31C80DFc15F581cA791F41B1653438f6b5D", "0xF9d80935D62Bb1a7Da5e06529fd69D833Be99Ab4", "0x0107CE60333B78B353370aE4FacBeB7Ac8545F02", "0xE4E4C68bca68FabCc4a215BDCb669b933C3b2989", "0xBcaC57990F8Edf1a821E5758a3a6AAA9F81A3e69", "0xf9946523c93D277Fd64f98cDba1aD344177C6467", "0x11b7246173E16F8C10b07d04b719E48282EBe2Cd", "0x9a699EcB9638e3022BE4793159ce2f7bC57D4F46", "0x6C00167A8d1b086aeEAB40caB9118df406E0c5dE", "0xE6D038BC4B9d8a82aad71CCf30c2E55CCD7f9F38", "0xFEc9E73d40751d7563d4056C461BFD4526Ce813c", "0xac32967007909F5B312557E4909CB73a3dEa3d8d", "0xdFf2B179B68E1F6d2dd977950AFa2b8F6AC828Ae", "0x064Ec9737B7000C26d62ed1226bE10327DaA678c", "0xb442d26D2b0848E4782cfd7553EE75497f897CCA", "0x81Ed5fCdfEE0C451acB3d99467e802321C949a96", "0xAA98177DAD812fdc8b37ec61d5f16A4Bf890F2C0", "0xfe6Ca6938259c1Ec6862Bc09524C59d9a7fbF030", "0x5cAd93D9E52b1c1A138E19552Bd9571F015EbA45", "0xd50a805a547Ed4f8dA3602615e77Ab9281A0560A", "0x7d4b0939c0F2c59E3c04DD098a155173fD75BA9F", "0x4C1dD1f078e78935DFD83F27f3A254b3E7d5E21a", "0x5f147732c386450c2f2A4c7260ada31f082EEEF8", "0x60D71d296875cfB701949cEc1eA6AC1FFd2e9A62", "0x1EB34745C94Bc9541c9f46A5c45B78AB1FF3622B", "0x766C1d99950Aa41bBdfdF8503391D986a406e2f1", "0x6802afC5996475F264324667AF3816B8a9B0459f", "0xe09283B2bE9431B6c9d866Ce1e1317F435d073e9", "0xfe77FEEE53FDce3Fc22B5DD149695AC136e624eC", "0x526Cf160F2A47B1CC1e5019DadE58a1a1dF6BeD5", "0x569BC675f0a6e5Fa08D4960C16071963654E798e", "0x83378c70B12Be0431A36416622efD2e430B04628", "0x00386637CF48eB0341B3fcFE80edab62b78C866e", "0x782BFf5A6074148b1f8c4E81B41F9297eFee2f8d", "0xc708dA7413108192b796ad7a4bf9EcA67cC195e9", "0x878578b7B9D96B83aAFB1a142AC0D2eA05231003", "0xc48E3F0Bf10D943aC71930FEE7C2cc024e2261Da", "0xb6490e9eE52F0D07BA034b794C7790d6af9DDa28", "0xce1992c4CA93789AB14239A1463DE9fe3140E623", "0x272257F2755F4db0Eb0e351C9764280dD63Ed592", "0xde209bec505BdF27A70c238453064b457d7153BC", "0x464CEF0ef5360a5b95088eea528E440315Fc51E0", "0x6824eC7bb04ec971B94C0cf1dd86D2f8E2eFdDE6", "0x738C9f6618191dEb17078281469Ded0524072119", "0xABA79AC31D71067EAeD57BF2a86100653d644Cac", "0x13a8dE9D3b1B73F30539978f9f3c63b64562FfB9", "0x635C8284c700f6b67ff428C832cbe65b76f8d623", "0x5cD8A628764F35e163B16711Ac415a7C98a877E1", "0x9d67E0cAdAa30ea632BfBeE876343e9057865d87", "0x4D73e1ad198EB4B130D7e3ec1a0d8866eE518E01", "0x75A383865BC8b523d42A8CaAA971460BF69103A0", "0x995D697ac37916b79a6a00E07E2Df07BdCa7c1b5", "0xa4435869AdA25A3198b5bf9F99f31825464E80Ab", "0xe48681DEd47637382fc22509C585067f4F7996fd", "0x3C4dE47214da95c8d028692A82E187514ec7b409", "0xE569F58b6BEa53CB0e9a1EF6B6e92BC46f1D42B5", "0x633DaBf67158c6326385432d113405aC1A127BeC", "0xD843b0da107A061ccb38fcC190cF271f3027bC96", "0xFac512717266dfF9f30fbb4a834A6297758f171c", "0xA46BF4Bd05aB02F8e93F3860915938eFaef6ED44", "0xe5919152A8880Ba3F39A1b8787B82261bBde4471", "0x0A051a69F27b9aAeCa868b252eADF8A8f5f7323A", "0x833F36c3c4E18BadED237bDf2dCdB8a0AE0C60c2", "0x087Cc3DD797e04ec8B6cb66B3d7BD84Fd8541221", "0x7bF8139Bc5F009447D6d4a3B227899a195218913", "0x79b5BB3A077ed7da558A85E44Aa8897D9Cfd1034", "0x7D21FF8B36DB331d2Fc5EaE47177fD8E6FE144e5", "0x991298F2122297cfcCf42FDa51511B004f4991F9", "0x332986f449E1154Cd06b6b967Fe45D3bc45Ca670", "0x8Bbc42dA742E9A5e0EE458A63Be0bcd23f0b5912", "0x4Cd3F1C8Bfe7fB50470e4738e45921A1D08bc9bA", "0x910915b4EF4B48737b786E5f279124ba2D088f4A", "0x1C69e28C38Ff6c3f5dBC2e6776264Ea8215D0fe7", "0x95136B3cf6849Bd63E4d02a8BffCF0d5A6731bD5", "0xC5bD742eC7b1601f8AC8Bcbe8BdcA897e4B460B2", "0xCAb4161aE91900B9Cbd1A3C643a84dCb66F241BD", "0x94e3F469953F8F49eF67EEB29fdD02CAc480FBFc", "0x6CFbA31B89974acD050d5cAf48Ae92A12Ed160B9", "0xDa96768110B50E07Bf9F612864F3C1B9B43A17b8", "0x71661fD966BEcD30D18b620Cc24B43a99FD2ce97", "0x1ecb3a0a1f9308186Dc2B766546996fEB8b79B3f", "0x078CC4caa131eB9d6D3E31847946d5F37fd3F58b", "0xe85002d93773725ddEFb84585615FEA9DE68afEa", "0x61B6F3a41432f98Dc2db19a72d31b21E474a819c", "0x70cB07291D38A5246ae2ADc676fF555b19C9Ca3b", "0x2CD00bDf1605046cef0F50420831Bf3b7d675882", "0x004a34b14A21F537D5D266C2550Ca6A228C040A9", "0x3BEDe79237a792D6943e2c2C20D69Bf39857b743", "0xd31b02b706245d8D7cAe4FD676040D99180025Df", "0x20453968Fd558CEC52C81ED2454Fd0b47f6A4A1B", "0x3832FEaC64fBC60e2E0B3b71878285f390A6986A", "0xa812a58b8cFb6f3648fBd8cc00485Bbcc43E5816", "0xd79dAB4673a12301d5034aBE0c2aE644523a2d4D", "0x0F17b2E69e349b563E76513eEf4D90e3f4be3BA9", "0x6091233927917A4CAfd796f859d68795C3Bd0dB4", "0x637530Ca749BCbaBCDC5023cf217c03A7063E6c4", "0x464e74119F17080a4FD3cAB4ec559C52786aAD1B", "0xACd6c2F22493DF8afF4771cd2F85CccC0fd2b2dF", "0x952F3C482D3A7Ff3B6dEFC6b40DB7B9A0580a0B7", "0x4eA1d6c74290f92DA6299F6bb65f5BED0f642797", "0xE3197391348C02044fbcD853FB6F800f09C4D037", "0x7Ba1fcaf5724f2ADfE975A261952a80964d01314", "0xB1870F63FAa2120e812dC21C1B521ab67C01FD23", "0x75F4fA23c6A2727Ba507362e1F52946c810073c0", "0x497fE20C94D4Ba9247582462d6dcB945B160Fd20", "0x51eDb088b39Fd1cE613Eb7fFb06503B83Ef35198", "0xD25dFb34B16E05145fE44d4f6F18063B5f78e82B", "0xEd59F04A033693492aBB66BE6bEb04cC5DeeB286", "0xB2ec2dB544c8469B69055bD5Ca51b8FaafeAC77a"]

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
  try {
    var questions = document.querySelectorAll(".Home_faqQuestionCorner__I7Qh4");

    for (let i = 0; i < questions.length; i++) {
      questions[i].addEventListener("click", function () {
        // @ts-ignore
        if (this.id == "Home_faqQuestionActive__ejv6_") {
          // @ts-ignore
          this.id = "";
          // @ts-ignore
          this.style.paddingBottom = "0px";

        } else {
          if (document.querySelector(".Home_faqQuestionCorner__I7Qh4#Home_faqQuestionActive__ejv6_")) {
            let item = (document.querySelector(".Home_faqQuestionCorner__I7Qh4#Home_faqQuestionActive__ejv6_") as unknown as HTMLElement);
            item.style.paddingBottom = "0px";
            item.id = "";
          }
          // @ts-ignore
          this.id = "Home_faqQuestionActive__ejv6_";
          // @ts-ignore
          this.style.paddingBottom = this.querySelector(".Home_faqBody__AYoUh").clientHeight + 15 + "px";
        }
      })
    }
  } catch (e) {
    console.log(e);
  }
}

const countdown = (deadline: any, elem: string, finalMessage: string) => {
  let el: HTMLElement | null | undefined = undefined;
  try {
    el = document.getElementById(elem);

    const timerUpdate = setInterval(() => {
      let t = getRemainingTime(deadline);
      // if (el != null) el.innerHTML = `${t.remainDays}D ${t.remainDays}H ${t.remainMinutes}M`;

      if (el != null) el.innerHTML =
        // `LIVE in <br/>`
        ``
        + ((Number(t.remainDays) != 0) ? `${t.remainDays}D` : ``) + ` `
        + ((Number(t.remainHours) != 0) ? `${t.remainHours}H` : ``) + ` `
        + ((Number(t.remainMinutes) != 0) ? `${t.remainMinutes}M` : ``) + ` `;

      if (t.remainTime <= 1) {
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
      headers: {
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

  // let tickerbar = document.getElementById("tickerbar");
  // tickerbar!.innerHTML = "";
  let address = "0x77a72edabdf29e76102e9f9280d5fb55a4c1d0ce";
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
        let seconditem = document.getElementById("seconditem" + i);

        // let pfpUrl = "https://i.seadn.io/gae/tNnkm9SWrFFYdC9VczshcGIUPZv0An-gnPSqnv10AM1HlwN_JRbOzcJvr1-gGxXzWoHxPQzeFb6Z8ITK08P7fjjj_ChrtHMfdpo21w?w=500&auto=format";

        // let contents = await fs.readFile("https://api.opensea.io/user/0x844a4641a3fbf2235da99667568140370d72fd45", 'utf8');

        // let contents = await callAPI(tx.from);

        // if (pfp != null) pfp.innerHTML = `<img
        //     width="48"
        //     height="48"
        //     src="` + pfp1 + `"
        //     />`;

        let setTo = await handleAddress(tx.from);

        item!.innerHTML = '<a target="_blank" rel="noopener noreferrer" href="https://opensea.io/' + tx.from + '"><b>' + setTo + '</b><br/>Reserved 1x Founders Crew Pass</a>';
        seconditem!.innerHTML = '<a target="_blank" rel="noopener noreferrer" href="https://opensea.io/' + tx.from + '"><b>' + setTo + '</b><br/>Reserved 1x Founders Crew Pass</a>';

        // let tickerbar = document.getElementById("tickerbar");
        // console.log(tickerbar);

        // let tickeritem = document.createElement('a');
        // tickeritem.className = styles.tickeritem;
        // tickeritem.target = "_blank";
        // tickeritem.rel = "noopener noreferrer";
        // tickeritem.href = "https://opensea.io/" + tx.from;
        // tickeritem.innerHTML = setTo + " RESERVED 1X CREW PASS";

        // tickerbar?.appendChild(tickeritem);
      }
    })

  });
}

async function handleAddress(address: string) {
  let provider = new ethers.providers.InfuraProvider();
  const ensName = await provider.lookupAddress(address);

  if (ensName != null) {
    console.log(ensName);
    return ensName.toUpperCase();
  } else {
    console.log((address.slice(0, 6) + "...." + address.slice(address.length - 4, address.length)));
    return ((address.slice(0, 6) + "...." + address.slice(address.length - 4, address.length)));
  }
}

const Home: NextPage = () => {

  const { address, isConnected } = useAccount();

  console.log("XXXXXXXXXXXXXXXXXXXX");
  console.log(address);

  // Merkle Root

  const [mintError, setMintError] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);

  const [depositList, setDepositList] = useState<string[]>([]);

  const leaves = addresses.map(x => keccak256(x))
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
  const buf2hex = (x: Buffer) => '0x' + x.toString('hex')

  let leaf = "";
  let proof = [""];

  console.log("root")
  console.log(buf2hex(tree.getRoot()))

  if (address !== undefined) {
    leaf = keccak256(address as string) // address from wallet using walletconnect/metamask
    proof = tree.getProof(leaf).map(x => buf2hex(x.data))
  }

  console.log("proof")
  console.log(proof)
  console.log(address)

  // const contractWrite = usePrepareContractWrite({
  //   address: '0xdAb1d65D8C2Bba440B14d6dC40a16cd843c43e22', // Replace
  //   abi: importedABI,
  //   functionName: 'depositWhitelist',
  //   overrides: {
  //     value: ethers.utils.parseEther('0.169'),
  //   },
  //   // args: [proof],
  //   onSuccess(data) {
  //     console.log('Success', data)
  //   },
  // })

  const depositConfig = usePrepareContractWrite({
    address: '0x77a72edabdf29e76102e9f9280d5fb55a4c1d0ce',
    abi: importedABI,
    functionName: 'depositAllowlist',
    overrides: {
      value: ethers.utils.parseEther('0.169'),
    },
    args: [proof],
  });

  // @ts-ignore
  const mintNFT = useContractWrite(depositConfig.config);

  const handleMint = () => {
    try {
      // @ts-ignore
      mintNFT?.write();
    } catch (e) {
      console.log(e)
      setMintError("Unable to mint at this time");
    }
  };

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
    getNames();

    setTimeout(() => {
      setLoaded(true);
      console.log("true");
    }, 4500)
  }, []);

  return (
    <>
      {/* <button disabled={!write} onClick={() => write?.()}>
        Feed
      </button>
      <button disabled={!write} onClick={() => proof}>
        Merkle
      </button>
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )} */}
      {/* {contractRead?.data}
      {contractRead?.error} */}

      <div
        style={loaded ? { display: 'none' } : { display: '' }}
        className={styles.loading}>
        {/* <video id="loader" autoPlay muted height="60%" width="60%">
          <source src="/Loading.mp4" type="video/mp4"/>
       </video> */}
        <Image
          src={loading}
        />
      </div>
      <div
        style={loaded ? { display: '' } : { display: 'none' }}
        className={styles.container}>
        <Head>
          <title>Troublemkrs Mint</title>
          <meta
            name="description"
            content="A Place to Connect, a Space to Empower."
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        </Head>

        <main className={styles.main}>

          <div className={styles.headerflex}>

            <div className={styles.logo}>
              <Image
                height="68px"
                width="200px"
                src={logo}
              />
            </div>

            <div className={styles.connect}>
              <div style={{
                margin: "auto 20px"
              }}>

                <div style={{
                  width: "100px",
                  display: "flex"
                }}>
                  <div style={{
                    marginRight: "20px",
                    marginBottom: "auto"
                  }}>
                    <a href="https://discord.gg/TroubleMkrsNFT" target="_blank" rel="noopener noreferrer">
                      <svg width="36px" height="36px" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                        <g>
                          <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#ffffff" fill-rule="nonzero"></path>
                        </g>
                      </svg>
                    </a>
                  </div>

                  <a href="https://twitter.com/TroubleMkrsNFT" target="_blank" rel="noopener noreferrer">
                    <Image
                      width="39px"
                      height="32px"
                      src={twitter}
                    />
                  </a>
                </div>

              </div>
              <div style={{
                margin: "auto 0"
              }}><ConnectButton showBalance={false} /></div>

            </div>

          </div>

          {/* <button onClick={() => {
            getNames();
          }}>
            Names
          </button> */}

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
                {/* <div className={styles.left}>
                  GUARANTEED PRESALE IS:
                  <div className={styles.live}><div id="clock"></div></div>
                </div> */}
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
                  <h2>TROUBLEMAKERS<br />FOUNDERS CREW PASS</h2>
                  <p>Finally, it&apos;s officially time to join the Troublemakers! Come reserve your pass!</p>
                </div>
                <div className={styles.reservationPhasesHolder} id={styles.phase2}>
                  <div className={styles.reservationPhases}>
                    <div className={styles.reservationPhaseBox}>
                      <div className={styles.cornerLeft}><div className={styles.cornerLeftInner}></div></div>
                      <p className={styles.reservationHeader}>
                        <span className={styles.reservationPhase}>PHASE 1</span><span className={styles.reservationActive}></span>
                      </p>
                      <p className={styles.reservationDesc}>Guaranteed Mint</p>
                      <p className={styles.reservationEnd}>Complete<span id={styles.phase1End}><span id="clock1"></span></span></p>
                    </div>
                    <div className={styles.reservationPhaseBox}>
                      <div className={styles.cornerLeft}><div className={styles.cornerLeftInner}></div></div>
                      <div className={styles.cornerRight}><div className={styles.cornerRightInner}></div></div>
                      <p className={styles.reservationHeader}>
                        <span className={styles.reservationPhase}>PHASE 2</span><span className={styles.reservationActive}></span>
                      </p>
                      <p className={styles.reservationDesc}>FCFS Mint</p>
                      <p className={styles.reservationEnd}><span id={styles.phase1End}><span id="clock2"></span></span></p>
                    </div>
                    <div className={styles.reservationPhaseBox} id={styles.reservationActive}>
                      <div className={styles.cornerRight}><div className={styles.cornerRightInner}></div></div>
                      <p className={styles.reservationHeader}>
                        <span className={styles.reservationPhase}>PHASE 3</span><span className={styles.reservationActive}></span>
                      </p>
                      <p className={styles.reservationDesc}>Acceptance Mint</p>
                      <p className={styles.reservationEnd}>Not Started<span id={styles.phase1End}><span id="clock3"></span></span></p>
                    </div>
                  </div>
                  <div className={styles.reservationReserveBox}>
                    <p>Reserved Price: <span id={styles.reservedPrice}>0.169 ETH</span></p>
                    <button onClick={handleMint} className={styles.mintButton}>Reserve Pass</button>
                    <p style={{
                      paddingTop: "10px",
                      display: mintError == "" ? "none" : "",
                    }}>
                      {mintError}</p>
                  </div>
                </div>
              </div>

            </div>

          </h1>

          <div className={styles.reservationsContainerHolder}>
            <div id="tickerbar" className={styles.reservationsContainer}>
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
              <div className={styles.reservationBorder}>
                <div className={styles.reservePfp} id="pfp4">
                  <Image
                    width="48"
                    height="48"
                    src={pfp4}
                  />
                </div>
                <div id="item4" className={styles.reservationName}>Loading...</div>
              </div>

              {/* LOOP */}

              <div className={styles.reservationBorder}>
                <div className={styles.reservePfp} id="pfp1">
                  <Image
                    className={styles.reservePfp}
                    width="48"
                    height="48"
                    src={pfp1}
                  />
                </div>
                <div id="seconditem1" className={styles.reservationName}>Loading...</div>
              </div>
              <div className={styles.reservationBorder}>
                <div className={styles.reservePfp} id="pfp2">
                  <Image
                    width="48"
                    height="48"
                    src={pfp2}
                  />
                </div>
                <div id="seconditem2" className={styles.reservationName}>Loading...</div>
              </div>
              <div className={styles.reservationBorder}>
                <div className={styles.reservePfp} id="pfp3">
                  <Image
                    width="48"
                    height="48"
                    src={pfp3}
                  />
                </div>
                <div id="seconditem3" className={styles.reservationName}>Loading...</div>
              </div>
              <div className={styles.reservationBorder}>
                <div className={styles.reservePfp} id="pfp4">
                  <Image
                    width="48"
                    height="48"
                    src={pfp4}
                  />
                </div>
                <div id="seconditem4" className={styles.reservationName}>Loading...</div>
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
              Presale FAQ
            </h1>
            {/* <h2>
              FREQUENTLY ASKED QUESTIONS
            </h2> */}

            <div className={styles.faqContainerQuestions}>

              <div className={styles.faqContainerColumn}>
                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>What is the Troublemakers Founders Crew Pass?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff" /></g></svg></span></p>
                    <div className={styles.faqBody}>
                      The Troublemakers Founders Crew Pass is the key to the
                      <a href="https://twitter.com/TroubleMkrsNFT" target="_blank" rel="noopener noreferrer" style={{
                        color: "#ffcc00",
                      }}> @TroubleMkrsNFT</a> ecosystem and early access to our community.
                      Pass holders will benefit greatly from everything we drop now and in perpetuity, with bonus utility involving our upcoming PFP collection.
                    </div>
                  </div>
                </div>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>What is the cost of the presale?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff" /></g></svg></span></p>
                    <div className={styles.faqBody}>
                      The cost to reserve a Troublemakers Founders Crew Pass is at 0.169E each.
                    </div>
                  </div>
                </div>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>Why a presale instead of the standard minting process?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff" /></g></svg></span></p>
                    <div className={styles.faqBody}>
                      Based on various considerations, this is a better way than the traditional minting process, where everyone who reserved their Crew Pass will be airdropped simultaneously.
                    </div>
                  </div>
                </div>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>How does Phase 1, 2 and 3 work?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff" /></g></svg></span></p>
                    <div className={styles.faqBody}>
                      Phase 1 - All whitelisted (WL) members who are guaranteed to reserve their pass.<br />
                      Phase 2 - All members who are keen to reserve additional passes, first-come-first-serve (FCFS).<br />
                      Phase 3 - All accepted public applicants.<br />
                    </div>
                  </div>
                </div>

              </div>

              <div className={styles.faqContainerColumn}>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>Is there a Discord?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff" /></g></svg></span></p>
                    <div className={styles.faqBody}>
                      Yes, the Discord is closed strictly for handpicked members only, and will be opened up for new pass holders after the presale.
                    </div>
                  </div>
                </div>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>Who is eligible to reserve a Founders Crew Pass?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff" /></g></svg></span></p>
                    <div className={styles.faqBody}>
                      The initial handpicked 200 who were invited to the Troublemakers Discord are eligible to reserve 1 Founders Crew Pass.
                      Another 100 will go to applicants who got accepted in the (Public Thread TBA)
                    </div>
                  </div>
                </div>

                <div className={styles.faqQuestionCorner}>
                  <div className={styles.faqHeader}>
                    <p><span>What are some of the perks of holding a Founders Crew Pass?</span> <span><svg xmlns="http://www.w3.org/2000/svg" width="17.15" height="11.055" viewBox="0 0 17.15 11.055"><g id="layer1" transform="translate(-291.965 13.031) rotate(-90)"><path id="path9429" d="M3.276,291.965a1.22,1.22,0,0,0-.8,2.161l7.464,6.395-7.464,6.392a1.22,1.22,0,1,0,1.584,1.846l8.546-7.312a1.22,1.22,0,0,0,0-1.856l-8.546-7.319a1.219,1.219,0,0,0-.781-.308Z" transform="translate(0 0)" fill="#fff" /></g></svg></span></p>
                    <div className={styles.faqBody}>
                      As a Troublemakers Founders Crew Pass holder, you are guaranteed:<br />
                      <br />
                      ⦁ 2 x Free Troublemakers PFP (Airdrop)<br />
                      ⦁ WL Nomination for Troublemakers PFP<br />
                      ⦁ Top-tier NFT & Crypto Calls<br />
                      ⦁ Exclusive Educational Content & Community Events<br />
                      ⦁ Daily Market Updates (Everything you need in 1 post)<br />
                      ⦁ Daily Curated WL Raffles (Eg. Homa Games, MitsubishiNFT, Owange, etc)<br />
                      ⦁ Elite Networking Group (Connect with various founders, collab managers, etc)<br />
                      ⦁ Team/Job Opportunities<br />
                      <br />
                      For more information, please refer to the Troublemakers Discord.<br />
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
              fontFamily: "marvin",
              fontSize: "24px",
              margin: "auto",
              textAlign: "center",
              lineHeight: "2.3rem",
            }}>
              A place to <span style={{
                color: "#ffcc00",
                fontSize: "24px",
                fontFamily: "marvin",
              }}>connect</span><br />
              A space to <span style={{
                color: "#ffcc00",
                fontSize: "24px",
                fontFamily: "marvin",
              }}>empower</span>
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

countdown('Dec 17 2022 7:00:00 GMT-0800', 'clock2', 'Presale is LIVE');
faqResponsive();

export default Home;
