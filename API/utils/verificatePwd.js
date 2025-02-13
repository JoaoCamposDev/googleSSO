// função de verificação de senha
function verificatePwd(senha){
    // verifica o tamanho da senha de no mínimo 8 caracteres
    let mensagem = ""
    if(senha.length < 8){
        mensagem = "A senha deve ter pelo menos 8 caracteres"
        return [false, mensagem]
    }

    // verifica se a senha contêm letras minúsculas
    let minuscula = senha.match(/[a-z]/g)
    if(minuscula == null){
        mensagem = "Senha inválida, por favor inclua letras minúsculas na sua senha!"
        return [false, mensagem]
    }

    // verifica se a senha contêm letras maiúsculas
    let maiscula = senha.match(/[A-Z]/g)
    if(maiscula == null){
        mensagem = "Senha inválida, por favor inclua letras maiúscula na sua senha!"
        return [false, mensagem]
    }

    // verifica se a senha contêm números
    let numero = senha.match(/[0-9]/g)
    if(numero == null){
        mensagem = "Senha inválida, por favor inclua números na sua senha!"
        return [false, mensagem]
    }

    // verifica se a senha contêm caracteres especiais
    let caracteres = senha.match(/\W|_/)
    if(caracteres == null){
        mensagem = "Senha inválida, por favor inclua caracteres especiais na sua senha!"
        return[false,mensagem]
    }

    //caso todas as validações tenham sido verificadas, retorna 'true'
    return [true,true]

};

module.exports = verificatePwd; 