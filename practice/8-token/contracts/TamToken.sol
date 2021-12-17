// contracts/TamToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TamToken is ERC20 {
  constructor() ERC20("Tamtamchik Token", "TAMT") {
    _mint(msg.sender, 100000*10**18);
  }
}
