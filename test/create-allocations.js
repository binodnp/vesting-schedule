const VestingSchedule = artifacts.require('./VestingSchedule.sol');
const BigNumber = require('bignumber.js');
const EVMRevert = require('./helpers/EVMRevert').EVMRevert;
const ether = require('./helpers/ether').ether;
const increaseTime = require('./helpers/increaseTime');
const duration = increaseTime.duration;
const MockToken = artifacts.require('./StandardTokenMock.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

  contract('Vesting Schedule: Create Vesting', function(accounts) {
    describe('Ruleset for Creating Vesting Allocations', () => {
        let vestingCoinMock;
        let vestingSchedule;

        beforeEach(async () => {
            const minimumVestingPeriod = duration.days(181);
            const withdrawalCap = ether(10000);//18 decimal places
            const withdrawalFrequency = 1;//Weekly

            vestingCoinMock = await MockToken.new(accounts[0], ether(7000000000));
                    
            vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

            await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
            await vestingSchedule.fund();
        });

        it('must allow admins to create vesting allocations.', async () => {
            let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
            let releaseOn = earliestWithdrawalDate + duration.minutes(1);
            let totalVested = ether(4999995);

            await vestingSchedule.createAllocation(accounts[1], 'John Doe 1', ether(111111), releaseOn);
            await vestingSchedule.createAllocation(accounts[2], 'John Doe 2', ether(222222), releaseOn);
            await vestingSchedule.createAllocation(accounts[3], 'John Doe 3', ether(333333), releaseOn);
            await vestingSchedule.createAllocation(accounts[4], 'John Doe 4', ether(444444), releaseOn);
            await vestingSchedule.createAllocation(accounts[5], 'John Doe 5', ether(555555), releaseOn);
            await vestingSchedule.createAllocation(accounts[6], 'John Doe 6', ether(666666), releaseOn);
            await vestingSchedule.createAllocation(accounts[7], 'John Doe 7', ether(777777), releaseOn);
            await vestingSchedule.createAllocation(accounts[8], 'John Doe 8', ether(888888), releaseOn);
            await vestingSchedule.createAllocation(accounts[9], 'John Doe 9', ether(999999), releaseOn);
            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(totalVested));
        });

        it('must correctly create vesting allocations.', async () => {
            let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
            let releaseOn = earliestWithdrawalDate + duration.minutes(1);

            await vestingSchedule.createAllocation(accounts[1], 'John Doe', ether(111111), releaseOn);
            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(ether(111111)));

            let allocation = await vestingSchedule.getAllocation(accounts[1]);
            assert(allocation[1].toString() == "John Doe");
            assert(allocation[2].toNumber() == releaseOn);
            assert(allocation[3].should.be.bignumber.equal(ether(111111)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(111111)));//closing balance
            assert(allocation[5].should.be.bignumber.equal(ether(0)));//withdrawn
            assert(allocation[6].toNumber() == 0);//last withdrawn on
            assert(allocation[7] == false);//deleted
        });

        it('must not allow non admins to create vesting allocation.', async () => {
            let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
            let releaseOn = earliestWithdrawalDate + duration.minutes(1);

            await vestingSchedule.createAllocation(accounts[3], 'John Doe', ether(250000), releaseOn, {from: accounts[2]}).should.be.rejectedWith(EVMRevert);
        });

        it('must not allow overwrite of existing vesting allocation.', async () => {
            let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
            let releaseOn = earliestWithdrawalDate + duration.minutes(1);

            await vestingSchedule.createAllocation(accounts[3], 'John Doe', ether(250000), releaseOn);
            await vestingSchedule.createAllocation(accounts[3], 'John Doe', ether(250000), releaseOn).should.be.rejectedWith(EVMRevert);
        });

        it('must not allow creating vesting allocation which can be released before the earliest withdrawal date.', async () => {
            let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
            let releaseOn = earliestWithdrawalDate - duration.minutes(1);

            await vestingSchedule.createAllocation(accounts[3], 'John Doe', ether(250000), releaseOn).should.be.rejectedWith(EVMRevert);
        });

        it('must not allow creating vesting allocation which exceeds the maximum cap (token balance of the contract).', async () => {
            let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
            let releaseOn = earliestWithdrawalDate + duration.minutes(1);

            await vestingSchedule.createAllocation(accounts[3], 'John Doe', ether(50000001), releaseOn).should.be.rejectedWith(EVMRevert);

            await vestingSchedule.createAllocation(accounts[3], 'John Doe', ether(20000000), releaseOn);
            await vestingSchedule.createAllocation(accounts[4], 'John Doe', ether(30000000), releaseOn);
            await vestingSchedule.createAllocation(accounts[5], 'John Doe', ether(1), releaseOn).should.be.rejectedWith(EVMRevert);

            await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
            await vestingSchedule.fund();

            await vestingSchedule.createAllocation(accounts[6], 'John Doe', ether(30000000), releaseOn);
            await vestingSchedule.createAllocation(accounts[7], 'John Doe', ether(20000001), releaseOn).should.be.rejectedWith(EVMRevert);
        });
    });
});