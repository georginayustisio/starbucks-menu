const express = require('express');
const bodyParser = require('body-parser');
const translate = require('translate-google');
const DrinkList = require('starbucks-jp-drink/lib/drinkList.js');
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

async function translateText(text) {
    try {
        const translatedText = await translate(text, { to: 'en' });
        return translatedText;
    } catch (error) {
        console.error('Translation Error:', error);
        return text; 
    }
}

app.get('/drinks', async (req, res) => {
    try {
        const searchOpt = req.query.type ? [req.query.type] : ['seasonal'];
        const drinkList = new DrinkList(searchOpt);

        const productName = await drinkList.productName();
        const catchcopy = await drinkList.catchcopy();
        const note = await drinkList.note();

        const translatedDrinks = await Promise.all(productName.map(async (name, i) => ({
            name: await translateText(name),
            catchcopy: await translateText(catchcopy[i]),
            note: await translateText(note[i])
        })));

        res.json(translatedDrinks);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
