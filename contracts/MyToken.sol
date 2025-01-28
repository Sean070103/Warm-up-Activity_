// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable(msg.sender) {
    uint256 public mintPrice = 0.01 ether;

    constructor() ERC20("MyToken", "MTK") {
        // Initial supply is set to zero; mint through mint function
    }

    // Public mint function
    function mint(uint256 amount) external payable {
        require(msg.value == mintPrice * amount, "Incorrect payment amount");

        _mint(msg.sender, amount);
    }

    // Set mint price (only owner can change it)
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    // Withdraw funds (only owner can withdraw)
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Fallback function to accept ether
    receive() external payable {}

    fallback() external payable {}
}
