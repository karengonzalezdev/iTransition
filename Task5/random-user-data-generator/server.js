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
const generateUserData = (region, errors, seed, page, recordsPerPage) => {
  const faker = regionData[region] || fakerEN;
  faker.seed(seed + page);
  let data = [];
  for (let i = 0; i < recordsPerPage; i++) {
    let user = {
      index: i + 1,
      identifier: faker.string.uuid(),
      name: `${faker.person.firstName()} ${faker.person.middleName() || ''} ${faker.person.lastName()}`,
      address: `${faker.location.city()}, ${faker.location.streetAddress()}, ${faker.location.secondaryAddress() || ''}`,
      phone: faker.phone.number()
    };
    data.push(applyErrors(user, errors));
  }
  return data;
};

const applyErrors = (user, errors) => {
  const errorTypes = ['delete', 'add', 'swap'];
  for (let i = 0; i < errors; i++) {
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    const fields = ['name', 'address', 'phone'];
    const field = fields[Math.floor(Math.random() * fields.length)];
    if (user[field]) {
      user[field] = introduceError(user[field], errorType);
    }
  }
  return user;
};

const introduceError = (value, errorType) => {
  const pos = Math.floor(Math.random() * value.length);
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  switch (errorType) {
    case 'delete':
      return value.slice(0, pos) + value.slice(pos + 1);
    case 'add':
      return value.slice(0, pos) + alphabet[Math.floor(Math.random() * alphabet.length)] + value.slice(pos);
    case 'swap':
      if (pos < value.length - 1) {
        return value.slice(0, pos) + value[pos + 1] + value[pos] + value.slice(pos + 2);
      }
      return value;
    default:
      return value;
  }
};

app.get('/users', (req, res) => {
  const { region, errors, seed, page, recordsPerPage } = req.query;
  const userData = generateUserData(region, parseFloat(errors), parseInt(seed), parseInt(page), parseInt(recordsPerPage));
  res.json(userData);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});