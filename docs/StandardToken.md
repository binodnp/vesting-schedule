# Standard ERC20 token  * (StandardToken.sol)

**↗ Extends: [ERC20](ERC20.md), [BasicToken](BasicToken.md)**
**↘ Derived Contracts: [StandardTokenMock](StandardTokenMock.md)**.

**StandardToken**

Implementation of the basic standard token.
https://github.com/ethereum/EIPs/issues/20
Based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol

## Contract Members
**Constants & Variables**

```js
mapping(address => mapping(address => uint256)) internal allowed;
```

## Functions

- [transferFrom](#transferfrom)
- [approve](#approve)
- [allowance](#allowance)
- [increaseApproval](#increaseapproval)
- [decreaseApproval](#decreaseapproval)

### transferFrom

⤾ overrides [ERC20.transferFrom](ERC20.md#transferfrom)

Transfer tokens from one address to another

```js
function transferFrom(address _from, address _to, uint256 _value) public
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _from | address | address The address which you want to send tokens from | 
| _to | address | address The address which you want to transfer to | 
| _value | uint256 | uint256 the amount of tokens to be transferred | 

### approve

⤾ overrides [ERC20.approve](ERC20.md#approve)

Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
Beware that changing an allowance with this method brings the risk that someone may use both the old
and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

```js
function approve(address _spender, uint256 _value) public
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _spender | address | The address which will spend the funds. | 
| _value | uint256 | The amount of tokens to be spent. | 

### allowance

⤾ overrides [ERC20.allowance](ERC20.md#allowance)

Function to check the amount of tokens that an owner allowed to a spender.

```js
function allowance(address _owner, address _spender) public view
returns(uint256)
```

**Returns**

A uint256 specifying the amount of tokens still available for the spender.

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address | address The address which owns the funds. | 
| _spender | address | address The address which will spend the funds. | 

### increaseApproval

Increase the amount of tokens that an owner allowed to a spender.
approve should be called when allowed[_spender] == 0. To increment
allowed value is better to use this function to avoid 2 calls (and wait until
the first transaction is mined)
From MonolithDAO Token.sol

```js
function increaseApproval(address _spender, uint256 _addedValue) public
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _spender | address | The address which will spend the funds. | 
| _addedValue | uint256 | The amount of tokens to increase the allowance by. | 

### decreaseApproval

Decrease the amount of tokens that an owner allowed to a spender.
approve should be called when allowed[_spender] == 0. To decrement
allowed value is better to use this function to avoid 2 calls (and wait until
the first transaction is mined)
From MonolithDAO Token.sol

```js
function decreaseApproval(address _spender, uint256 _subtractedValue) public
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _spender | address | The address which will spend the funds. | 
| _subtractedValue | uint256 | The amount of tokens to decrease the allowance by. | 

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
