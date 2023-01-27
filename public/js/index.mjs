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
            let nombre = document.getElementById("Nombre") || "generico";
            let id = parseInt(document.getElementById("Partida")) || 0;
            if(!modoJuego){
                tablero = new onlineLibre(marco.tableroClasico(), "http://localhost/", nombre);
            }else{
                alert("modo aun no implementado");
            }
            tablero.conection().then(()=>{
                if(tablero.conectado){
                    console.log("conectado");
                }else{
                    alert("falla en la coneccion")
                }
                tablero.crearPartida(id, -1).then((e)=>{
                    tablero.conectarsePartida(e.id).then((json)=>{
                        if(json.roll == 0){
                            tablero.imprimirBlanco();
                        }else{
                            tablero.imprimirNegro();
                            tablero.juego();
                        }
                    })
                });
            });
        }
    });
    document.getElementById("unirsePartida").addEventListener("click", (e)=>{
        e.preventDefault();
        let nombre = document.getElementById("Nombre") || "generico";
        let id = parseInt(document.getElementById("Partida")) || 0;
        if(!modoJuego){
            tablero = new onlineLibre(marco.tableroClasico(), "http://localhost/", nombre);
        }else{
            alert("modo aun no implementado");
        }
        tablero.conection().then(()=>{
            if(tablero.conectado){
                console.log("conectado");
            }else{
                alert("falla en la coneccion")
            }
            tablero.conectarsePartida(id).then((json)=>{
                if(json.roll == 0){
                    tablero.imprimirBlanco();
                }else{
                    tablero.imprimirNegro();
                    tablero.juego();
                }
            })
        });
    })
}

document.addEventListener("DOMContentLoaded",()=>{
    tablero = new modoLibre(marco.tableroVacio());
    iniciarComponentes();
});