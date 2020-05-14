const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const admin = data.admin;
const posts = data.posts;
const health = data.health
const exercise = data.exercise
const groups = data.groups
const bcrypt = require('bcryptjs');

const main = async () => {
	const db = await dbConnection();
	await db.dropDatabase();

	// create admin
	const adName = 'admin';
	const adPassword = 'PatrickHill';
	const adHash = await bcrypt.hash(adPassword, 15);
	await admin.create(adName, adHash);
	
	// create groups
	await groups.create('Running Club', 'Taking part in a marathon', 'Endless life, endless running!');
	await groups.create('Great White Shark', 'Swimming across the English Channel', 'We are sharks!');
	await groups.create('Mountain Peek', 'Climbing Mount Everest', 'Why climb? Because it is there!');
	
	// create users with posts/exercise/health
	const time = new Date();
	
	const userPassword1 = 'JohnSmith1234';
	const userHash1 = await bcrypt.hash(userPassword1, 15);
	const john = await users.create("John", "Smith", "jsmith1234", "male" , "jsmith@gmail.com", "Hoboken" , "NJ" , "30" , userHash1);
	const johnId = john._id;
	await posts.create(johnId, 'https://pic2.zhimg.com/1c40ab3114ffa3e9344d25559e46fdd4_1200x500.jpg', 'Be a snow boy', time);
	await posts.create(johnId, 'https://pic4.zhimg.com/743bd4fae3e8a52808c9140923b134bf_1200x500.jpg', 'Beautiful castle', time);
	await health.create(johnId);
	await exercise.create(johnId);

	const userPassword2 = 'lovelymagic';
	const userHash2 = await bcrypt.hash(userPassword2, 15);
	const harry = await users.create("Harry", "Potter", "magicboy", "male" , "harp@Hogwarts.edu", "London" , "UK" , "18" , userHash2);
	const harryId = harry._id;
	await posts.create(harryId, 'https://pic3.zhimg.com/cc03cba6c81e21adca8a11f8817170b1_1200x500.jpg', 'Favorite movie', time);
	await posts.create(harryId, 'https://pic2.zhimg.com/8094185cde3d4f70a60887e4d71c0e0f_1200x500.jpg', 'Somewhere to go', time);
	await health.create(harryId);
	await exercise.create(harryId);

	const userPassword3 = 'youcannotguess';
	const userHash3 = await bcrypt.hash(userPassword3, 15);
	const bill = await users.create("Bill", "Wang", "mystery", "male" , "mystery@outlook.com", "Beijing" , "Beijing" , "66" , userHash3);
	const billId = bill._id;
	await posts.create(billId, 'https://pic2.zhimg.com/9f825c52102b184d2c636f0aa3b02135_1200x500.jpg', 'Feel young again', time);
	await posts.create(billId, 'https://pic2.zhimg.com/5434f40a0f0e8dd6eb7f89d37432359a_1200x500.jpg', 'My sculpture', time);
	await health.create(billId);
	await exercise.create(billId);
    
	console.log('Done!');
	await db.serverConfig.close();
}

main().catch(console.log);