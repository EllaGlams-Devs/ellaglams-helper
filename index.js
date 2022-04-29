const moment = require('moment');
const csv = require('csvtojson')
let currentTime = moment().format('dddd-h-mm-ss');
const fs = require('fs')

//transformar archivo a CSV
let content = [
    {
        "LINK CODE": "<a href=\"https://click.linksynergy.com/link?id=DEoPybET1Dw&offerid=803538.8806194046181&type=2&murl=https%3A%2F%2Fwww.macys.com%2Fshop%2Fproduct%2Ftonymoly-minions-lip-eye-makeup-remover-2-oz.%3FID%3D11109208%26PartnerID%3DLINKSHARE%26cm_mmc%3DLINKSHARE-_-4-_-0-_-MP40&LSNSUBSITE=PR\" rel=\"nofollow\"><IMG border=0 src=\"https://slimages.macysassets.com/is/image/MCY/products/8/optimized/17372708_fpx.tif?wid=1200&fmt=jpeg&qlt=100\" ></a><IMG border=0 width=1 height=1 src=\"https://ad.linksynergy.com/fs-bin/show?id=DEoPybET1Dw&bids=803538.8806194046181&type=2&subid=0\" >",
        "ADVERTISER": "Macys.com",
        "LINK NAME": "Tonymoly Minions Lip & Eye Makeup Remover, 2 oz.",
        "LINK ID": "8806194046181",
        "RETAIL PRICE": "9.0",
        "CATEGORY": "Beauty"
    },
];
const csvFilePath = 'src/csv/links_10.csv'; // your csv file path
let jsonFilePath = 'src/json/' + currentTime + '.json'; // your json file path
let latestFile = '';
var minutes = 0.2,
    the_interval = minutes * 60 * 1000;


setInterval(function () {
    console.log("Latest Update : " + currentTime);

    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            data = jsonObj;
            fs.writeFileSync(jsonFilePath, JSON.stringify(data));
            console.log(data[0]["ADVERTISER"]);
        })

}, the_interval);