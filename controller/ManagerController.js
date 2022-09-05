const fs = require("fs");
const qs = require("qs");
const SqlController = require("../sql/SqlController");
const cookie = require("cookie");
const sql = new SqlController();
const mySql = new SqlController();
class ManagerController {
  showHomePage(req, res) {
    fs.readFile("./src/views/manager.html", "utf-8", async (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      let html = "";
      let dataFromSql = await sql.getDataFromSql();
      dataFromSql.forEach((element, index) => {
        html += ` <tr>
        <td>${index+1}</td>
        <td>${element.namecity}</td>
        <td>${element.country}</td>
        <td><a href="/details-city?${element.idcity}"><button class="btn">Detail</button></a></td>
        <td><a href="/delete?${element.idcity}"><button class="btn">Delete</button></a></td>
        <td><a href="/edit?${element.idcity}"><button class="btn">Edit</button></a></td>
        </tr>
        `;
      });
      data = data.replace("{change}", html);
      res.write(data);
      res.end();
    });
  }
  async showDetailsCity(req, res, index) {
    let dataFromSql = await sql.getCityDetail(index);
    fs.readFile("./src/views/details.html", "utf-8", (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      let html = "";
      dataFromSql.forEach((element) => {
        if (element.idcity == index) {
          html += `
          <tr>
          <td>${element.namecity}</td>
          <td>${element.country}</td>
          <td>${element.area}</td>
          <td>${element.population}</td>
          <td>${element.gdp}</td>
          <td>${element.descriptionCity}</td>
          </tr>
          `;
        }
      });
      data = data.replace("{change}", html);
      res.write(data);
      res.end();
    });
  }
  async showViewEditCity(req, res, index) {
    // this.showDetailsCity(req, res, index);
    let dataFromSql = await sql.getCityDetail(index);
    // let html = "";
    // dataFromSql.forEach((element) => {
    //   if (element.idcity == index) {
    //     html += `
    //     <tr>
    //     <td>${element.namecity}</td>
    //     <td>${element.country}</td>
    //     <td>${element.area}</td>
    //     <td>${element.population}</td>
    //     <td>${element.gdp}</td>
    //     <td>${element.descriptionCity}</td>
    //     </tr>
    //     `;
    //   }
    // });
    let htmls = "";
    dataFromSql.forEach((element) => {
      if (element.idcity == index) {
        htmls = `
      <input type="text" class="edit-form" name="namecity" value="${element.namecity}">
      <input type="text" class="edit-form" name="country" value="${element.country}">
      <input type="text" class="edit-form" name="area" value="${element.area}">
      <input type="text" class="edit-form" name="population" value="${element.population}">
      <input type="text" class="edit-form" name="gdp" value="${element.gdp}">
      <input type="text" class="edit-form" name="descriptionCity" value="${element.descriptionCity}">
      <button class="btn-edit" type="submit">Xác nhận</button>
      `;
      }
    });
    fs.readFile("./src/views/edit.html", "utf-8", (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      data = data.replace("{input}", htmls);
      // data = data.replace("{change}", htmls);
      res.write(data);
      res.end();
    });
  }
  editCity(req, res, index) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let dataForm = qs.parse(data);

      mySql.editInfoCity(index, dataForm);
      res.writeHead(301, { location: "/" });
      res.end();
    });
  }
  deleteCity(req, res, index) {
    mySql.deleteCity(index);
    res.writeHead(301, { location: "/" });
    res.end();
  }
  showViewCreateCity(req, res) {
    fs.readFile("./src/views/create.html", "utf-8", (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      res.write(data);
      res.end();
    });
  }
  createNewCity(req, res) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let dataForm = qs.parse(data);
      sql.insertNewCity(dataForm);
      res.writeHead(301, { location: "/" });
      res.end();
    });
  }
}
module.exports = ManagerController;
