import { alfil, caballo, peon, torre, rey, dama, pieza } from "./piezas.mjs";
import { casilla } from "./casillas.mjs";
import { objeto, movs, imp, input } from "./globales.mjs";

var bounds = 0;
var piezaSeleccionada = null;
var coorPiezas = [0,0];

class marco{
    static activar(tablero){
        for(let i = 0; i < 64; i++){
            if(tablero[i] instanceof pieza)
            tablero[i].controlar(tablero);
        }
    }

    static tableroVacio(){
        let tablero = []
        for(let i = 0; i < 64; i++){
            tablero.push(new casilla(i));
        }
        return tablero;
    }

    static tableroClasico(){
        let tablero = marco.tableroVacio();
        for(let i = 0; i < 64; i++){
            if(i > 7 && i < 16){
                new peon(i, true, tablero);
            }else if(i > 47 && i < 56){
                new peon(i, false, tablero);
            }else if(i == 0 || i == 7){
                new torre(i, true, tablero);
            }else if(i == 56 || i == 63){
                new torre(i, false, tablero);
            }else if(i == 1 || i == 6){
                new caballo(i, true, tablero);
            }else if(i == 57 || i == 62){
                new caballo(i, false, tablero);
            }else if(i == 2 || i == 5){
                new alfil(i, true, tablero);
            }else if(i == 58 || i == 61){
                new alfil(i, false, tablero);
            }else if(i == 3){
                new rey(i, true, tablero);
            }else if(i == 59){
                new rey(i, false, tablero);
            }else if(i == 4){
                new dama(i, true, tablero);
            }else if(i == 60){
                new dama(i, false, tablero);
            }
        }
        marco.activar(tablero);
        return tablero;
    }

    static tableroResgistro(tablero){
        let t = marco.tableroVacio();
        tablero.map((str, n)=>{
            switch(str[0]){
                case "P":
                    new peon(n, objeto.formatoColor(parseInt(str[1])), t);
                    break;
                case "A":
                    new alfil(n, objeto.formatoColor(parseInt(str[1])), t);
                    break;
                case "R":
                    new rey(n, objeto.formatoColor(parseInt(str[1])), t);
                    break;
                case "D":
                    new dama(n, objeto.formatoColor(parseInt(str[1])), t);
                    break;
                case "T":
                    new torre(n, objeto.formatoColor(parseInt(str[1])), t);
                    break;
                case "C":
                    new caballo(n, objeto.formatoColor(parseInt(str[1])), t);
                    break;
            }
        });
        return t;
    }
}

class modoJuego{

    turno = 0;
    reyes = [];
    registro = [];
    fin = false;
    jacke = false;
    vista = false;

    static formatoCoordenadas(dato){
        if(typeof(dato) == "object" || typeof(dato) == "boolean"){
            throw new Error("Fomato de dato incorrecto, dato tipo " + typeof(dato));
        }else if(typeof(dato) == "string"){
            const regex = /^[0-9]*$/;
            if(regex.test(dato)){
                return parseInt(dato);
            }
            dato = dato.toUpperCase();
            if(dato.length == 2){
                dato = (72 - dato.codePointAt(0)) + (parseInt(dato[1]) - 1)*8;
            }else{
                dato = (dato.codePointAt(0) - 65);
            }
        }
        if(dato < 64 && dato >= 0){
            return dato;
        }else{
            return;
        }
    }

    static registro(tablero){
        let t = [];
        tablero.map((obj)=>{
            if(obj instanceof pieza){
                let p = (obj.color)?"0":"1";
                t.push(String.fromCodePoint(obj.simbolo) + p);
            }else{
                t.push("0");
            }
        });
        return t;
    }

    constructor(tablero){
        if(new.target === modoJuego){
            throw new Error('No puedes instanciar una clase abstracta');
        }
        bounds = document.getElementById("tablero").getBoundingClientRect();
        this.tablero = tablero;
        window.addEventListener("resize",()=>{
            bounds = document.getElementById("tablero").getBoundingClientRect();
            this.imprimir();
        });
        document.getElementsByClassName("selector")[0].addEventListener("click",()=>{
            setTimeout(()=>{
                bounds = document.getElementById("tablero").getBoundingClientRect();
                this.imprimir();
            }, 1000);
        });
        this.logicaGrafica();
    }

    logicaGrafica(){}

    manejoError(e){
        imp("ho no developer, ha ocurrido un error inesperado, porfavor actualiza la version o ponte en contacto con el desarrollador principal");
        if(input("¿Quieres imprimir el error?(y/n)", "").toLowerCase() == "y"){
            console.error(e);
        }
        return;
    }

