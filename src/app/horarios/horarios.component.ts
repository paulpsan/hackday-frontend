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
  public materias;
  public aulas;
  public objetoEditar;
  public semanas = [];
  public mensajeError;
  public error: Boolean = false;
  public horarioForm: FormGroup;
  public cargando: Boolean = false;
  public mostrarLista: Boolean = false;
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
      dia: new FormControl("", Validators.required),
      hora_ini: new FormControl("", Validators.required),
      hora_fin: new FormControl("", Validators.required),
      materia: new FormControl("", Validators.required),
      aula: new FormControl("", Validators.required)
    });

    this._httpService.obtener("horarios").subscribe(
      data => {
        this.horarios = data;
      },
      err => {
        console.log(err)
        this.mensajeError = err.message;
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 2000);
      }
    );
    this._httpService.obtener("aulas").subscribe(
      data => {
        this.aulas = data;
      },
      err => {
        this.mensajeError = err.message;
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 2000);
      }
    );
    this._httpService.obtener("materias").subscribe(
      data => {
        this.materias = data;
      },
      err => {
        this.mensajeError = err.message;
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 2000);
      }
    );
    //carga semanas
    for (let i = 1; i <= 52; i++) {
      this.semanas.push(i);
    }
    console.log(this.semanas);
  }
  adicionar() {
    this.cargando = !this.cargando;
    this.objetoEditar = {
      _id: null,
      dia: "",
      hora_ini: "",
      hora_fin: "",
      materia: "",
      aula: ""
    };
  }
  editar(objeto) {
    this.cargando = !this.cargando;
    if (objeto._id) {
      this._httpService.buscarId("horarios", objeto._id).subscribe(
        data => {
          this.objetoEditar = data;
          console.log(data);

          this.horarioForm.setValue({
            dia: this.objetoEditar.dia,
            hora_ini: this.objetoEditar.hora_ini,
            hora_fin: this.objetoEditar.hora_fin,
            materia: this.objetoEditar.fk_materia,
            aula: this.objetoEditar.fk_aula
          });
        },
        err => {
          this.mensajeError = err.message;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 2000);
        }
      );
    }
  }

  cancelar() {
    this.cargando = !this.cargando;
    this.horarioForm.reset();
  }

  guardar() {
    console.log();
    let objHorario = {
      _id: null,
      dia: this.horarioForm.controls["dia"].value,
      hora_ini: this.horarioForm.controls["hora_ini"].value,
      hora_fin: this.horarioForm.controls["hora_fin"].value,
      fk_materia: this.horarioForm.controls["materia"].value,
      fk_aula: this.horarioForm.controls["aula"].value
    };

    if (this.objetoEditar._id) {
      objHorario._id = this.objetoEditar._id;
      this._httpService.editar("horarios", objHorario).subscribe(
        resp => {
          this.cargarDatos();
        },
        err => {
          this.mensajeError = err.error.mensaje;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 2000);
        }
      );
    } else {
      this._httpService.adicionar("horarios", objHorario).subscribe(
        resp => {
          this.cargarDatos();
        },
        err => {
          this.mensajeError = err.error.mensaje;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 2000);
        }
      );
    }
    this.cargando = !this.cargando;
    this.objetoEditar = [];
    this.horarioForm.reset();
  }
  eliminar(objeto) {
    if (confirm("desea eliminar")) {
      this._httpService.eliminarId("horarios", objeto._id).subscribe(
        data => {
          this.cargarDatos();
        },
        err => {
          this.mensajeError = err.message;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 2000);
        }
      );
    }
  }

  listar() {
    this.mostrarLista = !this.mostrarLista;
  }
}
