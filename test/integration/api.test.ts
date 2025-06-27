import axios from "axios"

axios.defaults.validateStatus = function () {
    return true
}

test('Must create a Passenger account', async function() {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    const responseSignup = await axios.post("http://localhost:3001/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();

    const responseGetAccount = await axios.get(`http://localhost:3001/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
})

test('Should not create a Passenger account if name is invalid', async function() {
    const input = {
        name: 'John',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    const responseSignup = await axios.post('http:localhost:3000/signup', input)
    expect(responseSignup.status).toBe(422)
    const outputSignup = responseSignup.data
    expect(outputSignup.message).toBe('Invalid name')
})