    set tablero(tablero){
        let tab = document.getElementById("tablero");
        tab.innerHTML = "";
        for(let i = 0; i < 64; i++){
            if(tablero[i] instanceof objeto){
                let cas = tablero[i];
                if(cas instanceof pieza){
                    if(cas instanceof peon){
                        if(cas.color){
                            tab.innerHTML += '<i class="fa-solid fa-chess-pawn pieza blanco"></i>';
                        }else{
                            tab.innerHTML += '<i class="fa-solid fa-chess-pawn pieza negro"></i>';
                        }
                    }else if(cas instanceof torre){
                        if(cas.color){
                            tab.innerHTML += '<i class="fa-solid fa-chess-rook pieza blanco"></i>';
                        }else{
                            tab.innerHTML += '<i class="fa-solid fa-chess-rook pieza negro"></i>';
                        }
                    }else if(cas instanceof alfil){
                        if(cas.color){
                            tab.innerHTML += '<i class="fa-solid fa-chess-bishop pieza blanco"></i>';
                        }else{
                            tab.innerHTML += '<i class="fa-solid fa-chess-bishop pieza negro"></i>';
                        }
                    }else if(cas instanceof dama){
                        if(cas.color){
                            tab.innerHTML += '<i class="fa-solid fa-chess-queen pieza blanco"></i>';
                        }else{
                            tab.innerHTML += '<i class="fa-solid fa-chess-queen pieza negro"></i>';
                        }
                    }else if(cas instanceof caballo){
                        if(cas.color){
                            tab.innerHTML += '<i class="fa-solid fa-chess-knight pieza blanco"></i>';
                        }else{
                            tab.innerHTML += '<i class="fa-solid fa-chess-knight pieza negro"></i>';
                        }
                    }else{
                        this.reyes.push(cas);
                        if(cas.color){
                            tab.innerHTML += '<i class="fa-solid fa-chess-king pieza blanco"></i>';
                        }else{
                            tab.innerHTML += '<i class="fa-solid fa-chess-king pieza negro"></i>';
                        }
                    }
                    let p = document.querySelectorAll(".pieza");
                    p = p[p.length - 1];
                    p.style.top = ((bounds.top + (bounds.height/8)*Math.floor(i/8)) + 5) + "px";
                    p.style.left = ((bounds.left + (bounds.width/8)*(i%8))) + "px";
                    cas = cas.casilla;
                }
                if(cas.color){
                    tab.innerHTML += "<div class='style1 casilla'></div>";
                }else{
                    tab.innerHTML += "<div class='style2 casilla'></div>";
                }
            }else{
                throw new Error("El parametro no tiene el formato indicado");
            }
        }
        this.__tablero = tablero;
    }

    get tablero(){
        return this.__tablero;
    }

    mate(mov){
        let verdad = false;
        while(mov != null){
            if(!(mov.objeto instanceof rey)){
                let p = (mov.objeto.posicion < 10)?"0" + mov.objeto.posicion:mov.objeto.posicion;
                this.buscarPieza("?" + p).map((obj)=>{
                    if(obj.color == objeto.formatoColor(this.turno)){
                        obj.seleccionar();
                        verdad = true;
                    }
                });
            }
            mov = mov.anterior;
        }
        return verdad;
    }

