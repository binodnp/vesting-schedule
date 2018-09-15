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

  contract('Vesting Schedule: Reduce Vesting', function(accounts) {
    describe('Ruleset for Decreasing Vesting Allocations', () => {
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

        it('must allow admins to decrease vesting allocations.', async () => {
            await vestingSchedule.decreaseAllocation(accounts[1], ether(11111));

            (await vestingSchedule.totalVested()).should.be.bignumber.equal(ether(3111108 - 11111));
        });

        it('must not allow decreasing more tokens than actually allocated.', async () => {
            await vestingSchedule.decreaseAllocation(accounts[1], ether(111111));
            (await vestingSchedule.totalVested()).should.be.bignumber.equal(ether(3111108 - 111111));

            let allocation = await vestingSchedule.getAllocation(accounts[1]);

            assert(allocation[3].should.be.bignumber.equal(ether(0)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(0)));//closing balance

            await vestingSchedule.decreaseAllocation(accounts[1], 1).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.decreaseAllocation(accounts[2], ether(222223)).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.decreaseAllocation(accounts[3], ether(333334)).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.decreaseAllocation(accounts[4], ether(444445)).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.decreaseAllocation(accounts[5], ether(555556)).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.decreaseAllocation(accounts[6], ether(666667)).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.decreaseAllocation(accounts[7], ether(777778)).should.be.rejectedWith(EVMRevert);

            await vestingSchedule.decreaseAllocation(accounts[2], ether(222221));
            await vestingSchedule.decreaseAllocation(accounts[3], ether(333331));
            await vestingSchedule.decreaseAllocation(accounts[4], ether(444441));
            await vestingSchedule.decreaseAllocation(accounts[5], ether(555551));
            await vestingSchedule.decreaseAllocation(accounts[6], ether(666661));
            await vestingSchedule.decreaseAllocation(accounts[7], ether(777771));

            allocation = await vestingSchedule.getAllocation(accounts[1]);

            assert(allocation[3].should.be.bignumber.equal(ether(0)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(0)));//closing balance

            allocation = await vestingSchedule.getAllocation(accounts[2]);

            assert(allocation[3].should.be.bignumber.equal(ether(1)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(1)));//closing balance

            allocation = await vestingSchedule.getAllocation(accounts[3]);

            assert(allocation[3].should.be.bignumber.equal(ether(2)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(2)));//closing balance

            allocation = await vestingSchedule.getAllocation(accounts[4]);

            assert(allocation[3].should.be.bignumber.equal(ether(3)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(3)));//closing balance

            allocation = await vestingSchedule.getAllocation(accounts[5]);

            assert(allocation[3].should.be.bignumber.equal(ether(4)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(4)));//closing balance

            allocation = await vestingSchedule.getAllocation(accounts[6]);

            assert(allocation[3].should.be.bignumber.equal(ether(5)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(5)));//closing balance

            allocation = await vestingSchedule.getAllocation(accounts[7]);

            assert(allocation[3].should.be.bignumber.equal(ether(6)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(6)));//closing balance
        });

        it('must correctly decrease vesting allocations.', async () => {
            await vestingSchedule.increaseAllocation(accounts[1], ether(111111));

            (await vestingSchedule.totalVested()).should.be.bignumber.equal(ether(3111108 + 111111));

            let allocation = await vestingSchedule.getAllocation(accounts[1]);

            assert(allocation[3].should.be.bignumber.equal(ether(222222)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(222222)));//closing balance

            await vestingSchedule.decreaseAllocation(accounts[1], ether(123456));

            (await vestingSchedule.totalVested()).should.be.bignumber.equal(ether(3111108 + 111111 - 123456));

            allocation = await vestingSchedule.getAllocation(accounts[1]);

            assert(allocation[3].should.be.bignumber.equal(ether(222222 - 123456)));//allocation
            assert(allocation[4].should.be.bignumber.equal(ether(222222 - 123456)));//closing balance
        });

        it('must not allow non admins to decrease vesting allocation.', async () => {
            await vestingSchedule.decreaseAllocation(accounts[1], ether(123456), {from: accounts[5]}).should.be.rejectedWith(EVMRevert);
        });

        it('must not allow reducing nonexisting vesting allocation.', async () => {
            await vestingSchedule.decreaseAllocation(accounts[8], ether(250000)).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.decreaseAllocation(accounts[8], ether(250000), {from: accounts[1]}).should.be.rejectedWith(EVMRevert);
        });
    });
});