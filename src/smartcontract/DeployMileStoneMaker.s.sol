pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {MileStoneMaker} from "./MileStoneMaker.sol";

// this step tell Foundry that this contract is actually a script
contract DeploySimpleStorageDeploy is Script {
    // main function
    function run() external returns (SimpleStorage) {
        // vm (cheatcode) is a keyword in Foundry
        vm.startBroadcast(); // everything after this, will be send to RPC
        // any transaction we need to send, it should be in between start/stop broadcast
        SimpleStorage simpleStorage = new SimpleStorage();
        vm.stopBroadcast();
        return simpleStorage;
    }
}