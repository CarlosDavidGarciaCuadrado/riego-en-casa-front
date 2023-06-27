import { DatePipe, formatDate } from "@angular/common";

 export interface ModelNameValue{
        "name": string,
        "value": any
  }
 
 export interface ModelSerie{
    "name": string,
    "series": any
 } 

  export class Meses {

    dias: string[] = [
        'lunes', 
        'martes',
        'miercoles',
        'jueves',
        'viernes'
    ];

    meses:string[] = [
        'Enero','Febrero','Marzo',
        'Abril','Mayo','Junio',
        'Julio','Agosto','Septiembre',
        'Octubre','Noviembre','Diciembre'
    ];
    nameValue!: ModelNameValue;
    tipoRiego!: ModelNameValue;
    tipoRiegoSistema!: ModelNameValue;
    tipoSerie!: ModelSerie;
    tipoRiegoConvencional!: ModelNameValue;
    mesesNameValue : any[] = [];
    diasNameValue : any[] = [];
    series : any[] = [];

    public constructor(){
        this.mesesNameValue = this.llenarMesesNameValue();
    }


    llenarMesesNameValue(){
        var meses : any[] = [];
        var cont = 1;
        this.meses.forEach(element => {
            var valor = cont<10?"0"+cont:""+cont;
            this.nameValue = {
                "name": element,
                "value": valor
            }
            meses.push(this.nameValue);
            cont++;
        });
        return meses;
    }

    llenarSeries(fecha: any, tiempoRiego: any, numRiego:any){
        var multi : any[] = [];
        this.tipoRiegoSistema = {
            "name": 'IrrigationSistem',
            "value": tiempoRiego
             }
        this.tipoRiegoConvencional = {
            name: "Convencional",
            value: 4*numRiego
        };   
        this.series.push(this.tipoRiegoSistema);       
        this.series.push(this.tipoRiegoConvencional); 
        this.tipoSerie={
            "name": this.getMes2(fecha),
            "series": this.series
             }
        multi.push(this.tipoSerie);
        this.series = [];
        return multi;
    }

    getMes(data: any){
        var mes = this.mesesNameValue.find(element=> {
            if(element.value == formatDate(data, 'MM', 'en-US')){
                return element;
            }
        });
        return mes;
    }

    getMes2(data:any){
        return this.meses[data];
    }

    getConsumo(cantidadTiempo:any){
        return 1*cantidadTiempo;
        }

        getHoras(ms: any){
            var residuo = ms%3600000;
            var horas = (ms-residuo)/3600000;
            var mr = residuo%60000;
            var minutos = (residuo-mr)/60000;
            var sr = mr%1000;
            var segundos = (mr-sr)/1000;
            return horas + "h:" + minutos + "m:" + segundos + "s";
        }

  }