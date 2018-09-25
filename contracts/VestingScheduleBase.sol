pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import './CustomPausable.sol';

///@title Vesting Schedule Base Contract
///@notice Vesting Schedule indicates when, how much, and how frequently
///founders, employees, and advisor can exercise their token allocations.
///Vesting is determined for each individual.
contract VestingScheduleBase is CustomPausable {
    using SafeMath for uint256;

    ///@dev Token allocation structure for vesting schedule.
    struct Allocation {
        string  memberName;
        uint256 startedOn;
        uint256 releaseOn;
        uint256 allocation;
        uint256 closingBalance;
        bool deleted;
        uint256 withdrawn;
        uint256 lastWithdrawnOn;
    }
    
    event Funded(address indexed _funder, uint256 _amount, uint256 _previousCap, uint256 _newCap);
    event FundRemoved(address indexed _address, uint256 _amount, uint256 _remainingInPool);
    event Withdrawn(address indexed _address, string _memberName, uint256 _amount);

    event AllocationCreated(address indexed _address, string _memberName, uint256 _amount, uint256 _releaseOn);
    event AllocationIncreased(address indexed _address, string _memberName, uint256 _amount, uint256 _additionalAmount);
    event AllocationDecreased(address indexed _address, string _memberName, uint256 _amount, uint256 _lessAmount);
    event AllocationDeleted(address indexed _address, string _memberName, uint256 _amount);
    event ScheduleExtended(address indexed _address, string _memberName, uint256 _releaseOn, uint256 _newReleaseDate);

    ///@notice Maximum amount of tokens that can be withdrawn for the specified frequency.
    ///Zero means that there's no cap;
    uint256 public withdrawalCap;

    ///@notice The frequency of token withdrawals. If the withdrawalCap is zero, this variable is ignored.
    uint256 public withdrawalFrequency;

    ///@notice The date on which the vesting schedule was started. 
    ///Please note that the start dates of individual vesting schedules
    ///could be different than this.
    uint256 public vestingStartedOn;

    ///@notice The minimum period of vesting.
    ///Please note that individual vesting schedules cannot have
    ///shorter period than this.
    uint256 public minimumVestingPeriod;

    ///@notice The earliest date on which the vested tokens can be redeemed.
    ///Please note that individual withdrawal dates cannot be earlier
    ///than this.
    uint256 public earliestWithdrawalDate;

    ///@notice The sum total amount of tokens vested for all allocations.
    uint256 public totalVested;

    ///@notice The sum total amount of tokens withdrawn from all allocations.
    uint256 public totalWithdrawn;

    ///@notice The ERC20 contract of the coin being vested.
    ERC20 public vestingCoin;

    ///@notice The list of vesting schedule allocations;
    mapping(address => Allocation) internal allocations;

    function createAllocation(address _address, string _memberName, uint256 _amount, uint256 _releaseOn) external returns(bool);
    function deleteAllocation(address _address) external returns(bool);
    function increaseAllocation(address _address, uint256 _additionalAmount) external returns(bool);
    function decreaseAllocation(address _address, uint256 _lessAmount) external returns(bool);
    function extendAllocation(address _address, uint256 _newReleaseDate) external returns(bool);
    function withdraw(uint256 _amount) external returns(bool);

    ///@notice Constructs this contract
    ///@param _minPeriod The minimum vesting period.
    ///@param _withdrawalCap Maximum amount of tokens that can be withdrawn for the specified frequency.
    ///@param _vestingCoin The ERC20 contract of the coin being vested.
    constructor(uint256 _minPeriod, uint256 _withdrawalCap, ERC20 _vestingCoin) internal {
        minimumVestingPeriod = _minPeriod;
        vestingStartedOn = now;
        vestingCoin = _vestingCoin;
        withdrawalCap = _withdrawalCap;
    }

    ///@notice The balance of this smart contract. 
    ///@return Returns the closing balance of vesting coin held by this contract.
    function getAvailableFunds() public view returns(uint256) {
        return vestingCoin.balanceOf(this);
    }

    ///@notice The sum total amount in vesting allocations.
    ///@return Returns the amount in vesting coin that must be held by this contract.
    function getAmountInVesting() public view returns(uint256) {
        return totalVested.sub(totalWithdrawn);
    }

    ///@notice The vesting schedule allocation of the specified address.
    ///@param _address The address to get the vesting schedule allocation of.
    ///@return Returns the requested vesting schedule allocation.
    function getAllocation(address _address) external view returns(uint256 _startedOn, string _memberName, uint256 _releaseOn, uint256 _allocation, uint256 _closingBalance, uint256 _withdrawn, uint256 _lastWithdrawnOn, bool _deleted) {
        _startedOn  = allocations[_address].startedOn;
        _memberName = allocations[_address].memberName;
        _releaseOn = allocations[_address].releaseOn;
        _allocation = allocations[_address].allocation;
        _closingBalance = allocations[_address].closingBalance;
        _withdrawn = allocations[_address].withdrawn;
        _lastWithdrawnOn = allocations[_address].lastWithdrawnOn;
        _deleted = allocations[_address].deleted;
    }

    ///@notice Signifies that the action is only possible 
    ///after the earliest withdrawal date of the vesting contract.
    modifier afterEarliestWithdrawalDate {
        require(now >= earliestWithdrawalDate);
        
        _;
    }

    ///@notice Override this function to receive the vesting coin in this contract.
    ///@return Returns true if the action was successful.
    function fund() external returns(bool);

    ///@notice Override this function to remove the vesting coin from this contract.
    ///@return Returns true if the action was successful.
    function removeFunds(uint256 _amount) external returns(bool);
}