# ERC20 interface (ERC20.sol)

**↗ Extends: [ERC20Basic](ERC20Basic.md)**
**↘ Derived Contracts: [StandardToken](StandardToken.md)**.

**ERC20**

see https://github.com/ethereum/EIPs/issues/20

**Events**

```js
event Approval(address indexed owner, address indexed spender, uint256 value);
```

## Functions

- [allowance](#allowance)
- [transferFrom](#transferfrom)
- [approve](#approve)

### allowance

⤿ Overridden Implementation(s): [StandardToken.allowance](StandardToken.md#allowance)

```js
function allowance(address _owner, address _spender) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address |  | 
| _spender | address |  | 

### transferFrom

⤿ Overridden Implementation(s): [StandardToken.transferFrom](StandardToken.md#transferfrom)

```js
function transferFrom(address _from, address _to, uint256 _value) public
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _from | address |  | 
| _to | address |  | 
| _value | uint256 |  | 

### approve

⤿ Overridden Implementation(s): [StandardToken.approve](StandardToken.md#approve)

```js
function approve(address _spender, uint256 _value) public
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _spender | address |  | 
| _value | uint256 |  | 

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
