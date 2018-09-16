#!/bin/bash
# Creates documentation
/usr/local/share/dotnet/dotnet "../solidity-docgen/bin/Debug/netcoreapp2.1/solidity-docgen.dll" "build/contracts" "docs"
echo "Success!"