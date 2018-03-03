import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpService } from "../services/http.service";
import { Subject } from "rxjs/Subject";

@Component({
  selector: "app-aulas",
  templateUrl: "./aulas.component.html",
  styleUrls: ["./aulas.component.css"]
})
export class AulasComponent implements OnInit {
  public aulas;
  public objetoEditar;
  public aulaForm: FormGroup;
  public cargando: Boolean = false;
  // dtOptions: DataTables.Settings = {};
  // dtTrigger: Subject<any> = new Subject();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _httpService: HttpService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }
  cargarDatos() {
    // this.dtOptions = {
    //   order: [[0, "desc"]],
    //   pagingType: "full_numbers",
    //   pageLength: 10,
    //   language: {
    //     search: "Buscar",
    //     lengthMenu: "Mostrar _MENU_ entradas",
    //     info: "Mostrar Pagina _PAGE_ de _PAGES_",
    //     paginate: {
    //       first: "Primero",
    //       previous: "Anterior",
    //       next: "Siguiente",
    //       last: "Ultimo"
    //     }
    //   }
    // };
    this.aulaForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      descripcion: new FormControl("")
    });

    this._httpService.obtener("aulas").subscribe(data => {
      this.aulas = data;
      console.log(data);
    });
  }
  adicionar() {
    this.cargando = !this.cargando;
    this.objetoEditar = {
      _id: null,
      nombre: "",
      descripcion: ""
    };
  }
  editar(objeto) {
    this.cargando = !this.cargando;
    if (objeto._id) {
      this._httpService.buscarId("aulas", objeto._id).subscribe(data => {
        this.objetoEditar = data;
        console.log(data);

        this.aulaForm.setValue({
          nombre: this.objetoEditar.nombre,
          descripcion: this.objetoEditar.descripcion
        });
      });

    }
  }
  cancelar() {
    this.cargando = !this.cargando;
    this.aulaForm.reset();
  }

  guardar() {
    console.log();
    let objAula = {
      _id: null,
      nombre: this.aulaForm.controls["nombre"].value,
      descripcion: this.aulaForm.controls["descripcion"].value
    };

    if (this.objetoEditar._id) {
      objAula._id = this.objetoEditar._id;
      this._httpService.editar("aulas", objAula).subscribe(resp => {
        this.cargarDatos();
      });
    } else {
      this._httpService.adicionar("aulas", objAula).subscribe(resp => {
        this.cargarDatos();
      });
    }
    this.cargando = !this.cargando;
    this.objetoEditar = [];
    this.aulaForm.reset();
  }
  eliminar(objeto) {
    if (confirm("desea eliminar")) {
      this._httpService.eliminarId("aulas", objeto._id).subscribe(data => {
        this.cargarDatos();
      });
    }
  }
}
