import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "./navBar.js"

import Home from './home';
import Clientes from './clientes/clientes';
import Login from './login';
import Reportes from './reportes/reportes';
import ReportesMedida from './reportes/reportesMedida';
import Tablero from './tablero/tablero';
import Sistema from './sistema/sistema';
import Test from './test/test'

import $ from 'jquery';

import 'jquery-confirm';
import 'jquery-confirm/css/jquery-confirm.css';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


// Diccionarios para lenguaje español
import esMessages from "devextreme/localization/messages/es.json";
import { locale, loadMessages } from "devextreme/localization";


import './scss/style.css'

import packageJson from '../package.json';
import CambiosDeAgencias from './clientes/CambiosDeAgencias.js';
import CambioMasivoAg from './clientes/cambioMasivoAg.js';

global.appVersion = packageJson.version;

class ContenedorPlataforma extends React.Component {

	constructor(props) {

		super(props);

		loadMessages(esMessages);
		locale(navigator.language);

		this.state = {
			logueado: false,
			key: '',
			nombre: '',
			apellido: '',
			organizaciones: [],
			organizacionesClientes: []
		};

		this.logueado = this.logueado.bind(this);
		this.getKey = this.getKey.bind(this);
		this.getOrganizaciones = this.getOrganizaciones.bind(this);
		this.getOrganizacionesHab = this.getOrganizacionesHab.bind(this);
		this.mensajeErrorWS = this.mensajeErrorWS.bind(this);
		this.mensajeErrorGeneral = this.mensajeErrorGeneral.bind(this);
		this.cerrarSesion = this.cerrarSesion.bind(this);
		this.volverAlInicio = this.volverAlInicio.bind(this);
		this.setOrganizacionesCliente = this.setOrganizacionesCliente.bind(this);
		this.getIDBilletera = this.getIDBilletera.bind(this);
		this.isLogueado = this.isLogueado.bind(this);

	}

	isLogueado() {
		return this.state.logueado;
	}

	getIDBilletera(codigoOrganizacion) {
		let respuesta = "";
		let i = 0;
		for (i = 0; i < this.state.organizacionesClientes.length; ++i) {
			if (this.state.organizacionesClientes[i].codigoOrganizacion == codigoOrganizacion)
				return this.state.organizacionesClientes[i].billeteraId;
		}
		return "";
	}

	cerrarSesion() {

		let objThis = this;
		let imagen = "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>";

		$.confirm({
			title: imagen,
			content: '<h4 class="text-center">Esta seguro que desea cerrar la sesion?</h4>',
			buttons: {
				cancelar: {
					text: 'Cancelar',
					btnClass: 'btn-outline-info',
					keys: ['enter', 'shift'],
					action: function () {
						//close
					}

				},
				aceptar: {
					text: 'Aceptar',
					btnClass: 'btn-info',
					keys: ['enter', 'shift'],
					action: function () {
						objThis.setState({
							logueado: false,
							key: '',
							nombre: '',
							apellido: '',
							organizaciones: []
						});
					}
				}
			}
		});



	}

	setOrganizacionesCliente(aOrganizaciones) {
		this.setState({ organizacionesClientes: aOrganizaciones });
	}

	volverAlInicio() {
		if (this.props.history != null)
			this.props.history.push('/');
	}

	getOrganizaciones() {
		return this.state.organizaciones;
	}

	getOrganizacionesHab() {
		if (this.state.organizacionesClientes == null) return [];
		let i, j = 0;
		let organizaciones = [];
		for (i = 0; i < this.state.organizaciones.length; ++i) {
			for (j = 0; j < this.state.organizacionesClientes.length; ++j) {
				if (this.state.organizacionesClientes[j].codigoOrganizacion == this.state.organizaciones[i].codigo) {
					organizaciones.push(this.state.organizacionesClientes[j]);
				}
			}
		}

		return organizaciones;
	}

	getKey() {
		return this.state.key;
	}

	logueado(aKey, aNombre, aApellido, aOrganizaciones) {
		this.setState(
			{
				logueado: true,
				key: aKey,
				nombre: aNombre,
				apellido: aApellido,
				organizaciones: aOrganizaciones
			}
		);
	}

	mensajeErrorGeneral() {


		let imagen = "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>";

		$.alert({
			title: imagen + "<h4>Ups. </h4>",
			content: '<div class="text-center pb-2 mt-2">Favor reintente más tarde. Verifique la conexión a internet.</div>',
			buttons: {
				continuar: function () {

				}
			}
		});


	}