    comandos(comando){
        let cmd = comando.split(" ");
        try{
            switch(cmd[0]){
                case "mm":
                    let p1 = this.buscarPieza(cmd[1]);
                    if(p1.length == 0){
                        console.error("pieza no encontrada");
                        return false;
                    }
                    p1.map((n)=>{
                        if(n instanceof pieza)
                            n.marcar(this.tablero);
                    });
                    return false;
                case "eq":
                    let piezas = this.buscarPieza(cmd[1]);
                    if(piezas.length == 0){
                        console.error("pieza no encontrada");
                        return false;
                    }
                    let a1 = 1;
                    if(this.turno%2 == 0){
                        a1 = 0;
                    }
                    if(this.reyes[a1].en){
                        for(let i = piezas.length - 1; i >= 0; i--){
                            if(piezas[i] instanceof torre){
                                if(piezas[i].en){
                                    let h = piezas[i].posicion;
                                    let verdad = true;
                                    for(let j = this.reyes[a1].posicion; j != h;(j < h)?j++:j--){
                                        if(!(this.tablero[j] instanceof casilla || this.tablero[j] instanceof rey)){
                                            verdad = false;
                                            break;
                                        }
                                    }
                                    if(verdad){
                                        if(this.reyes[a1].posicion > piezas[i].posicion){
                                            this.reyes[a1].mover(1, this.tablero);
                                            piezas[i].mover(this.reyes[a1].posicion + 1, this.tablero);
                                        }else{
                                            this.reyes[a1].mover(this.reyes[a1].posicion + 2, this.tablero);
                                            piezas[i].mover(this.reyes[a1].posicion - 1, this.tablero);
                                        }
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    console.error("no hay posible enroque");
                    return false;
                case "me":
                    let p = this.buscarPieza(cmd[1]);
                    if(p.length == 0){
                        console.error("Pieza no encontrada");
                        return false;
                    }
                    p.map((obj)=>{
                        obj.seleccionarEnemigos();
                    });
                    return false;
                case "ma":
                    let pi = this.buscarPieza(cmd[1]);
                    if(pi.length == 0){
                        console.error("pieza no encontrada");
                        return false;
                    }
                    pi.map((obj)=>{
                        obj.seleccionarAliados();
                    });
                    return false;
                case "end":
                    this.fin = true;
                    this.finDelJuego();
                    break;
                default:
                    console.error("comando no valido");
                    return false;
            }
            return true;
        }catch{
            console.error("lo lamento un error interno del sistema");
            return false;
        }
    }

    buscarPieza(pie){
        let piezas = [];
        let regex = /^[0-9]*$/;
        if(regex.test(pie)){
            piezas.push(this.tablero[parseInt(pie)]);
        }else if(pie.length == 2){
            piezas.push(this.tablero[modoJuego.formatoCoordenadas(pie)]);
        }else if(pie.length == 3){
            let pi = null;
            let n = pie[1] + pie[2];
            if(pie[0] == "?"){
                let pos = 0;
                if(regex.test(n)){
                    pos = parseInt(n);
                }else{
                    pos = modoJuego.formatoCoordenadas(n);
                }
                for(let i = 0; i < 64; i++){
                    if(this.tablero[i] instanceof pieza){
                        if(this.tablero[i].validar(pos, this.tablero)){
                            piezas.push(this.tablero[i]);
                        }
                    }
                }
            }else{
                if(regex.test(n)){
                    pi = this.tablero[parseInt(n)];
                }else{
                    pi = this.tablero[modoJuego.formatoCoordenadas(n)]
                }
                if(pi.simbolo == pie.toUpperCase().codePointAt(0)){
                    piezas.push(pi);
                }
            }
        }else{
            pie = pie.toUpperCase().codePointAt(0);
            for(let i = 0; i < 64; i++){
                if(this.tablero[i].simbolo == pie){
                    piezas.push(this.tablero[i]);
                }
            }
        }
        return piezas;
    }

    imprimirNegro(){
        let tab = document.getElementById("tablero");
        let ob = [...document.querySelectorAll(".pieza")];
        ob.map((e)=>{
            tab.removeChild(e);
        });
        this.tablero.map((cas, i)=>{
            if(cas instanceof pieza){
                if(cas instanceof peon){
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-pawn pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-pawn pieza negro"></i>';
                    }
                }else if(cas instanceof torre){
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-rook pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-rook pieza negro"></i>';
                    }
                }else if(cas instanceof alfil){
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-bishop pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-bishop pieza negro"></i>';
                    }
                }else if(cas instanceof dama){
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-queen pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-queen pieza negro"></i>';
                    }
                }else if(cas instanceof caballo){
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-knight pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-knight pieza negro"></i>';
                    }
                }else{
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-king pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-king pieza negro"></i>';
                    }
                }
                let p = document.querySelectorAll(".pieza");
                p = p[p.length - 1];
                p.style.top = ((bounds.top + (bounds.height/8)*Math.floor(i/8)) + 5) + "px";
                p.style.left = ((bounds.left + (bounds.width/8)*(i%8))) + "px";
                cas = cas.casilla;
            }
        });
        this.logicaGrafica();
        this.vista = false;
    }

    imprimirBlanco(){
        let tab = document.getElementById("tablero");
        let ob = [...document.querySelectorAll(".pieza")];
        ob.map((e)=>{
            tab.removeChild(e);
        });
        this.tablero.reverse().map((cas, i)=>{
            if(cas instanceof pieza){
                if(cas instanceof peon){
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-pawn pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-pawn pieza negro"></i>';
                    }
                }else if(cas instanceof torre){
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-rook pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-rook pieza negro"></i>';
                    }
                }else if(cas instanceof alfil){
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-bishop pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-bishop pieza negro"></i>';
                    }
                }else if(cas instanceof dama){
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-queen pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-queen pieza negro"></i>';
                    }
                }else if(cas instanceof caballo){
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-knight pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-knight pieza negro"></i>';
                    }
                }else{
                    if(cas.color){
                        tab.innerHTML += '<i class="fa-solid fa-chess-king pieza blanco"></i>';
                    }else{
                        tab.innerHTML += '<i class="fa-solid fa-chess-king pieza negro"></i>';
                    }
                }
                let p = document.querySelectorAll(".pieza");
                p = p[p.length - 1];
                p.style.top = ((bounds.top + (bounds.height/8)*Math.floor(i/8)) + 5) + "px";
                p.style.left = ((bounds.left + (bounds.width/8)*(i%8))) + "px";
                cas = cas.casilla;
            }
        });
        this.tablero.reverse();
        this.logicaGrafica();
        this.vista = true;
    }

    imprimir(){
        if(this.turno%2 == 0){
            this.imprimirBlanco();
        }else{
            this.imprimirNegro();
        }
    }

    juego(){
        throw new Error("No has sobreescrito el metodo juego");
    }

    registar(){
        this.registro.push(modoJuego.registro(this.tablero));
    }

    finDelJuego(...datos){
        alert("el juego ha finalizado");
    }

}

class modoLibre extends modoJuego{
    constructor(tablero){
        super(tablero);
        var t = this;
        [...document.querySelectorAll(".pieza")].map((cas)=>{
            cas.onmousedown = function(event) {
                coorPiezas[0] = Math.ceil(((event.clientX - bounds.left)*8)/bounds.width);
                coorPiezas[1] = Math.ceil(((event.clientY - bounds.top)*8)/bounds.height);
                coorPiezas[2] = cas.style.top;
                coorPiezas[3] = cas.style.left;
                cas.style.position = 'absolute';
                cas.style.zIndex = 1000;
                document.body.append(cas);
                function moveAt(pageX, pageY) {
                  cas.style.left = pageX - cas.offsetWidth / 2 + 'px';
                  cas.style.top = pageY - cas.offsetHeight / 2 + 'px';
                }
                moveAt(event.pageX, event.pageY);
              
                function onMouseMove(event) {
                  moveAt(event.pageX, event.pageY);
                }
                document.addEventListener('mousemove', onMouseMove);
                cas.onmouseup = function(e) {
                    document.removeEventListener('mousemove', onMouseMove);
                    cas.onmouseup = null;
                    if(e.clientX > bounds.left + bounds.width 
                        || e.clientX < bounds.left 
                        || e.clientY < bounds.top 
                        || e.clientY > bounds.top + bounds.height){
                        cas.style.left = coorPiezas[3];
                        cas.style.top = coorPiezas[2];
                        return;
                    }
                    let x = Math.ceil(((e.clientX - bounds.left)*8)/bounds.width);
                    let y = Math.ceil(((e.clientY - bounds.top)*8)/bounds.height);
                    if(coorPiezas[0] == x && coorPiezas[1] == y)
                        return;
                    [...document.querySelectorAll(".pieza")].map((pie)=>{
                        if(pie == cas)
                            return;
                        let bo = pie.getBoundingClientRect();
                        if(bo.left <= e.clientX && e.clientX <= bo.left + bo.width)
                            if(bo.top <= e.clientY && e.clientY <= bo.top + bo.height)
                                pie.style.display = "none";
                    });
                    let coor1 = (coorPiezas[0] - 1)+(coorPiezas[1]-1)*8;
                    let coor2 = (x - 1)+(y-1)*8;
                    t.comandos("mv " + coor1+ " " + coor2);
                };
              };
        });
    }

