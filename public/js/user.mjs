import {encriptador} from "./encriptador.mjs";

document.addEventListener("DOMContentLoaded",()=>{
    let us = localStorage.getItem("user");
    if(us){
        us = JSON.parse(us);
        let nombre = us.nombre;
        document.getElementById("nameUser").textContent = nombre;
        if(us.imagen != "pepe")
            document.getElementById("imgUser").src = us.imagen.replace("base64", ";base64");
        fetch(`/datos?query=${encriptador.enmascarador('SELECT * FROM paridas WHERE `bancas` = ' + us.id + ' || `negas` = ' + us.id)}`).then((res)=>res.json())
        .then((json)=>{
            json[0].map((datos)=>{
                if(datos.bancas == us.id){
                    fetch(`/datos?query=${encriptador.enmascarador('SELECT `nombre` FROM usuarios WHERE `id` = ' + datos.negas)}`).then((r)=>r.json())
                    .then(j=>{
                        document.getElementById("partidas").innerHTML += `<div class="row"><h4>${j[0][0].nombre}</h4><p>blancas</p></div>`;
                    });
                }else{
                    fetch(`/datos?query=${encriptador.enmascarador('SELECT `nombre` FROM usuarios WHERE `id` = ' + datos.negas)}`).then((r)=>r.json())
                    .then(j=>{
                        document.getElementById("partidas").innerHTML += `<div class="row"><h4>${j[0][0].nombre}</h4><p>negras</p></div>`;
                    });
                }
            });
        });
    }else{
        location = "/html/login.html"
    }
});