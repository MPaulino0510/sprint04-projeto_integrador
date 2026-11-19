export function textoValido(valor, limite) {
    return typeof valor === "string"
        && valor.trim().length > 0
        && valor.trim().length <= limite;
}

export function inteiroPositivo(valor) {
    return typeof valor === "number"
        && Number.isSafeInteger(valor)
        && valor > 0;
}

export function validacaoEmail(email) {
    if (typeof email !== "string") return false;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email.trim());
}