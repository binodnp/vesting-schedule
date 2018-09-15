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

  contract('Vesting Schedule: Increase Vesting', function(accounts) {
    describe('Ruleset for Increasing Vesting Allocations', () => {
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

            let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
            let releaseOn = earliestWithdrawalDate + duration.minutes(1);
            let totalVested = ether(3111108);

            await vestingSchedule.createAllocation(accounts[1], 'John Doe 1', ether(111111), releaseOn);
            await vestingSchedule.createAllocation(accounts[2], 'John Doe 2', ether(222222), releaseOn);
            await vestingSchedule.createAllocation(accounts[3], 'John Doe 3', ether(333333), releaseOn);
            await vestingSchedule.createAllocation(accounts[4], 'John Doe 4', ether(444444), releaseOn);
            await vestingSchedule.createAllocation(accounts[5], 'John Doe 5', ether(555555), releaseOn);
            await vestingSchedule.createAllocation(accounts[6], 'John Doe 6', ether(666666), releaseOn);
            await vestingSchedule.createAllocation(accounts[7], 'John Doe 7', ether(777777), releaseOn);
            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(totalVested));
        });

        it('must allow admins to increase vesting allocations.', async () => {
            await vestingSchedule.increaseAllocation(accounts[1], ether(111111));

            (await vestingSchedule.totalVested()).should.be.bignumber.equal(ether(3111108 + 111111));
        });

        it('must correctly increase vesting allocations.', async () => {
            await vestingSchedule.increaseAllocation(accounts[1], ether(111111));

            (await vestingSchedule.totalVested()).should.be.bignumber.equal(ether(3111108 + 111111));

            let allocation = await vestingSchedule.getAllocation(accounts[1]);

            assert(allocation[3].should.be.bignumber.equal(ether(222222)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(222222)));//closing balance
        });

        it('must not allow non admins to increase vesting allocation.', async () => {
            await vestingSchedule.increaseAllocation(accounts[3], ether(250000), {from: accounts[2]}).should.be.rejectedWith(EVMRevert);
        });

        it('must not allow an increase of nonexisting vesting allocation.', async () => {
            await vestingSchedule.increaseAllocation(accounts[8], ether(250000)).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.increaseAllocation(accounts[8], ether(250000), {from: accounts[1]}).should.be.rejectedWith(EVMRevert);
        });

        it('must not allow increasing vesting allocations that were deleted.', async () => {
            await vestingSchedule.deleteAllocation(accounts[1]);
            await vestingSchedule.increaseAllocation(accounts[1], ether(1)).should.be.rejectedWith(EVMRevert);

            await vestingSchedule.deleteAllocation(accounts[2]);
            await vestingSchedule.increaseAllocation(accounts[2], ether(2)).should.be.rejectedWith(EVMRevert);

            await vestingSchedule.deleteAllocation(accounts[3]);
            await vestingSchedule.increaseAllocation(accounts[3], ether(3)).should.be.rejectedWith(EVMRevert);
        });


        it('must not allow increasing vesting allocation which exceeds the maximum cap (token balance of the contract).', async () => {
            (await vestingSchedule.getAvailableFunds()).should.be.bignumber.equal(ether(50000000));
            (await vestingSchedule.getAmountInVesting()).should.be.bignumber.equal(ether(3111108));

            await vestingSchedule.increaseAllocation(accounts[6], ether(50000000 - 3111108));

            (await vestingSchedule.getAmountInVesting()).should.be.bignumber.equal(ether(50000000));

            await vestingSchedule.increaseAllocation(accounts[4], 1).should.be.rejectedWith(EVMRevert);
        });
    });
});