    imprimir(){
        if(this.vista){
            this.imprimirBlanco();
        }else{
            this.imprimirNegro();
        }
    }

    imprimirBlanco(){
        this.vista = true;
        super.imprimirBlanco();
    }

    imprimirNegro(){
        this.vista = false;
        super.imprimirNegro();
    }

    logicaGrafica(){
        var t = this;
        [...document.querySelectorAll(".pieza")].map((cas)=>{
            cas.onmousedown = function(event) {
                coorPiezas[0] = Math.ceil(((event.clientX - bounds.left)*8)/bounds.width);
                coorPiezas[1] = Math.ceil(((event.clientY - bounds.top)*8)/bounds.height);
                coorPiezas[2] = cas.style.top;
                coorPiezas[3] = cas.style.left;
                cas.style.position = 'absolute';
                cas.style.zIndex = 1000;
                document.body.append(cas);
                function moveAt(pageX, pageY) {
                  cas.style.left = pageX - cas.offsetWidth / 2 + 'px';
                  cas.style.top = pageY - cas.offsetHeight / 2 + 'px';
                }
                moveAt(event.pageX, event.pageY);
              
                function onMouseMove(event) {
                  moveAt(event.pageX, event.pageY);
                }
                document.addEventListener('mousemove', onMouseMove);
                cas.onmouseup = function(e) {
                    document.getElementById("tablero").append(cas);
                    document.removeEventListener('mousemove', onMouseMove);
                    cas.onmouseup = null;
                    if(e.clientX > bounds.left + bounds.width 
                        || e.clientX < bounds.left 
                        || e.clientY < bounds.top 
                        || e.clientY > bounds.top + bounds.height){
                        cas.style.left = coorPiezas[3];
                        cas.style.top = coorPiezas[2];
                        return;
                    }
                    let x = Math.ceil(((e.clientX - bounds.left)*8)/bounds.width);
                    let y = Math.ceil(((e.clientY - bounds.top)*8)/bounds.height);
                    if(coorPiezas[0] == x && coorPiezas[1] == y)
                        return;
                    [...document.querySelectorAll(".pieza")].map((pie)=>{
                        if(pie == cas)
                            return;
                        let bo = pie.getBoundingClientRect();
                        if(bo.left <= e.clientX && e.clientX <= bo.left + bo.width)
                            if(bo.top <= e.clientY && e.clientY <= bo.top + bo.height)
                                pie.style.display = "none";
                    });
                    let coor1 = (t.vista)?63-((coorPiezas[0] - 1)+(coorPiezas[1]-1)*8):(coorPiezas[0] - 1)+(coorPiezas[1]-1)*8;
                    let coor2 = (t.vista)?63-((x - 1)+(y-1)*8):(x - 1)+(y-1)*8;
                    t.comandos("mv " + coor1+ " " + coor2);
                };
              };
        });
    }

    comandos(comando){
        let cmd = comando.split(" ");
        try{
            switch(cmd[0]){
                case "mv":
                    switch(cmd.length){
                        case 2:
                            let coor = cmd[1];
                            let m = coor[1] + coor[2];
                            if(coor.length == 2){
                                coor = "?" + coor;
                            }else if(coor[0] != "?"){
                                m = coor[1] + coor[2];
                                coor = coor[0];
                            }else if (coor.length == 1){
                                console.error("formato de coordenadas incorrecto");
                                return false;
                            }
                            let pieza = this.buscarPieza(coor);
                            if(pieza.length > 0){
                                if(coor[0] != "?"){
                                    let i = pieza.length - 1;
                                    while(i >= 0){
                                        if(pieza[i].validar(modoJuego.formatoCoordenadas(m), this.tablero)){
                                            pieza[i].mover(modoJuego.formatoCoordenadas(parseInt(m)), this.tablero);
                                            break;
                                        }
                                        i--;
                                    }
                                }else{
                                    pieza[0].mover(modoJuego.formatoCoordenadas(m), this.tablero);
                                }
                            }else{
                                console.error("Pieza no encontrada");
                                return false;
                            }
                            break;
                        case 3:
                            let origen = cmd[1];
                            let destino = cmd[2];
                            let piezas = this.buscarPieza(origen);
                            if(piezas.length == 0){
                                console.error("Pieza no encontrada");
                                return false;
                            }
                            switch(destino.length){
                                case 1:
                                    let pieza = this.buscarPieza(origen);
                                    if(pieza.length == 0){
                                        console.error("Pieza no encontrada");
                                        return false;
                                    }
                                    for(let i = pieza.length-1; i >= 0; i--){
                                        if(piezas[0].validar(pieza[0].posicion, this.tablero)){
                                            piezas[0].mover(pieza[0].posicion, this.tablero);
                                            break;
                                        }
                                    }
                                    break;
                                case 2:
                                    piezas[0].mover(modoJuego.formatoCoordenadas(parseInt(destino)), this.tablero);
                                    break;
                                case 3:
                                    let p = this.buscarPieza(origen);
                                    if(p.length == 0){
                                        console.error("Pieza no encontrada");
                                    }
                                    for(let i = piezas.length; i >= 0; i--){
                                        if(piezas[i].validar(p[0].posicion, this.tablero)){
                                            piezas[i].mover(p[0].posicion, this.tablero);
                                        }
                                    }
                                    break;
                            }
                            break;
                        default:
                            console.error("mv requiere unicamente un paraametro, maximo dos");
                    }
                    break;
                default:
                    return super.comandos(comando);
            }
            return true;
        }catch(e){
            console.error("perdon error interno", e);
        }
    }
}

