const express =  require('express')
const cors = require('cors')
const routes = require('./routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

/* 
Método HTTP:

Get: Buscar uma informação de back-end
Post: Criar uma informação no Back-end
Put: Alterar uma informação no back-end
Delete: deletar uma informação no back-end

*/

/*
Tipo de parâmetros

Query: Parâmetros nomeados enviados na rota após "?" (Filtros, Paginação)
Route: Parâmetros ultilizados para identificar recursos
Request Body: Corpo da requisição, ultilizado para criar ou alterar recurso
*/



app.listen(3333)