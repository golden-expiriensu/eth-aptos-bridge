// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

import {OwnableImmutable} from "./base/OwnableImmutable.sol";
import {Roles} from "./base/Roles.sol";
import {ReceiptVerifier} from "./base/ReceiptVerifier.sol";
import {Pool} from "./base/Pool.sol";

error InvalidAddressLength(uint256);

contract Bridge is OwnableImmutable, Roles, ReceiptVerifier, Pool {
    using Counters for Counters.Counter;

    event Sent(Receipt receipt);
    event Claimed(Receipt receipt);

    Counters.Counter nonce;

    constructor(address _signer, address _owner)
        Roles(_signer)
        OwnableImmutable(_owner)
    {}

    function send(
        string calldata _tokenName,
        uint256 _chainTo,
        bytes calldata _recipientAddress,
        uint256 _amount
    ) external {
        _burn(_tokenName, msg.sender, _amount);

        emit Sent(
            Receipt({
                from: msg.sender,
                to: _recipientAddress,
                tokenName: _tokenName,
                amount: _amount,
                chainFrom: block.chainid,
                chainTo: _chainTo,
                nonce: nonce.current()
            })
        );

        nonce.increment();
    }

    function claim(Receipt calldata _receipt, bytes calldata _signature)
        external
    {
        if (_receipt.to.length != 20)
            revert InvalidAddressLength(_receipt.to.length);

        _useReceipt(_receipt, _signature);

        bytes memory unpacked = _receipt.to;
        address to;
        assembly {
            to := mload(add(unpacked, 20))
        }

        _mint(_receipt.tokenName, to, _receipt.amount);

        emit Claimed(_receipt);
    }
}