class modoFIDE extends modoJuego{

    constructor(tablero){
        super(tablero);
        var t = this;
        this.reyes.map((rey)=>{
            rey.jacke = (mov)=>{
                this.jacke = true;
                let ver = true;
                rey.movimientos(this.tablero).map((mov)=>{
                    if(mov.objeto instanceof casilla)
                        ver = false;
                });
                this.turno += 1;
                if(ver && !this.mate(mov)){
                    rey.mate();
                }
                imp("hacke");
                this.turno -= 1;
            }
            rey.mate = ()=>{
                rey.seleccionar();
                imp("jacke mate");
                this.fin = true;
                this.finDelJuego();
            }
        });
        for(let i = 0; i < 64; i++){
            if(this.tablero[i] instanceof peon){
                this.tablero[i].coronar = (p)=>{
                    this.tablero[p.posicion] = p.casilla;
                    let pi = "r";
                    while(pi == "r" || pi == "p"){
                        pi = input("seleccione el tipo de pieza que desea coronar al peon: ", "").toLowerCase();
                        switch(pi){
                            case "alfil":
                                new alfil(p.posicion, p.color, this.tablero);
                                break;
                            case "torre":
                                console.log("pepe");
                                new torre(p.posicion, p.color, this.tablero);
                                break;
                            case "caballo":
                                new caballo(p.posicion, p.color, this.tablero);
                                break;
                            case "dama":
                                new dama(p.posicion, p.color, this.tablero);
                                break;
                            case "peon":
                                console.error("¿para que quieres convertir un peon en un peon?");
                                break;
                            case "rey":
                                console.error("¿para que quieres otro rey?");
                                break;
                            default:
                                console.error("la pieza no se reconoce");
                                pi = "r";
                        }
                    }
                    this.tablero[p.posicion].amenazas = p.amenazas;
                    this.tablero[p.posicion].controlar(this.tablero);
                    setTimeout(()=>{
                        this.imprimir();
                    }, 100);
                }
            }
        }
    }

    logicaGrafica(){
        var t = this;
        [...document.querySelectorAll(".pieza")].map((cas)=>{
            cas.onmousedown = function(event) {
                coorPiezas[0] = Math.ceil(((event.clientX - bounds.left)*8)/bounds.width);
                coorPiezas[1] = Math.ceil(((event.clientY - bounds.top)*8)/bounds.height);
                coorPiezas[2] = cas.style.top;
                coorPiezas[3] = cas.style.left;
                cas.style.zIndex = 1000;
                document.body.append(cas);
                function moveAt(pageX, pageY) {
                  cas.style.left = pageX - cas.offsetWidth / 2 + 'px';
                  cas.style.top = pageY - cas.offsetHeight / 2 + 'px';
                }
                moveAt(event.pageX, event.pageY);
              
                function onMouseMove(event) {
                  moveAt(event.pageX, event.pageY);
                }
                document.addEventListener('mousemove', onMouseMove);
                cas.onmouseup = (e)=> {
                    document.getElementById("tablero").append(cas);
                    cas.style.zIndex = 12;
                    document.removeEventListener('mousemove', onMouseMove);
                    cas.onmouseup = null;
                    if(e.clientX > bounds.left + bounds.width 
                        || e.clientX < bounds.left 
                        || e.clientY < bounds.top 
                        || e.clientY > bounds.top + bounds.height){
                        cas.style.left = coorPiezas[3];
                        cas.style.top = coorPiezas[2];
                        return;
                    }
                    let x = Math.ceil(((e.clientX - bounds.left)*8)/bounds.width);
                    let y = Math.ceil(((e.clientY - bounds.top)*8)/bounds.height);
                    let coor1 = (t.vista)?63-((coorPiezas[0] - 1)+(coorPiezas[1]-1)*8):(coorPiezas[0] - 1)+(coorPiezas[1]-1)*8;
                    let coor2 = (t.vista)?63-((x - 1)+(y-1)*8):(x - 1)+(y-1)*8;
                    if(coorPiezas[0] == x && coorPiezas[1] == y)
                        return;
                    if(t.comandos("mv " + coor1+ " " + coor2)){
                        t.turno += 1;
                    }else{
                        cas.style.left = coorPiezas[3];
                        cas.style.top = coorPiezas[2];
                        return;
                    }
                    [...document.querySelectorAll(".pieza")].map((pie)=>{
                        if(pie == cas)
                            return;
                        let bo = pie.getBoundingClientRect();
                        if(bo.left <= e.clientX && e.clientX <= bo.left + bo.width)
                            if(bo.top <= e.clientY && e.clientY <= bo.top + bo.height)
                                pie.style.display = "none";
                    });
                };
              };
        });
    }

