const puppeteer = require('puppeteer');
const fs = require('fs')

async function run() {
    try {
        let allProducts = [];
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const name = process.argv[2];
        var state = 0;
        while (state < 5) {
            switch (state) {
                case 0:
                    scroll_id = 'zz6OJKfTScGHU48QrnXIX99cTqB0o+ER1ChHMIH9SkY=';
                    break;
                case 1:
                    scroll_id = 'RP3vaL6+73BUsdsjeJEvIv5bEdNhwKQDJAsJ6PZMChI=';
                    break;
                case 2:
                    scroll_id = '44ZyebICf2RcqYdekGYfeji0SqG8QNC6J00q9RUw1uw=';
                    break;
                case 3:
                    scroll_id = '9hB0GOD+hcZsyv/Yrda6GwKaqJWeVVcUAJBWL/dkN+M=';
                    break;
                case 4:
                    scroll_id = 'qD/ZkJ+Z/JcWKmlz/QgabYFOIneDPoMWqpRf57iO/ic=';
                    break;
                default:
                    console.log("Error");
            }
            let url = `https://www.1mg.com/search/all?name=${name}&filter=true&state=${state}&scroll_id=${scroll_id}`
            await page.goto(url);

            // if product container present 
            let check =await page.$('.product-card-container a',{timeout:5000});
            if (check) {
                await page.waitForSelector('[class*="style__product-image___"] img');
                let results = await page.$$eval('.product-card-container a', (elements) =>
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
            } else {
                break;
            }
            state = state + 1;
        }
        await browser.close();

        fs.writeFile('output.json', JSON.stringify(allProducts), (err) => {
            if (err) throw err;
            console.log(`file saved ${state}`);
        });

    } catch (err) {
        console.log(err);
        process.exit(1);

    }
}


run();
