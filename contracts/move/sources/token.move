module platform::Token {
    use aptos_framework::coin;
    use std::signer::address_of;
    use std::string;

    friend platform::Bridge;

    struct Token {}

    struct Capabilities<phantom Token> has key {
        mint_capability: coin::MintCapability<Token>,
        burn_capability: coin::BurnCapability<Token>
    }

    const ENOT_OWNER: u64 = 0;

    public entry fun initialize(account: &signer) {
        assert!(address_of(account) == @platform, ENOT_OWNER);
        
        let (burn_capability, freeze_capability, mint_capability) = coin::initialize<Token>(
            account,
            string::utf8(b"Vuuto Waque"),
            string::utf8(b"VWQ"),
            18,
            true,
        );

        coin::destroy_freeze_cap(freeze_capability);

        move_to<Capabilities<Token>>(account, Capabilities<Token> {
            mint_capability,
            burn_capability
        });
    }

    public(friend) fun mint(to: address, amount: u64) acquires Capabilities {
        let capabilities = borrow_global<Capabilities<Token>>(@platform);

        let resourse = coin::mint<Token>(amount, &capabilities.mint_capability);

        coin::deposit(to, resourse);
    }

    public(friend) fun burn(from: address, amount: u64) acquires Capabilities {
        let capabilities = borrow_global<Capabilities<Token>>(@platform);

        coin::burn_from<Token>(from, amount, &capabilities.burn_capability);
    }

    #[test_only]
    public fun mint_tokens_for_tests(to: address, amount: u64) acquires Capabilities {
        mint(to, amount);
    }
}