    imprimir(){
        if(this.vista){
            this.imprimirBlanco();
        }else{
            this.imprimirNegro();
        }
    }

    imprimirBlanco(){
        this.vista = true;
        super.imprimirBlanco();
    }

    amenazaRey(pieza, destino){
        let reyPeligro = null;
        for(let i = pieza.length - 1; i >= 0; i--){
            if(pieza[i] instanceof rey && pieza[i].color == objeto.formatoColor(this.turno))
                reyPeligro = pieza[i];
        }
        if(reyPeligro == null){
            let moverse = true;
            this.reyes.map((rey)=>{
                if(rey.color == objeto.formatoColor(this.turno)){
                    let mov = rey.amenazas[rey.amenazas.length - 1];
                    if(mov.origen == this.tablero[modoJuego.formatoCoordenadas(destino)]){
                        moverse = false;
                    }
                    while(mov != null && moverse){
                        if(modoJuego.formatoCoordenadas(destino) == mov.objeto.posicion){
                            moverse = false;
                            break;
                        }
                        mov = mov.anterior;
                    }
                }
            });
            if(moverse){
                console.error("No puedes mover esa pieza hasta eliminar la amenza del rey");
                return [];
            }else{
                this.jacke = false;
                return pieza;
            }
        }else{
            pieza.length = 0;
            pieza.push(reyPeligro);
            this.jacke = false;
            return pieza;
        }
    }

    imprimirNegro(){
        this.vista = false;
        super.imprimirNegro();
    }

    comandos(comando){
        let cmd = comando.split(" ");
        try{
            switch(cmd[0]){
                case "mv":
                    switch(cmd.length){
                        case 2:
                            let coor = cmd[1];
                            let m = coor[1] + coor[2];
                            if(coor.length == 2){
                                coor = "?" + coor;
                            }else if(coor[0] != "?"){
                                m = coor[1] + coor[2];
                                coor = coor[0];
                            }else if (coor.length == 1){
                                console.error("formato de coordenadas incorrecto");
                                return false;
                            }
                            let pieza = this.buscarPieza(coor);
                            if(this.jacke){
                                pieza = this.amenazaRey(pieza, m)
                            }
                            if(pieza.length > 0){
                                if(coor[0] != "?"){
                                    let i = pieza.length - 1;
                                    while(i >= 0){
                                        if(pieza[i].color == objeto.formatoColor(this.turno)){
                                            if(pieza[i].validar(modoJuego.formatoCoordenadas(m), this.tablero)){
                                                pieza[i].mover(modoJuego.formatoCoordenadas(m), this.tablero);
                                                return true;
                                            }
                                        }
                                        i--;
                                    }
                                }else{
                                    if(pieza[0].color == objeto.formatoColor(this.turno)){
                                        pieza[0].mover(modoJuego.formatoCoordenadas(m), this.tablero);
                                        return true;
                                    }
                                }
                            }
                            console.error("Pieza no encontrada");
                            return false;
                        case 3:
                            let origen = cmd[1];
                            let destino = cmd[2];
                            let piezas = this.buscarPieza(origen);
                            if(piezas.length == 0){
                                console.error("Pieza no encontrada");
                                return false;
                            }
                            if(this.jacke){
                                piezas = this.amenazaRey(piezas, destino)
                            }
                            switch(destino.length){
                                case 1:
                                    let pieza = this.buscarPieza(destino);
                                    if(pieza.length == 0){
                                        console.error("Pieza no encontrada");
                                        return false;
                                    }
                                    for(let i = pieza.length-1; i >= 0; i--){
                                        if(piezas[i].color == objeto.formatoColor(this.turno)){
                                            if(piezas[i].validar(pieza[i].posicion, this.tablero) ){
                                                piezas[i].mover(pieza[i].posicion, this.tablero);
                                                return true;
                                            }
                                        }
                                    }
                                    console.error("Pieza no encontrada");
                                    return false;
                                case 2:
                                    destino = modoJuego.formatoCoordenadas(destino);
                                    for(let i = piezas.length - 1; i >= 0; i--){
                                        if(piezas[i].color == objeto.formatoColor(this.turno)){
                                            if(piezas[i].validar(modoJuego.formatoCoordenadas(destino), this.tablero)){
                                                piezas[i].mover(modoJuego.formatoCoordenadas(destino), this.tablero);
                                                return true;
                                            }
                                        }
                                    }
                                    console.error("la pieza indicado no puede moverse a ese lugar");
                                    return false;
                                case 3:
                                    let p = this.buscarPieza(origen);
                                    if(p.length == 0){
                                        console.error("Pieza no encontrada");
                                    }
                                    for(let i = piezas.length - 1; i >= 0; i--){
                                        if(piezas[i].color == objeto.formatoColor(this.color)){
                                            if(piezas[i].validar(p[0].posicion, this.tablero)){
                                                piezas[i].mover(p[0].posicion, this.tablero);
                                                return true;
                                            }
                                        }
                                    }
                                    console.error("la pieza no puede ocupar esa posicion");
                                    return false;
                            }
                            break;
                        default:
                            console.error("mv requiere unicamente un paraametro, maximo dos");
                            return false;
                    }
                    break;
                case "end?":
                    if(input("¿Quieres proclamar tablas?(y/n)").toLowerCase() == "y"){
                        this.fin = true;
                        this.finDelJuego();
                    }
                    return false;
                    break;
                default:
                    return super.comandos(comando);
            }
            return true;
        }catch(e){
            console.error("perdon error interno");
            console.error(e);
        }
    }
}

