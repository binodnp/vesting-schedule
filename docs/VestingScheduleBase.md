# Vesting Schedule Base Contract (VestingScheduleBase.sol)

**contract VestingScheduleBase is [CustomPausable](CustomPausable.md)**

**VestingScheduleBase**

Vesting Schedule indicates when, how much, and how frequently
founders, employees, and advisor can exercise their token allocations.
Vesting is determined for each individual.

## Modifiers

- [afterEarliestWithdrawalDate](#afterearliestwithdrawaldate)

### afterEarliestWithdrawalDate

Signifies that the action is only possible 
after the earliest withdrawal date of the vesting contract.

```js
modifier afterEarliestWithdrawalDate () internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [createAllocation](#createallocation)
- [deleteAllocation](#deleteallocation)
- [increaseAllocation](#increaseallocation)
- [decreaseAllocation](#decreaseallocation)
- [extendAllocation](#extendallocation)
- [withdraw](#withdraw)
- [getAvailableFunds](#getavailablefunds)
- [getAmountInVesting](#getamountinvesting)
- [getAllocation](#getallocation)
- [fund](#fund)
- [removeFunds](#removefunds)

### createAllocation

```js
function createAllocation(address _address, string _memberName, uint256 _amount, uint256 _releaseOn) external
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 
| _memberName | string |  | 
| _amount | uint256 |  | 
| _releaseOn | uint256 |  | 

### deleteAllocation

```js
function deleteAllocation(address _address) external
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 

### increaseAllocation

```js
function increaseAllocation(address _address, uint256 _additionalAmount) external
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 
| _additionalAmount | uint256 |  | 

### decreaseAllocation

```js
function decreaseAllocation(address _address, uint256 _lessAmount) external
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 
| _lessAmount | uint256 |  | 

### extendAllocation

```js
function extendAllocation(address _address, uint256 _newReleaseDate) external
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 
| _newReleaseDate | uint256 |  | 

### withdraw

```js
function withdraw(uint256 _amount) external
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 |  | 

### getAvailableFunds

The balance of this smart contract.

```js
function getAvailableFunds() public
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getAmountInVesting

The sum total amount in vesting allocations.

```js
function getAmountInVesting() public
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getAllocation

The vesting schedule allocation of the specified address.

```js
function getAllocation(address _address) external
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address | The address to get the vesting schedule allocation of. | 

### fund

Override this function to receive the vesting coin in this contract.

```js
function fund() external
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### removeFunds

Override this function to remove the vesting coin from this contract.

```js
function removeFunds(uint256 _amount) external
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 |  | 

## Contracts

- [ERC20Basic](ERC20Basic.md)
- [VestingSchedule](VestingSchedule.md)
- [SafeMath](SafeMath.md)
- [BasicToken](BasicToken.md)
- [StandardToken](StandardToken.md)
- [CustomPausable](CustomPausable.md)
- [VestingScheduleBase](VestingScheduleBase.md)
- [CustomAdmin](CustomAdmin.md)
- [Migrations](Migrations.md)
- [StandardTokenMock](StandardTokenMock.md)
- [FrequencyHelper](FrequencyHelper.md)
- [Ownable](Ownable.md)
- [ERC20](ERC20.md)