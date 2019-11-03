const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const config = require('config');

// List of Routes
const items = require('./routes/api/items');
const userRegistration = require('./routes/api/users');
const userLogin = require('./routes/api/auth');

const app = express();

// BodyParser Middleware
app.use(express.json());

// DB Config
const db = config.get('mongoURI');

// Connect to MongoDB
mongoose
	.connect(db, {							// Adding new mongo url parser
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => console.log("MongoDB Connected..."))
	.catch(err => console.log(err));

// Use Routes
app.use('/api/items', items);
app.use('/api/users', userRegistration);
app.use('/api/auth', userLogin);

// Serve static assets if in production
if(process.env.NODE_ENV === 'production') {
	// Set static folder, client/build path, where your index.html file is
	app.use(express.static('client/build'));

	// Loads that index.html
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	});
}

// Now run your server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`))