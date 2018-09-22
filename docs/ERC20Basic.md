# ERC20Basic (ERC20Basic.sol)

**ERC20Basic**

Simpler version of ERC20 interface
See https://github.com/ethereum/EIPs/issues/179

**Events**

```js
event Transfer(address indexed from, address indexed to, uint256 value);
```

## Functions

- [totalSupply](#totalsupply)
- [balanceOf](#balanceof)
- [transfer](#transfer)

### totalSupply

```js
function totalSupply() public view
returns(uint256)
```

### balanceOf

```js
function balanceOf(address _who) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _who | address |  | 

### transfer

```js
function transfer(address _to, uint256 _value) public
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address |  | 
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
