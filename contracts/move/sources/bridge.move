module platform::Bridge {    
    use std::signer::address_of;
    use std::account::new_event_handle;
    use std::event::{
        EventHandle,
        emit_event,
        counter as event_counter
    };
    use platform::Token;

    struct Config has key {
        redeem_authority: address,
        swap_event_handle: EventHandle<SwapEvent>
    }

    struct SwapEvent has store, drop {
        to: address,
        amount: u64
    }

    const EALREADY_INITIALIZED: u64 = 0;
    const EUNAUTHORIZED: u64 = 1;

    public entry fun initialize(account: &signer, redeem_authority: address) {
        assert!(address_of(account) == @platform, EUNAUTHORIZED);

        if (exists<Config>(@platform)) abort EALREADY_INITIALIZED;

        move_to(account, Config {
            redeem_authority,
            swap_event_handle: new_event_handle<SwapEvent>(account)
        });
    }

    public entry fun swap(from: &signer, to: address, amount: u64) acquires Config {
        Token::burn(address_of(from), amount);
        
        emit_event(
            &mut borrow_global_mut<Config>(@platform).swap_event_handle,
            SwapEvent { to, amount }
        );
    }

    #[test_only]
    public fun get_swap_event_counter(): u64 acquires Config {
        event_counter<SwapEvent>(&borrow_global<Config>(@platform).swap_event_handle)
    }
}