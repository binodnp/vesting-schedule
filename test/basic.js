const VestingSchedule = artifacts.require('./VestingSchedule.sol');
const BigNumber = require('bignumber.js');
const ether = require('./helpers/ether').ether;
const increaseTime = require('./helpers/increaseTime');
const duration = increaseTime.duration;
const MockToken = artifacts.require('./StandardTokenMock.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

  contract('Vesting Schedule: Constructor', function(accounts) {
    describe('Constructor', () => {
      it('must construct properly with correct parameters.', async () => {
        const minimumVestingPeriod = duration.days(181);
        const withdrawalCap = ether(10000);//18 decimal places
        const withdrawalFrequency = 1;//Weekly
        const vestingCoinMock = await MockToken.new(accounts[0], ether(7000000000));
        
        let vestingStartedOn;
        let earliestWithdrawalDate;

        (await vestingCoinMock.balanceOf(accounts[0])).should.be.bignumber.equal(ether(7000000000));

        const vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

        ///The timestamp of contract deployment.
        vestingStartedOn = (await vestingSchedule.vestingStartedOn()).toNumber();
        earliestWithdrawalDate = vestingStartedOn + minimumVestingPeriod;

        assert((await vestingSchedule.minimumVestingPeriod()).toNumber() == minimumVestingPeriod);
        assert(await vestingSchedule.vestingCoin() == vestingCoinMock.address);
        assert((await vestingSchedule.withdrawalCap()).should.be.bignumber.equal(withdrawalCap));
        assert((await vestingSchedule.withdrawalFrequency()).toNumber() == duration.days(7));
        assert((await vestingSchedule.earliestWithdrawalDate()).toNumber() == earliestWithdrawalDate);
      });
    });
});