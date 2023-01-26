import {marco, modoLibre, modoFIDE, onlineLibre} from "./clases principales/juego.mjs";

var tablero = null;

document.addEventListener("DOMContentLoaded",()=>{
    tablero = new modoFIDE(marco.tableroVacio());
});