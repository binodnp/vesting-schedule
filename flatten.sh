#!/bin/bash
# Flattens the contract.
/usr/local/share/dotnet/dotnet "../SolidityFlattener/bin/Debug/netcoreapp2.1/SolidityFlattener.dll" "contracts/VestingSchedule.sol" "flattened/VestingSchedule.sol" ".,../node_modules"
echo "Success!"