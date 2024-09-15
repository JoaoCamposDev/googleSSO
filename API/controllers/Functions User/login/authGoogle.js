const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const jwt = require('jsonwebtoken');
const connection = require('../../../data/connection');

// Configura o Passport com a estratégia Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/user/auth/google/callback" // URL de callback após autenticação
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const { given_name, family_name, email } = profile._json; // Extrai dados do perfil

      const emailExists = await checkEmailExists(email); // Verifica se o e-mail existe no banco de dados

      if (!emailExists) {
        const user = {             // Dados do novo usuário
          name: given_name,        // name_user
          lastname: family_name,   // lastname_user
          email: email,            // email_user
          nickname: given_name,    // nickname_user
          fk_avatar: 1,            // fk_avatar_user
          fk_level: 1,             // fk_level_user
          XP: 0,                   // xp_user
          fk_quest: 1              // fk_quest_user
        };
        await addUserToDatabase(user); // Adiciona o usuário ao banco de dados se não existir
      }

      const token = jwt.sign({ given_name, family_name, email }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: '1h' }); // Gera o token JWT

      done(null, { token, profile }); // Conclui a autenticação com sucesso
    } catch (error) {
      done(error); // Conclui com erro se ocorrer
    }
  }
));

// Serializa e desserializa o usuário para a sessão
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Função para verificar se o e-mail já existe no banco de dados
const checkEmailExists = async (email) => {
  const executeConnection = await connection.getConnection(); // Obtém uma conexão
  try {
    const [rows] = await executeConnection.query('SELECT * FROM tbl_user WHERE email_user = ?', [email]); // Consulta o banco
    return rows.length > 0; // Retorna true se o e-mail existir
  } finally {
    await executeConnection.end(); // Fecha a conexão
  }
};

// Função para adicionar um novo usuário ao banco de dados
const addUserToDatabase = async (user) => {
  const executeConnection = await connection.getConnection(); // Obtém uma conexão
  try {
    const query = `INSERT INTO tbl_user (name_user, lastname_user, email_user, password_user, fk_level_user, fk_avatar_user, XP_user, nickname_user, fk_quest_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [user.name, user.lastname, user.email, '', user.fk_level || 1, user.fk_avatar || 1, user.XP || 0, user.nickname, user.fk_quest || 1];
    await executeConnection.query(query, values); // Executa a inserção
  } finally {
    await executeConnection.end(); // Fecha a conexão
  }
};

// Rota para iniciar o login com Google
const authGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

// Rota de callback do Google
const authGoogleCallback = passport.authenticate('google', { session: false }, (req, res) => {
  const { token, profile } = req.user; // Obtém o token e o perfil
  res.status(200).json({ token, profile }); // Retorna o token e o perfil
});

module.exports = {
  authGoogle, // Exporta a rota para iniciar o login com Google
  authGoogleCallback // Exporta a rota de callback do Google
};
