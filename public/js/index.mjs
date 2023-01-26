import {marco, modoLibre, modoFIDE, onlineLibre} from "./clases principales/juego.mjs";

var tablero = null;

document.addEventListener("DOMContentLoaded",()=>{
    tablero = new modoFIDE(marco.tableroClasico());
    tablero.imprimirBlanco();
    document.getElementsByClassName("selector")[0].addEventListener("click",()=>{
        document.getElementsByClassName("formulario")[0].classList.toggle("seleccionado");
        document.getElementsByClassName("formulario")[0].classList.toggle("desselecionado");
    });
});