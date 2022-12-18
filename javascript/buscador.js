"use-strict";
class Buscador{

    constructor(){
        this.urls = ["aficiones.html", "datos_adicionales.html", "experiencia_profesional.html", "index.html"];
        this.contenido = this.cargar_contenido();
    }

    cargar_contenido(){
        let contenido = new Map();
        let valor = [];
        for(let i=0; i<this.urls.length; i++){
            valor = "";
            let self = this;
            $.get(self.urls[i], function(datos){
                valor = self.urls[i] === "index.html" ? self.get_todo_contenido(datos) : self.get_main(datos);
                contenido.set(self.urls[i], valor);
            });
        } 
        return contenido;
    }

    get_todo_contenido(datos){
        let resultado = [];
        resultado.push("email");
        resultado.push("teléfono");
        resultado.push("ubicación");
        resultado.push(this.get_dato("p", datos, 1));
        resultado.push(this.get_dato("p", datos, 2));
        resultado.push(this.get_dato("p", datos, 3));
        resultado.push(this.get_dato("p", datos, 4));
        resultado.concat(this.get_main(datos));
        return resultado.join(" ");
    }

    get_main(datos){
        let contenido = this.get_dato("main", datos, 1);
        let resultado = this.lee_etiquetas(contenido);
        return resultado.join(" ");
    }

    lee_etiquetas(datos){
        let etiquetas = new Map();
        let etiqueta = "";
        let abierto = false;
        let estado_anterior = false;
        let resultado = [];
        for(let i=0; i<datos.length; i++){
            estado_anterior = new Boolean(abierto);
            abierto = datos[i] != "/" && datos[i] != "<" && datos[i>0?i-1:0] == "<" || abierto && datos[i] != ">";

            if(estado_anterior && !abierto && etiqueta.trim().length > 0){
                let valor = etiquetas.get(etiqueta.trim()) === undefined ? 1 : etiquetas.get(etiqueta.trim()) + 1;
                etiquetas.set(etiqueta.trim(), valor);
                if(["p", "h2", "h3", "h4", "th", "pre"].includes(etiqueta.trim()))
                    resultado.push(this.get_dato(etiqueta.trim(), datos, valor));

                etiqueta = "";
                abierto = false;
            }
            if (abierto)
                etiqueta += datos[i];
        }
        return resultado;
    }

    get_dato(elemento, datos, posicion){
        let resultado = datos.split("<" + elemento + ">")[posicion];
        resultado = resultado.split("</" + elemento + ">")[0];
        return resultado.toLowerCase().replace(/(\r\n|\n|\r)/gm, "").trim();
    }

    buscar(){
        let buscador = $("#buscador").val().toLowerCase();
        let num_educacion = this.contenido.get("index.html").split(buscador).length - 1;
        let num_experiencia = this.contenido.get("experiencia_profesional.html").split(buscador).length - 1;
        let num_aficiones = this.contenido.get("aficiones.html").split(buscador).length - 1;
        let num_adicionales = this.contenido.get("datos_adicionales.html").split(buscador).length - 1;
        this.cargar_resultados(num_educacion, num_experiencia, num_aficiones, num_adicionales);
        return false;
    }

    cargar_resultados(educacion, experiencia, aficiones, adicionales){
        $("#resultados").remove();
        $(" \
            <section id='resultados'> \
                <ul>\
                    <li><p>Educación: " + educacion + " concidencia(s)</p><a href='index.html'>ver educación</a></li>\
                    <li><p>Experiencia: " + experiencia + " concidencia(s)</p><a href='experiencia_profesional.html'>ver experiencia</a></li>\
                    <li><p>Aficiones: " + aficiones + " concidencia(s)</p><a href='aficiones.html'>ver aficiones</a></li>\
                    <li><p>Datos adicionales: " + adicionales + " concidencia(s)</p><a href='datos_adicionales.html'>ver más datos</a></li>\
                </ul>\
                <button onclick='buscador.cerrar_resultados()'>Cerrar</button> \
            </section> \
        ").insertAfter($("#contenedor_buscador")[0]);
    }

    cerrar_resultados(){
        $("#resultados").remove();
        $("#buscador").val("");
    }

}

var buscador = new Buscador();