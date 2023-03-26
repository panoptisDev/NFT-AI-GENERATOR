import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Result from '../components/Result';
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "../utils/interact.js";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imgs, setImgs] = useState();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [result, setResult] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("")
  const [status, setStatus] = useState("");
  const [wallet, setWallet] = useState("");
  const [minting, setMinting] = useState(false);
  const [selected, setSelected] = useState([]);
  const [minted, setMinted] = useState([]);

  const generateImage = async () => {
    if (prompt) {
      try {
        setLoading(true);
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt
          })
        })
        const data = await response.json();
        setImgs(data);
        setLoading(false);
      } catch (error) {
        console.log(error)
        setLoading(false);
      }
    }
  }
  const handleClick = (img, i) => {
    setImg(img);
    selected.some(element => {
      return element === img
    }) ? setSelected(selected.filter(e => {
      return e !== img
    })) : setSelected([...selected, img])
    setModal(true);
  }

  const handleUseEffect = async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
  }
  useEffect(() => {
    handleUseEffect()
    addWalletListener();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWalletAddress(walletResponse.address)
  };

  const onMintPressed = async () => {
    setMinting(true);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify(img),
    });

    console.log(response);
    const data = await response;
    const { status } = await mintNFT(
      `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
      name,
      description
    )
    setStatus(status);
    setMinting(false);
    setModal(false);
    setMinted([...minted, { img, name, description, status }])
    setResult(true);
  };

  const handleMintClick = () => {
    setModal(true);
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a
            target="_blank"
            href={`https://metamask.io/download.html`}
          >
            You must install Metamask, a virtual Ethereum wallet, in
            your browser.
          </a>
        </p>
      );
    }
  }
  return (
    <div className={styles.main}>
      <Head>
        <script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></script>
        <script
          nomodule
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
        ></script>
      </Head>
      {walletAddress.length > 0 ? (
        <div className={styles.wallet}>
          Connected: {String(walletAddress).substring(0, 6)}...
          {String(walletAddress).substring(38)}
        </div>
      ) : (
        <div className={styles.wallet} onClick={connectWalletPressed}>
          Connect Wallet
        </div>
      )}
      <h1 className={styles.title}>
        Mint NFTs em segundos com{" "}
        <span className={styles.Dalle}>DALL-E</span>
      </h1>
      <span className={styles.examples}>
        <img
          className={styles.example3}
          src="https://cdn.discordapp.com/attachments/666142372580556800/1076025257770631168/image.png"
        ></img>
        <img
          className={styles.example}
          src="https://cdn.discordapp.com/attachments/666142372580556800/1076019182002520094/image.png"
        ></img>
        <img
          className={styles.example1}
          src="https://cdn.discordapp.com/attachments/666142372580556800/1076021854193590312/image.png"
        ></img>
        <img
          className={styles.example2}
          src="https://cdn.discordapp.com/attachments/666142372580556800/1076022615489126401/image.png"
        ></img>
      </span>
      <div className={styles.field}>
        <input
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          className={styles.input}
          placeholder="An impressionist oil painting of an ape drinking a latte"
          required
        ></input>
        <div onClick={generateImage} className={styles.button}>
          GO
        </div>
      </div>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadimg}></div>
          <div className={styles.loadimg}></div>
          <div className={styles.loadimg}></div>
          <div className={styles.loadimg}></div>
          <div className={styles.loadimg}></div>
        </div>
      ) : null}
      {imgs && !loading ? (
        <div className={styles.imgs}>
          {imgs.map((img, i) => {
            return (
              <div
                key={i}
                className={styles.nftContainer}
                onClick={() => handleClick(img.url, i)}
              >
                <img
                  className={styles.nft}
                  src={`${img.url}`}
                ></img>
                {/*selected.some((element) => {
                                  return element === img.url;
                              }) ? (
                                  <ion-icon name="checkmark-circle-outline"></ion-icon>
                              ) : (
                                  <ion-icon name="ellipse-outline"></ion-icon>
                              )*/}
              </div>
            );
          })}
        </div>
      ) : null}
      {/*selected.length ? (
              <div onClick={handleMintClick} className={styles.mintNFT}>
                  Mint!
              </div>
          ) : null*/}
      {modal && selected.length ? (
        <Modal
          setModal={setModal}
          minting={minting}
          status={status}
          setStatus={setStatus}
          img={img}
          name={name}
          setName={setName}
          setDescription={setDescription}
          description={description}
          onMintPressed={onMintPressed}
        ></Modal>
      ) : null}
      {result ? (
        <Result setResult={setResult} status={status}></Result>
      ) : null}
      {minted.length ? <div className={styles.minted}>
        {minted.map(nft => {
          return (
            <div className={styles.mintedNFT}>
              <img src={nft.img} className={styles.image}></img>
              <h4 className={styles.name}>{nft.name}</h4>
              <p className={styles.description}>{nft.description}</p>
              <a className={styles.link} href={nft.status} target="_blank">
                <ion-icon name="link-outline"></ion-icon>
              </a>
            </div>
          );
        })}
      </div> : null}
    </div>
  );
}