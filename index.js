import express from "express";
import axios from "axios";
import moment from "moment";
import csv from "csvtojson";
import * as fs from 'fs';
import chalk from 'chalk';

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

    const csvFilePath = `src/csv/${folder}/links_${page}.csv`; // your csv file path
    let jsonFilePath = 'src/json/' + currentTime + '.json'; // your json file path
    let jsonParcedFilePath = `src/json/${folder}_links_${page}.json`; // your json file path
    let store = null;

    function UpdateProducts(store) {
        console.log(chalk.green.bgBlue('Iniciando...'), 'proceso de transformacion CSV a JSON');
        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj));
                store = jsonObj[0]["ADVERTISER"]
                console.log(chalk.bgGreen("-> JSON Ready! : "), chalk.green(moment().format('dddd-h-mm-ss')), "from", jsonObj[0]["ADVERTISER"]);
            })
            // .then(() => { res.send("JSON Ready! : " + moment().format('dddd-h-mm-ss') + " from : " + store); })
            .then(() => { RebuildBody(jsonFilePath); })
            .then(() => { SendToStrapi(); })
    }

    function RebuildBody() {
        console.log(chalk.green.bgBlue('Iniciando...'), 'homologacion JSON Rakuten a JSON Strapi');
        console.log("folder", csvFilePath);

        let json = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        let newJson = [];

        function freshJSON() {
            json.forEach(element => {
                let newElement = {};
                // newElement.RawLink = element["LINK CODE"];
                newElement.ProductLink = element["LINK CODE"].split('href="')[1].split('"')[0];
                newElement.ProductAdvertiser = element["ADVERTISER"];
                newElement.ProductName = element["LINK NAME"];
                newElement.linkid = element["LINK ID"];
                newElement.ProductPrice = element["RETAIL PRICE"];
                newElement.ProductSlug = element["CATEGORY"];
                newElement.ProductImage = element["LINK CODE"].split('src="')[1].split('"')[0];;

                //console.log(chalk.bgRed("RAW embbed code ..."));
                // console.log(rawEmbed.split('src="')[1].split('"')[0]);

                newJson.push(newElement);
                console.log(newElement)
            })
            // console.log(chalk.bold.bgYellow("JSONinicio..."), newJson, chalk.bold.bgYellow("JSONtermino"));
            fs.writeFileSync(jsonParcedFilePath, JSON.stringify(newJson));
            res.send("JSON Ready! : from RAkuten to Ellaglams format:  " + JSON.stringify(newJson) + " from : " + store);

        }
        freshJSON()
        // .then(() => {
        //     fs.writeFileSync(jsonFilePath, JSON.stringify(newJson));
        //     console.log(newJson);
        // })
    }

    function SendToStrapi() {
        console.log(chalk.green.bgBlue('Iniciando...'), 'envio de JSON a Strapi');
    }


    UpdateProducts();

});

// SUBIENDO CAMBIOS
app.listen(process.env.PORT || 4000, function () { console.log("listening on port 4000"); });