	mensajeErrorWS(titulo, errores, cerrarSesion) {


		let imagen = "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>";

		let i = 0;
		let mensaje = "";

		for (i = 0; i < errores.length; ++i) {
			mensaje = mensaje + "<div>" + errores[i].error + "</div>";
		}

		let objThis = this;

		$.alert({
			title: imagen + ' ' + titulo,
			content: '<div class="text-center pb-2 mt-2">' + mensaje + '</div>',
			buttons: {
				continuar: function () {
					if (cerrarSesion) {
						objThis.cerrarSesion();
						objThis.volverAlInicio();
					}
				}
			}
		});


	}

	render() {
		return (
			<Router>
				<NavBar getKeyLogin={this.getKey} cerrarSesion={this.cerrarSesion} mensajeErrorGeneral={this.mensajeErrorGeneral} mensajeErrorWS={this.mensajeErrorWS} isLogueado={this.isLogueado} nombreUsuario={this.state.nombre} apellidoUsuario={this.state.apellido} version={global.appVersion} />

				<Switch>
					<Route exact path="/">
						<Home isLogueado={this.isLogueado} />
					</Route>

					{this.isLogueado() &&
						<Route path="/clientes"
							render=
							{props =>
								<Clientes getIDBilletera={this.getIDBilletera} setOrganizacionesCliente={this.setOrganizacionesCliente} getKeyLogin={this.getKey} getOrganizacionesHab={this.getOrganizacionesHab} getOrganizaciones={this.getOrganizaciones} mensajeErrorWS={this.mensajeErrorWS} mensajeErrorGeneral={this.mensajeErrorGeneral} />
							}
						/>
					}

					{this.isLogueado() &&
						<Route path="/reportes"
							render=
							{props =>
								<Reportes getKeyLogin={this.getKey} getOrganizaciones={this.getOrganizaciones} mensajeErrorWS={this.mensajeErrorWS} mensajeErrorGeneral={this.mensajeErrorGeneral} />
							}
						/>
					}

					{this.isLogueado() &&
						<Route path="/reportesMedida"
							render=
							{props =>
								<ReportesMedida getKeyLogin={this.getKey} getOrganizaciones={this.getOrganizaciones} mensajeErrorWS={this.mensajeErrorWS} mensajeErrorGeneral={this.mensajeErrorGeneral} />
							}
						/>
					}

					{this.isLogueado() &&
						<Route path="/tablero"
							render=
							{props =>
								<Tablero getKeyLogin={this.getKey} getOrganizaciones={this.getOrganizaciones} mensajeErrorWS={this.mensajeErrorWS} mensajeErrorGeneral={this.mensajeErrorGeneral} />
							}
						/>
					}

					{this.isLogueado() &&
						<Route path="/cambioMasivoAg"
							render=
							{props =>
								<CambioMasivoAg getKeyLogin={this.getKey} getOrganizaciones={this.getOrganizaciones} mensajeErrorWS={this.mensajeErrorWS} mensajeErrorGeneral={this.mensajeErrorGeneral} />
							}
						/>
					}

					{this.isLogueado() &&
						<Route path="/sistema"
							render=
							{props =>
								<Sistema getKeyLogin={this.getKey} getOrganizaciones={this.getOrganizaciones} mensajeErrorWS={this.mensajeErrorWS} mensajeErrorGeneral={this.mensajeErrorGeneral} />
							}
						/>
					}
					{this.isLogueado() &&
						<Route path="/test"
							render=
							{props =>
								<Test getKeyLogin={this.getKey} getOrganizaciones={this.getOrganizaciones} mensajeErrorWS={this.mensajeErrorWS} mensajeErrorGeneral={this.mensajeErrorGeneral} />
							}
						/>
					}
					<Route path="/login"
						render=
						{props =>
							<Login logueado={this.logueado} mensajeErrorWS={this.mensajeErrorWS} mensajeErrorGeneral={this.mensajeErrorGeneral} />
						}
					/>

					<Route path="/login">
						<Login logueado={this.logueado} mensajeErrorWS={this.mensajeErrorWS} mensajeErrorGeneral={this.mensajeErrorGeneral} />
					</Route>
				</Switch>
			</Router>
		);
	}

}

ReactDOM.render(<ContenedorPlataforma />, document.getElementById('root'));

