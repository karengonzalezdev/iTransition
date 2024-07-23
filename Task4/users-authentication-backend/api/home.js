module.exports = (req, res) => {
  if (req.method === 'GET') {
    res.status(200).send('Hello World! Your server is running.');
  } else {
    res.status(405).send({ message: 'Method Not Allowed' });
  }
};