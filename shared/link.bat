call npm link
@echo on
cd ../client
call npm link shared
@echo on
cd ../server
call npm link shared
@echo on