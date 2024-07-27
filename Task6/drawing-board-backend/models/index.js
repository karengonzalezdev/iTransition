const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'postgres'
});

const Board = require('./Board')(sequelize);
const Drawing = require('./Drawing')(sequelize);
Board.hasMany(Drawing, { foreignKey: 'boardId' });
Drawing.belongsTo(Board, { foreignKey: 'boardId' });
sequelize.sync();

module.exports = {
  sequelize,
  Board,
  Drawing
};