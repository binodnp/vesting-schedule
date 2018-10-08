# Vesting Schedule Base Contract (VestingScheduleBase.sol)

**↗ Extends: [CustomPausable](CustomPausable.md)**
**↘ Derived Contracts: [VestingSchedule](VestingSchedule.md)**.

**VestingScheduleBase**

Vesting Schedule indicates when, how much, and how frequently
founders, employees, and advisor can exercise their token allocations.
Vesting is determined for each individual.

## Structs
### Allocation

```js
struct Allocation {
  string memberName,
  uint256 startedOn,
  uint256 releaseOn,
  uint256 allocation,
  uint256 closingBalance,
  bool deleted,
  uint256 withdrawn,
  uint256 lastWithdrawnOn
}
```

## Contract Members
**Constants & Variables**

```js
//public members
uint256 public withdrawalCap;
uint256 public withdrawalFrequency;
uint256 public vestingStartedOn;
uint256 public minimumVestingPeriod;
uint256 public earliestWithdrawalDate;
uint256 public totalVested;
uint256 public totalWithdrawn;
contract ERC20 public vestingCoin;

//internal members
mapping(address => struct VestingScheduleBase.Allocation) internal allocations;
```

**Events**

```js
event Funded(address indexed _funder, uint256 _amount, uint256 _previousCap, uint256 _newCap);
event FundRemoved(address indexed _address, uint256 _amount, uint256 _remainingInPool);
event Withdrawn(address indexed _address, string _memberName, uint256 _amount);
event AllocationCreated(address indexed _address, string _memberName, uint256 _amount, uint256 _releaseOn);
event AllocationIncreased(address indexed _address, string _memberName, uint256 _amount, uint256 _additionalAmount);
event AllocationDecreased(address indexed _address, string _memberName, uint256 _amount, uint256 _lessAmount);
event AllocationDeleted(address indexed _address, string _memberName, uint256 _amount);
event ScheduleExtended(address indexed _address, string _memberName, uint256 _releaseOn, uint256 _newReleaseDate);
```

## Modifiers

- [afterEarliestWithdrawalDate](#afterearliestwithdrawaldate)

### afterEarliestWithdrawalDate

Signifies that the action is only possible 
after the earliest withdrawal date of the vesting contract.

```js
modifier afterEarliestWithdrawalDate() internal
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

⤿ Overridden Implementation(s): [VestingSchedule.createAllocation](VestingSchedule.md#createallocation)

```js
function createAllocation(address _address, string _memberName, uint256 _amount, uint256 _releaseOn) external
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 
| _memberName | string |  | 
| _amount | uint256 |  | 
| _releaseOn | uint256 |  | 

### deleteAllocation

⤿ Overridden Implementation(s): [VestingSchedule.deleteAllocation](VestingSchedule.md#deleteallocation)

```js
function deleteAllocation(address _address) external
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 

### increaseAllocation

⤿ Overridden Implementation(s): [VestingSchedule.increaseAllocation](VestingSchedule.md#increaseallocation)

```js
function increaseAllocation(address _address, uint256 _additionalAmount) external
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 
| _additionalAmount | uint256 |  | 

### decreaseAllocation

⤿ Overridden Implementation(s): [VestingSchedule.decreaseAllocation](VestingSchedule.md#decreaseallocation)

```js
function decreaseAllocation(address _address, uint256 _lessAmount) external
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 
| _lessAmount | uint256 |  | 

### extendAllocation

⤿ Overridden Implementation(s): [VestingSchedule.extendAllocation](VestingSchedule.md#extendallocation)

```js
function extendAllocation(address _address, uint256 _newReleaseDate) external
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 
| _newReleaseDate | uint256 |  | 

### withdraw

⤿ Overridden Implementation(s): [VestingSchedule.withdraw](VestingSchedule.md#withdraw)

```js
function withdraw(uint256 _amount) external
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 |  | 

### getAvailableFunds

The balance of this smart contract.

```js
function getAvailableFunds() public view
returns(uint256)
```

**Returns**

Returns the closing balance of vesting coin held by this contract.

### getAmountInVesting

The sum total amount in vesting allocations.

```js
function getAmountInVesting() public view
returns(uint256)
```

**Returns**

Returns the amount in vesting coin that must be held by this contract.

### getAllocation

The vesting schedule allocation of the specified address.

```js
function getAllocation(address _address) external view
returns(_startedOn uint256, _memberName string, _releaseOn uint256, _allocation uint256, _closingBalance uint256, _withdrawn uint256, _lastWithdrawnOn uint256, _deleted bool)
```

**Returns**

Returns the requested vesting schedule allocation.

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address | The address to get the vesting schedule allocation of. | 

### fund

⤿ Overridden Implementation(s): [VestingSchedule.fund](VestingSchedule.md#fund)

Override this function to receive the vesting coin in this contract.

```js
function fund() external
returns(bool)
```

**Returns**

Returns true if the action was successful.

### removeFunds

⤿ Overridden Implementation(s): [VestingSchedule.removeFunds](VestingSchedule.md#removefunds)

Override this function to remove the vesting coin from this contract.

```js
function removeFunds(uint256 _amount) external
returns(bool)
```

**Returns**

Returns true if the action was successful.

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
