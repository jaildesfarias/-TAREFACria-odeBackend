const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const { Sequelize, DataTypes } = require('sequelize');

const port = 3001;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const sequelize = new Sequelize('lojinha', 'root', 'casa', {
  host: 'localhost',
  dialect: 'mysql',
});

const Produto = sequelize.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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

sequelize.sync().then(() => {
  console.log('Tabela sincronizada com sucesso.');
}).catch((erro) => {
  console.error('Erro ao sincronizar tabela:', erro);
});

app.get('/visualizarProdutos', async (req, res) => {
  try {
    const htmlTemplate = await fs.readFile('public/formulario.html', 'utf8');
    res.send(htmlTemplate);
  } catch (error) {
    console.error('Erro ao carregar formulário:', error);
    res.status(500).send('Erro interno no servidor');
  }
});

app.post('/insereProdutos', async (req, res) => {
  try {
    const dadosDoFormulario = req.body;
    console.log('Dados do Formulário:', dadosDoFormulario);

    await Produto.create({
      codigo: dadosDoFormulario.codigo,
      nome: dadosDoFormulario.nome,
      tamanho: dadosDoFormulario.tamanho,
      preco: parseFloat(dadosDoFormulario.preco),  
      cor: dadosDoFormulario.cor,
      material: dadosDoFormulario.material,
    });

    const resposta = `
      <!DOCTYPE html>
      <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Dados Recebidos do Formulário</title>
        </head>
        <body>
          <h2>Dados Recebidos do Formulário</h2>
          <table border="1">
            <tr>
              <th>campo</th>
              <th>valor</th>
            </tr>
            <tr>
              <td>codigo</td>
              <td>${dadosDoFormulario.codigo}</td>
            </tr>
            <tr>
              <td>Nome </td>
              <td>${dadosDoFormulario.nome}</td>
            </tr>
            <tr>
              <td>tamanho</td>
              <td>${dadosDoFormulario.tamanho}</td>
            </tr>
            <tr>
              <td>preço</td>
              <td>${dadosDoFormulario.preco}</td>
            </tr>
            <tr>
              <td>cor</td>
              <td>${dadosDoFormulario.cor}</td>
            </tr>
            <tr>
              <td>material</td>
              <td>${dadosDoFormulario.material}</td>
            </tr>
          </table>
        </body>
      </html>
    `;

    res.send(resposta);
  } catch (error) {
    console.error('Erro ao processar formulário:', error);
    res.status(500).send('Erro ao processar formulário');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
