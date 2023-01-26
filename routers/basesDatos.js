const router = require("express").Router();
const {query, encriptador} = require("./sql.js");

async function base64encode(uri){
    let bytestring = atob(uri);
    let ab = new ArrayBuffer(bytestring.length);
    let ia = new Uint8Array(ab);
    for(let i = 0;  i < bytestring.length; i++){
        ia[i] = bytestring.charCodeAt(i);
    }
    return new Blob([ab], {type: 'image/jpeg'}).text();
}

router.get("/datos",(s,r)=>{
    if(s.query.query == undefined)
        r.sendStatus(404);
    else{
        let p = encriptador.desenmascarador(s.query.query);
        query(p.replace("INSERT", "").replace("CREATE", "").replace("DELETE", ""))[0].then((datos)=>{
            datos.pop();
           r.send(datos);
        }).catch((e)=>{
            r.send(e);
        })
    }
});

router.post("/datos",(s,r)=>{
    if(s.body.tabla == undefined)
        r.sendStatus(404);
    else{
        let keys = Object.keys(s.body);
        let values = Object.values(s.body);
        values.shift();
        keys.shift();
        query(`INSERT INTO ${s.body.tabla} (${keys.join(",")}) VALUES (${values.join(",")})`)[0].then((datos)=>{
           r.send(datos);
        }).catch((e)=>{
            r.send(e);
        });
    }
});


module.exports = router;