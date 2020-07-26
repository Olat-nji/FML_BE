const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({
  path: '.env',
});

// Load models
const Campaign = require('./src/models/Campaign');
const User = require('./src/models/User');
const Faq = require('./src/models/Faq');
const Recommendation = require('./src/models/Recommendation');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const campaigns = JSON.parse(
  fs.readFileSync(`${__dirname}/src/_data/campaigns.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/src/_data/users.json`, 'utf-8')
);

const faqs = JSON.parse(
  fs.readFileSync(`${__dirname}/src/_data/faqs.json`, 'utf-8')
);

const recommendations = JSON.parse(
  fs.readFileSync(`${__dirname}/src/_data/recommendations.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Campaign.create(campaigns);
    await User.create(users);
    await Faq.create(faqs);
    await Recommendation.create(recommendations);

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Campaign.deleteMany();
    await User.deleteMany();
    await Faq.deleteMany();
    await Recommendation.deleteMany();

    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
