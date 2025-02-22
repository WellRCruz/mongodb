/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */


// Importação do módulo de conexão (database.js)
const { conectar, desconectar } = require('./database.js')

/**
 * Processo principal
 * Estudo do CRUD com o MongoDB
 */

//importação do pacote string-similarity para aprimorar a busca por nome
const stringSimilarity = require('string-similarity')

//importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')

//CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpfCliente: cpfCli
            }
        )
        // a linha abaixo salva o dados do cliente no banco
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso.")
    } catch (error) {
        // Tratamento de exceções específicas

        if (error.code = 11000) {
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}

// CRUD Read - Função para listar todos os clientes cadastrados por ordem alfabética
const listarClientes = async () => {
    try {
        const clientes = await clienteModel.find().sort(
            {
                nomeCliente: 1
            }
    )
        
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }
}

// CRUD Read - Função para buscar um cliente específico
//passado parâmetro nome, como pode ser alterdo o cpf
const buscarCliente = async (nome) => {
    try {
        // find () buscar
        // nomeCliente: new RegExp(nome) filtro pelo nome (partes que contenham (expressão regular))
        // 'i' insensitive (ignorar letras maiúsculas ou minúsculas)
        const cliente = await clienteModel.find({ nomeCliente: new RegExp(nome, 'i') })

        //calcular a similaridade entre os nomes retornados e o nome pesquisado
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)

        // validação (se não existir o cliente pesquisado)
        if (nomesClientes.length === 0) {
            console.log("Cliente não cadastrado")
        } else {
            const match = stringSimilarity.findBestMatch(nome, nomesClientes)
            // cliente com melhor similaridade
            const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)
            // Formatação da data
            const clienteFormatado = {
                nomeCliente: melhorCliente.nomeCliente,
                foneCliente: melhorCliente.foneCliente,
                cpfCliente: melhorCliente.cpfCliente,
                dataCadastro: melhorCliente.dataCadastro.toLocaleString('pt-BR')
            }
            console.log(clienteFormatado)
        }



    } catch (error) {
        console.log(error)
    }
}

//===============================================================================

// execução da aplicação

const app = async () => {
    await conectar()
    //await criarCliente("Leandro Ramos", "99999-0000", "142.222.444.02")
    //await criarCliente("Vitor de Assis Passos", "999999-0000", "142.222.444.01")
    //await criarCliente("Gustavo Nunes", "99999-0000", "142.222.444.03")
    //await criarCliente("Luiz Grilo", "99999-0000", "142.222.444.04")
    //await criarCliente("Thiago Lenda Apple", "99999-0000", "142.222.444.05")
    //CRUD - Read (Exemplo 1 - listar clientes)
    //await listarClientes()
    //CRUD Read (Exemplo 2 - buscar cliente)
    await buscarCliente("Wellington R Cruz")
    await desconectar()

}

console.clear()
app()