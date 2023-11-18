import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const app = express();

app.use(express.json());

const SECRET = process.env.SECRET;

// lista negra para guardar os tokens inválidos
let blackList = [];

// middleware para checar o token
function checkJwt(request, response, next) {
  const token = request.headers.authorization;

  
  const index = blackList.find(tokenParam => tokenParam == token);
  // verifica se há um token inválido na black list
  if(index !== undefined) return response.status(401).send('Token expirado');

  jwt.verify(token, SECRET, (err, decoded) => {
    if(err) return response.status(401).send('Get out of here');
    request.userId = decoded.id;
    next();
  });
}

app.post('/login', (request, response) => {
  if(request.body.username === 'fafa' && request.body.password === '123') {
    const access_token = jwt.sign({ id: 1 }, SECRET, { expiresIn: '2min' });
    return response.status(200).json({ success: true, access_token });
  }
  return response.status(401).json({ success: false, message: 'Usuário e/ou senha errados' });
});

app.post('/logout', (request, response) => {
  blackList.push(request.headers.authorization);
  return response.status(200).send('Algo');
});

// rota privada com jwt
app.get('/clientes', checkJwt, (request, response) => {
  return response.status(200).json([{ id: request.userId, name: 'Fabrício Lopes' }]);
});

app.listen(process.env.PORT, () => console.log('Cuida'));