export class FakeCartApi {
    constructor(state) {
        this.state = state;
    }

    getState() {
        return this.state ?? {
          0: {
            name: "Incredible Fish",
            price: 445,
            count: 1,
          }
        };
    }

    setState(cart) {
        console.log('setState!');
    }
}