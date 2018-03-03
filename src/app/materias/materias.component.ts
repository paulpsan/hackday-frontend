import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpService } from "../services/http.service";
import { Subject } from "rxjs/Subject";

@Component({
  selector: "app-materias",
  templateUrl: "./materias.component.html",
  styleUrls: ["./materias.component.css"]
})
export class MateriasComponent implements OnInit {
  public materias;
  public docentes;
  public objetoEditar;
  public materiaForm: FormGroup;
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
    this.materiaForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      detalle: new FormControl(""),
      docente: new FormControl("")
    });

    this._httpService.obtener("materias").subscribe(data => {
      this.materias = data;
      console.log(data);
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
      detalle: "",
      fk_docente: ""
    };
  }
  editar(objeto) {
    this.cargando = !this.cargando;
    if (objeto._id) {
      this._httpService.buscarId("materias", objeto._id).subscribe(data => {
        this.objetoEditar = data;
        console.log(data);

        this.materiaForm.setValue({
          nombre: this.objetoEditar.nombre,
          detalle: this.objetoEditar.detalle,
          docente: this.objetoEditar.fk_docente
        });
      });
    }
  }
  cancelar() {
    this.cargando = !this.cargando;
    this.materiaForm.reset();
  }

  guardar() {
    let objMateria = {
      _id: null,
      nombre: this.materiaForm.controls["nombre"].value,
      detalle: this.materiaForm.controls["detalle"].value,
      fk_docente: this.materiaForm.controls["docente"].value
    };
    console.log(objMateria);
    if (this.objetoEditar._id) {
      objMateria._id = this.objetoEditar._id;
      this._httpService.editar("materias", objMateria).subscribe(resp => {
        this.cargarDatos();
      });
    } else {
      this._httpService.adicionar("materias", objMateria).subscribe(resp => {
        this.cargarDatos();
      });
    }
    this.cargando = !this.cargando;
    this.objetoEditar = [];
    this.materiaForm.reset();
  }
  eliminar(objeto) {
    if (confirm("desea eliminar")) {
      this._httpService.eliminarId("materias", objeto._id).subscribe(data => {
        this.cargarDatos();
      });
    }
  }
}
