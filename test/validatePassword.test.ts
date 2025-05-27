import { validatePassword } from "../src/validatePassword"

test.each([
    'asdfgH123', 'asdG123456', 'aG1aG12399'
])('Must validate password %s', function(password: string) {
    const isValid = validatePassword(password)
    expect(isValid).toBe(true)
})

test.each([
    '', 'asD123', '12345678', 'asdfghjkl', 'ASDFGHJKL', 'asdfg123'
])('Should not validate password %s', function(password: string) {
    const isValid = validatePassword(password)
    expect(isValid).toBe(false)
})