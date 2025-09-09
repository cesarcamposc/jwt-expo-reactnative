// importamos express
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
const SECRET_KEY = 'mi_clave_secreta';

app.use(bodyParser.json());
app.use(cors());

// usuario ficticio
const usuarioDemo = {
  id: 1,
  name: 'Juan Perez 1',
  email: 'juan.perez@example.com',
  password: '123456'
};

// login - genera token JWT
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Verificar credenciales
  if (email === usuarioDemo.email && password === usuarioDemo.password) {
    // Generar token
    const token = jwt.sign(
        { id: usuarioDemo.id, name: usuarioDemo.name }, 
        SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Credenciales inválidas' });
});

// Middleware para verificar token
const verificarToken = (req, res, next) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET_KEY, (err, usuario) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.user = usuario;
    next();
  });
};

// ruta protegida
app.get('/perfil', verificarToken, (req, res) => {
  res.json({ 
    message: 'Acceso concedido', 
    user: req.user
    });
});

app.listen(port, () => {
  console.log(`Servidor JWT corriendo en http://localhost:${port}`);
});