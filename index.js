import express from "express";
import moment from "moment";
import csv from "csvtojson";
import * as fs from 'fs';
import chalk from 'chalk';
import { PostProductAPI } from './src/utils/PostProduct.js';
import { GetProductsAPI } from "./src/utils/GetProducts.js";

let currentTime = moment().format('dddd-h-mm-ss');

const app = express();

/* Saludo de SERVICIO GET - ROOT STATUS */
app.get("/", (req, res) => {
    res.send("Api Ellaglams Helper At your Service V.1.0");
    console.log("express listening");
});

//FLUJO tranformacion CSV a JSON
app.get('/csv', (req, res) => { // enpoint example + query => http://localhost:4000/csv/?folder=bloomingdales&page=1
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Origin", "*")
    let folder = req.query.folder;
    let page = req.query.page;

    //filepaths
    const csvFilePath = `src/csv/${folder}/links_${page}.csv`; // your csv file path
    let jsonFilePath = `src/json/${folder}_links_${page}.json`; // your json file path
    let jsonParcedFilePath = `src/json/${folder}_links_${page}_compatible.json`; // your json file path

    //convert CSV to JSON
    function UpdateProducts() {
        console.log(chalk.green.bgBlue('-> CSV 2 JSON Routine Started...'));
        console.log("original csv file => ", chalk.green.blue(csvFilePath));

        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj));
                console.log('new file => ', chalk.green.blue(jsonFilePath));
                console.log(moment().format('dddd-h-mm-ss'));
                console.log(chalk.bgGreen("JSON Ready!..."));
            })
            .then(() => { RebuildBody(jsonFilePath); })
    }
    UpdateProducts();   //init

    //Rebuild JSON Body
    function RebuildBody() {
        console.log(chalk.green.bgBlue('-> Rebuild JSON Started...'), "for Ellaglams Standard...");
        console.log("original json file => ", chalk.green.blue(jsonFilePath));
        let json = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        let newJson = [];

        function rebuildJSON() {
            json.forEach(element => {
                let newElement = {};
                newElement.ProductLink = element["LINK CODE"].split('href="')[1].split('"')[0];
                newElement.ProductAdvertiser = element["ADVERTISER"];
                newElement.ProductName = element["LINK NAME"];
                newElement.linkid = element["LINK ID"];
                newElement.ProductPrice = element["RETAIL PRICE"];
                newElement.ProductSlug = element["CATEGORY"];
                newElement.ProductImage = element["LINK CODE"].split('src="')[1].split('"')[0];;
                newJson.push(newElement);
            })
            fs.writeFileSync(jsonParcedFilePath, JSON.stringify(newJson));
            console.log('new file => ', chalk.green.blue(jsonParcedFilePath));
            console.log(moment().format('dddd-h-mm-ss'));
            console.log(chalk.bgGreen("JSON Rebuild Ready!..."));
            UploadProducts(jsonParcedFilePath);
        }
        rebuildJSON()
    }

    //Upload to Strapi 
    function UploadProducts() {
        console.log(chalk.green.bgBlue('-> Upload Routine Started...'), 'envio de JSON a Strapi');
        console.log("original json file => ", chalk.green.blue(jsonFilePath));
        let json = JSON.parse(fs.readFileSync(jsonParcedFilePath, 'utf8'));

        function SendToStrapiAPI() {
            console.log(chalk.bgRed('SUBIENDO OBJETO'));
            json.forEach(element => {
                PostProductAPI(element).then(data => { console.log(chalk.green("product uploaded  ->"), data.id, data.ProductName) })
            })
            res.send("PRODUCTS UPLOADED!...");
        }
        SendToStrapiAPI();
        console.log(chalk.bgYellow.bold(json.length, "products uploaded to Strapi"));
    }

});

// SUBIENDO CAMBIOS
app.listen(process.env.PORT || 4000, function () { console.log("listening on port 4000"); });