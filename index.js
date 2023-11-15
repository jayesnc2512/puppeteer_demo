const puppeteer = require('puppeteer');
const fs=require('fs')

async function run() {
    let allProducts = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const name = process.argv[2];
    var state = 0;
    while (state < 5) {
        await page.goto(`https://www.1mg.com/search/all?name=${name}&state=${state}`);
        await page.waitForSelector('[class*="style__product-image___"] img');


    
        const results = await page.$$eval('.product-card-container a', (elements) =>
            elements.map(e => {
                let img = e.querySelector('[class*="style__product-image___"] img');
                let title = e.querySelector('[class*="style__pro-title___"]');
                let rating = e.querySelector('[class*="CardRatingDetail__weight-700___"]');

                if (title) {
                    title = title.innerText;
                } else {
                    return ("Product not found");
                }
                if (img) {
                    img = img.src;
                } else {
                    img = 'N/A';
                }
                if (rating) {
                    rating = rating.innerText;
                } else {
                    rating = 'N/A';
                }
                return {
                    title: title,
                    img: img,
                    description: e.querySelector('[class*="style__pack-size___"]').innerText,
                    price: e.querySelector('[class*="style__price-tag___"]').innerText,
                    ratingss: rating,
                };
            }));
        allProducts.push(...results);
        state++;
    }
    console.log(allProducts);
    fs.writeFile('output.json', JSON.stringify(allProducts), (err) => {
        if (err) throw err;
        console.log('file saved');
    });
}

run();
