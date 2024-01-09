const {sequelize} = require('./src/models');
const express = require('express');
const cors = require('cors');
const verifyJWT = require('./src/middleware/verify.JWT');
const cookieParser = require('cookie-parser');
const credentials = require('./src/middleware/credentials');


const app = express();
const PORT = process.env.PORT || 3900;

app.use(credentials);

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(express.json());
app.use(cookieParser());

app.use('/users', require('./src/routes/api/users'));
app.use('/auth',require('./src/routes/api/auth'));
app.use('/refresh', require('./src/routes/api/refresh'));
app.use('/logout', require('./src/routes/api/logout'));

app.use(verifyJWT);
app.use('/posts', require('./src/routes/api/posts'));
app.use('/comments',require('./src/routes/api/comments'));


app.listen(PORT, async()=>{
    console.log(`server is running on http://localhost:${PORT}`);
    await sequelize.authenticate();
})