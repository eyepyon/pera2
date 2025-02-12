// HTML
// <div id="walletStatus">Checking for Phantom wallet...</div>
// <button id="connectButton" style="display: none;">Connect Phantom Wallet</button>
// <div id="walletInfo" style="display: none;">
//   <p>Connected wallet: <span id="walletAddress"></span></p>
//   <button id="disconnectButton">Disconnect</button>
// </div>
// <form id="walletForm" style="display: none;">
//   <input type="text" id="walletInput" readonly>
//   <button type="submit">Submit Wallet Address</button>
// </form>

document.addEventListener('DOMContentLoaded', async () => {
    const connectButton = document.getElementById('connectButton');
    const disconnectButton = document.getElementById('disconnectButton');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddressElement = document.getElementById('walletAddress');
    const walletStatus = document.getElementById('walletStatus');
    const walletForm = document.getElementById('walletForm');
    const walletInput = document.getElementById('walletInput');

    // Phantomウォレットの存在確認と初期化を待つ
    const checkForPhantom = async () => {
        try {
            if (!window.solana || !window.solana.isPhantom) {
                walletStatus.textContent = 'Phantom wallet not found. Please install Phantom wallet.';
                const installLink = document.createElement('a');
                installLink.href = 'https://phantom.app/';
                installLink.target = '_blank';
                installLink.textContent = 'Install Phantom';
                walletStatus.appendChild(document.createElement('br'));
                walletStatus.appendChild(installLink);
                return false;
            }

            walletStatus.textContent = 'Phantom wallet detected!';
            connectButton.style.display = 'block';
            return true;
        } catch (error) {
            console.error('Error checking for Phantom wallet:', error);
            walletStatus.textContent = 'Error checking for Phantom wallet: ' + error.message;
            return false;
        }
    };

    // ウォレット接続
    const connectWallet = async () => {
        try {
            walletStatus.textContent = 'Connecting to Phantom wallet...';
            connectButton.disabled = true;

            const resp = await window.solana.connect();
            console.log('Connected to Phantom!', resp);

            const publicKey = resp.publicKey.toString();
            walletAddressElement.textContent = publicKey;
            walletInput.value = publicKey; // フォームにアドレスを設定

            walletInfo.style.display = 'block';
            walletForm.style.display = 'block'; // フォームを表示
            connectButton.style.display = 'none';
            walletStatus.textContent = 'Connected successfully!';

        } catch (error) {
            console.error('Connection error:', error);
            walletStatus.textContent = 'Connection error: ' + error.message;
            connectButton.disabled = false;
        }
    };

    // ウォレット切断
    const disconnectWallet = async () => {
        try {
            await window.solana.disconnect();
            walletInfo.style.display = 'none';
            walletForm.style.display = 'none'; // フォームを非表示
            connectButton.style.display = 'block';
            connectButton.disabled = false;
            walletInput.value = ''; // フォームの値をクリア
            walletStatus.textContent = 'Disconnected from wallet';
        } catch (error) {
            console.error('Disconnection error:', error);
            walletStatus.textContent = 'Disconnection error: ' + error.message;
        }
    };

    // フォームのサブミット処理
    walletForm.addEventListener('submit', (e) => {
        e.preventDefault(); // デフォルトのフォーム送信を防止
        const walletAddress = walletInput.value;
        console.log('Submitted wallet address:', walletAddress);
        // ここでウォレットアドレスを使用した処理を追加
        // 例: サーバーへの送信など
        //alert('Wallet address submitted: ' + walletAddress);
        const url = 'https://snir4gmnv2m0ru-7860.proxy.runpod.net/'
        window.open(url, '_blank')
    });

    // イベントリスナーの設定
    connectButton.addEventListener('click', connectWallet);
    disconnectButton.addEventListener('click', disconnectWallet);

    // Phantomウォレットのイベント監視
    if (await checkForPhantom()) {
        window.solana.on('connect', (publicKey) => {
            console.log('Wallet connected via event!', publicKey);
            const address = publicKey.toString();
            walletAddressElement.textContent = address;
            walletInput.value = address; // フォームにアドレスを設定
            walletInfo.style.display = 'block';
            walletForm.style.display = 'block'; // フォームを表示
            connectButton.style.display = 'none';
        });

        window.solana.on('disconnect', () => {
            console.log('Wallet disconnected via event!');
            walletInfo.style.display = 'none';
            walletForm.style.display = 'none'; // フォームを非表示
            connectButton.style.display = 'block';
            connectButton.disabled = false;
            walletInput.value = ''; // フォームの値をクリア
            walletStatus.textContent = 'Wallet disconnected';
        });
    }
});
