// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

import {OwnableImmutable} from "./base/OwnableImmutable.sol";
import {Roles} from "./base/Roles.sol";
import {ReceiptVerifier} from "./base/ReceiptVerifier.sol";
import {Pool} from "./base/Pool.sol";

contract Bridge is OwnableImmutable, Roles, ReceiptVerifier, Pool {
    using Counters for Counters.Counter;

    event Swapped(Receipt receipt);
    event Redeemed(Receipt receipt);

    Counters.Counter nonce;

    constructor(address _signer, address _owner)
        Roles(_signer)
        OwnableImmutable(_owner)
    {}

    function swap(
        string calldata _tokenName,
        uint256 _chainTo,
        address _recipient,
        uint256 _amount
    ) external {
        _burn(_tokenName, msg.sender, _amount);

        emit Swapped(
            Receipt({
                from: msg.sender,
                to: _recipient,
                tokenName: _tokenName,
                amount: _amount,
                chainFrom: block.chainid,
                chainTo: _chainTo,
                nonce: nonce.current()
            })
        );

        nonce.increment();
    }

    function redeem(Receipt calldata _receipt, bytes calldata _signature)
        external
    {
        _useReceipt(_receipt, _signature);

        _mint(_receipt.tokenName, _receipt.to, _receipt.amount);

        emit Redeemed(_receipt);
    }
}
