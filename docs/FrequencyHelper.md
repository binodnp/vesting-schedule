# FrequencyHelper.sol

**↘ Derived Contracts: [VestingSchedule](VestingSchedule.md)**.

**FrequencyHelper**

## Enums
### Frequency

```js
enum Frequency {
 Daily,
 Weekly,
 HalfMonthly,
 Monthly,
 Quarterly,
 HalfYearly,
 Yearly
}
```

## Functions

- [convertFrequency](#convertfrequency)

### convertFrequency

```js
function convertFrequency(enum FrequencyHelper.Frequency _frequency) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _frequency | enum FrequencyHelper.Frequency |  | 

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
