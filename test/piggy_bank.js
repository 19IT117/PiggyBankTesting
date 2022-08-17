const PiggyBank = artifacts.require("PiggyBank");
const { assert } = require("chai");
const truffleAssert = require('truffle-assert');
const {Web3} = require('web3');
contract('PiggyBank', async (accounts) => {
  var contractInstance ;

  before(async () => {
    contractInstance = await PiggyBank.deployed();
  });

  it('should deploy contract properly', async () => {
    console.log(contractInstance.address);
    assert(contractInstance.address != '');
  });

  it('checking owner of the PiggyBank contract', async () => {
    const owner = await contractInstance.owner();
    assert(owner == accounts[0]);
  });

  it('depositing in PiggyBank' , async () => {
    
    await web3.eth.sendTransaction({
      from : accounts[0],
      to : contractInstance.address,
      value : 100000
    });

    // const results = await contractInstance.getPastEvents('Deposit', {
    //   filter : {
    //     amount : [2,1]
    //   },
    //   fromBlock : 1390
    // });
    const results = await contractInstance.getPastEvents('Deposit', { fromBlock : 0});
    const length = results.length;
    const amount = await results[length - 1].args[0].toNumber();
    const event = await results[length - 1].event;
    assert (event == 'Deposit' & amount == 100000);
    const balance = await contractInstance.contractBalance();
    assert(balance == 100000);
  });

  it('breaking PiggyBank from other accounts', async () => {
    await truffleAssert.reverts(
     contractInstance.withdraw({from : accounts[1]}),
      'not owner'
    )  
  });

  it('breaking PiggyBank from Owner', async () => {
    const result = await contractInstance.withdraw({from : accounts[0]});
    const results = await contractInstance.getPastEvents();
    const event = await results[0].event;
    const amount = await results[0].args[0].toNumber();
    assert(event == 'Withdraw'  & amount == 100000);
    const balance = await web3.eth.getBalance(contractInstance.address);
    // const balance = await contractInstance.contractBalance();
    assert(balance == 0);
  });

  it('checking values after self destruct function' , async () => {
    try{
      await contractInstance.owner();
    }catch (e){
      console.log(e.message);
    }
    await web3.eth.sendTransaction({
      from : accounts[0],
      to : contractInstance.address,
      value : 5
    });
    const results = await contractInstance.getPastEvents('Deposit', { fromBlock : 0});
    const length = results.length;
    // const amount = await results[length - 1].args[0].toNumber();
    // const event = await results[length - 1].event;
    // //assert (event == 'Deposit' & amount == 5);
    const balance = await web3.eth.getBalance(contractInstance.address);
    // const balance = await contractInstance.contractBalance();
    assert(balance == 5);
  });
});
