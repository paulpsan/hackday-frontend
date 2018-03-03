import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpService } from "../services/http.service";
import { Subject } from "rxjs/Subject";

@Component({
  selector: "app-horarios",
  templateUrl: "./horarios.component.html",
  styleUrls: ["./horarios.component.css"]
})
export class HorariosComponent implements OnInit {
  public horarios;
  public objetoEditar;
  public horarioForm: FormGroup;
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
    this.horarioForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      email: new FormControl("")
    });

    this._httpService.obtener("horarios").subscribe(data => {
      this.horarios = data;
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
      this._httpService.buscarId("horarios", objeto._id).subscribe(data => {
        this.objetoEditar = data;
        console.log(data);

        this.horarioForm.setValue({
          nombre: this.objetoEditar.nombre,
          email: this.objetoEditar.email
        });
      });

      this.cargando = !this.cargando;
      this.horarioForm.setValue({
        nombre: objeto.nombre,
        email: objeto.email
      });
    }
    this.cargando = !this.cargando;
    this.horarioForm.setValue({
      nombre: objeto.nombre,
      email: objeto.email
    });
  }
  cancelar() {
    this.cargando = !this.cargando;
    this.horarioForm.reset();
  }

  guardar() {
    console.log();
    let objHorario = {
      _id: null,
      nombre: this.horarioForm.controls["nombre"].value,
      email: this.horarioForm.controls["email"].value
    };

    if (this.objetoEditar._id) {
      objHorario._id = this.objetoEditar._id;
      this._httpService.editar("horarios", objHorario).subscribe(resp => {
        this.cargarDatos();
      });
    } else {
      this._httpService.adicionar("horarios", objHorario).subscribe(resp => {
        this.cargarDatos();
      });
    }
    this.cargando = !this.cargando;
    this.objetoEditar = [];
    this.horarioForm.reset();
  }
  eliminar(objeto) {
    if (confirm("desea eliminar")) {
      this._httpService.eliminarId("horarios", objeto._id).subscribe(data => {
        this.cargarDatos();
      });
    }
  }
}
