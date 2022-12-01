module platform::SupportedTokens {
    struct Native {}
    
    struct USDT {}
}

module platform::PlatformToken {
    use aptos_framework::coin;
    use std::signer::address_of;
    use std::string;

    friend platform::Bridge;

    struct Capabilities<phantom SupportedToken> has key {
        mint_capability: coin::MintCapability<SupportedToken>,
        burn_capability: coin::BurnCapability<SupportedToken>
    }

    const ENOT_OWNER: u64 = 0;

    public entry fun initialize<SupportedToken>(account: &signer, name: vector<u8>, symbol: vector<u8>) {
        assert!(address_of(account) == @platform, ENOT_OWNER);
        
        let (burn_capability, freeze_capability, mint_capability) = coin::initialize<SupportedToken>(
            account,
            string::utf8(name),
            string::utf8(symbol),
            18,
            true,
        );

        coin::destroy_freeze_cap(freeze_capability);

        move_to<Capabilities<SupportedToken>>(account, Capabilities<SupportedToken> {
            mint_capability,
            burn_capability
        });
    }

    public(friend) fun mint<SupportedToken>(to: address, amount: u64) acquires Capabilities {
        let capabilities = borrow_global<Capabilities<SupportedToken>>(@platform);

        let resourse = coin::mint<SupportedToken>(amount, &capabilities.mint_capability);

        coin::deposit(to, resourse);
    }

    public(friend) fun burn<SupportedToken>(from: address, amount: u64) acquires Capabilities {
        let capabilities = borrow_global<Capabilities<SupportedToken>>(@platform);

        coin::burn_from<SupportedToken>(from, amount, &capabilities.burn_capability);
    }

    #[test_only]
    public fun mint_tokens_for_tests<SupportedToken>(to: address, amount: u64) acquires Capabilities {
        mint<SupportedToken>(to, amount);
    }
}