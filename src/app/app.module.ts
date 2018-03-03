import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { APP_ROUTES } from "./app.routes";
import { AppComponent } from './app.component';
import { HttpService } from './services/http.service';
import { DocentesComponent } from './docentes/docentes.component';
import { HorariosComponent } from './horarios/horarios.component';
import { MateriasComponent } from './materias/materias.component';
import { AulasComponent } from './aulas/aulas.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    AppComponent,
    DocentesComponent,
    HorariosComponent,
    MateriasComponent,
    AulasComponent
  ],
  imports: [
    APP_ROUTES,
    CommonModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    BrowserModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule {}
