const mysql = require("mysql");
class SqlController {
  connect = this.connectionDatabase();
  connectionDatabase() {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456@Abc",
      database: "module3",
    });

    connection.connect();
    return connection;
  }
  getDataFromSql() {
    const sql = `select idcity ,namecity, country from listcity`;
    return new Promise((resolve, reject) => {
      this.connect.query(sql, (err, result) => {
        if (err) {
          reject(err.message);
        }
        resolve(result);
      });
    });
  }
  getCityDetail(index) {
    const sql = `select * from listcity where idcity = ${index}`;
    return new Promise((resolve, reject) => {
      this.connect.query(sql, (err, result) => {
        if (err) {
          reject(err.message);
        }
        resolve(result);
      });
    });
  }
  editInfoCity(index, data) {
    console.log(data)
    const sql = `update listcity set namecity = '${data.namecity}' , country = '${data.country}', area = ${data.area}, 
    population = ${data.population}, gdp = ${data.gdp}, descriptionCity = '${data.descriptionCity}' where idcity = ${index}`;
    this.connect.query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("update success info city");
    });
  }
 
  deleteCity(index) {
    
    let sqlDelete = `delete from listcity where idcity = ${Number(index)}`;
    
    this.sqlDelete(sqlDelete);
  }
  sqlDelete(sql) {
    this.connectionDatabase().query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("Delete Success");
    });
  }

  insertNewCity(data) {
    console.log(data);

    const sql = `insert into listcity(namecity, country,area, population,gdp, descriptionCity) values
    ('${(data.namecity)}','${(data.country)}',${Number(data.area)}, ${Number(data.population)} ,${Number(data.gdp)} , '${
      data.descriptionCity}')`;
    this.connect.query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("insert success City details");
    });
  }
}
module.exports = SqlController;
