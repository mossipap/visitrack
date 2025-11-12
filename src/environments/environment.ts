// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://vitrack.legipen.net/api/v1',
  appRoot: 'https://visitrack.ci',
 // apiUrl: 'http://localhost:4200',
  /* apiUrl: 'http://10.100.11.4:8081/api/v1',
  apiBiostar: 'https://10.100.10.22/api',
  appRoot: 'http://10.100.11.4:8080', */
  erreur_connexion_message: 'Problème de connexion au serveur, Veuillez vérifier votre connexion Internet et réessayer',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
