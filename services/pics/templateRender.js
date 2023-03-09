const fs = require('fs');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

const source = fs.readFileSync('./services/pics/template.html', 'utf8');
const template = handlebars.compile(source);
const data = {
    title: 'My Page',
    // profilePic: 'path/to/profile-pic.jpg',
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '555-555-5555',
    blocks: [
        {
            title: 'Block 1',
            text:  'Item jorijref 54jriemwd',
        },
        {
            title: 'Block 2',
            text: 'Item A'
        }
    ]
};

//render template
const html = template(data);

 const renderImage = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });


     const screenshot = await page.screenshot({ fullPage: true });

    await browser.close();

    // Save screenshot to file
    fs.writeFileSync('./services/pics/files/screenshot.jpg', screenshot);
    // Send file in response
};

module.exports = {
    renderImage
}