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

export function validacaoEmail(email){
    const regexEmail = /^[^\s@]+@(gmail|hotmail|outlook|yahoo)\.com(\.br)?$/i;

    if (!regexEmail.test(email)){
        return false;
    }
    return true;
}