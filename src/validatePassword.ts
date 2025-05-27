export function validatePassword(password: string) {
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) return true
    return false
}