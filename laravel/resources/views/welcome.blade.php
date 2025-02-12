<!DOCTYPE html>
<html>
<head>
    <title>PeraPelive Connection</title>
    <style>
        .button {
            padding: 10px 20px;
            margin: 10px 0;
            cursor: pointer;
        }
        #walletStatus {
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #ccc;
        }
        #walletForm {
            margin: 20px 0;
        }
        #walletInput {
            padding: 8px;
            width: 400px;
            margin-right: 10px;
        }
    </style>
</head>
<body>
<div id="walletStatus">Checking for Phantom wallet...</div>
<button id="connectButton" style="display: none;" class="button">Connect Phantom Wallet</button>
<div id="walletInfo" style="display: none;">
    <p>Connected wallet: <span id="walletAddress"></span></p>
    <button id="disconnectButton" class="button">Disconnect</button>
</div>
<form id="walletForm" style="display: none;" action="play.php" method="post">
    <input type="text" id="walletInput" name="address" readonly>
    <input type="submit" value="PeraPeLive Talk Start!!"/>
</form>

<script src="wallet.js"></script>
</body>
</html>
