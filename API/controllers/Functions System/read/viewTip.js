const connection = require("../../../data/connection")

exports.getTip = async (req, res) => {
    const executeConnection = connection.getConnection();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    let responseSent = false;
  
    try {
      // Busca a dica diária do dia
      const getDailyTipQuery = `
        SELECT * FROM ViewAllTip WHERE isDailyTip = 1 AND DATE(date_tip) = ?
      `;
      executeConnection.query(getDailyTipQuery, [formattedDate], async (error, dailyTipResults) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ msg: "Erro ao buscar dica diária." });
        }
  
        let tip;
        if (dailyTipResults.length > 0) {
          // Dica diária encontrada, retorna ela
          tip = dailyTipResults[0];
        } else {
          // Não encontrou dica diária, busca uma aleatória
          const getRandomTipQuery = `
            SELECT * FROM ViewAllTip ORDER BY RAND() LIMIT 1
          `;
          executeConnection.query(getRandomTipQuery, (error, randomTipResults) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ msg: "Erro ao buscar dica aleatória." });
            }
            tip = randomTipResults[0];
  
            // Salva a dica aleatória como dica diária
            const updateTipQuery = `
              UPDATE ViewAllTip SET isDailyTip = 1 WHERE id = ?
            `;
            executeConnection.query(updateTipQuery, [tip.id], (error) => {
              if (error) {
                console.error(error);
                // Lidar com o erro de atualização
              }
            });
          });
        }
  
        if (!responseSent) {
          if (tip) {
            return res.json(tip);
          } else {
            return res.status(404).json({ msg: "Nenhuma dica disponível no momento." });
          }
        }
      });
    } catch (error) {
      console.error("Algo deu errado ao buscar dica, tente novamente: ", error);
      if (!responseSent) {
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
      }
    }
  };