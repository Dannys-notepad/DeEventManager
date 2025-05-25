module.exports = async () => {
    const alphaDigits = '123456789'
    let code = ''
    for(let i = 0; i < 6; i++){
        code += alphaDigits.charAt(Math.random() * alphaDigits.length)
    }
    return code
}