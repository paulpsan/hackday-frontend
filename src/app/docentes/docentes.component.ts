import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpService } from "../services/http.service";
import { Subject } from "rxjs/Subject";
@Component({
  selector: "app-docentes",
  templateUrl: "./docentes.component.html",
  styleUrls: ["./docentes.component.css"]
})
export class DocentesComponent implements OnInit {
  public docentes;
  public objetoEditar;
  public docenteForm: FormGroup;
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
    this.docenteForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      email: new FormControl("")
    });

    this._httpService.obtener("docentes").subscribe(data => {
      this.docentes = data;
      console.log(data);
    });
  }
  adicionar() {
    this.cargando = !this.cargando;
    this.objetoEditar = {
      _id: null,
      nombre: "",
      email: ""
    };
  }
  editar(objeto) {
    this.cargando = !this.cargando;
    if (objeto._id) {
      this._httpService.buscarId("docentes", objeto._id).subscribe(data => {
        this.objetoEditar = data;
        console.log(data);

        this.docenteForm.setValue({
          nombre: this.objetoEditar.nombre,
          email: this.objetoEditar.email
        });
      });
    }
  }
  cancelar() {
    this.cargando = !this.cargando;
    this.docenteForm.reset();
  }

  guardar() {
    console.log();
    let objDocente = {
      _id: null,
      nombre: this.docenteForm.controls["nombre"].value,
      email: this.docenteForm.controls["email"].value
    };

    if (this.objetoEditar._id) {
      objDocente._id = this.objetoEditar._id;
      this._httpService.editar("docentes", objDocente).subscribe(resp => {
        this.cargarDatos();
      });
    } else {
      this._httpService.adicionar("docentes", objDocente).subscribe(resp => {
        this.cargarDatos();
      });
    }
    this.cargando = !this.cargando;
    this.objetoEditar = [];
    this.docenteForm.reset();
  }
  eliminar(objeto) {
    if (confirm("desea eliminar")) {
      this._httpService.eliminarId("docentes", objeto._id).subscribe(data => {
        this.cargarDatos();
      });
    }
  }
}
