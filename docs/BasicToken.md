# Basic token (BasicToken.sol)

**contract BasicToken is [ERC20Basic](ERC20Basic.md)**

**BasicToken**

Basic version of StandardToken, with no allowances.

## Functions

- [totalSupply](#totalsupply)

- [transfer](#transfer)

- [balanceOf](#balanceof)

### totalSupply

Total number of tokens in existence

```js

function totalSupply() public

```

**Arguments**

| Name        | Type           | Description  |

| ------------- |------------- | -----|

### transfer

Transfer token for a specified address

```js

function transfer(address _to, uint256 _value) public

```

**Arguments**

| Name        | Type           | Description  |

| ------------- |------------- | -----|

| _to | address | The address to transfer to. | 

| _value | uint256 | The amount to be transferred. | 

### balanceOf

Gets the balance of the specified address.

```js

function balanceOf(address _owner) public

```

**Arguments**

| Name        | Type           | Description  |

| ------------- |------------- | -----|

| _owner | address | The address to query the the balance of. | 

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