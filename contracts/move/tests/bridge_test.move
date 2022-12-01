#[test_only]
module platform::BridgeTests {
    use std::account::create_account_for_test;
    use std::coin;

    use platform::Token;
    use platform::Token::Token as TokenType;
    use platform::Bridge;

    #[test]
    #[expected_failure(abort_code=0)]
    fun should_forbid_to_initialize_twice() {
        let account = create_account_for_test(@platform);
        
        Bridge::initialize(&account, @platform);
        Bridge::initialize(&account, @platform);
    }

    #[test(false_owner=@0xFA15E)]
    #[expected_failure(abort_code=1)]
    fun should_forbid_to_initialize_from_not_owner(false_owner: address) {
        let account = create_account_for_test(false_owner);

        Bridge::initialize(&account, @platform);
    }

    #[test(from_addr=@0xA115E, to_addr=@0xB0B)]
    fun should_successfully_swap(from_addr: address, to_addr: address) {
        let swap_amount = 850000;
        
        initialize_modules();
        let (from_acc, _) = initialize_users(from_addr, to_addr);

        Token::mint_tokens_for_tests(from_addr, swap_amount);

        assert!(coin::balance<TokenType>(from_addr) == swap_amount, 0);
        assert!(coin::balance<TokenType>(to_addr) == 0, 1);

        Bridge::swap(&from_acc, to_addr, swap_amount);

        assert!(coin::balance<TokenType>(from_addr) == 0, 2);
        assert!(coin::balance<TokenType>(to_addr) == 0, 3);
    }

    #[test(from_addr=@0xA115E, to_addr=@0xB0B)]
    fun should_emit_swap_event(from_addr: address, to_addr: address) {
        let swap_amount = 123;
        
        initialize_modules();
        let (from_acc, _) = initialize_users(from_addr, to_addr);

        Token::mint_tokens_for_tests(from_addr, swap_amount);

        assert!(Bridge::get_swap_event_counter() == 0, 4);

        Bridge::swap(&from_acc, to_addr, swap_amount);

        assert!(Bridge::get_swap_event_counter() == 1, 5);
    }

    #[test(from_addr=@0xA115E, to_addr=@0xB0B)]
    #[expected_failure(abort_code=65542)]
    fun should_fail_if_not_enough_tokens_on_from_addr(from_addr: address, to_addr: address) {
        let swap_amount = 1000000;

        initialize_modules();
        let (from_acc, _) = initialize_users(from_addr, to_addr);

        Token::mint_tokens_for_tests(from_addr, swap_amount - 1);

        Bridge::swap(&from_acc, to_addr, swap_amount);
    }

    fun initialize_modules() {
        let account = create_account_for_test(@platform);

        Token::initialize(&account);        
        Bridge::initialize(&account, @platform);
    }

    fun initialize_users(from_addr: address, to_addr: address): (signer, signer) {
        let from_acc = create_account_for_test(from_addr);
        let to_acc = create_account_for_test(to_addr);

        coin::register<TokenType>(&from_acc);
        coin::register<TokenType>(&to_acc);

        (from_acc, to_acc)
    }
}