"use strict";

module.exports = function (options) {
  if (options.get('game') == null) {
      console.log('Se debe especificar un juego ej. --game tombola');
	  process.exit(1);
  }

  // @see https://www.npmjs.com/package/ssh-deploy-release
  return {
    // Common configuration
    // These options will be merged with those specific to the environment
    common: {
      localPath: 'build',
      host: '10.10.23.165',
      username: 'opc',
      privateKeyFile: process.env.HOME+'/.ssh/oracle.key',
      allowRemove: true,
      releasesFolder: 'releases-' + options.get('game'),
      currentReleaseLink: options.get('game'),
      share: {},
      exclude: [],
      create: []
    },
    // Environment specific configuration
    environments: {
      be: {
      	host: '10.10.23.134',
      	username: 'opc',
      	privateKeyFile: process.env.HOME+'/.ssh/oracle.key',
      	localPath: 'build.' + options.get('game') + '.be',
        deployPath: '/usr/share/nginx/html'
      },
      desa: {
      	host: 'BA-Services-Online',
      	username: 'root',
      	privateKeyFile: process.env.HOME+'/.ssh/id_rsa',
      	localPath: 'build.' + options.get('game') + '.desa',
        deployPath: '/var/www/html/quinielaonlinedesa.tecnoaccion.com.ar'
      }
	}
  };
};
