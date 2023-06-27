import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from './service.service';
import { Meses, ModelSerie } from './models';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  nCaracterMax: number = 0;
// options
showXAxis: boolean = true;
showYAxis: boolean = true;
gradient: boolean = true;
showLegend: boolean = true;
showXAxisLabel: boolean = true;
xAxisLabel: string = 'Meses';
showYAxisLabel: boolean = true;
yAxisLabel: string = 'Agua Usada (L)';
legendTitle: string = 'Sistema de Riego Usado';
view:[number, number] = [1100, 400];
multi : any= [];
  buttonName: string = 'Mostrar Gráfica';
  mostrarGrafic:boolean = false;
  array: any;
  public pageSize=5;
  currentPage = 0;
  totalSize = 0;
  title = 'riego-sistematizado';
  displayedColumns: string[] = ['fechaInicio', 'fechaFin', 'temperaturaInicial','temperaturaFinal', 'humTerrenoInicial', 'humTerrenoFinal', 'aguaUsada', 'tiempoRiego'];
  dataSource = new MatTableDataSource();
  meses: Meses = new Meses();
  seriesR!: ModelSerie;
  toppings = new FormControl();
  toppingList: string[] = this.meses.meses;
  dia = new FormControl();
  diasList: string[] = this.meses.dias;
  selected = new Date().getFullYear();
  fechasFormControl: FormGroup;
  anios:any = [];
  minDate = new Date(new Date().getFullYear(), 0, 1);
  maxDate = new Date(new Date().getFullYear(), 11, 31);


  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  constructor(private service: ServiceService, private pag: MatPaginatorIntl, private datePipe: DatePipe, fb: FormBuilder){
    this.pag.itemsPerPageLabel = "Registros por página";
    this.fechasFormControl = fb.group({
      anios:[new Date().getFullYear(), Validators.required],
      fechaInicio:['', Validators.required],
      fechaFin:['', Validators.required]
    });
  }

  ngOnInit() {
    this.getData();
    this.getAnios();
 }

 getAnios(){
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 10;
  for (let i = currentYear; i >= startYear; i--) {
    this.anios.push(i);
  }
 }

 public handlePage(e: any) {
  this.currentPage = e.pageIndex;
  this.pageSize = e.pageSize;
  this.iterator();
}

private iterator() {
  const end = (this.currentPage + 1) * this.pageSize;
  const start = this.currentPage * this.pageSize;
  const part = this.array.slice(start, end);
  this.dataSource = part;
}

getDataActual(resp:any, res:any){
  this.multi = [];
  for (const iterator of res.data[1]) {
    resp = this.meses.llenarSeries(iterator.fecha-1, iterator.sumaAgua, iterator.numRiego);
    this.seriesR = {
      "name" : resp[0].name,
      "series" : resp[0].series
    }
    this.multi.push(this.seriesR);
  }
  this.dataSource = res.data[0];
  this.dataSource.paginator = this.paginator;
  this.array = res.data[0];
  this.totalSize = res.data[0].length;
  this.iterator();
}
 
getData(){
  try {
    this.service.getListAll().subscribe((res: any) => {
      var resp:any;
      console.log(res);    
      this.getDataActual(resp, res);
    });
  } catch(err) {
    alert("hubo un error...");
  }
}

getDataFechas(){
  const datepipe: DatePipe = new DatePipe('en-US');
  if(this.fechasFormControl.valid){
  var data = {
    fechaInicio: datepipe.transform(this.fechasFormControl.value.fechaInicio, 'YYYY-MM-dd'),
    fechaFin: datepipe.transform(this.fechasFormControl.value.fechaFin, 'YYYY-MM-dd')
  } 
  this.service.getByDates(data).subscribe((res:any)=>{
    var resp:any; 
    this.getDataActual(resp, res);
  });
}else{
  alert('por favor, llene los campos requeridos...');
}
}

onSelect(data: any): void {
  console.log('Item clicked', JSON.parse(JSON.stringify(data)));
}

onActivate(data: any): void {
  console.log('Activate', JSON.parse(JSON.stringify(data)));
}

onDeactivate(data: any): void {
  console.log('Deactivate', JSON.parse(JSON.stringify(data)));
}

mostrarGraficOrTable(){
  this.mostrarGrafic = !this.mostrarGrafic;
  this.buttonName = !this.mostrarGrafic ? 'Mostrar Gráfica':'Mostrar Tabla';
}

capturarCaracteres(event:any){
  this.nCaracterMax = event;
}

getDia(data: any){
  const dateObj = new Date(data);
  const nombreDia = this.datePipe.transform(dateObj, 'EEEE');
  return nombreDia;
}

calendario(anio:any){
  this.minDate = new Date(anio, 0, 1);
  this.maxDate = new Date(anio, 11, 31);
}

selectedAnio(){
  this.fechasFormControl.controls['fechaInicio'].setValue('');
  this.fechasFormControl.controls['fechaFin'].setValue('');
  this.calendario(this.fechasFormControl.value.anios);
}

getHoras(mls:any){
  return this.meses.getHoras(mls);
}

}