class online extends modoJuego{

    __tipo = "";
    conectado = false;
    url = "";
    nombre = "";
    id = -1;
    roll = -1;
    _promesa = null;

    constructor(tablero, url){
        if(new.target === online){
            throw new Error("no puesdes instanciar una clase abstracta");
        }
        super(tablero);
        this.url = url;
        /*let n = 0;
        let id = setInterval(()=>{
            if(this.conectado){
                this.init();
                clearInterval(id);
            }else if(n < 10){
                n += 1;
            }else{
                this.manejoError("no se pudo conectar al servidor");
                clearInterval(id);
            }
        }, 1000)
        this.conection(id);*/
    }

    comando(comando){
        return this.comandos(comando).then(async (op)=>{
            if(op != undefined){
                if(op[1] && this.permitir){
                    this.imprimir();
                    await this.comandoOnline(this.id, op[2]).then((cmd)=>{
                        console.log(cmd);
                        if(cmd != undefined)
                            this.comandos(cmd).then((op)=>{
                                if(op != undefined){
                                    if(op[0]){
                                        this.turno += 1;
                                    }
                                    if(op[1] && op[2][0] == "-"){
                                        this.comandoOnline(this.id, op[2]);
                                    }
                                }
                            });
                    });
                }
                if(op[0]){
                    this.turno += 1;
                    console.clear();
                    this.imprimir();
                }
            }
        });
    }

    async init(){
        await this.juego();
    }

    imprimir(){
        if(this.roll == 0){
            this.imprimirBlanco();
        }else{
            this.imprimirNegro();
        }
        return;
    }

    permitir(){
        return (this.roll == 0 && this.turno%2 == 0) || (this.roll == 1 && this.turno%2 == 1);
    }

    conection(){
        return fetch(this.url + "juego").then((res)=>{
            this.conectado = res.ok;
        }).catch((e)=>{
            this.conectado = false;
            this.manejoError(e);
        });
    }

