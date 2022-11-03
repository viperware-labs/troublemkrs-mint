import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
//import './App.css';


const truncate = (input, len) =>
    input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 15px;
  border-radius: 18px;
  border: none;
  background-color: white;
  padding: 15px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: white;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: black;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 50%;
  @media (min-width: 700px) {
    width: 350px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const LogoButtonImg = styled.img`

  margin: 30px;
  width: 48px;
  height: 48px;

`;

export const DownImg = styled.img`

  margin: 20px;
  width: 60px;
  height: 60px;
  @media (max-width: 500px) {
    visibility:hidden;
  }

`;

export const GalleryItem = styled.div`
    max-width: 100%;
    border-radius: 20px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.5);
    transition: all .3s;
    &:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.8);
    }
    img {
    width: 100%;
    object-fit: cover;
    }
`;

export const StyledImg = styled.img`

  border-radius: 50px;
  border: 5px #000000 solid;
  
  width: 250px;
  @media (min-width: 900px) {
    width: 85%;
  }
  @media (min-width: 1440px) {
    width: 470px;
  }
`;

export const StyledTeamImg = styled.img`

  border-radius: 8px;
  border: 6px #ffffff solid;
  width: 200px;
  @media (min-width: 900px) {
    width: 350px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
`;

export const StyledHeader = styled.img`
  width: 45vw;
`;

export const StyledLink = styled.a`
  color: var(--primary-text);
  text-decoration: none;
`;

export const FooterLink = styled.a`
  text-decoration: none;
`;

export const FooterLogo = styled.img`
  width: 100px;
`;



function App() {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);

    // Merkle
    const addresses = ["0x9d3F56186CE4bA86214AE9127e07491f2449D698", "0xC07183E35c6139CE334Dd89eeE736A8366221E20", "0xd6e67ce446dC04dcF3F3556B8150F370D4c52A62",
    "0xB4983B3aB0903c85D546BEa30A6c3d45675442F4", "0xD420a5e4b1Aa810441f03959C15798D30A213065", "0xDe54227dC7cb1dE999979f21548096D92B64827f"]

    const leaves = addresses.map(x => keccak256(x))
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
    const buf2hex = x => '0x' + x.toString('hex')

    console.log(buf2hex(tree.getRoot()))

    const leaf = keccak256(blockchain.account) // address from wallet using walletconnect/metamask
    const proof = tree.getProof(leaf).map(x => buf2hex(x.data))

    // Game Data
    //const [amountTokens, setTokens] = useState(0);
    //const [myTokens, setListTokens] = useState([]);

    const [invalidMint, setInvalidMint] = useState("");

    // Contract Data
    const data = useSelector((state) => state.data);
    const [claimingNft, setClaimingNft] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [mintAmount, setMintAmount] = useState(1);
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        SCAN_LINK: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },
        NFT_NAME: "",
        SYMBOL: "",
        MAX_SUPPLY: 1,
        PUBLIC_WEI_COST: 0,
        WL_WEI_COST: 0,
        DISPLAY_COST: 0,
        GAS_LIMIT: 0,
        MARKETPLACE: "",
        MARKETPLACE_LINK: "",
        SHOW_BACKGROUND: false,
    });

    const claimNFTs = async () => {
        setInvalidMint("");

        let cost = CONFIG.PUBLIC_WEI_COST;
        let totalCostWei = String(cost * mintAmount);

        blockchain.smartContract.methods
            .depositPublic()
            .send({
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: totalCostWei,
            });

    };

    const claimWhitelistNFTs = async () => {
        setInvalidMint("");

        let cost = CONFIG.WL_WEI_COST;
        let totalCostWei = String(cost * mintAmount);

        if (mintAmount > 2) {

            setInvalidMint("Error: You can only mint 2 NFTs from whitelist");

        } else {

            blockchain.smartContract.methods
            .depositAllowlist(proof)
            .send({
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: totalCostWei,
            });

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
        if (newMintAmount > 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    };

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    const getConfig = async () => {
        const configResponse = await fetch("/config/config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    useEffect(() => {
        getConfig();
    }, []);

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    //You have minted {data.mintedCount(blockchain.account)}            Ξ


    return (
        <s.Screen>
            <s.Container
                flex={1}
                ai={"center"}

                //image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}


            >
                
                <s.SpacerLarge/>
                <s.SpacerLarge/>
                <s.SpacerLarge/>
                <s.SpacerLarge/>
                <s.SpacerLarge/>


                <s.Container jc={"center"} ai={"left"} style={{ width: "90%" }}>
                    
                    <s.TextDescription

                        style={{
                            textAlign: "center",
                            color: "#024d1e",
                            fontFamily: "customfont",
                            fontSize: "30px",
                            fontWeight: "900",

                        }}

                    >

                        Troublemkrs<br />

                    </s.TextDescription>

                    <s.SpacerLarge/>

                        <StyledImg style={{
                            margin: "auto",
                        }}
                        src="/config/images/trbl.png"/>

                    <s.SpacerLarge/>


                    <s.TextDescription

                            style={{
                                textAlign: "center",
                                color: "white",
                                fontWeight: "normal",
                                fontFamily: "customfont",
                                fontSize: "24px",
                            }}
                        >   
                            <br/>
                            {blockchain.account === "" ||
                                        blockchain.smartContract === null ? (
                                        <s.Container ai={"center"} jc={"center"}>
                                            <s.SpacerLarge />
                                            <StyledButton
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    dispatch(connect());
                                                    getData();
                                                }}
                                                style={{
                                                    textAlign: "center",
                                                    color: "#024d1e",
                                                    fontSize: "20px",
                                                    fontFamily: "customfont",
                                                    fontWeight: "700",
                                                }}
                                            > Connect
                                                <br />



                                            </StyledButton>
                                            
                                            {blockchain.errorMsg !== "" ? (
                                                <>
                                                    <s.SpacerSmall />
                                                    <s.TextDescription

                                                        style={{
                                                            textAlign: "center",
                                                            color: "#024d1e",
                                                            fontFamily: "customfont",
                                                        }}
                                                    >
                                                        {blockchain.errorMsg}
                                                    </s.TextDescription>
                                                </>
                                            ) : null}
                                        </s.Container>
                                    ) : (
                                        <>
                                            <s.TextDescription

                                                style={{
                                                    textAlign: "center",
                                                    color: "#024d1e",
                                                    fontSize: "22px",
                                                    fontFamily: "customfont",
                                                    fontWeight: "700",
                                                }}
                                            >
                                                Remaining Supply: {(data.totalSupply ? (CONFIG.MAX_SUPPLY - data.totalSupply) : CONFIG.MAX_SUPPLY)}/{CONFIG.MAX_SUPPLY}<br/>
                                            </s.TextDescription>
                                            <s.SpacerMedium />
                                            <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                                <StyledRoundButton
                                                    disabled={claimingNft ? 1 : 0}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        decrementMintAmount();
                                                    }}
                                                    style={{
                                                        textAlign: "center",
                                                        fontSize: "20px",
                                                        color: "black",
                                                        color: "#024d1e",
                                                        fontFamily: "customfont",
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    -
                                                </StyledRoundButton>
                                                <s.SpacerMedium />
                                                <s.TextDescription

                                                    style={{
                                                        textAlign: "center",
                                                        color: "#024d1e",
                                                        fontSize: "20px",
                                                        fontFamily: "customfont",
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    {mintAmount}
                                                </s.TextDescription>
                                                <s.SpacerMedium />
                                                <StyledRoundButton
                                                    disabled={claimingNft ? 1 : 0}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        incrementMintAmount();
                                                    }}
                                                    style={{
                                                        textAlign: "center",
                                                        color: "#024d1e",
                                                        fontSize: "20px",
                                                        fontFamily: "customfont",
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    +
                                                </StyledRoundButton>
                                            </s.Container>

                                            <s.TextDescription

                                                style={{
                                                    textAlign: "center",
                                                    color: "#024d1e",
                                                    fontFamily: "customfont",
                                                }}
                                            >
                                                {feedback}
                                            </s.TextDescription>

                                            <s.SpacerMedium />

                                            <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                                <StyledButton
                                                    disabled={claimingNft ? 1 : 0}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        claimNFTs();
                                                        getData();
                                                    }}
                                                    style={{
                                                        textAlign: "center",
                                                        color: "#024d1e",
                                                        fontSize: "20px",
                                                        fontFamily: "customfont",
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    {claimingNft ? "PROCESSING" : "PUBLIC DEPOSIT"}
                                                </StyledButton>
                                            </s.Container>

                                            <s.SpacerMedium />

                                            <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                                <StyledButton
                                                    disabled={claimingNft ? 1 : 0}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        claimWhitelistNFTs();
                                                        getData();
                                                    }}
                                                    style={{
                                                        textAlign: "center",
                                                        color: "#024d1e",
                                                        fontSize: "20px",
                                                        fontFamily: "customfont",
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    {claimingNft ? "PROCESSING" : "WHITELIST DEPOSIT"}
                                                </StyledButton>
                                            </s.Container>

                                            <s.SpacerMedium />

                                        </>
                                    )}

                                    <s.SpacerLarge />
                                    <s.SpacerLarge />
                                    <s.SpacerLarge />
                                    <s.SpacerLarge />
                                    <s.SpacerLarge />


                            {/* <DownImg src="/config/images/down.png" /> */}
                        </s.TextDescription>
                    <s.Container>
                    </s.Container>
                    {/* <div class="container">
                    <s.TextDescription
                            style={{
                                textAlign: "center",
                                color: "white",
                                fontWeight: "bold",
                                fontFamily: "customfont",
                                fontSize: "32px"
                            }}
                        >
                                Recent Works
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <div class="gallery" style="visibility: hidden">
                        <a href="https://boredapeyachtclub.com" target="_blank" class="gallery-link">
                            <GalleryItem href="https://boredapeyachtclub.com" class="view overlay hm-black-light">
                                <img src="/config/images/BAYC.png" alt="Placeholder Image" class="img-fluid gallery-item"/>
                                <s.TextDescription
                                style={{
                                    textAlign: "center",
                                    color: "white",
                                    fontWeight: "normal",
                                    fontFamily: "customfont",
                                    fontSize: "24px",
                                    padding: "0px 0px 30px 0px"
                                }}
                                >
                                        Bored Ape Yacht Club
                                </s.TextDescription>  
                            </GalleryItem>
                        </a>
                        <a href="https://boredapeyachtclub.com" target="_blank" class="gallery-link">
                        <GalleryItem href="https://boredapeyachtclub.com" class="view overlay hm-black-light">
                            <img src="/config/images/NoNecks.png" alt="Placeholder Image" class="img-fluid gallery-item"/>
                            <s.TextDescription
                            style={{
                                textAlign: "center",
                                color: "white",
                                fontWeight: "normal",
                                fontFamily: "customfont",
                                fontSize: "24px",
                                padding: "0px 0px 30px 0px"
                            }}
                            >
                                   No Necks
                            </s.TextDescription>  
                        </GalleryItem>
                        </a>
                        <a href="https://boredapeyachtclub.com" target="_blank" class="gallery-link">
                        <GalleryItem href="https://boredapeyachtclub.com" class="view overlay hm-black-light">
                            <img src="/config/images/CoolCats.png" alt="Placeholder Image" class="img-fluid gallery-item"/>
                            <s.TextDescription
                            style={{
                                textAlign: "center",
                                color: "white",
                                fontWeight: "normal",
                                fontFamily: "customfont",
                                fontSize: "24px",
                                padding: "0px 0px 30px 0px"
                            }}
                            >
                                    Cool Cats
                            </s.TextDescription>  
                        </GalleryItem>
                        </a>
                        <a href="https://boredapeyachtclub.com" target="_blank" class="gallery-link">
                        <GalleryItem href="https://boredapeyachtclub.com" class="view overlay hm-black-light">
                            <img src="/config/images/Mosaicbirds.png" alt="Placeholder Image" class="img-fluid gallery-item"/>
                            <s.TextDescription
                            style={{
                                textAlign: "center",
                                color: "white",
                                fontWeight: "normal",
                                fontFamily: "customfont",
                                fontSize: "24px",
                                padding: "0px 0px 30px 0px"
                            }}
                            >
                                    Mosaicbirds
                            </s.TextDescription>  
                        </GalleryItem>
                        </a>
                        <a href="https://boredapeyachtclub.com" target="_blank" class="gallery-link">
                        <GalleryItem href="https://boredapeyachtclub.com" class="view overlay hm-black-light">
                            <img src="/config/images/Doodles.png" alt="Placeholder Image" class="img-fluid gallery-item"/>
                            <s.TextDescription
                            style={{
                                textAlign: "center",
                                color: "white",
                                fontWeight: "normal",
                                fontFamily: "customfont",
                                fontSize: "24px",
                                padding: "0px 0px 30px 0px"
                            }}
                            >
                                    Doodles
                            </s.TextDescription>  
                        </GalleryItem>
                        </a>
                        <a href="https://boredapeyachtclub.com" target="_blank" class="gallery-link">
                        <GalleryItem href="https://boredapeyachtclub.com" class="view overlay hm-black-light">
                            <img src="/config/images/Moonbirds.png" alt="Placeholder Image" class="img-fluid gallery-item"/>
                            <s.TextDescription
                            style={{
                                textAlign: "center",
                                color: "white",
                                fontWeight: "normal",
                                fontFamily: "customfont",
                                fontSize: "24px",
                                padding: "0px 0px 30px 0px"
                            }}
                            >
                                    Moonbirds
                            </s.TextDescription>  
                        </GalleryItem>
                        </a>
                    </div>
                    </div> */}

                </s.Container>
                <s.SpacerMedium />
            </s.Container >
        </s.Screen >
    );
}

export default App;

//[0xb7b19092bad498eae34230a9e14c8ce3d9d85b2bb91212108c9d47d1948acfeb,0x1f957db768cd7253fad82a8a30755840d536fb0ffca7c5c73fe9d815b1bc2f2f,0x924862b314bd38813a325167aca7caee16318f07303bd8e9f81bbe5808575fbf,0xe5076a139576746fd34a0fd9c21222dc274a909421fcbaa332a5af7272b6dcb1,0x148c730f8169681c1ebfb5626eb20af3d2351445463a1fdc5d0b116c62dc58c8,0x5712507eeb3d7b48e5876f21fc871656c2379464b480c8e89c50c2a1e8f58ac5]