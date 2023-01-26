const { createPool } = require("mysql2/promise");

const pool = createPool({
    host:"localhost",
    user:"root",
    password:"root",
    port:8888,
    database:"AJEDREZ",
    socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'
});



function query(...data){
    return data.map((str, n)=>{
        return pool.query(str.replace(";", "")).catch((e)=>{
            console.error("Error de query o ibntentan hacer una sql inyection");
            console.log(e);
            return e;
        });
    });
}
class encriptador{
    static desplazamiento(str, n){
        return [...str].map((l)=>{
            return String.fromCodePoint(l.charCodeAt(0) + n);
        }).join("");
    }

    static reemplazo(str){
        let palabraClave = "calumbrientosCALAMBRITOS";
        return [...str].map((l)=>{
            for(let i = 0; palabraClave[i] != undefined; i++){
                if(palabraClave[i] == l){
                    return String.fromCodePoint(i);
                }
            }
            return l;
        }).join("");
    }

    static revertir(str){
        let palabraClave = "calumbrientosCALAMBRITOS";
        return [...str].map((l)=>{
            for(let i = 0; palabraClave[i] != undefined; i++){
                if(i == l.charCodeAt(0)){
                    return palabraClave[i];
                }
            }
            return l;
        }).join("");
    }

    static enmascarador(str){
        return encriptador.desplazamiento(encriptador.reemplazo(encriptador.desplazamiento(str, 1)), 6);
    }

    static desenmascarador(str){
        return encriptador.desplazamiento(encriptador.revertir(encriptador.desplazamiento(str, -6)), -1);
    }
}

module.exports = {query, encriptador};