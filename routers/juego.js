const router = require("express").Router();


class batalla {

    /*
    *Aca se guarda los numbres de los juegadores, el roll 0 sera el blanco y el 
    *roll 1 sera el negro
    */
    roles = [];
    /*Aca se guardara los callback para conectarse con el cliente*/
    con = [];
    /*Aca se guardara los callback para cancelar la coneccion con el cliente*/
    can = [];
    /*
    * aca se guarda el status de la partida, el estatus 0 significa que ningun jugador esta conectado
    * el status 1 significa que un jugador esta conectado
    * y el status 2 significa qu los jugadores ya estan juagndo
    */
    status = 0;
    /*
    * Aca se guarda el tipo de la partida
    */
    tipo = "";
    /*
    * aca se guarda la posicion de la partida
    */
    id = 0;
    /*Aca se guarda si se a utilizado mensaje*/
    existeComando = false;

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {Number} id 
     * @param {String} tipo 
     * @param {batalla} siguiente 
     * @param {batalla} anterior 
     * @description esta clase se utiliza para guarda informacion de la partida.
     */
    constructor(id = -1, tipo = "", siguiente = null, anterior = null){
        this.id = id;
        this.tipo = tipo;
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {String} mensaje 
     * @returns {Boolean}
     * @description esta funcion se sobreescribe para guardar la respuesta del usuario hasta 
     * el proximo llamado de la funcion.
     */
    mensaje = (mensaje)=>true;

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @returns {void}
     * @description esta funcion ejecuta todos los callback del array can;
     */
    cancelar(){
        this.can.map((f)=>{
            f();
        });
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @returns {void}
     * @description esta funcion ejecuta todos los callback del array con;
     */
    conectar(){
        this.con.map((f)=>{
            f();
        });
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {String} nombre 
     * @param {Number} roll 
     * @returns {Number}
     * @description esta funcion pone el roll que el usuario quiera en la partida
     */
    setRoll(nombre, roll){
        let n = 0;
        switch(roll){
            case 1:
                n = 0;
                break;
            case 2:
                n = 1;
                break;
            default:
                return -1;
        }
        if(this.roles[n] == undefined){
            this.roles[n] = nombre;
            return n;
        }
        return -1;
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {String} nombre 
     * @returns {Number}
     * @description esta funcion pone el roll aleatoriamente, si ya uno de los roles ya estan ocupados,
     * devuelve el otro.
     */
    roll(nombre){
        if(this.status >= 2){
            return 2;
        }
        if(this.status == 0){
            let n = Math.random().toFixed(2)
            if(n > 0.5){
                this.roles[1] = nombre;
                this.status += 1;
                return 1;
            }
            this.roles[0] = nombre;
            this.status += 1;
            return 0;
        }
        let n = 1;
        if(this.roles[0] == undefined){
            n = 0;
        }
        this.roles[n] = nombre;
        this.status += 1;
        return n;
    }

    set anterior(sgt){
        this._ant = sgt;
    }

    get anterior(){
        return this._ant;
    }

    set siguiente(sgt){
        this._sgt = sgt;
    }

    get siguiente(){
        return this._sgt;
    }
}

class batallas{

    /*Aca se guarda el numero de batallas activas*/
    lenth = 0;

    /*Aca se guarda la raiz de la lista*/
    batalla = null;

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {baatalla} batalla 
     * @returns {batalla}
     * @description esta funcion agrega ordenadamente por el id, a la lista la batalla que le demos, 
     * si algun id esta repetido, la nueva batalla cambiara si id sumandole uno hasta encontrar uno 
     * vacio
     */
    agregar(batalla){
        if(this.batalla == null){
            batalla.siguiente = null;
            batalla.anterior = null;
            this.batalla = batalla;
            this.lenth += 1;
            return batalla;
        }else{
            let auxiliar = this.batalla;
            if(batalla.id == auxiliar.id){
                batalla.id += 1;
            }
            while(auxiliar.siguiente != null && batalla.id > auxiliar.id){
                if(batalla.id == auxiliar.siguiente.id){
                    batalla.id += 1;
                }
                auxiliar = auxiliar.siguiente;
            }
            if(auxiliar.siguiente == null){
                batalla.anterior = auxiliar;
                auxiliar.siguiente = batalla;
            }else{
                batalla.anterior = auxiliar.anterior;
                batalla.siguiente = auxiliar;
               if(auxiliar == this.batalla){
                    this.batalla = batalla;
               }else{
                    auxiliar.anterior.siguiente = batalla;
               }
               auxiliar.anterior = batalla;
            }
            this.lenth += 1;
            return batalla;
        }
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {Number} id 
     * @returns {Boolean}
     * @description esta funcion elimina de la lista la batalla con el id indicado, si se logra borrar, 
     * devolvera verdadero, sino lo logra, sera falso.
     */
    eliminar(id){
        let auxiliar = this.buscarId(id, 0, this.lenth);
        if(auxiliar.id != id){
            return false;
        }
        this.lenth -= 1;
        if(auxiliar.siguiente == null && auxiliar.anterior == null){
            this.batalla = null;
            return true;
        }else{
            let ant = auxiliar.anterior;
            if(ant != null){
                ant.siguiente = auxiliar.siguiente;
                if(auxiliar.siguiente != null)
                    auxiliar.siguiente.anterior = ant;
            }else{
                auxiliar.siguiente.anterior = null;
                this.batalla = auxiliar.siguiente;
            }
        }
        return true;
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {Number} pos 
     * @returns {batalla}
     * @description devuelve la batalla en la posicion indicada, ojo no el id, sino la posicion en la lista
     */
    ir(pos){
        if(pos > this.lenth){
            throw new Error("desborde de lista");
        }
        let auxiliar = this.batalla;
        for(let i = 0; i < pos; i++){
            auxiliar = auxiliar.siguiente;
        }
        return auxiliar;
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {Number} id 
     * @param {Number} inicio 
     * @param {Number} final 
     * @returns {batalla}
     * @description esta funcion busca por medio de busqueda binaria la batalla con el id indicado
     */
    buscarId(id, inicio, final){
        final = final || this.lenth;
        inicio = inicio || 0;
        let medio = Math.floor((final + inicio)/2);
        let go = this.ir(medio);
        if(go != undefined){
            if(go.id == id)
                return go;
        }else{
            return null;
        }
        if(inicio == final){
            return null;
        }
        if(go.id > id){
            return this.buscarId(id, inicio, medio - 1);
        }else{
            return this.buscarId(id, medio + 1, final);
        }
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {String} tipo 
     * @returns {batalla}
     * @description esta funcion devulve la primera partida en la cual el tipo es el mismo que el indicado 
     * y sea el estatis menor que 2
     */
    buscarPartida(tipo){
        let auxiliar = this.batalla;
        while(auxiliar != null){
            if(auxiliar.tipo == tipo){
                if(auxiliar.status != 2){
                    break;
                }
            }
            auxiliar = auxiliar.siguiente;
        }
        if(auxiliar == null){
            return null;
        }
        return auxiliar;
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {Funtion} funtion 
     * @returns {void}
     * @description ejecuta la funcion callback por cada batalla activa que halla, a esta funcion se le 
     * pasa como parametros, la batalla y la posicion de esta
     */
    map(funtion){
        let auxiliar = this.batalla;
        var i = 0;
        while(auxiliar != null){
            funtion(auxiliar, i);
            auxiliar = auxiliar.siguiente;
            i++;
        }
        return;
    }
}

/*Aca se declara todas las partidas*/
var juegos = new batallas();

juegos.agregar(new batalla(0, "libre"));

/*
* el metodo get se utiliza para que el cliente pueda saber si el servidor esta encendido
*/
router.get("/juego", (s,r)=>{
    r.sendStatus(204);//se devulve un 204, significa que la comunicacion se hizo con exito pero no se devolvera nada
    console.log("conectado...");//se imprime conectado simplemente para saber cuantas conecciones hay
});

/*
* el metodo patch se utiliza como canal de comunicacion entre los clientes
* el json enviado por el usuario:
* {id:Number, comando:String}
*/
router.patch("/juego", (s,r) =>{
    let partida = juegos.buscarId(s.body.id, 0, this.lenth);//se busca la partida por medio del id.
    if(partida == null){// se pregunta si la partida existe
        r.send({"comando":"-end"});//le enviamos un comando al usuario para terminar la partida
    }else{
        setTimeout(()=>{
            if(!partida.existeComando){
                try{
                    r.send({"comando":"-end"});
                }catch(e){
                };
            }
        }, 10000);//se pone un cronometro para evitar estancamientos en la partida
        if(s.body.comando == "" || !partida.existeComando){//se pregunta si se perdio el hilo del long polling
            partida.mensaje = (mensaje)=>{//se sobreescribe la funcion mensaje para que le mande la respuesta
                r.send({"comando":mensaje});//se manda el comando
                partida.existeComando = false;//se dice que ya no hay comandos disponibles
            }
            partida.existeComando = true;//se dice que si existe un comando para ejecutar
        }else{
            let cmd = [];
            if(s.body.comando[0] == "-")//se pregunta si hay metadatos en el comando
                cmd = s.body.comando.split(" ");
            else
                cmd[0] = s.body.comando;
            if(partida.mensaje(cmd[0])){//se ejecuta el comando, si es la primera ves simpre devulve true
                setTimeout(()=>{
                    if(partida.existeComando){
                        try{
                            r.send({"comando":"-end"});
                        }catch(e){
                        };
                    }else{
                        partida.mensaje(s.body.comando);
                        partida.mensaje = (mensaje)=>{
                            r.send({"comando":mensaje});
                            partida.existeComando = false;
                        }
                        partida.existeComando = true;
                    }
                }, 10000);//se establece un tiempo de reconeccion
            }else{
                partida.mensaje = (mensaje)=>{//sobrescribe el metoodo mensaje para que devulva un callback
                    r.send({"comando":mensaje});//envia un comando al usuario
                    partida.existeComando = false;//se dice que ya no hay comandos
                }
                partida.existeComando = true;// se dice que hay comandos
                if(cmd[1] == "final"){//se ejecutan los metadatos
                    partida.mensaje("-true");
                    juegos.eliminar(partida.id);
                }
            }
        }
    }
});

/*
* el metodo put se utiliza buscar partida y devolver el id de esta
* el json enviado por el usuario:
* {id:Number, nombre:String, tipo:String}
*/
router.put("/juego", (s, r)=>{
    let partida = null;//se separa un espacio en memoria
    if(s.body.id == -1){//se verifica si el usuario quiere encontrar partida con id o con status
        partida = juegos.buscarPartida(s.body.tipo);//se buscara partida por estatus y tipo
    }else{
        partida = juegos.buscarId(s.body.id, 0, juegos.lenth);//se busca por id
    }
    if(partida == null){//se pregunta si no encontro alguna batalla
        r.sendStatus(404);//se envia un not found al usuario
    }else{
        if(partida.tipo != s.body.tipo || partida.status == 2){//se pregunta si es del mismo tipo o si no esta vacia
            r.sendStatus(404);//se envia un not found al usuario
        }else{
            let re = partida.roll(s.body.nombre);//se declara un roll para el usuario
            partida.con.push(()=>{//se añade un calback a con
                r.send({"id":partida.id, "roll":re});// se envia los datos de coneccion al usuario
            });
            partida.can.push(()=>{//se añade un calback a can
                r.sendStatus(404);//se envia un not found al usuario
            });
            if(partida.status == 2){//se pregunta si ya estan los dos jugadores
                partida.conectar();//se conectan a la partida
            }
            setTimeout(()=>{
                if(partida.status < 2){
                    partida.cancelar();
                    juegos.eliminar(partida.id);
                }
            }, 60000);//se inicia un temporizador por si nadie se une a la partida
        }
    }
});

/*
* el metodo delete se utiliza para eliminar una partida al usuario
* el json enviado por el usuario:
* {id:Number, instruccion:String}
*/
router.delete("/juego", (s,r)=>{
    let partida = juegos.buscarId(s.body.id, 0, juegos.lenth);
    if(partida == null){
        r.sendStatus(404);
        return;
    }
    switch(s.body.instrucion){
        case "cancel":
                break;
        case "delete":
            break;
    }
    juegos.eliminar(partida.id);
    r.sendStatus(204);
});

/*
* el metodo delete se utiliza para crear una nueva partida
* el json enviado por el usuario:
* {id:Number, instruccion:String, tipo:String, roll:Number}
*/
router.post("/juego", (s, r)=>{
    let partida = null; //se separa un espacio de memoria
    if(s.body.id == -1){//se pregunta si quiere un id en especifico
        partida = juegos.agregar(new batalla(0, s.body.tipo));
    }else{
        partida = juegos.agregar(new batalla(s.body.id, s.body.tipo));
    }
    if(partida == null){//si no se pudo crear la partida
        r.sendStatus(404);
    }else{
        r.send({"id":partida.id, "roll":-1});//se manda el id de la partida
    }
});

module.exports = router;