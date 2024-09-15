const mysql = require('mysql2/promise'); // Certifique-se de usar mysql2/promise para suporte a promessas

// Configurações da conexão
const config = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bd_ecoguia'
};

// Função para obter a conexão
exports.getConnection = async () => {
  try {
    const connection = await mysql.createConnection(config); // Cria uma conexão com promessas
    console.log('Conectado como ID ' + connection.threadId); // Isso não estará disponível com promessas; remova se for desnecessário
    return connection;
  } catch (err) {
    console.error('Erro ao conectar: ' + err.stack);
    throw err;
  }
};
