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
            valor = [];
            let self = this;
            $.get(self.urls[i], function(datos){
                valor = self.urls[i] === "index.html" ? self.get_todo_contenido(datos) : self.get_main(datos);
            });
            contenido.set(this.urls[i], valor);
        }
        return contenido;
    }

    get_todo_contenido(datos){
        let resultado = [];
        resultado.push("email");
        resultado.push("teléfono");
        resultado.push("ubicación");
        resultado.push(this.get_dato("p", datos, 5));
        resultado.push(this.get_dato("p", datos, 6));
        resultado.push(this.get_dato("h2", datos, 5));
        resultado.push(this.get_dato("p", datos, 7));
        resultado.push(this.get_dato("h2", datos, 6));
        resultado.push(this.get_dato("pre", datos, 1));
        resultado.push(this.get_dato("pre", datos, 2));
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

            if(estado_anterior && !abierto){
                let valor = etiquetas.get(etiqueta) === "undefined" ? 1 : etiquetas.get(etiqueta) + 1;
                etiquetas.set(etiqueta, valor);
                resultado.push(this.get_dato(etiqueta, datos, valor));

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
        console.log(elemento)
        console.log(datos)
        console.log(posicion)
        console.log(resultado)
        resultado = resultado.split("</" + elemento + ">")[0];
        return resultado.toLowerCase();
    }

    buscar(){
        let buscador = $("#buscador").val().toLowerCase();
        let num_educacion = this.contenido.get("index.html").split(buscador).length - 1;
        let num_experiencia = this.contenido.get("experiencia_profesional.html").split(buscador).length - 1;
        let num_aficiones = this.contenido.get("aficiones.html").split(buscador).length - 1;
        let num_adicionales = this.contenido.get("datos_adicionales.html").split(buscador).length - 1;
        this.cargar_resultados(num_educacion, num_experiencia, num_aficiones, num_adicionales);
    }

    cargar_resultados(educacion, experiencia, aficiones, adicionales){
        $("#resultados").remove();
        $(" \
            <section id='resultados'> \
                <ul>\
                    <li>Educación: " + educacion + " concidencia(s)</li>\
                    <li>Experiencia: " + experiencia + " concidencia(s)</li>\
                    <li>Aficiones: " + aficiones + " concidencia(s)</li>\
                    <li>Datos adicionales: " + adicionales + " concidencia(s)</li>\
                </ul>\
            </section> \
        ").insertAfter($("nav"));
    }

}

var buscador = new Buscador();
