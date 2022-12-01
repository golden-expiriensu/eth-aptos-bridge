// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {OwnableImmutable} from "./base/OwnableImmutable.sol";

contract Token is ERC20, OwnableImmutable {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address _initialSupplyOwner,
        address _contractOwner
    ) ERC20(_name, _symbol) OwnableImmutable(_contractOwner) {
        _mint(_initialSupplyOwner, _initialSupply);
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    function burn(address _from, uint256 _amount) external onlyOwner {
        _burn(_from, _amount);
    }
}
