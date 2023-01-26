const express = require("express");
const bodyParser = require('body-parser');
const app = express();

/*Configuraciones*/
app.set("port", process.env.PORT || 80);

app.set('trust proxy', true);

/*Midwares*/
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

/*rutas*/

/*
*archivos
*/
app.use(require("./routers/archivos.js"));
/*
* downloads
*/
app.use(require("./routers/download.js"));
/*
*juego, esta se dedica a la comunicacion del ajedraz
*Nota: el metodo de comunicacion de los usuarios es el long polling
*/
app.use(require("./routers/juego.js"));

/*
* SQL
*/
app.use(require("./routers/basesDatos.js"));

/*
* declaramos el public
*/
app.use(express.static(__dirname + "/public"));

app.use((s, r)=>{
    r.sendFile("/routers/not_found/",{
        root:__dirname
    });
});

/*Servidor*/
app.listen(app.get("port"), ()=>{
    console.log("servidor prendido");
});