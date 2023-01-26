const router = require("express").Router();

/*router.get("/files/:carpeta/:archivo", (s, r)=>{
    r.sendFile(`/${s.params.carpeta}/${s.params.archivo}`,{
        root: __dirname
    });
});

router.get("/files/:carpeta1/:carpeta2/:archivo", (s, r)=>{
    r.sendFile(`/${s.params.carpeta1}/${s.params.carpeta2}/${s.params.archivo}`,{
        root: __dirname
    });
});*/
module.exports = router;