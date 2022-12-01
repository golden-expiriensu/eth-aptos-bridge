module platform::Bridge {    
    use std::signer::address_of;
    use std::account::new_event_handle;
    use std::event::{
        EventHandle,
        emit_event,
    };
    use platform::PlatformToken;

    #[test_only]
    use std::event::counter as event_counter;

    struct Config has key {
        executor: address,
        feeE12: u64,
        treasure: address,
        swap_event_handle: EventHandle<SendEvent>
    }

    struct SendEvent has store, drop {
        to: address,
        to_chain: u64,
        amount: u64
    }

    // 100e12
    const WHOLE_PERCENT: u64 = 100000000000000;

    const EALREADY_INITIALIZED: u64 = 0;
    const EWRONG_FEE: u64 = 1;
    const EUNAUTHORIZED: u64 = 2;
    const ENOTHING_TO_CLAIM: u64 = 3;

    public entry fun initialize(account: &signer, executor: address, feeE12: u64, treasure: address) {
        assert!(address_of(account) == @platform, EUNAUTHORIZED);
        assert!(feeE12 < WHOLE_PERCENT, EWRONG_FEE);

        if (exists<Config>(@platform)) abort EALREADY_INITIALIZED;

        move_to(account, Config {
            executor,
            feeE12,
            treasure,
            swap_event_handle: new_event_handle<SendEvent>(account)
        });
    }

    public entry fun send<PlatformToken>(from: &signer, to: address, to_chain: u64, amount: u64) acquires Config {
        PlatformToken::burn<PlatformToken>(address_of(from), amount);
        
        emit_event(
            &mut borrow_global_mut<Config>(@platform).swap_event_handle,
            SendEvent { to, to_chain, amount }
        );
    }

    #[test_only]
    public fun get_send_event_counter(): u64 acquires Config {
        event_counter<SendEvent>(&borrow_global<Config>(@platform).swap_event_handle)
    }
}