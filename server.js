const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');

const port = 3009;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const sequelize = new Sequelize('lojinha', 'root', 'girafa', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

const Product = sequelize.define('Product', {
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tamanho: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  material: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();

sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao banco de dados');
  })
  .catch((erro) => {
    console.error('Erro ao conectar:', erro);
  });


app.get('/formulario', (req, res) => {
  try {
    const htmlTemplate = fs.readFileSync('formulario.html', 'utf8');
    res.send(htmlTemplate);
  } catch (error) {
    console.error('Erro ao carregar formulário:', error);
    res.status(500).send('Erro interno no servidor');
  }
});


app.post('/processar-formulario', async (req, res) => {
  try {
    const dadosDoFormulario = req.body;

    const resposta = `
      <!DOCTYPE html>
    
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Dados Recebidos do Formulário</title>
      </head>
      <body>
          <h2>Dados Recebidos do Formulário</h2>
          <table border="1">
              <tr>
                  <th>Campo</th>
                  <th>Valor</th>
              </tr>
              <tr>
                  <td>Codigo</td>
                  <td>${dadosDoFormulario.codigo}</td>
              </tr>
              <tr>
                  <td>Nome </td>
                  <td>${dadosDoFormulario.nome}</td>
              </tr>
              <tr>
                  <td>Tamanho</td>
                  <td>${dadosDoFormulario.tamanho}</td>
              </tr>
              <tr>
                  <td>Preço</td>
                  <td>${dadosDoFormulario.preco}</td>
              </tr>
              <tr>
                  <td>Cor</td>
                  <td>
                    <table border="1">
                      <tr>
                        <th>Cor</th>
                      </tr>
                      <tr>
                        <td>${dadosDoFormulario.cor}</td>
                      </tr>
                    </table>
                  </td>
              </tr>
              <tr>
                  <td>Material</td>
                  <td>${dadosDoFormulario.material}</td>
              </tr>
          </table>
      </body>
      </html>
    `;

    res.send(resposta);
  } catch (error) {
    console.error('Erro ao processar formulário:', error);
    res.status(500).send('Erro interno no servidor');
  }
});


app.post('/insereProdutos', async (req, res) => {
  try {
    const dadosDoFormulario = req.body;

    
    await Product.create({
      codigo: dadosDoFormulario.codigo,
      nome: dadosDoFormulario.nome,
      tamanho: dadosDoFormulario.tamanho,
      preco: parseFloat(dadosDoFormulario.preco),
      cor: dadosDoFormulario.cor,
      material: dadosDoFormulario.material,
    });

    res.send('Dados inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao processar formulário:', error);
    res.status(500).send('Erro interno no servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
