// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {MileStoneMaker} from "../src/MileStoneMaker.sol";

contract MileStoneMakerScript is Script {
    function run() external returns (MileStoneMaker) {
        // vm (cheatcode) is a keyword in Foundry
        vm.startBroadcast(); // everything after this, will be send to RPC
        // any transaction we need to send, it should be in between start/stop broadcast
        MileStoneMaker milestoneMaker = new MileStoneMaker();
        vm.stopBroadcast();
        return milestoneMaker;
    }
}
