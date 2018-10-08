# This contract enables you to create pausable mechanism to stop in case of emergency. (CustomPausable.sol)

**↗ Extends: [CustomAdmin](CustomAdmin.md)**
**↘ Derived Contracts: [VestingScheduleBase](VestingScheduleBase.md)**.

**CustomPausable**

## Contract Members
**Constants & Variables**

```js
bool public paused;
```

**Events**

```js
event Pause();
event Unpause();
```

## Modifiers

- [whenNotPaused](#whennotpaused)
- [whenPaused](#whenpaused)

### whenNotPaused

Verifies whether the contract is not paused.

```js
modifier whenNotPaused() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### whenPaused

Verifies whether the contract is paused.

```js
modifier whenPaused() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [pause](#pause)
- [unpause](#unpause)

### pause

Pauses the contract.

```js
function pause() external onlyAdmin whenNotPaused
```

### unpause

Unpauses the contract and returns to normal state.

```js
function unpause() external onlyAdmin whenPaused
```

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
