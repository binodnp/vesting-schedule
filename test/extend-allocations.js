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

  contract('Vesting Schedule: Extend Vesting', function(accounts) {
    describe('Ruleset for Extending Vesting Schedule', () => {
        let vestingCoinMock;
        let vestingSchedule;
        let releaseOn;
        let earliestWithdrawalDate;

        beforeEach(async () => {
            const minimumVestingPeriod = duration.days(181);
            const withdrawalCap = ether(10000);//18 decimal places
            const withdrawalFrequency = 1;//Weekly

            vestingCoinMock = await MockToken.new(accounts[0], ether(7000000000));
                    
            vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

            await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
            await vestingSchedule.fund();

            earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
            releaseOn = earliestWithdrawalDate + duration.minutes(1);
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

        it('must allow admins to extend vesting allocations.', async () => {
            let newReleaseDate = releaseOn + duration.minutes(1);

            await vestingSchedule.extendAllocation(accounts[1], newReleaseDate);
            let allocation = await vestingSchedule.getAllocation(accounts[1]);

            assert(allocation[2].toNumber() == newReleaseDate);
        });

        it('must not allow extending vesting allocations that don\'t exist.', async () => {
            let newReleaseDate = releaseOn + duration.minutes(1);

            await vestingSchedule.extendAllocation(accounts[8], newReleaseDate).should.be.rejectedWith(EVMRevert);
        });

        it('must not allow extending vesting allocations that were deleted.', async () => {
            let newReleaseDate = releaseOn + duration.minutes(1);

            await vestingSchedule.deleteAllocation(accounts[6]);
            await vestingSchedule.extendAllocation(accounts[6], newReleaseDate).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.extendAllocation(accounts[5], newReleaseDate);
        });

        it('must not allow non admins to extend vesting allocations.', async () => {
            let newReleaseDate = releaseOn + duration.minutes(1);

            await vestingSchedule.extendAllocation(accounts[1], newReleaseDate, {from: accounts[7]}).should.be.rejectedWith(EVMRevert);
        });

        it('must ensure that vesting can only be extended into the future.', async () => {
            await vestingSchedule.extendAllocation(accounts[4], releaseOn).should.be.rejectedWith(EVMRevert);
        });
    });
});