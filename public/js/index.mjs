import {marco, modoLibre, modoFIDE, onlineLibre} from "./clases principales/juego.mjs";

var tablero = null;

function iniciarComponentes(){
    var tipoJuego = false;
    var modoJuego = false;
    document.getElementsByClassName("selector")[0].addEventListener("click",()=>{
        document.getElementsByClassName("formulario")[0].classList.toggle("seleccionado");
        document.getElementsByClassName("formulario")[0].classList.toggle("desselecionado");
    });
    let user = localStorage.getItem("user");
    if(user){
        document.getElementById("Nombre").Placeholder = user.nombre;
        document.getElementById("Nombre").disabled = true;
    }
    document.getElementById("blanco").addEventListener("change",()=>{
        tablero.imprimirBlanco();
    });
    document.getElementById("negro").addEventListener("change",()=>{
        tablero.imprimirNegro();
    });
    document.getElementById("Online").addEventListener("change",()=>{
        tipoJuego = true;
        document.getElementById("Partida").disabled = false;
        document.getElementById("unirsePartida").disabled = false;
    });
    document.getElementById("Local").addEventListener("change",()=>{
        tipoJuego = false;
        document.getElementById("Partida").disabled = true;
        document.getElementById("unirsePartida").disabled = true;
    });
    document.getElementById("Libre").addEventListener("change",()=>{
        modoJuego = false;
    });
    document.getElementById("FIDE").addEventListener("change",()=>{
        modoJuego = true;
    });
    document.getElementById("crearPartida").addEventListener("click",(e)=>{
        e.preventDefault();
        if(!tipoJuego){
            if(!modoJuego){
                tablero = new modoLibre(marco.tableroClasico());
            }else{
                tablero = new modoFIDE(marco.tableroClasico());
            }
        }else{
            if(!modoJuego){
                tablero = new onlineLibre(marco.tableroClasico());
            }else{
                alert("modo aun no implementado");
            }
            tablero.conection().then(()=>{
                if(tablero.conectado){
                    console.log("conectado");
                }else{
                    alert("falla en la coneccion")
                }
                let nombre = document.getElementById("Nombre") || "generico";
                let id = documento.getElementById("Partida") || 0;
                
            });
        }
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    tablero = new modoLibre(marco.tableroVacio());
    iniciarComponentes();
});