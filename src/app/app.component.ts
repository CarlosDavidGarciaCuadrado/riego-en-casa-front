import { Component, ViewChild } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from './service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  array: any;
  public pageSize=5;
  currentPage = 0;
  totalSize = 0;
  title = 'riego-sistematizado';
  displayedColumns: string[] = ['position', 'temperatura', 'humAmbiente', 'humTerreno', 'phTerreno'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  constructor(private service: ServiceService){
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
}
