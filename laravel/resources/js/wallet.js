// HTML
// <button id="connectButton">Connect Phantom Wallet</button>
// <div id="walletInfo" style="display: none;">
//   <p>Connected wallet: <span id="walletAddress"></span></p>
//   <button id="disconnectButton">Disconnect</button>
// </div>

// JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const connectButton = document.getElementById('connectButton');
  const disconnectButton = document.getElementById('disconnectButton');
  const walletInfo = document.getElementById('walletInfo');
  const walletAddressElement = document.getElementById('walletAddress');

  // Phantomウォレットのプロバイダーを取得
  const getProvider = () => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        return provider;
      }
    }

    window.open('https://phantom.app/', '_blank');
    return null;
  };

  // ウォレット接続
  const connectWallet = async () => {
    try {
      const provider = getProvider();
      if (!provider) return;

      const response = await provider.connect();
      const publicKey = response.publicKey.toString();
      
      // UI更新
      walletAddressElement.textContent = publicKey;
      connectButton.style.display = 'none';
      walletInfo.style.display = 'block';
      
      console.log('Connected with:', publicKey);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  // ウォレット切断
  const disconnectWallet = async () => {
    try {
      const provider = getProvider();
      if (!provider) return;

      await provider.disconnect();
      
      // UI更新
      connectButton.style.display = 'block';
      walletInfo.style.display = 'none';
      walletAddressElement.textContent = '';
      
      console.log('Disconnected from wallet');
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  };

  // イベントリスナーの設定
  connectButton.addEventListener('click', connectWallet);
  disconnectButton.addEventListener('click', disconnectWallet);

  // Phantomウォレットのイベント監視
  const provider = getProvider();
  if (provider) {
    provider.on('connect', (publicKey) => {
      walletAddressElement.textContent = publicKey.toString();
      connectButton.style.display = 'none';
      walletInfo.style.display = 'block';
    });

    provider.on('disconnect', () => {
      connectButton.style.display = 'block';
      walletInfo.style.display = 'none';
      walletAddressElement.textContent = '';
    });
  }
});
