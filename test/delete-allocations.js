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

  contract('Vesting Schedule: Delete Vesting', function(accounts) {
    describe('Ruleset for Deleting Vesting Allocations', () => {
        let vestingCoinMock;
        let vestingSchedule;
        let totalVested;
        let releaseOn;

        beforeEach(async () => {
            const minimumVestingPeriod = duration.days(181);
            const withdrawalCap = ether(10000);//18 decimal places
            const withdrawalFrequency = 1;//Weekly

            vestingCoinMock = await MockToken.new(accounts[0], ether(7000000000));
                    
            vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

            await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
            await vestingSchedule.fund();

            let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
            releaseOn = earliestWithdrawalDate + duration.minutes(1);

            totalVested = ether(4999995);

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

        it('must allow admins to delete vesting allocations.', async () => {
            await vestingSchedule.deleteAllocation(accounts[1]);
            await vestingSchedule.deleteAllocation(accounts[2]);
            await vestingSchedule.deleteAllocation(accounts[3]);
            await vestingSchedule.deleteAllocation(accounts[4]);
            await vestingSchedule.deleteAllocation(accounts[5]);
            await vestingSchedule.deleteAllocation(accounts[6]);
            await vestingSchedule.deleteAllocation(accounts[7]);
            await vestingSchedule.deleteAllocation(accounts[8]);
            await vestingSchedule.deleteAllocation(accounts[9]);
        });

        it('must correctly update "totalVested" variable.', async () => {
            let expectedTotalVested = ether(3999996);

            await vestingSchedule.deleteAllocation(accounts[9]);

            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(expectedTotalVested));

            expectedTotalVested = ether(3111108);

            assert(await vestingSchedule.deleteAllocation(accounts[8]));
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(expectedTotalVested));

            expectedTotalVested = ether(2333331);

            assert(await vestingSchedule.deleteAllocation(accounts[7]));            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(expectedTotalVested));

            expectedTotalVested = ether(1666665);

            assert(await vestingSchedule.deleteAllocation(accounts[6]));            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(expectedTotalVested));

            expectedTotalVested = ether(1111110);

            assert(await vestingSchedule.deleteAllocation(accounts[5]));            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(expectedTotalVested));

            expectedTotalVested = ether(666666);

            assert(await vestingSchedule.deleteAllocation(accounts[4]));            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(expectedTotalVested));

            expectedTotalVested = ether(333333);

            assert(await vestingSchedule.deleteAllocation(accounts[3]));            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(expectedTotalVested));

            expectedTotalVested = ether(111111);

            assert(await vestingSchedule.deleteAllocation(accounts[2]));            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(expectedTotalVested));

            expectedTotalVested = ether(0);

            assert(await vestingSchedule.deleteAllocation(accounts[1]));            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(expectedTotalVested));
        });

        it('must correctly delete vesting allocations.', async () => {
            let expectedTotalVested = ether(4999995 - 555555);
            assert(await vestingSchedule.deleteAllocation(accounts[5]));
            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(expectedTotalVested));

            let allocation = await vestingSchedule.getAllocation(accounts[5]);

            assert(allocation[1].toString() == "John Doe 5");
            assert(allocation[2].toNumber() == releaseOn);
            assert(allocation[3].toNumber() == 0);//allocation
            assert(allocation[4].toNumber() == 0);//closing balance
            assert(allocation[4].toNumber() == 0);//closing balance
            assert(allocation[7].toString() == "true");//deleted
        });

        it('must not allow deleting vesting allocations that don\'t exist.', async () => {
            await vestingSchedule.deleteAllocation(accounts[0]).should.be.rejectedWith(EVMRevert);
        });

        it('must not allow deleting vesting allocations that were already deleted.', async () => {
            assert(await vestingSchedule.deleteAllocation(accounts[6]));
            await vestingSchedule.deleteAllocation(accounts[6]).should.be.rejectedWith(EVMRevert);
        });

        it('must not allow non admins to delete vesting allocation.', async () => {
            await vestingSchedule.deleteAllocation(accounts[1], {from: accounts[9]}).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.deleteAllocation(accounts[2], {from: accounts[8]}).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.deleteAllocation(accounts[3], {from: accounts[7]}).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.deleteAllocation(accounts[4], {from: accounts[5]}).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.deleteAllocation(accounts[5], {from: accounts[6]}).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.deleteAllocation(accounts[6], {from: accounts[4]}).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.deleteAllocation(accounts[7], {from: accounts[3]}).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.deleteAllocation(accounts[8], {from: accounts[2]}).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.deleteAllocation(accounts[9], {from: accounts[1]}).should.be.rejectedWith(EVMRevert);
        });
    });
});