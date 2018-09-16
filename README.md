# Vesting Schedule
An easy to use ERC20 vesting schedule for founders, employees, and advisors.

## How to Install?

### Install Truffle Tools

https://truffleframework.com

### Clone the Repository

```sh
https://github.com/binodnp/vesting-schedule
```

### Install Packages

```sh
npm install
```

Running Tests

Start Local RPC Client

```sh
ganache-cli --acounts 15
```

Run Tests

```sh
truffle test
```

[Documentation](docs/VestingSchedule.md)

---

## Types & Enumerators

### Allocation Struct

```js
///@notice Token allocation structure for vesting schedule.
struct Allocation {
    string  memberName;
    uint256 startedOn;
    uint256 releaseOn;
    uint256 allocation;
    uint256 closingBalance;
    bool deleted;
    uint256 withdrawn;
    uint256 lastWithdrawnOn;
}
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| memberName | string | The full name of the beneficiary. |
| startedOn | uint256 | The timestamp of the allocation start. |
| releaseOn | uint256 | The timestamp on which the first withdrawal becomes avaiable.  |
| allocation | uint256 | The total amount allocated to this member.  |
| closingBalance | uint256 | The remaining balance of the vesting schedule allocation. |
| deleted | bool | Indicates that the vesting schedule allocation was deleted.   |
| withdrawn | uint256 | The total amount withdrawn from the allocation.  |
| lastWithdrawnOn | uint256 |  The timestamp of the latest withdrawal.  |

### Withdrawal Frequency Enum

The supported withdrawal frequencies are:

- Daily (1 day)
- Weekly (7 days)
- Half Monthly (15 days)
- Monthly (30 days)
- Quarterly (91 days)
- Half Yearly (182 days)


## Features

### Funding (ERC20 Vesting Token)

**fund**

Enables this vesting schedule contract to receive the ERC20 (vesting coin) token. Please note that this action can only be performed by an administrator.

Before calling this function, please `approve` your desired amount of the coin for this smart contract address to `transferFrom`.

```js
function fund() external onlyAdmin returns(bool)
```

**removeFunds**

Allows you to withdraw the surplus balance of the vesting coin from this contract. Please note that this action is restricted to administrators only and you may only withdraw amounts above the sum total allocation balances. In other words, you cannot withdraw the token amount held by this contract on behalf of the beneficiaries.

```js
function removeFunds(uint256 _amount) external onlyAdmin returns(bool)
```


| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | The amount desired to withdraw. |


----

### Allocations

**createAllocation**

Creates a vesting schedule allocation for a new beneficiary. A beneficiary could mean founders, employees,or advisors. Please note that this action can only be performed by an administrator.


```js
function createAllocation(address _address, string _memberName, uint256 _amount, uint256 _releaseOn) external onlyAdmin returns(bool)
```


| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address | The address which will receive the tokens in the future date. |
| _memberName | string | The name of the candidate for which this vesting schedule allocation is being created for. |
| _amount | uint256 | The total amount of tokens being vested over the period of vesting duration. |
| _releaseOn | uint256 | The date on which the first schedule becomes available for withdrawal. |

**deleteAllocation**

Deletes the specified vesting schedule allocation. Please note that this action can only be performed by an administrator.

```js
function deleteAllocation(address _address) external onlyAdmin returns(bool)
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address | The address of the beneficiary whose allocation is being requested to be deleted. |


**increaseAllocation**

Increases the total allocation of the specified vesting schedule. Please note that this action can only be performed by an administrator.

```js
function increaseAllocation(address _address, uint256 _additionalAmount) external onlyAdmin returns(bool)
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address | The address of the beneficiary whose allocation is being requested to be increased. |
| _additionalAmount | uint256 | The additional amount in vesting coin to be addeded to the existing allocation |


**decreaseAllocation**

Decreases the total allocation of the specified vesting schedule. Please note that this action can only be performed by an administrator.

```js
function decreaseAllocation(address _address, uint256 _lessAmount) external onlyAdmin returns(bool)
```


| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address | The address of the beneficiary whose allocation is being requested to be decreased. |
| _lessAmount | uint256 | The amount in vesting coin to be decreased from the existing allocation. |


**extendAllocation**

Extends the release date of the specified vesting schedule allocation. Please note that this action can only be performed by an administrator.

```js
function extendAllocation(address _address, uint256 _newReleaseDate) external onlyAdmin returns(bool)
```


| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address | The address of the beneficiary who allocation is being requested to be extended. |
| _newReleaseDate | uint256 | A new release date to extend the allocation to. |


### Withdrawals

**withdraw**

This action enables the beneficiaries (founders, employees, consultants, or advisors) to withdraw a desired amount from this contract. Please note that withdrawals cannot be performed when the contract is paused.


```js
function withdraw(uint256 _amount) external canWithdraw(_amount) afterEarliestWithdrawalDate whenNotPaused returns(bool)
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | The amount desired to be withdrawn by the caller. |


