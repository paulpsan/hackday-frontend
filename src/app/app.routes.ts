import { RouterModule, Routes } from "@angular/router";

import { DocentesComponent } from "./docentes/docentes.component";
import { HorariosComponent } from "./horarios/horarios.component";
import { MateriasComponent } from "./materias/materias.component";
import { AulasComponent } from "./aulas/aulas.component";


const appRoutes: Routes = [
  { path: "docentes", component: DocentesComponent },
  { path: "horarios", component: HorariosComponent },
  { path: "materias", component: MateriasComponent },
  { path: "aulas", component: AulasComponent }
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true });
