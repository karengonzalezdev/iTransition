const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Drawing = sequelize.define('Drawing', {
    boardId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Boards',
        key: 'id'
      },
      allowNull: false
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  });
  return Drawing;
};