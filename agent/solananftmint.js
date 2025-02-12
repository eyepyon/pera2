const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { 
  createGenericFile,
  createSignerFromKeypair,
  none,
  percentAmount,
  signerIdentity,
  some 
} = require('@metaplex-foundation/umi');
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { 
  createNft,
  mplTokenMetadata 
} = require('@metaplex-foundation/mpl-token-metadata');

class SolanaNftMinter {
  constructor(rpcEndpoint, wallet) {
    this.connection = new Connection(rpcEndpoint);
    this.wallet = wallet;
    
    // Umiインスタンスの作成
    this.umi = createUmi(rpcEndpoint)
      .use(mplTokenMetadata());
    
    // ウォレットの設定
    const signer = createSignerFromKeypair(this.umi, this.wallet);
    this.umi.use(signerIdentity(signer));
  }

  async mintNft(metadata) {
    try {
      // NFTメタデータの作成
      const uri = await this.uploadMetadata(metadata);

      // NFTの作成
      const nft = await createNft(this.umi, {
        name: metadata.name,
        symbol: metadata.symbol,
        uri: uri,
        sellerFeeBasisPoints: percentAmount(0),
        collection: none(),
        creators: some([{
          address: this.wallet.publicKey,
          verified: true,
          share: 100,
        }]),
      }).sendAndConfirm(this.umi);

      console.log('NFT created successfully!');
      console.log('Mint address:', nft.mintAddress.toString());
      
      return nft;

    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  async uploadMetadata(metadata) {
    // メタデータのJSONを作成
    const metadataJson = {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      image: metadata.imageUrl,
      attributes: metadata.attributes || [],
    };

    // ここでは例としてARウェーブにアップロードする想定
    // 実際のプロジェクトでは適切なストレージサービスを選択してください
    const uri = `https://arweave.net/${await this.uploadToArweave(metadataJson)}`;
    return uri;
  }

  async uploadToArweave(metadata) {
    // この部分は実際のプロジェクトで使用する
    // ストレージサービスに応じて実装してください
    throw new Error('Storage implementation required');
  }
}

// 使用例
async function main() {
  // ウォレットの設定（テスト用）
  const wallet = Keypair.generate();
  
  // NFTミンターのインスタンス作成
  const minter = new SolanaNftMinter(
    'https://api.devnet.solana.com', // テスト用にDevnetを使用
    wallet
  );

  // NFTのメタデータ
  const metadata = {
    name: "PeraPeLive NFT",
    symbol: "PeraPeLive",
    description: "PeraPeLive Completed on Solana",
    imageUrl: "https://perape.live/image/complete1.png",
    attributes: [
      {
        trait_type: "Background",
        value: "Blue"
      }
    ]
  };

  try {
    const nft = await minter.mintNft(metadata);
    console.log('NFT minted successfully!');
  } catch (error) {
    console.error('Failed to mint NFT:', error);
  }
}

// main().catch(console.error);

module.exports = SolanaNftMinter;
