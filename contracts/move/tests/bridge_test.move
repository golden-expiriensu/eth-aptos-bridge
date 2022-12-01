#[test_only]
module platform::BridgeTests {
    use std::account::create_account_for_test;
    use std::coin;

    use platform::PlatformToken;
    use platform::SupportedTokens::USDT;
    use platform::Bridge;

    // 1%
    const PLATFORM_FEE: u64 = 1000000000000;
    // 100%
    const TOO_BIG_FEE: u64 = 100000000000000;

    #[test]
    #[expected_failure(abort_code=0)]
    fun should_forbid_to_initialize_twice() {
        let account = create_account_for_test(@platform);
        
        Bridge::initialize(&account, @platform, PLATFORM_FEE, @platform);
        Bridge::initialize(&account, @platform, PLATFORM_FEE, @platform);
    }

    #[test]
    #[expected_failure(abort_code=1)]
    fun should_forbid_to_initialize_with_too_big_fee() {
        let account = create_account_for_test(@platform);
        
        Bridge::initialize(&account, @platform, TOO_BIG_FEE, @platform);
    }

    #[test(false_owner=@0xFA15E)]
    #[expected_failure(abort_code=2)]
    fun should_forbid_to_initialize_from_not_owner(false_owner: address) {
        let account = create_account_for_test(false_owner);

        Bridge::initialize(&account, @platform, PLATFORM_FEE, @platform);
    }

    #[test(from_addr=@0xA115E, to_addr=@0xB0B)]
    fun should_successfully_send(from_addr: address, to_addr: address) {
        let send_amount = 850000;
        
        initialize_modules();
        let (from_acc, _) = initialize_users(from_addr, to_addr);

        PlatformToken::mint_tokens_for_tests<USDT>(from_addr, send_amount);

        assert!(coin::balance<USDT>(from_addr) == send_amount, 0);
        assert!(coin::balance<USDT>(to_addr) == 0, 1);

        Bridge::send<USDT>(&from_acc, to_addr, 1, send_amount);

        assert!(coin::balance<USDT>(from_addr) == 0, 2);
        assert!(coin::balance<USDT>(to_addr) == 0, 3);
    }

    #[test(from_addr=@0xA115E, to_addr=@0xB0B)]
    fun should_emit_send_event(from_addr: address, to_addr: address) {
        let send_amount = 123;
        
        initialize_modules();
        let (from_acc, _) = initialize_users(from_addr, to_addr);

        PlatformToken::mint_tokens_for_tests<USDT>(from_addr, send_amount);

        assert!(Bridge::get_send_event_counter() == 0, 4);

        Bridge::send<USDT>(&from_acc, to_addr, 1, send_amount);

        assert!(Bridge::get_send_event_counter() == 1, 5);
    }

    #[test(from_addr=@0xA115E, to_addr=@0xB0B)]
    #[expected_failure(abort_code=65542)]
    fun should_fail_if_not_enough_tokens_on_from_addr(from_addr: address, to_addr: address) {
        let send_amount = 1000000;

        initialize_modules();
        let (from_acc, _) = initialize_users(from_addr, to_addr);

        PlatformToken::mint_tokens_for_tests<USDT>(from_addr, send_amount - 1);

        Bridge::send<USDT>(&from_acc, to_addr, 1, send_amount);
    }

    fun initialize_modules() {
        let account = create_account_for_test(@platform);

        PlatformToken::initialize<USDT>(&account, b"TestToken", b"TTT");        
        Bridge::initialize(&account, @platform, PLATFORM_FEE, @platform);
    }

    fun initialize_users(from_addr: address, to_addr: address): (signer, signer) {
        let from_acc = create_account_for_test(from_addr);
        let to_acc = create_account_for_test(to_addr);

        coin::register<USDT>(&from_acc);
        coin::register<USDT>(&to_acc);

        (from_acc, to_acc)
    }
}