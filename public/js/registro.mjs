import {encriptador} from "./encriptador.mjs";

var imagen = "pepe";

document.addEventListener("DOMContentLoaded", ()=>{
    let file = document.getElementById("file");
    file.addEventListener("change",()=>{
        if(file.files[0].type == "image/png" || file.files[0].type == "image/jpg"){
            let f = new FileReader();
            f.onload = (e)=>{
                imagen = `"${e.target.result}"`;
            }
            f.readAsDataURL(file.files[0]);
        }else
            alert("Formato de imagen no valido");
    });
    document.getElementById("registrar").addEventListener("click",(e)=>{
        e.preventDefault();
        let n = document.getElementById("us").value;
        let con1 = document.getElementById("con1").value;
        let con2 = document.getElementById("con2").value;
        if(n == "" || con1 == "" || con2 == ""){
            alert("un campo esta vacio");
            return false;
        }
        if(con2 != con1){
            alert("las contraseñas no coinciden");
            return false;
        }
        fetch(`/datos?query=${encriptador.enmascarador('SELECT id FROM usuarios WHERE `nombre` = "'+n+'"')}`).then(e=>e.json()).then(json=>{
            if(json[0].length == 0){
                con1 = encriptador.enmascarador(con1);
                let js = JSON.stringify({
                    tabla:"usuarios",
                    nombre:`"${n}"`,
                    contraseña:`"${con1}"`,
                    imagen:imagen
                });
                localStorage.removeItem("user");
                localStorage.setItem("user", JSON.stringify({id:json[0][0].id, nombre:n, imagen:imagen}));
                fetch("/datos",{
                    method: "POST",
                    body: JSON.stringify({
                        tabla:"usuarios",
                        nombre:`"${n}"`,
                        contraseña:`"${con1}"`,
                        imagen:imagen
                    }),
                    headers:{
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                location = "http://localhost/html/user.html";
            }else
                alert("Nombre de usuario ya registrado");
        });
    });
});