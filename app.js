// Select the button and status div
const connectButton = document.getElementById("connectButton");
const statusDiv = document.getElementById("status");

// Function to connect to MetaMask
const connectToMetaMask = async () => {
  // Check if MetaMask is installed
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      // Get the current chain ID
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      // Update the UI with account and chain info
      statusDiv.innerHTML = `
        <p>Connected chain: ${chainId}</p>
        <p>Connected account: ${account}</p>
      `;
    } catch (error) {
      // Handle errors (e.g., user rejected the request)
      console.error("Error connecting to MetaMask:", error);
      statusDiv.textContent = "Error connecting to MetaMask. Please try again.";
    }
  } else {
    // MetaMask is not installed
    statusDiv.textContent =
      "MetaMask is not installed. Please install it from https://metamask.io.";
  }
};

// Add an event listener to the button
connectButton.addEventListener("click", connectToMetaMask);
