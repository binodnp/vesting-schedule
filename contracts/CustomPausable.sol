/*
Copyright 2018 Binod Nirvan

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */


 pragma solidity 0.4.24;


import "./CustomAdmin.sol";


///@title This contract enables you to create pausable mechanism to stop in case of emergency.
contract CustomPausable is CustomAdmin {
  event Pause();
  event Unpause();

  bool public paused = false;

  ///@notice Verifies whether the contract is not paused.
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  ///@notice Verifies whether the contract is paused.
  modifier whenPaused() {
    require(paused);
    _;
  }

  ///@notice Pauses the contract.
  function pause() external onlyAdmin whenNotPaused {
    paused = true;
    emit Pause();
  }

  ///@notice Unpauses the contract and returns to normal state.
  function unpause() external onlyAdmin whenPaused {
    paused = false;
    emit Unpause();
  }
}