// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {OwnableImmutable} from "./OwnableImmutable.sol";
import {IMintableBurnable} from "contracts/interfaces/IMintableBurnable.sol";

error TokenIsNotSupported();

abstract contract Pool is OwnableImmutable {
    mapping(bytes32 => address) tokenNameHash2Address;

    function setTokenAddress(string calldata _tokenName, address _address)
        external
        onlyOwner
    {
        tokenNameHash2Address[_name2hash(_tokenName)] = _address;
    }

    function _mint(
        string memory _tokenName,
        address _to,
        uint256 _amount
    ) internal {
        bytes32 hash = _name2hash(_tokenName);

        if (tokenNameHash2Address[hash] == address(0))
            revert TokenIsNotSupported();

        IMintableBurnable(tokenNameHash2Address[hash]).mint(_to, _amount);
    }

    function _burn(
        string memory _tokenName,
        address _from,
        uint256 _amount
    ) internal {
        bytes32 hash = _name2hash(_tokenName);

        if (tokenNameHash2Address[hash] == address(0))
            revert TokenIsNotSupported();

        IMintableBurnable(tokenNameHash2Address[hash]).burn(_from, _amount);
    }

    function _name2hash(string memory _tokenName)
        private
        pure
        returns (bytes32)
    {
        return keccak256(bytes(_tokenName));
    }
}
