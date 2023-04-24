import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from './service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

// options
showXAxis: boolean = true;
showYAxis: boolean = true;
gradient: boolean = true;
showLegend: boolean = true;
showXAxisLabel: boolean = true;
xAxisLabel: string = 'Meses';
showYAxisLabel: boolean = true;
yAxisLabel: string = 'Agua Usada';
legendTitle: string = 'Sistema de Riego Usado';
view:[number, number] = [1100, 400];
multi= [
  {
    "name": "Enero",
    "series": [
      {
        "name": "IrrigationSistem",
        "value": 7300000
      },
      {
        "name": "Convencional",
        "value": 8300000
      }
    ]
  },

  {
    "name": "Febrero",
    "series": [
      {
        "name": "IrrigationSistem",
        "value": 7870000
      },
      {
        "name": "Convencional",
        "value": 8270000
      }
    ]
  },

  {
    "name": "Marzo",
    "series": [
      {
        "name": "IrrigationSistem",
        "value": 5000002
      },
      {
        "name": "Convencional",
        "value": 5800000
      }
    ]
  },
  {
    "name": "Abril",
    "series": [
      {
        "name": "IrrigationSistem",
        "value": 5000002
      },
      {
        "name": "Convencional",
        "value": 5800000
      }
    ]
  }
];
  buttonName: string = 'Mostrar Gráfica';
  mostrarGrafic:boolean = false;
  array: any;
  public pageSize=5;
  currentPage = 0;
  totalSize = 0;
  title = 'riego-sistematizado';
  displayedColumns: string[] = ['position', 'temperatura', 'humAmbiente', 'humTerreno', 'phTerreno'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  constructor(private service: ServiceService, private pag: MatPaginatorIntl){
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
      this.dataSource = res;
      this.dataSource.paginator = this.paginator;
      this.array = res;
      this.totalSize = res.length;
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



}
