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
app.get('/csv', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Origin", "*")

    const csvFilePath = 'src/csv/links_10.csv'; // your csv file path
    let jsonFilePath = 'src/json/' + currentTime + '.json'; // your json file path
    let jsonParcedFilePath = 'src/json/' + currentTime + '_parced.json'; // your json file path
    let store = null;

    function UpdateProducts() {
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
        console.log("nuevo JSON", jsonFilePath);

        let json = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        let newJson = [];

        let parcedImage = json[0]["LINK CODE"];

        console.log(chalk.bgRed(parcedImage));

        function freshJSON() {
            json.forEach(element => {
                let newElement = {};
                newElement.RawLink = element["LINK CODE"];
                newElement.ProductLink = element["LINK CODE"];
                newElement.ProductAdvertiser = element["ADVERTISER"];
                newElement.ProductName = element["LINK NAME"];
                newElement.linkid = element["LINK ID"];
                newElement.ProductPrice = element["RETAIL PRICE"];
                newElement.ProductSlug = element["CATEGORY"];
                newElement.ProductImage = element["LINK ID"];
                newJson.push(newElement);
                // console.log(newElement)
            })
            // console.log(chalk.bold.bgYellow("JSONinicio..."), newJson, chalk.bold.bgYellow("JSONtermino"));
            fs.writeFileSync(jsonParcedFilePath, JSON.stringify(newJson));
            res.send("JSON Ready! : from RAkuten to Ellaglams format:  " +  JSON.stringify(newJson) + " from : " + store);

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



//transformar archivo a CSV
// let content = [
//     {
//         "LINK CODE": "<a href=\"https://click.linksynergy.com/link?id=DEoPybET1Dw&offerid=803538.8806194046181&type=2&murl=https%3A%2F%2Fwww.macys.com%2Fshop%2Fproduct%2Ftonymoly-minions-lip-eye-makeup-remover-2-oz.%3FID%3D11109208%26PartnerID%3DLINKSHARE%26cm_mmc%3DLINKSHARE-_-4-_-0-_-MP40&LSNSUBSITE=PR\" rel=\"nofollow\"><IMG border=0 src=\"https://slimages.macysassets.com/is/image/MCY/products/8/optimized/17372708_fpx.tif?wid=1200&fmt=jpeg&qlt=100\" ></a><IMG border=0 width=1 height=1 src=\"https://ad.linksynergy.com/fs-bin/show?id=DEoPybET1Dw&bids=803538.8806194046181&type=2&subid=0\" >",
//         "ADVERTISER": "Macys.com",
//         "LINK NAME": "Tonymoly Minions Lip & Eye Makeup Remover, 2 oz.",
//         "LINK ID": "8806194046181",
//         "RETAIL PRICE": "9.0",
//         "CATEGORY": "Beauty"
//     },
// ];




// SUBIENDO CAMBIOS
app.listen(process.env.PORT || 4000, function () {
    console.log("listening on port 4000");
});