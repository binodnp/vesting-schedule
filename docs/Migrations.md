﻿# Migrations.sol

**Migrations**

## Modifiers

- [restricted](#restricted)

### restricted

```js
modifier restricted () internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [setCompleted](#setcompleted)
- [upgrade](#upgrade)

### setCompleted

```js
function setCompleted(uint256 completed) public
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| completed | uint256 |  | 

### upgrade

```js
function upgrade(address new_address) public
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| new_address | address |  | 

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