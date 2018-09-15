pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract StandardTokenMock is StandardToken {
  constructor(address _owner, uint256 _tokens) public {
    balances[_owner] = _tokens;
  }
}