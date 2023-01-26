import {encriptador} from "./encriptador.mjs";

document.addEventListener("DOMContentLoaded",()=>{
    let user = document.getElementById("user");
    let password = document.getElementById("password");
    user.addEventListener("input",(e)=>{
        e.preventDefault();
        if(user.value.length > 8){
            alert("su nombre de usuario no debe pasar los 8 caracteres");
            user.value = user.value.substr(0, user.value.length - 1);
        }
    });
    password.addEventListener("input",(e)=>{
        e.preventDefault();
        if(password.value.length > 8){
            alert("su nombre de usuario no debe pasar los 8 caracteres");
            password.value = password.value.substr(0, password.value.length - 1);
        }
    });
    document.getElementById("ingresar").addEventListener("click",(e)=>{
        e.preventDefault();
        let name = user.value;
        let pass = password.value;
        fetch(`/datos?query=${encriptador.enmascarador('SELECT * FROM usuarios WHERE `nombre` = "'+name+'"')}`).then(res=>res.json())
        .then(json=>{
            if(json[0].length != 0){
                let con = encriptador.desenmascarador(json[0][0].contraseña);
                if(pass == con){
                    localStorage.removeItem("user");
                    localStorage.setItem("user", JSON.stringify({id:json[0][0].id, nombre:name, imagen:json[0][0].imagen}));
                    location = "http://localhost/html/user.html";
                }else
                    alert("usuario o contraseña incorrecto");
            }else
                alert("usuario o contraseña incorrecto");
        });
    });;
});