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


const renderImage = async (search) => {
    console.log(search)
    searchData = {
        // profilePic: 'path/to/profile-pic.jpg',
        name: search.name,
        year: search.birthday.getFullYear(),
        place: search.place, //new Date(birthday).getFullYear()
        vk:'sova72',
        blocks: [
            {
                title: 'Обстоятельства пропажи',
                text: 'Пропал ' +  search.lostdate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') + ' ' + search.circumstances,
            },
            {
                title: 'Был одет',
                text: search.clothes,
            },
            {
                title: 'Приметы',
                text: search.appearance,
            },
            {
                title: 'Особые приметы',
                text: search.special,
            },
        ]
    }
    const html = template(searchData);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 480 }); // set viewport to 800x600

    await page.setContent(html, { waitUntil: 'load' });
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();

    // Save screenshot to file
    fs.writeFileSync('./services/pics/files/screenshot.jpg', screenshot);
    // Send file in response
};

module.exports = {
    renderImage
}