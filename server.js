const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: '7386',
		database: 'Lecama' 
	}
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

console.log(db.select('*').from('Register').then(data => {
	console.log(data[1].name)
}))

app.get('/', (req, res) => { res.json("it working") })

app.post('/register', (req, res) => {
	const { name, email, username, password } = req.body;
	if(!name || !email || !username || !password){
		return res.status(400).json('Bad form submittion request')
	}
	const hash = bcrypt.hashSync(password);
	

	db.transaction(trx => {
		trx.insert({
			name: name,
			email: email,
			username: username,
			password: hash,
			joined: new Date()
		}).into('Register')
		.returning('*')
		.then(console.log("sent"))
		.then(trx.commit)
		.catch(trx.rollback)
	})
	
	// .catch(err => res.status(400).json('User alreay exist'))
	// db.transaction(trx => {
	// 	trx.insert({
	// 		hash: hash, 
	// 		username: username
	// 	})
	// 	.into('Login')
	// 	.returning('username')
	// 	.then(username => {
	// 		return	trx('users') 
	// 		.returning('*') 
	// 		.insert({
	// 			name: name,
	// 			email: loginEmail[0],
	// 			username: username,
	// 			password: hash,
	// 			joined: new Date()
	// 		})
	// 		.then(user => {
	// 			res.json(user[0])
	// 		}) 
	// 	})
	// 	.then(trx.commit)
	// 	.catch(trx.rollback)
	// })
	// .catch(err => res.status(400).json('User alreay exist'))

 })
// app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
// app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
// app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db) })
// app.put('/image', (req, res) => {image.handleImage(req, res, db) })
// app.post('/imageUrl', (req, res) => {image.handleApiRequest(req, res,) })


app.listen(process.env.PORT || 3000, ()=> {
	// console.log(`app is running on port ${process.env.PORT}`);
	console.log(`app is running on port ${process.env.PORT} || 3000`)
}); 

