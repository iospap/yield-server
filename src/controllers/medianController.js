const { median: sql } = require('../sql');
const { pgp, connect } = require('../utils/dbConnectionPostgres');

const tableName = 'median';

const getMedian = async () => {
  const conn = await connect();

  const response = await conn.query(sql.getMedian);

  if (!response) {
    return new AppError(`Couldn't get ${tableName} data`, 404);
  }

  return response;
};

const insertMedian = async (payload) => {
  const conn = await connect();

  const columns = ['uniquePools', 'medianAPY', 'timestamp'];
  const cs = new pgp.helpers.ColumnSet(columns, { table: tableName });
  // multi row insert
  const query = pgp.helpers.insert(payload, cs);
  const response = await conn.result(query);

  if (!response) {
    return new AppError(`Couldn't insert ${tableName} data`, 404);
  }

  return {
    status: 'success',
    response: `Inserted ${payload.length} samples`,
  };
};

module.exports = {
  getMedian,
  insertMedian,
};