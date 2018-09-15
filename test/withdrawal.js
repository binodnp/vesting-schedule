const VestingSchedule = artifacts.require('./VestingSchedule.sol');
const BigNumber = require('bignumber.js');
const EVMRevert = require('./helpers/EVMRevert').EVMRevert;
const ether = require('./helpers/ether').ether;
const { increaseTimeTo, duration} = require('./helpers/increaseTime');
const MockToken = artifacts.require('./StandardTokenMock.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

  contract('Vesting Schedule: Withdrawal', function(accounts) {
    describe('Ruleset for Vesting Allocations', () => {
        let vestingCoinMock;

        beforeEach(async () => {
            vestingCoinMock = await MockToken.new(accounts[0], ether(7000000000));                    
        });

        it('must correctly calculate daily allocations.', async () => {
            const minimumVestingPeriod = duration.days(181);
            const withdrawalCap = ether(10000);//18 decimal places
            const withdrawalFrequency = 0;//Daily

            const vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

            await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
            await vestingSchedule.fund();

            let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
            let releaseOn = earliestWithdrawalDate + duration.minutes(1);
            let totalVested = ether(111111);

            await vestingSchedule.createAllocation(accounts[1], 'John Doe 1', ether(111111), releaseOn);
            
            assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(totalVested));        

            await increaseTimeTo(releaseOn + duration.minutes(1));

            (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(10000));

            //Check if the beneficiary can withdraw amount more than actually allocated.
            await vestingSchedule.withdraw(ether(20000000), {from: accounts[1]}).should.be.rejectedWith(EVMRevert);

            await vestingSchedule.withdraw(ether(5000), {from: accounts[1]});

            await increaseTimeTo(releaseOn + duration.days(1) + duration.minutes(1));

            (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(15000));

            await increaseTimeTo(releaseOn + duration.days(8) + duration.minutes(1));

            (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(85000));

            await increaseTimeTo(releaseOn + duration.days(10) + duration.minutes(1));

            await vestingSchedule.withdraw(ether(25000), {from: accounts[1]});

            (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(80000));

            await increaseTimeTo(releaseOn + duration.days(11) + duration.minutes(1));

            await vestingSchedule.withdraw(ether(55000), {from: accounts[1]});

            (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(26111));

            await vestingSchedule.withdraw(ether(55000), {from: accounts[1]}).should.be.rejectedWith(EVMRevert);

            await increaseTimeTo(releaseOn + duration.days(12) + duration.minutes(1));

            await vestingSchedule.withdraw(ether(26112), {from: accounts[1]}).should.be.rejectedWith(EVMRevert);
            await vestingSchedule.withdraw(ether(26111), {from: accounts[1]});

            (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(0));
        });

        // it('must correctly calculate weekly allocations.', async () => {
        //     const minimumVestingPeriod = duration.days(181);
        //     const withdrawalCap = ether(10000);//18 decimal places
        //     const withdrawalFrequency = 1;//Weekly

        //     const vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

        //     await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
        //     await vestingSchedule.fund();

        //     let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
        //     let releaseOn = earliestWithdrawalDate + duration.minutes(1);
        //     let totalVested = ether(111111);

        //     await vestingSchedule.createAllocation(accounts[1], 'John Doe 1', ether(111111), releaseOn);
            
        //     assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(totalVested));        

        //     await increaseTimeTo(releaseOn + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(10000));

        //     await increaseTimeTo(releaseOn + duration.weeks(1) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(20000));

        //     await increaseTimeTo(releaseOn + duration.weeks(2) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(30000));

        //     await increaseTimeTo(releaseOn + duration.weeks(6) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(70000));

        //     await increaseTimeTo(releaseOn + duration.weeks(8) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(90000));

        //     await increaseTimeTo(releaseOn + duration.weeks(13) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(111111));
        // });

        // it('must correctly calculate biweekly allocations.', async () => {
        //     const minimumVestingPeriod = duration.days(181);
        //     const withdrawalCap = ether(10000);//18 decimal places
        //     const withdrawalFrequency = 2;//Half monthly

        //     const vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

        //     await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
        //     await vestingSchedule.fund();

        //     let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
        //     let releaseOn = earliestWithdrawalDate + duration.minutes(1);
        //     let totalVested = ether(111111);

        //     await vestingSchedule.createAllocation(accounts[1], 'John Doe 1', ether(111111), releaseOn);
            
        //     assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(totalVested));        

        //     await increaseTimeTo(releaseOn + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(10000));

        //     await increaseTimeTo(releaseOn + duration.days(15 * 2) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(30000));

        //     await increaseTimeTo(releaseOn + duration.days(15 * 4) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(50000));

        //     await increaseTimeTo(releaseOn + duration.days(15 * 7) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(80000));

        //     await increaseTimeTo(releaseOn + duration.days(15 * 8) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(90000));

        //     await increaseTimeTo(releaseOn + duration.days(15 * 44) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(111111));
        // });

        // it('must correctly calculate monthly allocations.', async () => {
        //     const minimumVestingPeriod = duration.days(181);
        //     const withdrawalCap = ether(10000);//18 decimal places
        //     const withdrawalFrequency = 3;//Monthly

        //     const vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

        //     await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
        //     await vestingSchedule.fund();

        //     let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
        //     let releaseOn = earliestWithdrawalDate + duration.minutes(1);
        //     let totalVested = ether(111111);

        //     await vestingSchedule.createAllocation(accounts[1], 'John Doe 1', ether(111111), releaseOn);
            
        //     assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(totalVested));        

        //     await increaseTimeTo(releaseOn + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(10000));

        //     await increaseTimeTo(releaseOn + duration.days(30 * 3) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(40000));

        //     await increaseTimeTo(releaseOn + duration.days(30 * 6) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(70000));

        //     await increaseTimeTo(releaseOn + duration.days(30 * 9) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(100000));

        //     await increaseTimeTo(releaseOn + duration.days(30 * 11) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(111111));

        //     await increaseTimeTo(releaseOn + duration.days(30 * 300) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(111111));
        // });

        // it('must correctly calculate quarterly allocations.', async () => {
        //     const minimumVestingPeriod = duration.days(181);
        //     const withdrawalCap = ether(10000);//18 decimal places
        //     const withdrawalFrequency = 4;//Quarterly

        //     const vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

        //     await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
        //     await vestingSchedule.fund();

        //     let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
        //     let releaseOn = earliestWithdrawalDate + duration.minutes(1);
        //     let totalVested = ether(111111);

        //     await vestingSchedule.createAllocation(accounts[1], 'John Doe 1', ether(111111), releaseOn);
            
        //     assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(totalVested));        

        //     await increaseTimeTo(releaseOn + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(10000));

        //     await increaseTimeTo(releaseOn + duration.days(91) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(20000));

        //     await increaseTimeTo(releaseOn + duration.days(91 * 2) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(30000));

        //     await increaseTimeTo(releaseOn + duration.days(91 * 4) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(50000));

        //     await increaseTimeTo(releaseOn + duration.days(91 * 5) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(60000));

        //     await increaseTimeTo(releaseOn + duration.days(91 * 11) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(111111));
        // });

        // it('must correctly calculate half yearly allocations.', async () => {
        //     const minimumVestingPeriod = duration.days(181);
        //     const withdrawalCap = ether(10000);//18 decimal places
        //     const withdrawalFrequency = 5;//Half yearly

        //     const vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

        //     await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
        //     await vestingSchedule.fund();

        //     let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
        //     let releaseOn = earliestWithdrawalDate + duration.minutes(1);
        //     let totalVested = ether(111111);

        //     await vestingSchedule.createAllocation(accounts[1], 'John Doe 1', ether(111111), releaseOn);
            
        //     assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(totalVested));        

        //     await increaseTimeTo(releaseOn + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(10000));

        //     await increaseTimeTo(releaseOn + duration.days(182) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(20000));

        //     await increaseTimeTo(releaseOn + duration.days(182 * 8) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(90000));

        //     await increaseTimeTo(releaseOn + duration.days(182 * 10) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(110000));

        //     await increaseTimeTo(releaseOn + duration.days(182 * 11) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(111111));

        //     await increaseTimeTo(releaseOn + duration.days(182 * 12) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(111111));
        // });

        // it('must correctly calculate yearly allocations.', async () => {
        //     const minimumVestingPeriod = duration.days(181);
        //     const withdrawalCap = ether(10000);//18 decimal places
        //     const withdrawalFrequency = 6;//Yearly

        //     const vestingSchedule = await VestingSchedule.new(minimumVestingPeriod, withdrawalCap, withdrawalFrequency, vestingCoinMock.address);

        //     await vestingCoinMock.approve(vestingSchedule.address, ether(50000000));
        //     await vestingSchedule.fund();

        //     let earliestWithdrawalDate = (await vestingSchedule.earliestWithdrawalDate()).toNumber();
        //     let releaseOn = earliestWithdrawalDate + duration.minutes(1);
        //     let totalVested = ether(111111);

        //     await vestingSchedule.createAllocation(accounts[1], 'John Doe 1', ether(111111), releaseOn);
            
        //     assert((await vestingSchedule.totalVested()).should.be.bignumber.equal(totalVested));        

        //     await increaseTimeTo(releaseOn + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(10000));

        //     await increaseTimeTo(releaseOn + duration.days(365) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(20000));

        //     await increaseTimeTo(releaseOn + duration.days(365 * 8) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(90000));

        //     await increaseTimeTo(releaseOn + duration.days(365 * 10) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(110000));

        //     await increaseTimeTo(releaseOn + duration.days(365 * 11) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(111111));

        //     await increaseTimeTo(releaseOn + duration.days(365 * 19) + duration.minutes(1));

        //     (await vestingSchedule.getDrawingPower(accounts[1])).should.be.bignumber.equal(ether(111111));
        // });
    });
});