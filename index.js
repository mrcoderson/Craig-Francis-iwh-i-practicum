const express = require('express');
const axios = require('axios');
const { set } = require('express/lib/application');
const app = express();
require('dotenv').config();


app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HS_TOKEN;
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const players = 'https://api.hubspot.com/crm/v3/objects/2-195485431?properties=name,club,position';
    const headers = {
        "Authorization": `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(players, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'England Players', data });      
    } catch (error) {
        console.error(error);
    }
}); 

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });      
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update', async (req, res) => {
    const update = {
        "properties" : {
            "name": req.body.name,
            "club": req.body.club,
            "position": req.body.position
        }
    }

    const updatePlayer = "https://api.hubapi.com/crm/v3/objects/2-195485431";
    const headers = {
        "Authorization": `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(updatePlayer, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});


// Localhost

app.listen(3000, () => console.log('Listening on http://localhost:3000'));