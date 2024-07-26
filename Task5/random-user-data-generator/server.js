const express = require('express');
const cors = require('cors');
const { faker: fakerEN } = require('@faker-js/faker/locale/en');
const { faker: fakerFR } = require('@faker-js/faker/locale/fr');
const { faker: fakerDE } = require('@faker-js/faker/locale/de');
const { faker: fakerES_MX } = require('@faker-js/faker/locale/es_MX');
const { faker: fakerRU } = require('@faker-js/faker/locale/ru');
const { faker: fakerSV } = require('@faker-js/faker/locale/sv');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

const regionData = {
  USA: fakerEN,
  France: fakerFR,
  Germany: fakerDE,
  Mexico: fakerES_MX,
  Sweden: fakerSV,
  Russia: fakerRU
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const seedRandom = (seed) => {
  const seedRandom = require('seed-random');
  return seedRandom(seed);
};

const generateUserData = (region, errors, seed, page, recordsPerPage) => {
  const faker = regionData[region] || fakerEN;
  const random = seedRandom(seed);
  faker.seed(seed);
  let data = [];
  for (let i = 0; i < recordsPerPage; i++) {
    let user = {
      index: i + 1,
      identifier: faker.string.uuid(),
      name: `${faker.person.firstName()} ${faker.person.middleName() || ''} ${faker.person.lastName()}`,
      address: truncateString(`${faker.location.city()}, ${faker.location.streetAddress()}, ${faker.location.secondaryAddress() || ''}`, 100),
      phone: faker.phone.number()
    };
    data.push(applyErrors(user, errors, random));
  }
  return data;
};

const applyErrors = (user, errors, random) => {
  if (errors === 0) return user;
  const errorTypes = ['delete', 'add', 'swap'];
  const fields = ['name', 'address', 'phone'];
  if (errors === 10) {
    const maxErrors = Math.min(10, 1000);
    for (let i = 0; i < maxErrors; i++) {
      fields.forEach(field => {
        if (user[field]) {
          user[field] = introduceError(user[field], errorTypes[Math.floor(random() * errorTypes.length)], random);
        }
      });
    }
  } else if (errors < 10) {
    const errorProbability = errors / 10;
    fields.forEach(field => {
      if (user[field]) {
        const fieldLength = user[field].length;
        for (let i = 0; i < fieldLength; i++) {
          if (random() < errorProbability) {
            user[field] = introduceError(user[field], errorTypes[Math.floor(random() * errorTypes.length)], random);
          }
        }
      }
    });
  } else {
    const maxErrors = Math.min(errors, 1000);
    for (let i = 0; i < maxErrors; i++) {
      fields.forEach(field => {
        if (user[field]) {
          user[field] = introduceError(user[field], errorTypes[Math.floor(random() * errorTypes.length)], random);
        }
      });
    }
  }
  return user;
};

const introduceError = (value, errorType, random) => {
  const pos = Math.floor(random() * value.length);
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  switch (errorType) {
    case 'delete':
      return value.slice(0, pos) + value.slice(pos + 1);
    case 'add':
      return value.slice(0, pos) + alphabet[Math.floor(random() * alphabet.length)] + value.slice(pos);
    case 'swap':
      if (pos < value.length - 1) {
        return value.slice(0, pos) + value[pos + 1] + value[pos] + value.slice(pos + 2);
      }
      return value;
    default:
      return value;
  }
};

const truncateString = (str, maxLength) => {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

app.get('/users', (req, res) => {
  const { region, errors, seed, page, recordsPerPage } = req.query;
  const seedValue = Math.max(0, parseInt(seed));
  const userData = generateUserData(region, parseFloat(errors), seedValue, parseInt(page), parseInt(recordsPerPage));
  res.json(userData);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});