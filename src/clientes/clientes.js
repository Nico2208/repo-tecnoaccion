import React from 'react'
import { withRouter } from 'react-router-dom';
import { Animated } from 'react-animated-css';
import $ from 'jquery';

import Row from './component/row'
import DatosPersonales from './datosPersonales';
import Billetera from './billetera';
import Cupones from './cupones';
import SolicitudRetiros from './solicitudRetiros';
import CambiosDeAgencias from './CambiosDeAgencias';
import Exclusion from './exclusion';
import Mensajeria from './mensajeria';
import fetchTimeout from 'fetch-timeout';
import Moment from 'moment';
import ListadoUif from './listadoUif';
import SeguimientoReclamo from './seguimientoReclamos';

class Clientes extends React.Component {

    constructor(props) {
        super(props);

        
        //Renombre funciones con .bind(this) en el constructor de la clase

        this.inicializarCliente = this.inicializarCliente.bind(this);

        this.inicializarCliente(false);

        this.handleBuscar = this.handleBuscar.bind(this);
        this.goToDatos = this.goToDatos.bind(this);
        this.goToBilletera = this.goToBilletera.bind(this);
        this.goToCupones = this.goToCupones.bind(this);
        this.goToSolicitudRetiros = this.goToSolicitudRetiros.bind(this);
        this.goToCambiosDeAgencias = this.goToCambiosDeAgencias.bind(this);
        this.goToExclusion = this.goToExclusion.bind(this);
        this.goToSeguimientoReclamo = this.goToSeguimientoReclamo.bind(this);
        this.goToListadoUif = this.goToListadoUif.bind(this)
        this.goToMensajeria = this.goToMensajeria.bind(this);
        this.handleBtn = this.handleBtn.bind(this);
        this.buscarCliente = this.buscarCliente.bind(this);
        this.getIdCliente = this.getIdCliente.bind(this);
        this.getOrganizacionSel = this.getOrganizacionSel.bind(this);
        this.inicializarCliente = this.inicializarCliente.bind(this);
        this.handleChangeNroDocuCorreo = this.handleChangeNroDocuCorreo.bind(this);
        this.traerDatosPersonales = this.traerDatosPersonales.bind(this);
        this.inicializarBilletera = this.inicializarBilletera.bind(this);
        this.inicializarSolicitudRetiros = this.inicializarSolicitudRetiros.bind(this);
        this.inicializarCambiosDeAgencias = this.inicializarCambiosDeAgencias.bind(this);
        this.inicializarConsultaExclusiones = this.inicializarConsultaExclusiones.bind(this);
        this.inicializarConsultaReclamos = this.inicializarConsultaReclamos.bind(this);
        this.ejecutarConsultarBilletera = this.ejecutarConsultarBilletera.bind(this);
        this.ejecutarConsultarSolRetiros = this.ejecutarConsultarSolRetiros.bind(this);
        this.ejecutarConsultarCambioAgencias = this.ejecutarConsultarCambioAgencias.bind(this);
        this.ejecutarConsultaListadoUif = this.ejecutarConsultaListadoUif.bind(this)
        this.ejecutarConsultaExclusiones = this.ejecutarConsultaExclusiones.bind(this);
        this.ejecutarConsultaReclamos = this.ejecutarConsultaReclamos.bind(this);
        this.inicializarCupones = this.inicializarCupones.bind(this);
        this.inicializarReclamos = this.inicializarReclamos.bind(this);
        this.inicializarListadoUif = this.inicializarListadoUif.bind(this)
        this.handleVerCupon = this.handleVerCupon.bind(this);
        this.traerJuegos = this.traerJuegos.bind(this);
        this.ejecutarConsultarCupones = this.ejecutarConsultarCupones.bind(this);
        this.cambioFechaDesdeCupon = this.cambioFechaDesdeCupon.bind(this);
        this.cambioFechaDesdeBilletera = this.cambioFechaDesdeBilletera.bind(this);
        this.cambioFechaDesdeSolicitudRetiro = this.cambioFechaDesdeSolicitudRetiro.bind(this);
        this.cambioFechaDesdeCambioAgencia = this.cambioFechaDesdeCambioAgencia.bind(this);
        this.cambioFechaDesdeExclusion = this.cambioFechaDesdeExclusion.bind(this);
        this.cambioFechaDesdeReclamos = this.cambioFechaDesdeReclamos.bind(this);
        this.cambioFechaDesdeUif = this.cambioFechaDesdeUif.bind(this)
        this.setIdCuponSeleccionado = this.setIdCuponSeleccionado.bind(this);
        this.setIdReclamoSeleccionado = this.setIdReclamoSeleccionado.bind(this);
        this.traerTiposMovBilletera = this.traerTiposMovBilletera.bind(this);
        this.getOrganizacionDefault = this.getOrganizacionDefault.bind(this);
        this.cambiarSolRetiroConAgenciaAmiga = this.cambiarSolRetiroConAgenciaAmiga.bind(this);
        this.reenvioMailCuentaActivacion = this.reenvioMailCuentaActivacion.bind(this);
        this.ClickAcelerarCambioAgencia = this.ClickAcelerarCambioAgencia.bind(this);
        this.setState = this.setState.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.anularExclusion = this.anularExclusion.bind(this);
        this.nuevaExclusion = this.nuevaExclusion.bind(this);
        this.handleNuevosDatos = this.handleNuevosDatos.bind(this);
        this.nuevoReclamo = this.nuevoReclamo.bind(this);
        this.handleVerReclamo = this.handleVerReclamo.bind(this)
        //Nicolas

        this.actualizarListadoUsuarios = this.actualizarListadoUsuarios.bind(this);
        this.handleListarUsuarios = this.handleListarUsuarios.bind(this);
        this.handlePalabra = this.handlePalabra.bind(this)
        this.handleFiltarPorDNI = this.handleFiltarPorDNI.bind()


        
        this.state = {
            listadoUsuarios: [],
            palabraACtual: ""
        }
    }

    handleFiltarPorDNI = (palabra) => {
        // let filtrados = this.state.listadoUsuarios.filter((usuario)=> usuario.documento === palabra)
        let filtrados = this.state.listadoUsuarios.filter((usuario)=> usuario.documento === palabra)
        this.actualizarListadoUsuarios(filtrados)
        console.log(filtrados)

        
    }

    handlePalabra() { //Modifica el valor de palabraActial tomando el DNI ingresado por formulario



        let nroDocu = $('#inputDNI').val();

        this.setState({ palabraACtual: nroDocu })
    }


    handleListarUsuarios() {
        $('.my-button').addClass('btn btn-success');
        let statusCode = "";
        let cerrarSesion = false;
        let url = "http://billetera.tecnoaccion.com.ar:8704/api-operador/admin/usuarios"
        fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')

            .then(respPromise => {
                statusCode = respPromise.status;
                // if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                //     cerrarSesion = true;
                // }
                return respPromise.json();
            })
            .then(json => {

                console.log(json)
                this.actualizarListadoUsuarios(json.items)
                // this.state.listadoUsuarios = json.items
                // if (json.status === "ok") {

                //     this.state.listadoUif.items = json.items;
                //     this.state.listadoUif.paginado = true;
                //     this.state.listadoUif.totalPages = json.totalPages;
                //     this.state.listadoUif.currentPage = json.currentPage;
                //     this.state.listadoUif.totalItems = json.totalItems;

                //     this.setState({ listadoUif: this.state.listadoUif });
                //     $("#pagConsListadoUif").val(json.currentPage + 1);

                // } else {
                //     this.props.mensajeErrorWS('Listado UIF', json.errores, cerrarSesion);
                // }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })

    }
    actualizarListadoUsuarios(value) {
        this.setState({ listadoUsuarios: value })
    }
    formatDate(string) {
        var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(string).toLocaleDateString("es-ES", options);
    }

    ClickAcelerarCambioAgencia() {

        if (this.getOrganizacionSel() == null) return;

        let url = process.env.REACT_APP_WS_EJECUTAR_CAMBIO_AGENCIA;
        url = url.replace(":idBilletera", this.props.getIDBilletera(this.getOrganizacionSel()));

        let cerrarSesion = false;
        let statusCode = "";

        let parametros = {};

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
            body: JSON.stringify(parametros)
        }
        )
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    this.ejecutarConsultarCambioAgencias(1);
                } else if (json.status === "error") {
                    if (cerrarSesion) {
                        this.props.mensajeErrorWS('Cambiar Solicitud a la agencia amiga', json.errores, cerrarSesion);
                    } else {
                        this.props.mensajeErrorWS('Cambiar Solicitud a la agencia amiga', json.errores);
                    }
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;

    }

