pragma solidity ^0.4.24;

contract FrequencyHelper {
    enum Frequency {
        Daily,
        Weekly,
        HalfMonthly,
        Monthly,
        Quarterly,
        HalfYearly,
        Yearly
    }

    function convertFrequency(Frequency _frequency) internal pure returns(uint256) {
        if(_frequency == Frequency.Daily) {
            return 1 days;
        }
        
        if(_frequency == Frequency.Weekly) {
            return 7 days;
        }
        
        if(_frequency == Frequency.HalfMonthly) {
            return 15 days;
        }

        if(_frequency == Frequency.Monthly) {
            return 30 days;
        }

        if(_frequency == Frequency.Quarterly) {
            return 91 days;
        }

        if(_frequency == Frequency.HalfYearly) {
            return 182 days;
        }

        return 365 days;
    }
}
