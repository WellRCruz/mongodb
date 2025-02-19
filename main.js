/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */

// importação do módulo de conexão (database.js)
const { conectar, desconectar } = require('./database.js')

// execução da aplicação
const app = async() => {
    await conectar()
}

console.clear()
app()
