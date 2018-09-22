#!/bin/bash
# Creates documentation
/usr/local/share/dotnet/dotnet "../solidoc/bin/Debug/netcoreapp2.1/solidoc.dll" "./" "docs"
echo "Success!"