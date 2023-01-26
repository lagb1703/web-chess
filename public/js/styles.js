document.addEventListener("DOMContentLoaded", ()=>{
    let estilo = (localStorage.getItem("color-preference") != null)?JSON.parse(localStorage.getItem("color-preference")).estilo:0;
    document.getElementById("styles").addEventListener("click", (e)=>{
        e.preventDefault();
        let style = "";
        switch(estilo){
            case 0:
                style = "/css/estilos/estilo_azul.css";
                break;
            case 1:
                style = "/css/estilos/estilo_marron.css";
                break;
            case 2:
                style = "/css/estilos/estilo_verde.css";
                estilo = -1;
                break;
        }
        estilo += 1;
        localStorage.removeItem('color-preference');
        localStorage.setItem('color-preference', JSON.stringify({style:style, estilo:estilo}));
        document.getElementById("color").href = style;
    });
});