    crearPartida(id, roll){
        if(!this.conectado){
            throw new Error("Coneccion no establecida");
        }
        return fetch(this.url + "juego",{
            method: "POST",
            body: JSON.stringify({
                id:id,
                nombre: this.nombre,
                tipo: this.__tipo, 
                roll:roll
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => {
            let j = res.json();
            this.id = j.id;
            this.roll = j.roll;
            return j;
        });
    }

    eliminarPartida(id, instruccion){
        if(!this.conectado){
            throw new Error("Coneccion no establecida");
        }
        return fetch(this.url + "juego",{
            method: "DELETE",
            body: JSON.stringify({
                id:id,
                instrucion:instruccion
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(() =>{
            this.id = -1;
            this.roll = -1;
        });
    }

    comandoOnline(id, comando, n = 0){
        if(!this.conectado){
            throw new Error("Coneccion no establecida");
        }
        return fetch(this.url + "juego",{
            method: "PATCH",
            body: JSON.stringify({
                id:id,
                comando:comando
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => {
            if(res != undefined)
                if(res.ok)
                    res = res.json();
            return res;
        })
        .then(r=>r.comando)
        .catch(async (e)=>{
            if(n<10){
                console.error("fallo", n);
                await this.comandoOnline(this.id, comando, n = n + 1).then((cmd)=>{
                    if(cmd != undefined)
                        this.comandos(cmd).then((op)=>{
                            if(op != undefined)
                                if(op[1] && op[2][0] == "-"){
                                    this.comandoOnline(this.id, op[2]);
                                }
                        });
                });
            }else{
                this.manejoError(e);
            }
        })
    }

    conectarsePartida(id){
        if(!this.conectado){
            throw new Error("Coneccion no establecida");
        }
        return fetch(this.url + "juego",{
            method: "PUT",
            body: JSON.stringify({
                id:id,
                nombre: this.nombre,
                tipo: this.__tipo
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => {
            console.log(res)
            if(res != undefined){
                if(res.status == 200)
                    res = res.json();
            }
            return res;
        }).then(json =>{
            if(json != undefined){
                this.roll = json.roll;
                this.id = json.id;
            }
            return json;
        }).catch((e)=>{
            this.manejoError(e);
        });
    }
}

class onlineLibre extends online{
    constructor(tablero, url){
        super(tablero, url);
        this.__tipo = "libre";
    }

    logicaGrafica(){
        var t = this;
        [...document.querySelectorAll(".pieza")].map((cas)=>{
            cas.onmousedown = function(event) {
                coorPiezas[0] = Math.ceil(((event.clientX - bounds.left)*8)/bounds.width);
                coorPiezas[1] = Math.ceil(((event.clientY - bounds.top)*8)/bounds.height);
                coorPiezas[2] = cas.style.top;
                coorPiezas[3] = cas.style.left;
                cas.style.position = 'absolute';
                cas.style.zIndex = 1000;
                document.body.append(cas);
                function moveAt(pageX, pageY) {
                  cas.style.left = pageX - cas.offsetWidth / 2 + 'px';
                  cas.style.top = pageY - cas.offsetHeight / 2 + 'px';
                }
                moveAt(event.pageX, event.pageY);
              
                function onMouseMove(event) {
                  moveAt(event.pageX, event.pageY);
                }
                document.addEventListener('mousemove', onMouseMove);
                cas.onmouseup = function(e) {
                    document.getElementById("tablero").append(cas);
                    document.removeEventListener('mousemove', onMouseMove);
                    cas.onmouseup = null;
                    if(e.clientX > bounds.left + bounds.width 
                        || e.clientX < bounds.left 
                        || e.clientY < bounds.top 
                        || e.clientY > bounds.top + bounds.height
                        || t.roll != t.turno%2){
                        alert("espera tu turno")
                        cas.style.left = coorPiezas[3];
                        cas.style.top = coorPiezas[2];
                        return;
                    }
                    let x = Math.ceil(((e.clientX - bounds.left)*8)/bounds.width);
                    let y = Math.ceil(((e.clientY - bounds.top)*8)/bounds.height);
                    if(coorPiezas[0] == x && coorPiezas[1] == y)
                        return;
                    [...document.querySelectorAll(".pieza")].map((pie)=>{
                        if(pie == cas)
                            return;
                        let bo = pie.getBoundingClientRect();
                        if(bo.left <= e.clientX && e.clientX <= bo.left + bo.width)
                            if(bo.top <= e.clientY && e.clientY <= bo.top + bo.height)
                                pie.style.display = "none";
                    });
                    let coor1 = (t.vista)?63-((coorPiezas[0] - 1)+(coorPiezas[1]-1)*8):(coorPiezas[0] - 1)+(coorPiezas[1]-1)*8;
                    let coor2 = (t.vista)?63-((x - 1)+(y-1)*8):(x - 1)+(y-1)*8;
                    console.log("mv " + coor1+ " " + coor2, t.vista);
                    t.comando("mv " + coor1+ " " + coor2);
                };
              };
        });
    }

    comandos(comando){
        return new Promise((solve, reject)=>{
            let cmd = comando.split(" ");
            try{
                switch(cmd[0]){
                    case "mv":
                        switch(cmd.length){
                            case 2:
                                let coor = cmd[1];
                                let m = coor[1] + coor[2];
                                if(coor.length == 2){
                                    coor = "?" + coor;
                                }else if(coor[0] != "?"){
                                    m = coor[1] + coor[2];
                                    coor = coor[0];
                                }else if (coor.length == 1){
                                    console.error("formato de coordenadas incorrecto");
                                    return false;
                                }
                                let pieza = this.buscarPieza(coor);
                                if(pieza.length > 0){
                                    if(coor[0] != "?"){
                                        let i = pieza.length - 1;
                                        while(i >= 0){
                                            if(pieza[i].validar(modoJuego.formatoCoordenadas(m), this.tablero)){
                                                pieza[i].mover(modoJuego.formatoCoordenadas(m), this.tablero);
                                                break;
                                            }
                                            i--;
                                        }
                                    }else{
                                        pieza[0].mover(modoJuego.formatoCoordenadas(parseInt(m)), this.tablero);
                                    }
                                }else{
                                    console.error("Pieza no encontrada");
                                    reject();
                                }
                                break;
                            case 3:
                                let origen = cmd[1];
                                let destino = cmd[2];
                                let piezas = this.buscarPieza(origen);
                                if(piezas.length == 0){
                                    console.error("Pieza no encontrada");
                                    reject();
                                }
                                switch(destino.length){
                                    case 1:
                                        let pieza = this.buscarPieza(origen);
                                        if(pieza.length == 0){
                                            console.error("Pieza no encontrada");
                                            reject();
                                        }
                                        for(let i = pieza.length-1; i >= 0; i--){
                                            if(piezas[0].validar(pieza[0].posicion, this.tablero)){
                                                piezas[0].mover(pieza[0].posicion, this.tablero);
                                                break;
                                            }
                                        }
                                        break;
                                    case 2:
                                        piezas[0].mover(modoJuego.formatoCoordenadas(destino), this.tablero);
                                        break;
                                    case 3:
                                        let p = this.buscarPieza(origen);
                                        if(p.length == 0){
                                            console.error("Pieza no encontrada");
                                            reject();
                                        }
                                        for(let i = piezas.length; i >= 0; i--){
                                            if(piezas[i].validar(p[0].posicion, this.tablero)){
                                                piezas[i].mover(p[0].posicion, this.tablero);
                                            }
                                        }
                                        break;
                                }
                                break;
                            default:
                                console.error("mv requiere unicamente un paraametro, maximo dos");
                        }
                        break;
                    default:
                        //return super.comandos(comando);
                        reject();
                }
                solve([true, true, comando]);
            }catch(e){
                console.error("perdon error interno", e);
                reject();
            }
        });
    }

    async juego(){
        await this.comandoOnline(this.id,"").then(async (e)=>{
            await this.comandos(e).then((op)=>{
                if(op != undefined){
                    if(op[0]){
                        this.turno += 1;
                    }
                    if(op[1] && op[2][0] == "-"){
                        this.comandoOnline(this.id, op[2]);
                    }
                }
            })
            this.imprimir();
        });
    }
}

export{marco, modoLibre, modoFIDE, onlineLibre}