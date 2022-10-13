import React from 'react'
import { withRouter} from 'react-router-dom';
import fetchTimeout from 'fetch-timeout';
import { Animated } from 'react-animated-css';
import $ from 'jquery';

import Agencias from './agencias';
import Roles from './roles';
import Operadores from './operadores'

class Sistema extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            pagina: 0,
            agencias: {items:[]},
            operadores:{items:[]}
        }
        
        this.ejecutarConsultaAgencias   = this.ejecutarConsultaAgencias.bind(this)
        this.ejecutarConsultaRoles      = this.ejecutarConsultaRoles.bind(this)
        this.ejecutarConsultaOperadores = this.ejecutarConsultaOperadores.bind(this)
        this.handleBtnPanel             = this.handleBtnPanel.bind(this)
        this.cambioFiltroAg             = this.cambioFiltroAg.bind(this)
        this.cambioFiltroOp             = this.cambioFiltroOp.bind(this)
    }


    componentDidMount(){

        this.setState({agencias:{
            items: ""
        }})

        this.ejecutarConsultaRoles();
    }

    cambioFiltroAg(codAg, localidad, estado){



        if(codAg !== undefined){
            this.setState({filtroAgCodAg: codAg})
        }

        if(localidad !== undefined){
            this.setState({filtroAgLocalidad: localidad})
        }

        if(estado !== undefined){
            if(estado === "Habilitada"){
                this.setState({filtroAgEstado: true})
            }else if(estado === "Deshabilitada"){
                this.setState({filtroAgEstado: false})
            }
            
        }

    }

    cambioFiltroOp(usr, nombre, apellido){
        if(usr !== undefined){
            this.setState({filtroOpUsr: usr})
        }

        if(nombre !== undefined){
            this.setState({filtroOpNombre: nombre})
        }

        if(apellido !== undefined){
            this.setState({filtroOpApellido: apellido})
        }
    }

    handleBtnPanel(e){

        if(e.target.id === "sistAgBtn"){
            this.setState({pagina: 1})
            $('#sistAgBtn').removeClass('btn-outline-dark')
            $('#sistAgBtn').addClass('btn-dark')

            $('#sistUsrBtn').removeClass('btn-dark')
            $('#sistRolesBtn').removeClass('btn-dark')
            $('#sistUsrBtn').addClass('btn-outline-dark')
            $('#sistRolesBtn').addClass('btn-outline-dark')
            
            
            
        }else if(e.target.id === "sistUsrBtn"){
            $('#sistUsrBtn').removeClass('btn-outline-dark')
            $('#sistUsrBtn').addClass('btn-dark')

            $('#sistAgBtn').removeClass('btn-dark')
            $('#sistRolesBtn').removeClass('btn-dark')
            $('#sistAgBtn').addClass('btn-outline-dark')
            $('#sistRolesBtn').addClass('btn-outline-dark')

            this.setState({pagina: 2})
            
        }else if(e.target.id === "sistRolesBtn"){
            $('#sistRolesBtn').removeClass('btn-outline-dark')
            $('#sistRolesBtn').addClass('btn-dark')

            $('#sistUsrBtn').removeClass('btn-dark')
            $('#sistAgBtn').removeClass('btn-dark')
            $('#sistUsrBtn').addClass('btn-outline-dark')
            $('#sistAgBtn').addClass('btn-outline-dark')

            this.setState({pagina: 3})
            
        }

    }

    ejecutarConsultaAgencias(pagina){

        let url = process.env.REACT_APP_WS_LISTADO_AGENCIAS;

        let cerrarSesion = false;
        let statusCode = "";

        let condFiltro = null
        let codOrg = $("#fieldorgSeleccionadaAg").val()

        if(codOrg !== undefined && condFiltro === null){
            condFiltro = "codigoOrganizacion=" + codOrg
        }else if(codOrg !== undefined){
            condFiltro = condFiltro + "&codigoOrganizacion=" + this.state.filtroAgCodOrg
        }

        if(this.state.filtroAgCodAg != undefined && condFiltro === null){
            condFiltro = "codigo=" + this.state.filtroAgCodAg
        }else if(this.state.filtroAgCodAg != null){
            condFiltro = condFiltro + "&codigo=" + this.state.filtroAgCodAg
        }

        if(this.state.filtroAgLocalidad != undefined && condFiltro === null){
            condFiltro = "localidad=" + this.state.filtroAgLocalidad
        }else if(this.state.filtroAgLocalidad != undefined){
            condFiltro = condFiltro + "&localidad=" + this.state.filtroAgLocalidad
        }

        if(this.state.filtroAgEstado != undefined && condFiltro === null){
            condFiltro = "habilitada=" + this.state.filtroAgEstado
        }else if(this.state.filtroAgEstado != undefined){
            condFiltro = condFiltro + "&habilitada=" + this.state.filtroAgEstado
        }


        if(isNaN(pagina)=== false){
            if((pagina !== undefined || pagina !== NaN) && condFiltro === null){
                condFiltro = "page="+(pagina-1).toString(); 
            }else if (pagina != undefined || pagina !== NaN){
                condFiltro = condFiltro + "&page="+(pagina-1).toString();
            }
        }

        if(condFiltro != null){
            url = url + "?" + condFiltro
        }       

        fetchTimeout(url,{ 
            method: 'GET',
            headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': 'Bearer ' + this.props.getKeyLogin()
                    },
            }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status===process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status==="ok") {

                    this.setState({agencias : {
                                    totalItems: json.totalItems,
                                    totalPages: json.totalPages,
                                    currentPage: json.currentPage,
                                    items : json.items,
                                    paginado:true

                                    

                    }})

                  } else { 
                    this.props.mensajeErrorWS('Consulta Agencia',json.errores,cerrarSesion);                     
                  }
                })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
                })	

    }

    ejecutarConsultaOperadores(pagina){

        let url = process.env.REACT_APP_WS_LISTADO_OPERADORES;

        let cerrarSesion = false;
        let statusCode = "";

        let condFiltro = null
        let codOrg = $("#fieldorgSeleccionadaAg").val()

        if(codOrg !== undefined && condFiltro === null){
            condFiltro = "codigoOrganizacion=" + codOrg
        }else if(codOrg !== undefined){
            condFiltro = condFiltro + "&codigoOrganizacion=" + this.state.filtroAgCodOrg
        }

        if(this.state.filtroOpUsr != undefined && condFiltro === null){
            condFiltro = "username=" + this.state.filtroOpUsr
        }else if(this.state.filtroOpUsr != undefined){
            condFiltro = condFiltro + "&username=" + this.state.filtroOpUsr
        }

        if(this.state.filtroOpNombre != undefined && condFiltro === null){
            condFiltro = "nombre=" + this.state.filtroOpNombre
        }else if(this.state.filtroOpNombre != null){
            condFiltro = condFiltro + "&nombre=" + this.state.filtroOpNombre
        }

        if(this.state.filtroOpApellido != undefined && condFiltro === null){
            condFiltro = "apellido=" + this.state.filtroOpApellido
        }else if(this.state.filtroOpApellido != undefined){
            condFiltro = condFiltro + "&apellido=" + this.state.filtroOpApellido
        }


        if(isNaN(pagina)=== false){
            if((pagina !== undefined || pagina !== NaN) && condFiltro === null){
                condFiltro = "page="+(pagina-1).toString(); 
            }else if (pagina != undefined || pagina !== NaN){
                condFiltro = condFiltro + "&page="+(pagina-1).toString();
            }
        }

        if(condFiltro != null){
            url = url + "?" + condFiltro
        }       

        fetchTimeout(url,{ 
            method: 'GET',
            headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': 'Bearer ' + this.props.getKeyLogin()
                    },
            }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status===process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status==="ok") {

                    this.setState({operadores : {
                                    totalItems: json.totalItems,
                                    totalPages: json.totalPages,
                                    currentPage: json.currentPage,
                                    items : json.items,
                                    paginado:true

                                    

                    }})

                  } else { 
                    this.props.mensajeErrorWS('Consulta Operadores',json.errores,cerrarSesion);                     
                  }
                })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
                })	

    }

    ejecutarConsultaRoles(){

        let url = process.env.REACT_APP_WS_LISTADO_ROLES;

        let cerrarSesion = false;
        let statusCode = "";    

        fetchTimeout(url,{ 
            method: 'GET',
            headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': 'Bearer ' + this.props.getKeyLogin()
                    },
            }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status===process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status==="ok") {

                    this.setState({roles: json})

                  } else { 
                    this.props.mensajeErrorWS('Consulta Roles',json.errores,cerrarSesion);                     
                  }
                })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
                })	

    }
    
    render(){

    return (
            <Animated animationIn="fadeIn">

                <div className=" bg-light pr-3 pl-3 pt-2 mt-2 shadow mx-auto mb-2">
                    <h4 className="bg-dark p-2 text-center text-light mx-auto mb-3">Panel de Sistema</h4>    

                    <div className="row text-center pb-3">
                        <div className="col-sm-4">
                            <button className="btn btn-outline-dark w-75" onClick={this.handleBtnPanel} id="sistAgBtn">Agencias</button>
                        </div>

                        <div className="col-sm-4">
                            <button className="btn btn-outline-dark w-75" onClick={this.handleBtnPanel}  id="sistUsrBtn">Operadores</button>
                        </div>

                        <div className="col-sm-4">
                            <button className="btn btn-outline-dark w-75" onClick={this.handleBtnPanel}  id="sistRolesBtn">Roles</button>
                        </div>
                    </div>
                   
                </div>

                <div id="sistemasCont">
                    {this.state.pagina === 1 &&
                        <Agencias agencias={this.state.agencias} cambioFiltroAg={this.cambioFiltroAg} getKeyLogin={this.props.getKeyLogin} ejecutarConsultaAgencias= {this.ejecutarConsultaAgencias} getOrganizaciones= {this.props.getOrganizaciones} mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral}/>
                    }

                    {this.state.pagina === 2 &&
                        <Operadores roles={this.state.roles} ejecutarConsultaRoles={this.ejecutarConsultaRoles} operadores={this.state.operadores} cambioFiltroOp={this.cambioFiltroOp} getKeyLogin={this.props.getKeyLogin} ejecutarConsultaOperadores= {this.ejecutarConsultaOperadores} getOrganizaciones= {this.props.getOrganizaciones} mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral}/>
                    }

                    {this.state.pagina === 3 &&
                        <Roles roles={this.state.roles} getKeyLogin={this.props.getKeyLogin} ejecutarConsultaRoles={this.ejecutarConsultaRoles}  mensajeErrorWS={this.props.mensajeErrorWS} mensajeErrorGeneral={this.props.mensajeErrorGeneral}/>
                    }
                </div>

            </Animated>            
            )
    }

}

export default withRouter(Sistema)