    cambiarSolRetiroConAgenciaAmiga(idSolicitudRetiro) {

        if (idSolicitudRetiro == null) return;

        let url = process.env.REACT_APP_WS_REASIG_SOLRET_AGENCIA_AMIGA;

        url = url.replace(":idSolicitudRetiro", idSolicitudRetiro);

        let cerrarSesion = false;
        let statusCode = "";

        let parametros = {};

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
            body: JSON.stringify(parametros)
        }
        )
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    // Aceptar solicitud
                    this.ejecutarConsultarSolRetiros(1);
                } else if (json.status === "error") {
                    if (cerrarSesion) {
                        this.props.mensajeErrorWS('Cambiar Solicitud a la agencia amiga', json.errores, cerrarSesion);
                    } else {
                        this.props.mensajeErrorWS('Cambiar Solicitud a la agencia amiga', json.errores);
                    }
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;


    }

    setIdCuponSeleccionado(id) {
        this.state.cupones.idCuponSeleccionado = id;
        this.setState({ cupones: this.state.cupones });
    }

    setIdReclamoSeleccionado(id) {
        this.state.reclamos.idReclamoSeleccionado = id;
        this.setState({ reclamos: this.state.reclamos });
    }

    cambioFechaDesdeBilletera(fecha) {

        let nuevaFecha = null;

        if (fecha != null) {
            nuevaFecha = new Date();
            nuevaFecha.setDate(fecha.getDate() + 1);
        }

        if (nuevaFecha == null)
            this.state.billetera.filtros.fechaHasta = nuevaFecha;
        else if (this.state.billetera.filtros.fechaHasta == null)
            this.state.billetera.filtros.fechaHasta = nuevaFecha;

        this.setState({ billetera: this.state.billetera });
    }

    cambioFechaDesdeCambioAgencia(fecha) {

        let nuevaFecha = null;

        if (fecha != null) {
            nuevaFecha = new Date();
            nuevaFecha.setDate(fecha.getDate() + 1);
        }

        if (nuevaFecha == null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.cambiosDeAgencias.filtros.fechaHasta = nuevaFecha;
        else if (this.state.cambiosDeAgencias.filtros.fechaHasta == null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.cambiosDeAgencias.filtros.fechaHasta = nuevaFecha;

        this.setState({ cambiosDeAgencias: this.state.cambiosDeAgencias });
    }

    cambioFechaDesdeExclusion(fecha) {

        let nuevaFecha = null;

        if (fecha != null) {
            nuevaFecha = new Date();
            nuevaFecha.setDate(fecha.getDate() + 1);
        }

        if (nuevaFecha == null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.exclusiones.filtros.fechaHasta = nuevaFecha;
        else if (this.state.exclusiones.filtros.fechaHasta == null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.exclusiones.filtros.fechaHasta = nuevaFecha;

        this.setState({ exclusiones: this.state.exclusiones });
    }

    cambioFechaDesdeReclamos(fecha) {

        let nuevaFecha = null;

        if (fecha != null) {
            nuevaFecha = new Date();
            nuevaFecha.setDate(fecha.getDate() + 1);
        }

        if (nuevaFecha == null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.reclamos.filtros.fechaHasta = nuevaFecha;
        else if (this.state.reclamos.filtros.fechaHasta == null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.reclamos.filtros.fechaHasta = nuevaFecha;

        this.setState({ reclamos: this.state.reclamos });
    }

    cambioFechaDesdeSolicitudRetiro(fecha) {

        let nuevaFecha = null;

        if (fecha != null) {
            nuevaFecha = new Date();
            nuevaFecha.setDate(fecha.getDate() + 1);
        }

        if (nuevaFecha == null)
            this.state.solicitudRetiros.filtros.fechaHasta = nuevaFecha;
        else if (this.state.solicitudRetiros.filtros.fechaHasta == null)
            this.state.solicitudRetiros.filtros.fechaHasta = nuevaFecha;

        this.setState({ solicitudRetiros: this.state.solicitudRetiros });
    }

    cambioFechaDesdeCupon(fecha) {

        let nuevaFecha = null;

        if (fecha != null) {
            nuevaFecha = new Date();
            nuevaFecha.setDate(fecha.getDate() + 1);
        }

        if (nuevaFecha == null)
            this.state.cupones.filtros.fechaHasta = nuevaFecha;
        else if (this.state.cupones.filtros.fechaHasta == null)
            this.state.cupones.filtros.fechaHasta = nuevaFecha;

        this.setState({ cupones: this.state.cupones });

    }

    cambioFechaDesdeUif(fecha) {

        let nuevaFecha = null;

        if (fecha != null) {
            nuevaFecha = new Date();
            nuevaFecha.setDate(fecha.getDate() + 1);
        }

        if (nuevaFecha == null)
            this.state.listadoUif.filtros.fechaHasta = nuevaFecha;
        else if (this.state.listadoUif.filtros.fechaHasta == null)
            this.state.listadoUif.filtros.fechaHasta = nuevaFecha;

        this.setState({ listadoUif: this.state.listadoUif });

    }

    anularExclusion() {
        let cerrarSesion = false;
        let statusCode = "";
        let url = process.env.REACT_APP_WS_ANULAR_EXCLUSION;
        url = url.replace(":idBilletera", this.props.getIDBilletera(this.getOrganizacionSel()));
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }
        )
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {

                    let nroDocu = $('#fieldNroDocu').val();
                    this.buscarCliente(nroDocu);
                    this.ejecutarConsultaExclusiones(1);
                } else if (json.status === "error") {
                    if (cerrarSesion) {
                        this.props.mensajeErrorWS('Anular exclusion', json.errores, cerrarSesion);
                    } else {
                        this.props.mensajeErrorWS('Anular exclusion', json.errores);
                    }
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;

    }


    nuevaExclusion(desde, hasta, observaciones) {
        let url = process.env.REACT_APP_WS_GENERAR_EXCLUSION;
        url = url.replace(":idBilletera", this.props.getIDBilletera(this.getOrganizacionSel()));
        let cerrarSesion = false;
        let statusCode = "";
        let parametros = {
            desde: desde,
            hasta: hasta,
            observaciones: observaciones
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
            body: JSON.stringify(parametros)
        }
        )
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status === process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    let nroDocu = $('#fieldNroDocu').val();
                    this.buscarCliente(nroDocu);
                    this.ejecutarConsultaExclusiones(1);
                } else if (json.status === "error") {
                    if (cerrarSesion) {
                        this.props.mensajeErrorWS('Alta Operador', json.errores, cerrarSesion);
                    } else {
                        this.props.mensajeErrorWS('Alta Operador', json.errores);
                    }
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;
    }

    nuevoReclamo(falla, observaciones) {
        let url = process.env.REACT_APP_WS_GENERAR_RECLAMO;
        url = url.replace(":idBilletera", this.props.getIDBilletera(this.getOrganizacionSel()));
        let cerrarSesion = false;
        let statusCode = "";
        let parametros = {
            fallaId: falla,
            problemaId: null,
            observaciones: observaciones
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
            body: JSON.stringify(parametros)
        }
        )
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status === process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {

                } else if (json.status === "error") {
                    if (cerrarSesion) {
                        this.props.mensajeErrorWS('Alta Reclamo', json.errores, cerrarSesion);
                    } else {
                        this.props.mensajeErrorWS('Alta Reclamo', json.errores);
                    }
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;
    }

    handleNuevosDatos(e) {
        this.setState({ nuevosDatos: e.component.option("formData") })
    }

    inicializarCliente(refrescar) {
        this.state = {
            resultado: false,
            pagina: 0,
            cliente: {
                id: '',
                nombre: '',
                apellido: ''
            },
            datosPersonales: {
                cliente: {}
            },
            billetera: {
                totalPages: "",
                totalItems: "",
                currentPage: "",
                paginado: false,
                filtros: {
                    fechaDesde: new Date(),
                    fechaHasta: (new Date()).setDate((new Date()).getDate() + 1),
                    tipo: -1,
                    tiposOptions: {
                        items: [],
                        displayExpr: 'descripcion',
                        valueExpr: 'id'
                    }
                },
                billetera: []
            },
            solicitudRetiros: {
                totalPages: "",
                totalItems: "",
                currentPage: "",
                paginado: false,
                filtros: {
                    fechaDesde: new Date(),
                    fechaHasta: (new Date()).setDate((new Date()).getDate() + 1)
                },
                solicitudRetiros: []
            },
            cambiosDeAgencias: {
                totalPages: "",
                totalItems: "",
                currentPage: "",
                paginado: false,
                filtros: {
                    fechaDesde: new Date(),
                    fechaHasta: (new Date()).setDate((new Date()).getDate() + 1)
                },
                cambiosDeAgencias: []
            },
            exclusiones: {
                totalPages: "",
                totalItems: "",
                currentPage: "",
                paginado: false,
                filtros: {
                    fechaDesde: new Date(),
                    fechaHasta: (new Date()).setDate((new Date()).getDate() + 1)
                },
                items: []
            },
            reclamos: {
                totalPages: "",
                totalItems: "",
                currentPage: "",
                paginado: false,
                filtros: {
                    fechaDesde: new Date(),
                    fechaHasta: (new Date()).setDate((new Date()).getDate() + 1),
                },
                reclamos: [],
                idReclamoSeleccionado: null,
                verReclamo: []
            },
            listadoUif: {
                totalPages: "",
                totalItems: "",
                currentPage: "",
                paginado: false,
                filtros: {
                    fechaDesde: new Date(),
                    fechaHasta: (new Date()).setDate((new Date()).getDate() + 1),
                    estado: null,

                },
                items: []
            },
            cupones: {
                totalPages: "",
                totalItems: "",
                currentPage: "",
                paginado: false,
                filtros: {
                    fechaDesde: new Date(),
                    fechaHasta: (new Date()).setDate((new Date()).getDate() + 1),
                    juego: -1,
                    nuc: null,
                    juegosOptions: {
                        items: [],
                        displayExpr: 'nombre',
                        valueExpr: 'codigo'
                    }
                },
                idCuponSeleccionado: null,
                cupones: [],
                verCupon: {
                    payload: {
                        apuestas: [],
                        extractos: [],
                        sorteos: []
                    }
                }
            }
        };

        if (refrescar) {
            this.setState(this.state);
        }


    }

    ejecutarConsultarCupones(pagina) {

        let agregarCondFiltroJuego = "";
        let agregarCondFiltroFechas = "";
        let agregarCondFiltroPagina = "";

        let condFiltro = "";

        let formatFecDesde = "";
        if ((this.state.cupones.filtros.fechaDesde === null)
            &&
            (this.state.cupones.filtros.fechaHasta === null)
            &&
            ((this.state.cupones.filtros.nuc === null) || (this.state.cupones.filtros.nuc.length === 0))) {
            this.props.mensajeErrorWS('Consulta de Cupones', [{ codigo: 0, error: 'Debe ingresar fechas o NUC' }], false);
            return;
        }

        if (this.state.cupones.filtros.fechaDesde != null)
            formatFecDesde = encodeURIComponent(Moment(this.state.cupones.filtros.fechaDesde).format('YYYYMMDD'));

        let formatFecHasta = "";
        if (this.state.cupones.filtros.fechaHasta != null)
            formatFecHasta = encodeURIComponent(Moment(this.state.cupones.filtros.fechaHasta).format('YYYYMMDD'));

        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_CONS_CUPONES_BILLETERA;
        url = url.replace(":idBilletera", this.props.getIDBilletera(this.getOrganizacionSel()));

        if (this.state.cupones.filtros.juego != -1) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + '&';
            condFiltro = condFiltro + "codigoJuego=" + this.state.cupones.filtros.juego;
        }

        if ((formatFecDesde.length > 0) && (formatFecHasta.length > 0)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + '&';
            condFiltro = condFiltro + "desde=" + formatFecDesde + "&" + "hasta=" + formatFecHasta;
        }

        if (Number.isInteger(pagina)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + '&';
            condFiltro = condFiltro + "page=" + (pagina - 1).toString();
        }

        if ((this.state.cupones.filtros.nuc != null) && (this.state.cupones.filtros.nuc.length > 0)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + '&';
            condFiltro = condFiltro + "nuc=" + this.state.cupones.filtros.nuc;
        }

        if (condFiltro.length > 0)
            url = url + "?" + condFiltro;

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    this.state.cupones.cupones = json.items;
                    this.state.cupones.paginado = true;
                    this.state.cupones.totalPages = json.totalPages;
                    this.state.cupones.currentPage = json.currentPage;
                    this.state.cupones.totalItems = json.totalItems;
                    this.setState({ cupones: this.state.cupones });
                    $("#pagConsCupon").val(json.currentPage + 1);

                } else {
                    this.props.mensajeErrorWS('Consulta de Cupones', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;

    }

    ejecutarConsultaListadoUif(pagina) {

        let condFiltro = "";

        let formatFecDesde = "";
        let formatFecHasta = "";
        let idBilletera = "";
        let org = "";
        let estado = ""

        if (this.state.listadoUif.filtros.fechaDesde != null)
            formatFecDesde = encodeURIComponent(Moment(this.state.listadoUif.filtros.fechaDesde).format('YYYYMMDD'));

        if (this.state.listadoUif.filtros.fechaHasta != null)
            formatFecHasta = encodeURIComponent(Moment(this.state.listadoUif.filtros.fechaHasta).format('YYYYMMDD'));

        let statusCode = "";
        let cerrarSesion = false;

        let url = process.env.REACT_APP_WS_LISTADO_UIF;

        idBilletera = this.props.getIDBilletera(this.getOrganizacionSel());
        org = this.getOrganizacionSel();

        condFiltro = "codigoOrganizacion=" + org + "&billeteraId=" + idBilletera;

        if ((formatFecDesde.length > 0) && (formatFecHasta.length > 0)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + '&';
            condFiltro = condFiltro + "desde=" + formatFecDesde + "&" + "hasta=" + formatFecHasta;
        }

        if (Number.isInteger(pagina)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + '&';
            condFiltro = condFiltro + "page=" + (pagina - 1).toString();
        }

        if (this.state.listadoUif.filtros.estado != null) {
            if (this.state.listadoUif.filtros.estado === "Pendientes") {
                estado = "PENDIENTE"
            } else if (this.state.listadoUif.filtros.estado === "Resueltos") {
                estado = "RESUELTO"
            } else if (this.state.listadoUif.filtros.estado === "Todos") {
                estado = undefined
            }

            if (estado !== undefined) {
                condFiltro = condFiltro + "&"
                condFiltro = condFiltro + "estado=" + estado
            }
        }


        if (condFiltro.length > 0)
            url = url + "?" + condFiltro;


        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {

                    this.state.listadoUif.items = json.items;
                    this.state.listadoUif.paginado = true;
                    this.state.listadoUif.totalPages = json.totalPages;
                    this.state.listadoUif.currentPage = json.currentPage;
                    this.state.listadoUif.totalItems = json.totalItems;

                    this.setState({ listadoUif: this.state.listadoUif });
                    $("#pagConsListadoUif").val(json.currentPage + 1);

                } else {
                    this.props.mensajeErrorWS('Listado UIF', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;

    }

    // eslint-disable-next-line no-dupe-class-members
    ejecutarConsultaExclusiones(pagina) {

        let idBilletera = this.props.getIDBilletera(this.getOrganizacionSel());

        if (this.state.exclusiones.filtros.fechaDesde == null) {
            this.props.mensajeErrorWS('Consulta de Exclusiones', [{ codigo: 0, error: 'Ingresar la fecha desde' }], false);
            return;
        }

        if (this.state.exclusiones.filtros.fechaHasta == null) {
            this.props.mensajeErrorWS('Consulta de Exclusiones', [{ codigo: 0, error: 'Ingresar la fecha hasta' }], false);
            return;
        }


        let formatFecDesde = encodeURIComponent(Moment(this.state.exclusiones.filtros.fechaDesde).format('YYYYMMDD'));
        let formatFecHasta = encodeURIComponent(Moment(this.state.exclusiones.filtros.fechaHasta).format('YYYYMMDD'));

        let condFiltro = "";

        let statusCode = "";
        let cerrarSesion = false;

        let url = process.env.REACT_APP_WS_CONS_EXCLUSIONES;
        url = url.replace(":idBilletera", encodeURIComponent(idBilletera));

        if (formatFecDesde.length == 0) {
            this.props.mensajeErrorWS('Consulta de Exclusiones', [{ codigo: 0, error: 'Ingresar la fecha desde' }], false);
            return;
        }

        if (formatFecHasta.length == 0) {
            this.props.mensajeErrorWS('Consulta de Exclusiones', [{ codigo: 0, error: 'Ingresar la fecha hasta' }], false);
            return;
        }

        if ((formatFecDesde.length > 0) && (formatFecHasta.length > 0)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + "&";
            condFiltro = condFiltro + "desde=" + formatFecDesde + "&" + "hasta=" + formatFecHasta;
        }

        if (Number.isInteger(pagina)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + "&";
            condFiltro = condFiltro + "page=" + (pagina - 1).toString();
        }

        if (condFiltro.length > 0)
            url = url + "?" + condFiltro;

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                // eslint-disable-next-line no-unused-vars
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    json.items.map((item) => {
                        item.desde = this.formatDate(item.desde);
                        item.hasta = this.formatDate(item.hasta);
                    });
                    this.state.exclusiones.paginado = true;
                    this.state.exclusiones.totalPages = json.totalPages;
                    this.state.exclusiones.currentPage = json.currentPage;
                    this.state.exclusiones.totalItems = json.totalItems;
                    this.state.exclusiones.exclusiones = json.items;
                    this.setState({ exclusiones: this.state.exclusiones });
                    $("#pagConsExclusion").val(json.currentPage + 1);
                } else {
                    this.props.mensajeErrorWS('Consulta de Cambios de agencias', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;

    }

    ejecutarConsultaReclamos(pagina) {
        let idBilletera = this.props.getIDBilletera(this.getOrganizacionSel());
        let org = this.getOrganizacionSel();
        let condFiltro = ""
        condFiltro = "codigosOrganizacion=" + org + "&billeteraId=" + idBilletera;
        let estado = ""

        if (this.state.reclamos.filtros.fechaDesde == null) {
            this.props.mensajeErrorWS('Consulta de Reclamos', [{ codigo: 0, error: 'Ingresar la fecha desde' }], false);
            return;
        }
        if (this.state.reclamos.filtros.fechaHasta == null) {
            this.props.mensajeErrorWS('Consulta de Reclamos', [{ codigo: 0, error: 'Ingresar la fecha hasta' }], false);
            return;
        }

        let formatFecDesde = encodeURIComponent(Moment(this.state.reclamos.filtros.fechaDesde).format('YYYYMMDD'));
        let formatFecHasta = encodeURIComponent(Moment(this.state.reclamos.filtros.fechaHasta).format('YYYYMMDD'));
        condFiltro = "billeteraId=" + idBilletera;
        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_LISTADO_RECLAMOS;

        if (formatFecDesde.length == 0) {
            this.props.mensajeErrorWS('Consulta de reclamos', [{ codigo: 0, error: 'Ingresar la fecha desde' }], false);
            return;
        }

        if (formatFecHasta.length == 0) {
            this.props.mensajeErrorWS('Consulta de reclamos', [{ codigo: 0, error: 'Ingresar la fecha hasta' }], false);
            return;
        }

        if ((formatFecDesde.length > 0) && (formatFecHasta.length > 0)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + "&";
            condFiltro = condFiltro + "desde=" + formatFecDesde + "&" + "hasta=" + formatFecHasta;
        }

        if (this.state.reclamos.filtros.estado != null) {
            if (this.state.reclamos.filtros.estado === "Abiertos") {
                estado = true
            } else if (this.state.reclamos.filtros.estado === "Cerrados") {
                estado = false
            } else if (this.state.reclamos.filtros.estado === "Todos") {
                estado = undefined
            }

            if (estado !== undefined) {
                condFiltro = condFiltro + "&"
                condFiltro = condFiltro + "abierto=" + estado
            }
        }

        if (Number.isInteger(pagina)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + "&";
            condFiltro = condFiltro + "page=" + (pagina - 1).toString();
        }

        if (condFiltro.length > 0)
            url = url + "?" + condFiltro;

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    this.state.reclamos.reclamos = json.items;
                    this.state.reclamos.paginado = true;
                    this.state.reclamos.totalPages = json.totalPages;
                    this.state.reclamos.currentPage = json.currentPage;
                    this.state.reclamos.totalItems = json.totalItems;
                    this.setState({ reclamos: this.state.reclamos });
                    $("#pagConsReclamos").val(json.currentPage + 1);
                } else {
                    this.props.mensajeErrorWS('Consulta de reclamos', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;

    }

    traerTiposMovBilletera() {

        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_TIPOS_MOV_BILLETERA;
        url = url + "?codigoOrganizacion=" + this.getOrganizacionSel();

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                // eslint-disable-next-line no-unused-vars
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {

                    let tiposOptions = {
                        items: json.tiposMovimientos,
                        displayExpr: 'descripcion',
                        valueExpr: 'id'
                    }

                    tiposOptions.items.unshift({ id: -1, descripcion: "Todos" });

                    // eslint-disable-next-line react/no-direct-mutation-state
                    this.state.billetera.filtros.tiposOptions = tiposOptions;

                    this.setState({ billetera: this.state.billetera });

                } else {
                    this.props.mensajeErrorWS('Traer Tipos Movimientos', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            });


    }

    reenvioMailCuentaActivacion() {

        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_REENVIO_MAIL_ACTIVACION_CTA;
        url = url.replace(":idUsuario", this.state.datosPersonales.cliente.id);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        fetchTimeout(url, {
            signal: controller.signal,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {

                    $.confirm({
                        title: '<b>Correo enviado</b>',
                        backgroundDismiss: true,
                        columnClass: 'medium',
                        animation: 'zoom',
                        closeIcon: true,
                        closeAnimation: 'scale',
                        content: `<h5 className="text-center mt-4 mb-4">
                                    Se ha vuelto a enviar al cliente el correo de activación de cuenta.  
                                 </h5>`,
                        buttons: {
                            Continuar: {
                                text: "Continuar",
                                action: function () { }


                            }

                        }
                    });


                } else {
                    this.props.mensajeErrorWS('Reenvío mail activación cuenta', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral(timeoutId);
                clearTimeout(timeoutId);
            });

    }

    traerJuegos() {


        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_CONS_JUEGOS;
        url = url + "?codigoOrganizacion=" + this.getOrganizacionSel();

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    console.log(process.env.REACT_APP_CODIGO_CERRO_SESION);
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {

                    let juegosOptions = {
                        items: json.juegos,
                        displayExpr: 'nombre',
                        valueExpr: 'codigo'
                    }

                    juegosOptions.items.unshift({ codigo: -1, nombre: "Todos" });

                    this.state.cupones.filtros.juegosOptions = juegosOptions;

                    this.setState({ cupones: this.state.cupones });

                } else {
                    this.props.mensajeErrorWS('Traer Juegos', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;

    }

    handleVerCupon() {

        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_VER_CUPON;
        url = url.replace(":idCupon", encodeURIComponent(this.state.cupones.idCuponSeleccionado));

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {

                    if (typeof json.cupon.premio === 'undefined') {
                        json.cupon.premio = null;
                    }

                    this.state.cupones.verCupon = json.cupon;

                    this.setState({ cupones: this.state.cupones });


                } else {
                    this.props.mensajeErrorWS('Visualizar cupón', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;


    }

    handleVerReclamo() {
        let objThis = this;
        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_VER_RECLAMO;
        url = url.replace(":idReclamo", encodeURIComponent(objThis.state.reclamos.idReclamoSeleccionado));

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    this.state.reclamos.verReclamo = json.detalles;
                    this.setState({ detalles: this.state.detalles });
                } else {
                    this.props.mensajeErrorWS('Visualizar reclamo', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;


    }

    handleEditarReclamo(abierto, fallaId, observaciones) {
        let objThis = this;
        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_VER_RECLAMO;
        url = url.replace(":idReclamo", encodeURIComponent(objThis.reclamos.idReclamoSeleccionado));
        let parametros = {
            abierto: abierto,
            fallaId: fallaId,
            observaciones: observaciones,
            problemaId: null
        };

        fetchTimeout(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.getKeyLogin()
            },
            body: JSON.stringify(parametros)
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                } else {
                    this.props.mensajeErrorWS('Editar reclamo: ', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            });
    }

    inicializarCupones() {


        this.state.cupones.totalPages = "";
        this.state.cupones.totalItems = "";
        this.state.cupones.currentPage = "";
        this.state.cupones.paginado = false;
        /*
        this.state.cupones.filtros.fechaDesde = null;
        this.state.cupones.filtros.fechaHasta = null;
        this.state.cupones.filtros.juego  = -1;
        this.state.cupones.filtros.nuc = null;*/
        this.state.cupones.idCuponSeleccionado = null;

        if (this.state.cupones.cupones != null)
            this.state.cupones.cupones.length = 0;

        let aVerCupon =
        {
            payload: {
                apuestas: [],
                extractos: [],
                sorteos: []
            }
        };
        this.state.cupones.verCupon = aVerCupon;

        this.setState({ cupones: this.state.cupones });

    }

    inicializarReclamos() {
        this.state.reclamos.totalPages = "";
        this.state.reclamos.totalItems = "";
        this.state.reclamos.currentPage = "";
        this.state.reclamos.paginado = false;
        this.state.reclamos.idReclamoSeleccionado = null;

        if (this.state.reclamos.reclamos != null)
            this.state.reclamos.reclamos.length = 0;

        let aVerReclamo =
        {
            payload: {
                detalles: []
            }
        };
        this.state.reclamos.verReclamo = aVerReclamo;
        this.setState({ reclamos: this.state.reclamos });
    }

    inicializarListadoUif() {


        this.state.listadoUif.totalPages = "";
        this.state.listadoUif.totalItems = "";
        this.state.listadoUif.currentPage = "";
        this.state.listadoUif.paginado = false;



        if (this.state.listadoUif.items != null)
            this.state.listadoUif.items.length = 0;



        this.setState({ listadoUif: this.state.listadoUif });

    }

    inicializarBilletera() {

        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.billetera.pagina = false;
        if (this.state.billetera.billetera != null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.billetera.billetera.length = 0;

        this.setState({ billetera: this.state.billetera });

    }

    inicializarSolicitudRetiros() {

        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.solicitudRetiros.pagina = false;
        if (this.state.solicitudRetiros.solicitudRetiros != null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.solicitudRetiros.solicitudRetiros.length = 0;

        this.setState({ solicitudRetiros: this.state.solicitudRetiros });

    }

    inicializarCambiosDeAgencias() {

        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.CambiosDeAgencias.pagina = false;
        if (this.state.CambiosDeAgencias.CambiosDeAgencias != null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.CambiosDeAgencias.CambiosDeAgencias.length = 0;

        this.setState({ CambiosDeAgencias: this.state.CambiosDeAgencias });
    }
    inicializarConsultaExclusiones() {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.exclusiones.totalPages = "";
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.exclusiones.totalItems = "";
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.exclusiones.currentPage = "";
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.exclusiones.paginado = false;
        if (this.state.exclusiones.items != null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.exclusiones.items.length = 0;
        this.setState({ exclusiones: this.state.exclusiones });
    }

    inicializarConsultaReclamos() {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.reclamos.totalPages = "";
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.reclamos.totalItems = "";
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.reclamos.currentPage = "";
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.reclamos.paginado = false;
        if (this.state.reclamos.items != null)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.reclamos.items.length = 0;
        this.setState({ reclamos: this.state.reclamos });
    }

    ejecutarConsultarCambioAgencias(pagina) {

        let idBilletera = this.props.getIDBilletera(this.getOrganizacionSel());

        if (this.state.cambiosDeAgencias.filtros.fechaDesde == null) {
            this.props.mensajeErrorWS('Consulta de Cambios de Agencias', [{ codigo: 0, error: 'Ingresar la fecha desde' }], false);
            return;
        }

        if (this.state.cambiosDeAgencias.filtros.fechaHasta == null) {
            this.props.mensajeErrorWS('Consulta de Cambios de Agencias', [{ codigo: 0, error: 'Ingresar la fecha hasta' }], false);
            return;
        }


        let formatFecDesde = encodeURIComponent(Moment(this.state.cambiosDeAgencias.filtros.fechaDesde).format('YYYYMMDD'));
        let formatFecHasta = encodeURIComponent(Moment(this.state.cambiosDeAgencias.filtros.fechaHasta).format('YYYYMMDD'));

        let condFiltro = "";

        let statusCode = "";
        let cerrarSesion = false;

        let url = process.env.REACT_APP_WS_CONS_CAMBIOS_AGENCIAS;
        url = url.replace(":idBilletera", encodeURIComponent(idBilletera));

        if (formatFecDesde.length == 0) {
            this.props.mensajeErrorWS('Consulta de Cambios de Agencias', [{ codigo: 0, error: 'Ingresar la fecha desde' }], false);
            return;
        }

        if (formatFecHasta.length == 0) {
            this.props.mensajeErrorWS('Consulta de Cambios de Agencias', [{ codigo: 0, error: 'Ingresar la fecha hasta' }], false);
            return;
        }

        if ((formatFecDesde.length > 0) && (formatFecHasta.length > 0)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + "&";
            condFiltro = condFiltro + "desde=" + formatFecDesde + "&" + "hasta=" + formatFecHasta;
        }

        if (Number.isInteger(pagina)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + "&";
            condFiltro = condFiltro + "page=" + (pagina - 1).toString();
        }

        if (condFiltro.length > 0)
            url = url + "?" + condFiltro;

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {

                    this.state.cambiosDeAgencias.cambiosDeAgencias = json.items;
                    this.state.cambiosDeAgencias.paginado = true;
                    this.state.cambiosDeAgencias.totalPages = json.totalPages;
                    this.state.cambiosDeAgencias.currentPage = json.currentPage;
                    this.state.cambiosDeAgencias.totalItems = json.totalItems;
                    this.setState({ cambiosDeAgencias: this.state.cambiosDeAgencias });
                    $("#pagConsCupon").val(json.currentPage + 1);
                } else {
                    this.props.mensajeErrorWS('Consulta de Cambios de agencias', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;


    }

    ejecutarConsultarSolRetiros(pagina) {


        let idBilletera = this.props.getIDBilletera(this.getOrganizacionSel());

        if (this.state.solicitudRetiros.filtros.fechaDesde == null) {
            this.props.mensajeErrorWS('Consulta de Retiros', [{ codigo: 0, error: 'Ingresar la fecha desde' }], false);
            return;
        }

        if (this.state.solicitudRetiros.filtros.fechaHasta == null) {
            this.props.mensajeErrorWS('Consulta de Retiros', [{ codigo: 0, error: 'Ingresar la fecha hasta' }], false);
            return;
        }


        let formatFecDesde = encodeURIComponent(Moment(this.state.solicitudRetiros.filtros.fechaDesde).format('YYYYMMDD'));
        let formatFecHasta = encodeURIComponent(Moment(this.state.solicitudRetiros.filtros.fechaHasta).format('YYYYMMDD'));

        let condFiltro = "";

        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_CONS_SOL_RETIROS;
        url = url.replace(":idBilletera", encodeURIComponent(idBilletera));

        if (formatFecDesde.length == 0) {
            this.props.mensajeErrorWS('Consulta de Solicitutes', [{ codigo: 0, error: 'Ingresar la fecha desde' }], false);
            return;
        }

        if (formatFecHasta.length == 0) {
            this.props.mensajeErrorWS('Consulta de Solicitudes', [{ codigo: 0, error: 'Ingresar la fecha hasta' }], false);
            return;
        }

        if ((formatFecDesde.length > 0) && (formatFecHasta.length > 0)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + "&";
            condFiltro = condFiltro + "desde=" + formatFecDesde + "&" + "hasta=" + formatFecHasta;
        }

        if (Number.isInteger(pagina)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + "&";
            condFiltro = condFiltro + "page=" + (pagina - 1).toString();
        }

        if (condFiltro.length > 0)
            url = url + "?" + condFiltro;

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    this.state.solicitudRetiros.solicitudRetiros = json.items;
                    this.state.solicitudRetiros.paginado = true;
                    this.state.solicitudRetiros.totalPages = json.totalPages;
                    this.state.solicitudRetiros.currentPage = json.currentPage;
                    this.state.solicitudRetiros.totalItems = json.totalItems;
                    this.setState({ solicitudRetiros: this.state.solicitudRetiros });
                    $("#pagConsCupon").val(json.currentPage + 1);
                } else {
                    this.props.mensajeErrorWS('Consulta de Solicitudes', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;


    }

    ejecutarConsultarBilletera(pagina) {

        let idBilletera = this.props.getIDBilletera(this.getOrganizacionSel());

        if (this.state.billetera.filtros.fechaDesde == null) {
            this.props.mensajeErrorWS('Consulta de Billetera', [{ codigo: 0, error: 'Ingresar la fecha desde' }], false);
            return;
        }

        if (this.state.billetera.filtros.fechaHasta == null) {
            this.props.mensajeErrorWS('Consulta de Billetera', [{ codigo: 0, error: 'Ingresar la fecha hasta' }], false);
            return;
        }


        let formatFecDesde = encodeURIComponent(Moment(this.state.billetera.filtros.fechaDesde).format('YYYYMMDD'));
        let formatFecHasta = encodeURIComponent(Moment(this.state.billetera.filtros.fechaHasta).format('YYYYMMDD'));

        let condFiltro = "";

        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_CONS_BILLETERA;
        url = url.replace(":idBilletera", encodeURIComponent(idBilletera));

        if (formatFecDesde.length == 0) {
            this.props.mensajeErrorWS('Consulta de Billetera', [{ codigo: 0, error: 'Ingresar la fecha desde' }], false);
            return;
        }

        if (formatFecHasta.length == 0) {
            this.props.mensajeErrorWS('Consulta de Billetera', [{ codigo: 0, error: 'Ingresar la fecha hasta' }], false);
            return;
        }

        if ((formatFecDesde.length > 0) && (formatFecHasta.length > 0)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + "&";
            condFiltro = condFiltro + "desde=" + formatFecDesde + "&" + "hasta=" + formatFecHasta;
        }

        if (Number.isInteger(pagina)) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + "&";
            condFiltro = condFiltro + "page=" + (pagina - 1).toString();
        }

        if (this.state.billetera.filtros.tipo != -1) {
            if (condFiltro.length > 0)
                condFiltro = condFiltro + '&';
            condFiltro = condFiltro + "tipo=" + this.state.billetera.filtros.tipo;
        }

        if (condFiltro.length > 0)
            url = url + "?" + condFiltro;

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    this.state.billetera.billetera = json;
                    this.state.billetera.paginado = true;
                    this.state.billetera.totalPages = json.totalPages;
                    this.state.billetera.currentPage = json.currentPage;
                    this.state.billetera.totalItems = json.totalItems;
                    this.setState({ billetera: this.state.billetera });
                    $("#pagConsCupon").val(json.currentPage + 1);
                } else {
                    this.props.mensajeErrorWS('Consulta Billetera', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;


    }

    getOrganizacionDefault(dataBilletera) {

        let provincia = "";

        if (dataBilletera == null)
            return provincia;

        let i = 0;

        for (i = 0; i < dataBilletera.length; ++i) {
            if (dataBilletera[i].principal === true) {
                provincia = dataBilletera[i].nombreOrganizacion;
                break;
            }
        }

        return provincia;

    }

    traerDatosPersonales() {

        let url = process.env.REACT_APP_WS_DATOS_USUARIO;
        url = url.replace(":idCliente", this.getIdCliente())
        let statusCode = "";
        let cerrarSesion = false;

        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    let aDatosPersonales = {
                        cliente: json
                    }
                    aDatosPersonales.cliente.provincia = this.getOrganizacionDefault(json.dataBilletera);
                    console.log(aDatosPersonales.cliente.dataBilletera)
                    this.setState({ pagina: 1, datosPersonales: aDatosPersonales, msjExclusion: true });
                    this.props.setOrganizacionesCliente(json.dataBilletera);
                } else {
                    this.props.mensajeErrorWS('Búsqueda Cliente', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;



    }

    handleChangeNroDocuCorreo(event) {
        this.inicializarCliente(true);
        event.preventDefault();
    }

    getOrganizacionSel() {
        return $("#fieldorgSeleccionada").val();
    }

    componentDidUpdate() {
        this.handleBtn()
    }

    buscarCliente(nroDocumento) {

        //this.props.setOrganizacionesCliente([]);

        let agregarParams = "";
        let statusCode = "";
        let cerrarSesion = false;
        let url = process.env.REACT_APP_WS_CONS_USUARIOS;

        if (nroDocumento.length > 0) {
            if (agregarParams.length === 0)
                url = url + "?";

            if (nroDocumento.includes("@"))
                url = url + "email=" + encodeURI(nroDocumento);
            else
                url = url + "documento=" + encodeURI(nroDocumento);


        }

        console.log(url)
        fetchTimeout(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
        }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {
                    if (json.items.length > 0) {
                        this.setState({ cliente: json.items[0] });
                        this.setState({ pagina: 1 });
                        this.traerDatosPersonales();
                        this.goToDatos();
                    } else {
                        this.props.mensajeErrorWS('Búsqueda Cliente', [{ codigo: 0, error: 'Cliente no encontrado' }], cerrarSesion);
                    }
                } else {
                    this.props.mensajeErrorWS('Búsqueda Cliente', json.errores, cerrarSesion);
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;

    }

    handleBuscar(e) {
        e.preventDefault()
        let nroDocu = $('#fieldNroDocu').val();

        if (nroDocu.length > 0) {
            this.inicializarCliente(true);
            this.buscarCliente(nroDocu);
            this.setState({ resultado: true })
        } else {
            this.props.mensajeErrorWS('Consulta del Cliente', [{ codigo: 0, error: 'Debe ingresar Nro. Docu. / Correo' }], false);
        }

    }

    getIdCliente() {
        return this.state.cliente.id;
    }

    goToDatos() {
        this.setState({ pagina: 1 })
    }

    goToBilletera() {
        this.setState({ pagina: 2 });
        if ((this.state.billetera.billetera.items == null) ||
            ((this.state.billetera.billetera.items != null) && (this.state.billetera.billetera.items.length == 0)))
            this.ejecutarConsultarBilletera(1);
    }

    goToSolicitudRetiros() {
        this.setState({ pagina: 5 });
        if ((this.state.solicitudRetiros.solicitudRetiros == null) ||
            ((this.state.solicitudRetiros.solicitudRetiros != null) && (this.state.solicitudRetiros.solicitudRetiros.length == 0))) {
            this.ejecutarConsultarSolRetiros(1);
        }
    }

    goToCambiosDeAgencias() {
        this.setState({ pagina: 6 });
        if ((this.state.cambiosDeAgencias.cambiosDeAgencias == null) ||
            ((this.state.cambiosDeAgencias.cambiosDeAgencias != null) && (this.state.cambiosDeAgencias.cambiosDeAgencias.length == 0))) {
            this.ejecutarConsultarCambioAgencias(1);
        }
    }


    goToCupones() {
        this.setState({ pagina: 3 });
        if ((this.state.cupones.cupones == null) ||
            ((this.state.cupones.cupones != null) && (this.state.cupones.cupones.length == 0)))
            this.ejecutarConsultarCupones(1);
    }

    goToMensajeria() {
        this.setState({ pagina: 4 })
    }

    goToListadoUif() {
        this.setState({ pagina: 7 })
    }

    goToExclusion() {
        this.setState({ pagina: 8 })
    }

    goToSeguimientoReclamo() {
        this.setState({ pagina: 9 })
    }



    handleBtn() {

        if (this.state.pagina === 1) {
            $('#datosBtn').removeClass('btn-outline-dark');
            $('#datosBtn').addClass('btn-dark');
        } else {
            $('#datosBtn').addClass('btn-outline-dark');
            $('#datosBtn').removeClass('btn-dark');
        }

        if (this.state.pagina === 2) {
            $('#billeteraBtn').removeClass('btn-outline-dark');
            $('#billeteraBtn').addClass('btn-dark');
        } else {
            $('#billeteraBtn').addClass('btn-outline-dark');
            $('#billeteraBtn').removeClass('btn-dark');
        }

        if (this.state.pagina === 3) {
            $('#cuponesBtn').removeClass('btn-outline-dark');
            $('#cuponesBtn').addClass('btn-dark');
        } else {
            $('#cuponesBtn').addClass('btn-outline-dark');
            $('#cuponesBtn').removeClass('btn-dark');
        }

        if (this.state.pagina === 4) {
            $('#mensajeriaBtn').removeClass('btn-outline-dark');
            $('#mensajeriaBtn').addClass('btn-dark');
        } else {
            $('#mensajeriaBtn').addClass('btn-outline-dark');
            $('#mensajeriaBtn').removeClass('btn-dark');
        }

        if (this.state.pagina === 5) {
            $('#solicitudRetiroBtn').removeClass('btn-outline-dark');
            $('#solicitudRetiroBtn').addClass('btn-dark');
        } else {
            $('#solicitudRetiroBtn').addClass('btn-outline-dark');
            $('#solicitudRetiroBtn').removeClass('btn-dark');
        }

        if (this.state.pagina === 6) {
            $('#cambiosDeAgenciasBtn').removeClass('btn-outline-dark');
            $('#cambiosDeAgenciasBtn').addClass('btn-dark');
        } else {
            $('#cambiosDeAgenciasBtn').addClass('btn-outline-dark');
            $('#cambiosDeAgenciasBtn').removeClass('btn-dark');
        }

        if (this.state.pagina === 7) {
            $('#listadoUifBtn').removeClass('btn-outline-dark');
            $('#listadoUifBtn').addClass('btn-dark');
        } else {
            $('#listadoUifBtn').addClass('btn-outline-dark');
            $('#listadoUifBtn').removeClass('btn-dark');
        }

        if (this.state.pagina === 8) {
            $('#exclusionBtn').removeClass('btn-outline-dark');
            $('#exclusionBtn').addClass('btn-dark');
        } else {
            $('#exclusionBtn').addClass('btn-outline-dark');
            $('#exclusionBtn').removeClass('btn-dark');
        }
        if (this.state.pagina === 9) {
            $('#reclamoBtn').removeClass('btn-outline-dark');
            $('#reclamoBtn').addClass('btn-dark');
        } else {
            $('#reclamoBtn').addClass('btn-outline-dark');
            $('#reclamoBtn').removeClass('btn-dark');
        }
    }

    render() {

        let jsxOrganizacionesHabCliente = null;

        if (this.props.getOrganizaciones() !== undefined) {
            jsxOrganizacionesHabCliente = this.props.getOrganizacionesHab().map(
                (organizacion) =>
                    <option key={organizacion.codigoOrganizacion} value={organizacion.codigoOrganizacion}>{organizacion.nombreOrganizacion}</option>
            );
        }

        return (
            <Animated animationIn="fadeIn">
                <div className=" bg-light pr-3 pl-3 pt-2 mt-1 shadow mx-auto">
                    <h4 className="bg-dark p-2 text-center text-light mx-auto mb-3">Panel de Clientes</h4>
                    <div className="row pb-2 w-75 mx-auto">
                        <div className="sm-4 mt-2">
                            <label htmlFor="fname" className="mr-2"><b>Nro. Documento / Correo</b></label>

                            <form onSubmit={this.handleBuscar} style={{ display: "inline" }}><input style={{ width: "40%" }} type="text" id="fieldNroDocu" name="fieldNroDocu" onChange={this.handleChangeNroDocuCorreo}></input></form>
                        </div>
                        <div className="col-sm-5 mt-2">
                            <label htmlFor="fieldorgSeleccionada" className="mr-2"><b>Seleccione Organización</b></label>

                            <select name="org" id="fieldorgSeleccionada" >
                                {jsxOrganizacionesHabCliente}
                            </select>
                        </div>
                        <div className="sm-3 text-center mb-2">
                            <button type="button" className="btn btn-dark" onClick={this.handleBuscar}>
                                <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                <b>Buscar Cliente</b>
                            </button>
                            <button onClick={this.handleListarUsuarios} className='my-button' data-toggle="modal" data-target="#exampleModalCenter">Ver</button>

                            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div className="modal-dialog" style={{ zIndex: 999, top: "20px" }} role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLongTitle">Todos los usuarios</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <form className="form-inline">
                                                <div className="form-group mx-sm-3 mb-2">
                                                    <label htmlFor="inputDNI" className="sr-only">DNI</label>
                                                    <input type="text" className="form-control" id="inputDNI" placeholder="22312456" onChange={this.handlePalabra} value={this.state.palabraACtual} />
                                                </div>
                                                <button type="button" className="btn btn-primary mb-2" onClick={() =>  this.handleFiltarPorDNI(this.state.palabraACtual) }>Buscar</button>
                                                {
                                                    this.state.palabraACtual.length}
                                            </form>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">ID</th>
                                                        <th scope="col">Fullname</th>
                                                        <th scope="col">Type</th>
                                                        <th scope="col">Document</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {
                                                        this.state.listadoUsuarios.map(
                                                            (usuario, index) => <Row key={index} usuario={usuario} />
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {this.state.resultado === true &&


                    <div className=" bg-light  p-3 mt-1 shadow" id="panelResultados">

                        <div className="w-95 mx-auto text-center mb-2 uppercase">
                            <h4 className="cliente-head">
                                <b> {this.state.cliente.nombre} {this.state.cliente.apellido} </b>

                                {this.state.msjExclusion && this.state.datosPersonales.cliente.dataBilletera !== undefined &&

                                    <div style={{ display: "inline" }}>
                                        {this.state.datosPersonales.cliente.dataBilletera[0].autoExclusionHasta !== undefined &&
                                            <span className="text-danger text-small blink_me"> Autoexcluido hasta: {this.formatDate(this.state.datosPersonales.cliente.dataBilletera[0].autoExclusionHasta)}</span>}
                                    </div>

                                }

                            </h4>
                        </div>

                        <div className="row text-center" id="panel">
                            <div className="col-sm-2">
                                <button className="btn btn-outline-dark w-100 p-1 mb-4" id="datosBtn" onClick={this.goToDatos}>Datos Personales</button>
                                <button className="btn btn-outline-dark w-100 p-1 mb-4 mt-2" id="billeteraBtn" onClick={this.goToBilletera}>Billetera</button>
                                <button className="btn btn-outline-dark w-100 p-1 mb-4 mt-2" id="cuponesBtn" onClick={this.goToCupones}>Cupones</button>
                                <button className="btn btn-outline-dark w-100 p-1 mb-4 mt-2" id="solicitudRetiroBtn" onClick={this.goToSolicitudRetiros}>Solicitud de Retiros</button>
                                <button className="btn btn-outline-dark w-100 p-1 mb-4 mt-2" id="cambiosDeAgenciasBtn" onClick={this.goToCambiosDeAgencias}>Cambios de Agencias</button>
                                <button className="btn btn-outline-dark w-100 p-1 mb-4 mt-2" id="listadoUifBtn" onClick={this.goToListadoUif}>Listado UIF</button>
                                <button className="btn btn-outline-dark w-100 p-1 mb-4 mt-2" id="exclusionBtn" onClick={this.goToExclusion}>Exclusión</button>
                                <button className="btn btn-outline-dark w-100 p-1 mb-4 mt-2" id="reclamoBtn" onClick={this.goToSeguimientoReclamo}>Reclamos</button>

                                {1 == 2 && <button className="btn btn-outline-dark w-100 p-1 mb-4 mt-2" id="mensajeriaBtn" onClick={this.goToMensajeria}>Mensajeria</button>}
                                {1 == 2 && <button className="btn btn-outline-dark w-100 p-1 mb-4 mt-2" disabled>Gestiones</button>}
                                {1 == 2 && <button className="btn btn-outline-dark w-100 p-1 mb-4 mt-2" disabled>Reclamos</button>}

                            </div>

                            <div className="col-sm-10 pr-3" id="tablas">

                                {this.state.pagina === 1 &&
                                    <Animated animationIn="fadeIn">
                                        <DatosPersonales handleBuscarCliente={this.handleBuscar} reenvioMailCuentaActivacion={this.reenvioMailCuentaActivacion} refresh={this.inicializarCliente} datosPersonales={this.state.datosPersonales} setOrganizacionesCliente={this.props.setOrganizacionesCliente} getIdCliente={this.getIdCliente} getKeyLogin={this.props.getKeyLogin} mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral} getOrganizacionSel={this.getOrganizacionSel} />
                                    </Animated>
                                }

                                {this.state.pagina === 2 &&
                                    <Animated animationIn="fadeIn">
                                        <Billetera traerTiposMovBilletera={this.traerTiposMovBilletera} cambioFechaDesdeBilletera={this.cambioFechaDesdeBilletera} ejecutarConsultarBilletera={this.ejecutarConsultarBilletera} billetera={this.state.billetera} inicializarBilletera={this.inicializarBilletera} getIDBilletera={this.props.getIDBilletera} getOrganizacionSel={this.getOrganizacionSel} getIdCliente={this.getIdCliente} getKeyLogin={this.props.getKeyLogin} mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral} />
                                    </Animated>
                                }

                                {this.state.pagina === 3 &&
                                    <Animated animationIn="fadeIn">
                                        <Cupones setIdCuponSeleccionado={this.setIdCuponSeleccionado} cambioFechaDesdeCupon={this.cambioFechaDesdeCupon} cupones={this.state.cupones} ejecutarConsultarCupones={this.ejecutarConsultarCupones} traerJuegos={this.traerJuegos} handleVerCupon={this.handleVerCupon} inicializarCupones={this.inicializarCupones} getIDBilletera={this.props.getIDBilletera} getOrganizacionSel={this.getOrganizacionSel} getIdCliente={this.getIdCliente} getKeyLogin={this.props.getKeyLogin} mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral} />
                                    </Animated>
                                }

                                {this.state.pagina === 4 &&
                                    <Animated animationIn="fadeIn" className="w-95 mx-auto mt-2">
                                        <Mensajeria mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral} />
                                    </Animated>
                                }

                                {this.state.pagina === 5 &&
                                    <Animated animationIn="fadeIn" className="w-95 mx-auto mt-2">
                                        <SolicitudRetiros cambiarSolRetiroConAgenciaAmiga={this.cambiarSolRetiroConAgenciaAmiga} ejecutarConsultarSolRetiros={this.ejecutarConsultarSolRetiros} cambioFechaDesdeSolicitudRetiro={this.cambioFechaDesdeSolicitudRetiro} inicializarSolicitudRetiros={this.inicializarSolicitudRetiros} solicitudRetiros={this.state.solicitudRetiros} mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral} />
                                    </Animated>
                                }

                                {this.state.pagina === 6 &&
                                    <Animated animationIn="fadeIn" className="w-95 mx-auto mt-2">
                                        <CambiosDeAgencias ClickAcelerarCambioAgencia={this.ClickAcelerarCambioAgencia} cambiosDeAgencias={this.state.cambiosDeAgencias} ejecutarConsultarCambioAgencias={this.ejecutarConsultarCambioAgencias} cambioFechaDesdeCambioAgencia={this.cambioFechaDesdeCambioAgencia} inicializarCambiosDeAgencias={this.inicializarSolicitudRetiros} mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral} />
                                    </Animated>
                                }

                                {this.state.pagina === 7 &&
                                    <Animated animationIn="fadeIn" className="w-95 mx-auto mt-2">
                                        <ListadoUif cambioFechaDesdeUif={this.cambioFechaDesdeUif} listadoUif={this.state.listadoUif} ejecutarConsultaListadoUif={this.ejecutarConsultaListadoUif} inicializarListadoUif={this.inicializarListadoUif} getIDBilletera={this.props.getIDBilletera} getOrganizacionSel={this.getOrganizacionSel} getIdCliente={this.getIdCliente} getKeyLogin={this.props.getKeyLogin} mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral} />
                                    </Animated>
                                }
                                {this.state.pagina === 8 &&
                                    <Animated animationIn="fadeIn" className="w-95 mx-auto mt-2">
                                        <Exclusion formatDate={this.formatDate} exclusiones={this.state.exclusiones} ejecutarConsultaExclusiones={this.ejecutarConsultaExclusiones} cambioFechaDesdeExclusion={this.cambioFechaDesdeExclusion} inicializarConsultaExclusiones={this.inicializarSolicitudRetiros} anularExclusion={this.anularExclusion} nuevaExclusion={this.nuevaExclusion} mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral} />
                                    </Animated>
                                }
                                {this.state.pagina === 9 &&
                                    <Animated animationIn="fadeIn" className="w-95 mx-auto mt-2">
                                        <SeguimientoReclamo setIdReclamoSeleccionado={this.setIdReclamoSeleccionado} reclamos={this.state.reclamos} ejecutarConsultaReclamos={this.ejecutarConsultaReclamos} nuevoReclamo={this.nuevoReclamo} cambioFechaDesdeReclamos={this.cambioFechaDesdeReclamos} handleVerReclamo={this.handleVerReclamo} inicializarConsultaReclamos={this.inicializarConsultaReclamos} inicializarReclamos={this.inicializarReclamos} mensajeErrorWS={this.props.mensajeErrorWS} getKeyLogin={this.props.getKeyLogin} mensajeErrorGeneral={this.props.mensajeErrorGeneral} handleEditarReclamo={this.handleEditarReclamo} />
                                    </Animated>
                                }
                            </div>
                        </div>
                    </div>
                }


            </Animated>
        )
    }

}



export default withRouter(Clientes)