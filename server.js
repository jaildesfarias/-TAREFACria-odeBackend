const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
{}
const sequelize = new Sequelize('lojinha', 'aluno', 'ifpe2023, {
  host: 'localhost',
  dialect: 'mysql',
});

const Produto = sequelize.define('Produto', {
  campo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  vestido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const port = 3000;

app.route('/produtos')
  .get(async (req, res) => {
    try {
      const produtos = await Produto.findAll();
      let todosProdutos = "";
      produtos.forEach(produto => {
        todosProdutos += "Campo " + produto.campo;
        todosProdutos += " Vestido " + produto.vestido;
        todosProdutos += " Preço " + produto.preco;
        todosProdutos += " Marca " + produto.marca;
        todosProdutos += "<br>";
      });
      res.send('<b>Veja nossos produtos</b>' + todosProdutos);
    } catch (error) {
      console.error('Erro ao recuperar produtos do banco de dados:', error);
      res.status(500).send('Erro interno do servidor');
    }
  })
  .post(urlencodedParser, async (req, res) => {
    try {
      const nomeFiltro = req.body.nome;
      const precoMaximo = parseFloat(req.body.precoMaximo);

      const resultadoBusca = await Produto.findAll({
        where: {
          vestido: {
            [Sequelize.Op.like]: `%${nomeFiltro}%`,
          },
          preco: {
            [Sequelize.Op.lte]: precoMaximo,
          },
        },
      });

      let todosProdutos = "";
      resultadoBusca.forEach(produto => {
        todosProdutos += "Campo " + produto.campo;
        todosProdutos += " Vestido " + produto.vestido;
        todosProdutos += " Preço " + produto.preco;
        todosProdutos += " Marca " + produto.marca;
        todosProdutos += "<br>";
      });

      const novoProduto = await Produto.create({
        campo: resultadoBusca.length + 1,
        vestido: req.body.vestido,
        preco: parseFloat(req.body.preco),
        marca: req.body.marca,
      });

      console.log("Novo produto inserido com sucesso!");
      res.send("<p><b>Bem-vindo à minha lojinha!!</b></br>" + todosProdutos);
    } catch (error) {
      console.error('Erro ao buscar ou inserir produtos no banco de dados:', error);
      res.status(500).send('Erro interno do servidor');
    }
  });

sequelize.sync()
  .then(() => {
    console.log('Modelo sincronizado com o banco de dados');
    app.listen(port, () => {
      console.log(`Esta aplicação está escutando a porta ${port}`);
    });
  })
  .catch(error => {
    console.error('Erro ao sincronizar modelo com o banco de dados:', error);
  });
