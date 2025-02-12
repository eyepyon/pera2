const { Connection, Keypair } = require('@solana/web3.js');
const { AgentProgram } = require('solana-agent-program');

class NFTMinter {
  constructor(connection, payer) {
    this.connection = connection;
    this.payer = payer;
    this.program = new AgentProgram(connection, payer);
  }

  async mintNFT(metadata) {
    try {
      // Create mint account
      const mintKeypair = Keypair.generate();
      
      // Initialize NFT mint
      const tx = await this.program.methods
        .initializeNFT({
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
        })
        .accounts({
          mint: mintKeypair.publicKey,
          payer: this.payer.publicKey,
        })
        .signers([this.payer, mintKeypair])
        .rpc();

      console.log('NFT minted successfully!');
      console.log('Transaction signature:', tx);
      console.log('Mint address:', mintKeypair.publicKey.toString());

      return {
        tx,
        mintAddress: mintKeypair.publicKey
      };

    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }
}

// 使用例
async function main() {
  // 接続設定
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // テスト用のウォレット生成（実際の使用時は既存のウォレットを使用）
  const payer = Keypair.generate();

  const minter = new NFTMinter(connection, payer);

  const metadata = {
    name: "PeraPeLive NFT",
    symbol: "MNFT",
    uri: "https://perape.live/metadata.json"
  };

  try {
    const result = await minter.mintNFT(metadata);
    console.log('Minting successful:', result);
  } catch (error) {
    console.error('Minting failed:', error);
  }
}

// export the minter class
module.exports = NFTMinter;
