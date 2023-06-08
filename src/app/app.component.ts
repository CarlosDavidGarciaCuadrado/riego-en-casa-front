import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from './service.service';
import { Meses, ModelNameValue, ModelSerie } from './models';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

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
yAxisLabel: string = 'Agua Usada(mL)';
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
  displayedColumns: string[] = ['position', 'temperatura', 'humAmbiente', 'humTerreno'];
  dataSource = new MatTableDataSource();
  meses: Meses = new Meses();
  seriesR!: ModelSerie;
  toppings = new FormControl();
  toppingList: string[] = this.meses.meses;
  dia = new FormControl();
  diasList: string[] = this.meses.dias;
  selected = '';

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  constructor(private service: ServiceService, private pag: MatPaginatorIntl, private datePipe: DatePipe){
    this.pag.itemsPerPageLabel = "Registros por página";
  }

  ngOnInit() {
    this.getData();
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
 
getData(){
  try {
    this.service.getListAll().subscribe((res: any) => {
      var resp:any;    
      for (const iterator of res.data) {
        resp = this.meses.llenarSeries(iterator.fecha, iterator.tiempoRiego);
        this.seriesR = {
          "name" : resp[0].name,
          "series" : resp[0].series
        }
        this.multi.push(this.seriesR);
      }
      this.dataSource = res.data;
      this.dataSource.paginator = this.paginator;
      this.array = res.data;
      this.totalSize = res.data.length;
      this.iterator();
    });
  } catch(err) {
    alert("hubo un error...");
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

filtrar(event: Event) {
  const filtro = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filtro.trim().toLowerCase();
} 

getDia(data: any){
  const dateObj = new Date(data);
  const nombreDia = this.datePipe.transform(dateObj, 'EEEE');
  return nombreDia;
}

}
