import { Component, OnInit, ViewChild } from '@angular/core';
import { RolService } from 'src/app/_services/rol.service';
import { Rol } from 'src/app/_models/rol';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-listaroles',
  templateUrl: './listaroles.component.html',
  styleUrls: ['./listaroles.component.css']
})
export class ListarolesComponent implements OnInit {
  roles: Rol[];
  listData: MatTableDataSource<Rol>;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  displayedColumns: string[] = [ 'Id', 'descripcion', 'alias' , 'activo', 'publico', 'actionsColumn' ];

  constructor(private rolService: RolService, private router: Router) { }

  ngOnInit() {
    this.rolService.getAll().subscribe(list => {
    this.roles = list;

    this.listData = new MatTableDataSource(this.roles);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    });

  //  $("html,body").animate({ scrollTop: 100 }, "slow");
  }

  edit(id: number): void {
      this.router.navigate(['/seguridad/asignaropciones', id]);
 }

}
