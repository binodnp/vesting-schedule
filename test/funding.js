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

  contract('Vesting Schedule: Funding', function(accounts) {
    describe('Ruleset for Funding and Withdrawing Funds', () => {
        let vestingCoinMock;
        let vestingSchedule;

        beforeEach(async () => {
            const minimumVestingPeriod = duration.days(181);
            const withdrawalCap = ether(10000);//18 decimal places
            const withdrawalFrequency = 1;//Weekly

            vestingCoinMock = await MockToken.new(accounts[0], ether(7000000000));
                    
            vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);
        });

        it('must not allow non admins to fund the vesting schedule.', async () => {
            ///Transfer some tokens to a non admin.
            vestingCoinMock.transfer(accounts[1], ether(100000000));

            await vestingCoinMock.approve(vestingSchedule.address, ether(50000000), { from: accounts[1] });
            await vestingSchedule.fund({from: accounts[1]}).should.be.rejectedWith(EVMRevert);
        });

        it('must allow administrators to fund the vesting schedule with correct parameters.', async () => {
            await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
            await vestingSchedule.fund();

            await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
            
            assert((await vestingSchedule.getAvailableFunds()).should.be.bignumber.equal(ether(50000000)));
            
            await vestingSchedule.fund();

            assert((await vestingSchedule.getAvailableFunds()).should.be.bignumber.equal(ether(100000000)));
        });

        it('must not allow non admins to remove funds from the vesting schedule.', async () => {
            await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
            await vestingSchedule.fund();

            assert((await vestingSchedule.getAvailableFunds()).should.be.bignumber.equal(ether(50000000)));

            await vestingSchedule.removeFunds(ether(20000000), {from: accounts[1]}).should.be.rejectedWith(EVMRevert);
        });

        it('must allow admins to remove funds from the vesting schedule.', async () => {
            await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
            await vestingSchedule.fund();

            const previousBalance = ether(50000000);
            const withdrawnAmount = ether(20000000);

            assert((await vestingSchedule.getAvailableFunds()).should.be.bignumber.equal(previousBalance));

            await vestingSchedule.removeFunds(withdrawnAmount);
            (await vestingCoinMock.balanceOf(vestingSchedule.address)).should.be.bignumber.equal(ether(30000000));
        });
    });
});