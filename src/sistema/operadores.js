import React from 'react';

import DataGrid, { Column, Paging, Button, Sorting } from 'devextreme-react/data-grid';
import Form, { SimpleItem, GroupItem, Label } from 'devextreme-react/form';
import 'devextreme-react/text-area';
import TextBox from 'devextreme-react/text-box';

import $ from 'jquery';
import fetchTimeout from 'fetch-timeout';


import 'devextreme-react/text-area';
import { Animated } from "react-animated-css"



class Operadores extends React.Component {

  constructor(props) {		
    super(props);

    this.state = {
      
      detalleOp: {},
      readOnly: true,
      opId: null,
      nuevosDatosAg: null,
      nuevoOp:{   
        username:"",
        nombre: "",
        apellido: "",
        password:"",
        matchingPassword:"",
        roles: [],
        organizaciones: []
      }

    }

    this.addPage                = this.addPage.bind(this);
    this.removePage             = this.removePage.bind(this);
    this.firstPage              = this.firstPage.bind(this);
    this.lastPage               = this.lastPage.bind(this);
    this.formFieldDataChanged   = this.formFieldDataChanged.bind(this);
    this.handleDetalleOp        = this.handleDetalleOp.bind(this);
    this.consultaDetalleOp      = this.consultaDetalleOp.bind(this);
    this.toggleEdicion          = this.toggleEdicion.bind(this);
    this.cancelarEdicion        = this.cancelarEdicion.bind(this)
    this.guardarEdicionOp       = this.guardarEdicionOp.bind(this)
    this.handleNuevosDatos      = this.handleNuevosDatos.bind(this)
    this.consultaBtn            = this.consultaBtn.bind(this)
    this.addRol                 = this.addRol.bind(this)
    this.addOrg                 = this.addOrg.bind(this)
    this.hanldeRolSeleccionado  = this.hanldeRolSeleccionado.bind(this)
    this.hanldeOrgSeleccionado  = this.hanldeOrgSeleccionado.bind(this)
    this.borrarRolSeleccionado  = this.borrarRolSeleccionado.bind(this)
    this.borrarOrgSeleccionada  = this.borrarOrgSeleccionada.bind(this)
    this.cambiarContraseña      = this.cambiarContraseña.bind(this)
    this.guardarNuevaContraseña = this.guardarNuevaContraseña.bind(this)
    this.handleNuevoOperador    = this.handleNuevoOperador.bind(this)
    this.guardarNuevoOp         = this.guardarNuevoOp.bind(this)
  }

  guardarNuevoOp(){

    let username = ""
    let password = ""
    let matchingPassword = ""
    let nombre = ""
    let apellido = ""

    

    if (this.state.nuevoOp===undefined) {
      return
    }else{
      username = this.state.nuevoOp.username
      password = this.state.nuevoOp.password
      matchingPassword = this.state.nuevoOp.matchingPassword
      nombre = this.state.nuevoOp.nombre
      apellido = this.state.nuevoOp.apellido
    };

    let url = process.env.REACT_APP_WS_ALTA_OPERADOR
    
    let cerrarSesion = false;
    let statusCode = "";
    
    let parametros = {
      username: username,
      password: password,
      matchingPassword: matchingPassword,
      nombre: nombre,
      apellido: apellido,

      roles : this.state.arrayIdRol,
      organizaciones: this.state.arrayIdOrg
    };

    fetch(url,{ 
      method: 'POST',
      headers:{
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this.props.getKeyLogin()
      },
      body: JSON.stringify(parametros)
      }
      )
      .then(respPromise => {
        statusCode = respPromise.status; 
        if (respPromise.status===process.env.REACT_APP_CODIGO_CERRO_SESION) {
          cerrarSesion = true;
        }
        return respPromise.json();
      })
      .then(json => {
        if (json.status==="ok") {

            $('#nuevoOpModal').modal('toggle');
            this.setState({readOnly: true})
            this.props.ejecutarConsultaOperadores();

        } else if (json.status==="error") {	
                if (cerrarSesion) {					
                  this.props.mensajeErrorWS('Alta Operador',json.errores,cerrarSesion);
                } else {
                  this.props.mensajeErrorWS('Alta Operador',json.errores);	
                }
              }
      })
      .catch((error) => {
        this.props.mensajeErrorGeneral();
      })		
      ;
  }

  handleNuevoOperador(){
    $('#nuevoOpModal').modal('toggle');
    this.setState({
                    editandoNuevo: true,
                    nuevoOp:{
                      username:"",
                      password:"",
                      matchingPassword:"",
                      nombre:"",
                      apellido:" ",
                      roles:[],
                      organizaciones:[]
                    }
                  })
  }

  cambiarContraseña(){
    $("#passModal").modal("toggle")
  }
  
  guardarNuevaContraseña(){
    let pass = $("#pass").val()
    let matchPass = $("#matchPass").val()

    let id = this.state.opId;

    let url = process.env.REACT_APP_WS_CAMBIAR_CLAVE_OPERADOR;
    url = url.replace(":idOperador", id)
    
    let cerrarSesion = false;
    let statusCode = "";
    
    
    let parametros = {
      newPassword: pass,
      matchingPassword: matchPass
    };

    fetch(url,{ 
      method: 'POST',
      headers:{
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this.props.getKeyLogin()
      },
      body: JSON.stringify(parametros)
      }
      )
      .then(respPromise => {
        statusCode = respPromise.status; 
        if (respPromise.status===process.env.REACT_APP_CODIGO_CERRO_SESION) {
          cerrarSesion = true;
        }
        return respPromise.json();
      })
      .then(json => {
        if (json.status==="ok") {

            $('#passModal').modal('toggle');
            this.setState({readOnly: true})
            this.props.ejecutarConsultaOperadores();

        } else if (json.status==="error") {	
                if (cerrarSesion) {					
                  this.props.mensajeErrorWS('Actualizar Contraseña',json.errores,cerrarSesion);
                } else {
                  this.props.mensajeErrorWS('Actualizar Contraseña',json.errores);	
                }
              }
      })
      .catch((error) => {
        this.props.mensajeErrorGeneral();
      })		
      ;


  }

  borrarOrgSeleccionada(e){
    let codigo = e.target.closest("tr").cells[0].innerHTML
    let currentOrg = "";
    let arrayIdOrg = []  


    if(!this.state.editandoNuevo){
      currentOrg = this.state.detalleOp.organizaciones
      var removeIndex = currentOrg.map(function(item) { return item.codigo; }).indexOf(codigo);
      currentOrg.splice(removeIndex, 1)

      this.setState({
        detalleOp:{   
                      id: this.state.detalleOp.id,
                      username:this.state.detalleOp.username,
                      nombre: this.state.detalleOp.nombre,
                      apellido: this.state.detalleOp.apellido,
                      bloqueado: this.state.detalleOp.bloqueado,
                      active: this.state.detalleOp.active,
                      roles: this.state.detalleOp.roles,
                      organizaciones: currentOrg
                    }
      })

      this.state.detalleOp.organizaciones.forEach(element => {
        arrayIdOrg.push(element.codigo)
      });
      
      this.setState({arrayIdOrg : arrayIdOrg})

    }else{

      if(this.state.nuevoOp.organizaciones === undefined){
        currentOrg = []
        
      }else{
        currentOrg = this.state.nuevoOp.organizaciones
      }

      var removeIndex = currentOrg.map(function(item) { return item.codigo; }).indexOf(codigo);
      currentOrg.splice(removeIndex, 1)
      

      this.setState({
        nuevoOp:{   
          username:this.state.nuevoOp.username,
          password:this.state.nuevoOp.password,
          matchingPassword:this.state.nuevoOp.matchingPassword,
          nombre: this.state.nuevoOp.nombre,
          apellido: this.state.nuevoOp.apellido,
          roles: this.state.nuevoOp.roles,
          organizaciones: currentOrg
        }
      })
      
      this.state.nuevoOp.organizaciones.forEach(element => {
        arrayIdOrg.push(element.codigo)
      });
      
      this.setState({arrayIdOrg : arrayIdOrg})

    } 
  }

  borrarRolSeleccionado(e){
    let id = e.target.closest("tr").cells[0].innerHTML
    let currentRol = "";
    let arrayIdRol = []  


    if(!this.state.editandoNuevo){
      currentRol = this.state.detalleOp.roles
      var removeIndex = currentRol.map(function(item) { return item.id; }).indexOf(id);
      currentRol.splice(removeIndex, 1)

      this.setState({
        detalleOp:{   
                      id: this.state.detalleOp.id,
                      username:this.state.detalleOp.username,
                      nombre: this.state.detalleOp.nombre,
                      apellido: this.state.detalleOp.apellido,
                      bloqueado: this.state.detalleOp.bloqueado,
                      active: this.state.detalleOp.active,
                      roles: currentRol,
                      organizaciones: this.state.detalleOp.organizaciones
                    }
      })

      this.state.detalleOp.roles.forEach(element => {
        arrayIdRol.push(element.id)
      });
      
      this.setState({arrayIdRol : arrayIdRol})

    }else{
      if(this.state.nuevoOp.roles === undefined){
        currentRol = []
        
      }else{
        currentRol = this.state.nuevoOp.roles
      }

      var removeIndex = currentRol.map(function(item) { return item.id; }).indexOf(id);
      currentRol.splice(removeIndex, 1)
      

      this.setState({
        nuevoOp:{   
          username:this.state.nuevoOp.username,
          password:this.state.nuevoOp.password,
          matchingPassword:this.state.nuevoOp.matchingPassword,
          nombre: this.state.nuevoOp.nombre,
          apellido: this.state.nuevoOp.apellido,
          roles: currentRol,
          organizaciones: this.state.nuevoOp.organizaciones
        }
      })
      
      this.state.nuevoOp.roles.forEach(element => {
        arrayIdRol.push(element.id)
      });
      
      this.setState({arrayIdRol : arrayIdRol})

    } 
  }

  hanldeOrgSeleccionado(e){
    let codigo = parseInt(e.target.closest("tr").cells[0].innerHTML, 10)
    let descripcion = e.target.closest("tr").cells[1].innerHTML

    let newOrg ={codigo: codigo, descripcion: descripcion}
    let currentOrg = "";
    let arrayIdOrg = []

    if(!this.state.editandoNuevo){
      currentOrg = this.state.detalleOp.organizaciones
      currentOrg.push(newOrg)

      this.setState({
                      detalleOp:{   
                                    id: this.state.detalleOp.id,
                                    username:this.state.detalleOp.username,
                                    nombre: this.state.detalleOp.nombre,
                                    apellido: this.state.detalleOp.apellido,
                                    bloqueado: this.state.detalleOp.bloqueado,
                                    active: this.state.detalleOp.active,
                                    roles: this.state.detalleOp.roles,
                                    organizaciones: currentOrg
                                  }
                    })

      this.state.detalleOp.organizaciones.forEach(element => {
        arrayIdOrg.push(element.codigo)
      });

      this.setState({arrayIdOrg : arrayIdOrg})

    }else{

      if(this.state.nuevoOp.organizaciones === undefined){
        currentOrg = []
        
      }else{
        currentOrg = this.state.nuevoOp.organizaciones
      }
      
      currentOrg.push(newOrg)

      this.setState({
        nuevoOp:{   
          username:this.state.nuevoOp.username,
          password:this.state.nuevoOp.password,
          matchingPassword:this.state.nuevoOp.matchingPassword,
          nombre: this.state.nuevoOp.nombre,
          apellido: this.state.nuevoOp.apellido,
          roles: this.state.nuevoOp.roles,
          organizaciones: currentOrg
        }
      })
     
      this.state.nuevoOp.organizaciones.forEach(element => {
        arrayIdOrg.push(element.codigo)
      });

      this.setState({arrayIdOrg : arrayIdOrg})
      
    }
    
    $("#orgModal").modal("toggle")

  }

  hanldeRolSeleccionado(e){
    let id = e.target.closest("tr").cells[0].innerHTML
    let name = e.target.closest("tr").cells[1].innerHTML
    let descripcion = e.target.closest("tr").cells[2].innerHTML

    let newRol ={id:id, nombre:name, descripcion: descripcion}
    let currentRol = "";
    let arrayIdRol = []

    if(!this.state.editandoNuevo){
      currentRol = this.state.detalleOp.roles
      currentRol.push(newRol)

      this.setState({
                      detalleOp:{   
                                    id: this.state.detalleOp.id,
                                    username:this.state.detalleOp.username,
                                    nombre: this.state.detalleOp.nombre,
                                    apellido: this.state.detalleOp.apellido,
                                    bloqueado: this.state.detalleOp.bloqueado,
                                    active: this.state.detalleOp.active,
                                    roles: currentRol,
                                    organizaciones: this.state.detalleOp.organizaciones
                                  }
                    })

      this.state.detalleOp.roles.forEach(element => {
        arrayIdRol.push(element.id)
      });

      this.setState({arrayIdRol : arrayIdRol})

    }else{
      
      if(this.state.nuevoOp.roles === undefined){
        currentRol = []
        
      }else{
        currentRol = this.state.nuevoOp.roles
      }
      
      currentRol.push(newRol)

      this.setState({
        nuevoOp:{   
          username:this.state.nuevoOp.username,
          password:this.state.nuevoOp.password,
          matchingPassword:this.state.nuevoOp.matchingPassword,
          nombre: this.state.nuevoOp.nombre,
          apellido: this.state.nuevoOp.apellido,
          roles: currentRol,
          organizaciones: this.state.nuevoOp.organizaciones
        }
      })

      this.state.nuevoOp.roles.forEach(element => {
        arrayIdRol.push(element.id)
      });

      this.setState({arrayIdRol : arrayIdRol})
      
    }
    
    $("#rolesModal").modal("toggle")

  }

  addRol(){
    this.props.ejecutarConsultaRoles()
    $("#rolesModal").modal("toggle")
  }

  addOrg(){
    $("#orgModal").modal("toggle")
  }

  consultaBtn(){
    
    this.props.ejecutarConsultaOperadores(1)
    $("#pagConsOp").val(1)
    $("#contenedorPag").removeClass("hidden")

  }

  guardarEdicionOp() {
    
    let username = ""
    let nombre = ""
    let apellido = ""
    let active = ""
    let bloqueado = ""

    if (this.state.nuevosDatosOp===undefined) {
        username = this.state.detalleOp.username
        nombre = this.state.detalleOp.nombre
        apellido = this.state.detalleOp.apellido
        active = this.state.detalleOp.active
        bloqueado = this.state.detalleOp.bloqueado
    }else{
        username = this.state.nuevosDatosOp.username
        nombre = this.state.nuevosDatosOp.nombre
        apellido = this.state.nuevosDatosOp.apellido
        active = this.state.nuevosDatosOp.active
        bloqueado = this.state.nuevosDatosOp.bloqueado
    };
    

    let id = this.state.opId;

    let url = process.env.REACT_APP_WS_GUARDAR_DETALLE_OPERADOR;
    url = url.replace(":idOperador", id)
    
    let cerrarSesion = false;
    let statusCode = "";
    
    let parametros = {
      username: username,
      nombre: nombre,
      apellido: apellido,
      activo: active,
      bloqueado: bloqueado,
      roles: this.state.arrayIdRol,
      organizaciones: this.state.arrayIdOrg
    };

    fetch(url,{ 
      method: 'POST',
      headers:{
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this.props.getKeyLogin()
      },
      body: JSON.stringify(parametros)
      }
      )
      .then(respPromise => {
        statusCode = respPromise.status; 
        if (respPromise.status===process.env.REACT_APP_CODIGO_CERRO_SESION) {
          cerrarSesion = true;
        }

        return respPromise.json();
      })
      .then(json => {
        if (json.status==="ok") {

            $('#detalleOpModal').modal('toggle');
            this.setState({readOnly: true})
            this.props.ejecutarConsultaOperadores(Number($("#pagConsOp").val()));

        } else if (json.status==="error") {	
                if (cerrarSesion) {					
                  this.props.mensajeErrorWS('Actualizar Operador',json.errores,cerrarSesion);
                } else {
                  this.props.mensajeErrorWS('Actualizar Operador',json.errores);	
                }
              }
      })
      .catch((error) => {
        this.props.mensajeErrorGeneral();
      })		
      ;

  }

  toggleEdicion(){
    this.setState({readOnly:!this.state.readOnly})
  }

  cancelarEdicion(){
    this.setState({readOnly: true})
  }

  handleOrg(){
    return $("#fieldorgSeleccionadaAg").val()
  }

  formFieldDataChanged(e) {

    let usr = undefined
    let nombre = undefined
    let apellido = undefined

    if(e.dataField==="username") {
     usr = e.value
    }

    if(e.dataField==="nombre") {
      nombre = e.value
     }

     if(e.dataField==="apellido") {
      apellido = e.value
     }

    this.props.cambioFiltroOp(usr, nombre, apellido)

  }

  firstPage(){
    $("#pagConsOp").val(1); 
    this.props.ejecutarConsultaOperadores(Number($("#pagConsOp").val()));
  }

  lastPage(){

    $("#pagConsOp").val(this.props.operadores.totalPages); 
    this.props.ejecutarConsultaOperadores(Number($("#pagConsOp").val()));
    
  }

  addPage(){
    if (Number($("#pagConsOp").val())<this.props.operadores.totalPages) 
      $("#pagConsOp").val(Number($("#pagConsOp").val())+1);
    else
      $("#pagConsOp").val(this.props.operadores.totalPages);
    this.props.ejecutarConsultaOperadores(Number($("#pagConsOp").val()));
  }

  removePage(){
    if (Number($("#pagConsOp").val())>1)
        $("#pagConsOp").val(Number($("#pagConsOp").val())-1);
    else
        $("#pagConsOp").val(1); 

    this.props.ejecutarConsultaOperadores(Number($("#pagConsOp").val()));
  }

  handleChangePagina(e) {
    if (e.target.value.length==0) return;
    if (!((Number($("#pagConsOp").val())>=1) && 
       (Number($("#pagConsOp").val())<=this.props.operadores.totalPages))) 
        this.props.ejecutarConsultaOperadores(1);
    else
      this.props.ejecutarConsultaOperadores(Number(e.target.value));
  }

  handleDetalleOp(e){
    $('#detalleOpModal').modal('toggle');

    this.setState({
                    opId: e.row.data.id,
                    editandoNuevo: false
                })
    this.consultaDetalleOp(this.state.opId)
    
  }

  consultaDetalleOp(id){

        let url = process.env.REACT_APP_WS_DETALLE_OPERADORES;
        url = url.replace(":idOperador", id)

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

                    this.setState({detalleOp : json})

                  } else { 
                    this.props.mensajeErrorWS('Consulta Operadores',json.errores,cerrarSesion);                     
                  }
                })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
                })	

  }

  handleNuevosDatos(e){
    this.setState({nuevosDatosOp: e.component.option("formData")})
  }

  render() {

      let jsxOrganizacionesHabilitadas = null;

        
      if (this.props.getOrganizaciones() !== undefined) {
          jsxOrganizacionesHabilitadas = this.props.getOrganizaciones().map(
          (organizacion) => 
          <option value={organizacion.codigo}>{organizacion.descripcion}</option>
          );
      }

      return (

      <div className="bg-light p-4 border" style={{maxHeight: $("#panelResultados").height() - 45}}>

        <div className="mb-3">
          <Form onFieldDataChanged={this.formFieldDataChanged}>
              <GroupItem cssClass="first-group" colCount={9}>
                <GroupItem colSpan={2}>

                    <label htmlFor="fieldorgSeleccionadaAg">Organización</label>                      
                    <select name="org" id="fieldorgSeleccionadaAg" className="select p-0 ml-2" onChange={this.consultaBtn}>{jsxOrganizacionesHabilitadas}</select>

                </GroupItem>
  
                <GroupItem colSpan={2}>
                <SimpleItem
                    dataField="username"
                  >
                    <Label text="Usuario"></Label>
                </SimpleItem>
                </GroupItem>
                
                <GroupItem colSpan={2}>
                <SimpleItem
                    dataField="nombre"
                  
                    
                  
                  >
                    <Label text="Nombre"></Label>
                </SimpleItem>
                </GroupItem>

                <GroupItem colSpan={2}>
                <SimpleItem
                    dataField="apellido"
                  
                    
                  
                  >
                    <Label text="Apellido"></Label>
                </SimpleItem>
                </GroupItem>
  
                  
  
                <GroupItem colSpan={2}>
                
                  <button type="button"className="btn btn-dark" onClick={this.consultaBtn}>
                                  <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                  <b>Consultar</b>
                  </button>

                 </GroupItem>
              </GroupItem>
  
          </Form>
        </div>

        
            <DataGrid
              dataSource={this.props.operadores.items}
              showBorders={true}
              keyExpr='id'
              focusedRowEnabled={true}
            >
              <Paging enabled={false} />
              <Sorting mode="none" />
      
              <Column dataField="username"/>
              <Column dataField="nombre"/>
              <Column dataField="apellido" />

              <Column type="buttons" caption="Detalle">
                    <Button
                        icon="search"
                        text="Detalle"
                        hint="Detalle"
                        onClick={this.handleDetalleOp}
                    />
              </Column>
            </DataGrid>

            <div className="text-center mt-3">
              <button className="btn btn-dark" onClick={this.handleNuevoOperador}>Alta Operador</button>
            </div>
          
            <div className="mt-2 text-center hidden" id="contenedorPag">
              <label htmlFor="paginador">Pagina</label>

              <a  onClick={this.firstPage} style={{cursor:"pointer"}} className="ml-1">
                <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false" style={{marginRight:"-9px"}}></span>
                <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span>
              </a>

              <a onClick={this.removePage} ><span style={{cursor:"pointer"}}className="iconify ml-1" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span></a>

              <input 
                  className="mr-1 ml-1 text-center" 
                  type="number" 
                  id="pagConsOp" 
                  style={{width:"30px"}}
                  placeholder={this.props.operadores.currentPage+1} 
                  onBlur={(e) => {this.handleChangePagina(e)}}
              />

              <a onClick={this.addPage}><span style={{cursor:"pointer"}}className="iconify mr-1" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span></a>

              <a  onClick={this.lastPage} style={{cursor:"pointer"}} className="mr-1">
                <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span>
                <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false" style={{marginLeft:"-9px"}}></span>
              </a>
              
              <span>de {this.props.operadores.totalPages} ({this.props.operadores.totalItems} registros) </span>
            </div>
            
            <div className="modal fade" id="detalleOpModal" tabIndex="-1" role="dialog" aria-labelledby="detalleOpModal" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header bg-dark text-light">
                    <h5 className="modal-title" id="detalleOpModal">Detalle de Operador</h5>
                    <button type="button"className="text-light close" data-dismiss="modal" aria-label="Close" onClick={this.cancelarEdicion}> 
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body" style={{height:"65vh", overflowY:"scroll"}}>
                    <div className="row">

                      <Form formData={this.state.detalleOp} style={{margin:"auto"}} onFieldDataChanged={this.handleNuevosDatos}>
                        <GroupItem cssClass="first-group" colCount={4}>

                          <GroupItem colSpan={4}>
                            <SimpleItem dataField="id" editorOptions= {{readOnly: true }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="username" editorOptions= {{readOnly: this.state.readOnly }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="nombre" editorOptions= {{readOnly: this.state.readOnly }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="apellido" editorOptions= {{readOnly: this.state.readOnly }} />
                          </GroupItem>

                          <GroupItem colSpan={1}>
                            <SimpleItem dataField="bloqueado" editorType='dxCheckBox' editorOptions= {{readOnly: this.state.readOnly }} />
                          </GroupItem>

                          <GroupItem colSpan={1}>
                            <SimpleItem dataField="active" editorType='dxCheckBox' editorOptions= {{readOnly: this.state.readOnly }} />
                          </GroupItem>

                        </GroupItem>

                        <GroupItem cssClass="second-group" colCount={4}>
                            <GroupItem colSpan={4}>

                            <div className="position-relative">
                                <h4 className="text-center mt-3 mb-3">Roles</h4>

                                {!this.state.readOnly && 
                                  <Animated animationIn="fadeIn">
                                    <div onClick={this.addRol} style={{top:"-5%",right:"36%", cursor:"pointer"}} className="position-absolute">
                                      <span className="iconify" data-icon="carbon:add-filled" data-inline="false" data-width="25px"></span>
                                    </div>
                                  </Animated>
                                } 
                            </div>

                            <table className="table text-center">
                                <thead>
                                    <tr>
                                      <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripcion</th>
                                    </tr>
                                    
                                </thead>
                                
                                <tbody>
                                    {this.state.detalleOp.roles !== undefined &&
                                    this.state.detalleOp.roles.map(
                                        (roles) => 

                                        <tr>
                                            <td>{roles.id}</td>
                                            <td>{roles.nombre}</td>
                                            <td>{roles.descripcion}</td>
                                            {!this.state.readOnly &&
                                            <td onClick={this.borrarRolSeleccionado} style={{ cursor:"pointer"}}>
                                                <span className="iconify" data-icon="carbon:close-filled" data-inline="false" data-width="25px"></span>
                                            </td>
                                            }
                                        </tr>

                                    )}
                                </tbody>

                            </table>
                            
                          </GroupItem>

                        </GroupItem>

                        <GroupItem cssClass="third-group" colCount={4}>
                            <GroupItem colSpan={4}>

                            <div className="position-relative">
                                <h4 className="text-center mt-3 mb-3">Organizaciones</h4>

                                {!this.state.readOnly && 
                                  <Animated animationIn="fadeIn">
                                    <div onClick={this.addOrg} style={{top:"-5%",right:"30%", cursor:"pointer"}} className="position-absolute">
                                      <span className="iconify" data-icon="carbon:add-filled" data-inline="false" data-width="25px"></span>
                                    </div>
                                  </Animated>
                                } 
                            </div>

                            <table className="table text-center">
                                <thead>
                                  <tr>
                                    <th>Codigo</th>
                                    <th>Descripcion</th>
                                  </tr>
                                    
                                </thead>
                                
                                <tbody>
                                    {this.state.detalleOp.organizaciones !== undefined &&
                                    this.state.detalleOp.organizaciones.map(
                                        (org) => 

                                        <tr>
                                            <td>{org.codigo}</td>
                                            <td>{org.descripcion}</td>
                                            {!this.state.readOnly &&
                                            <td onClick={this.borrarOrgSeleccionada} style={{ cursor:"pointer"}}>
                                                <span className="iconify" data-icon="carbon:close-filled" data-inline="false" data-width="25px"></span>
                                            </td>
                                            }
                                        </tr>

                                    )}
                                </tbody>

                            </table>
                            
                          </GroupItem>

                        </GroupItem>

                        <GroupItem cssClass="third-group" colCount={4}>
                            <GroupItem colSpan={4}>
                                <div className="text-center mt-3">
                                    <button className="btn btn-dark" onClick={this.cambiarContraseña}>Cambiar Contraseña</button>
                                </div>
                            </GroupItem>
                        </GroupItem>

                      </Form>
                                            
                      

                    </div>
                  </div>

                  <div className="modal-footer">

                    {this.state.readOnly &&
                      <button className="btn btn-dark" onClick={this.toggleEdicion}>
                        <span className="iconify mr-2 mb-1" data-icon="clarity:edit-solid" data-inline="false" width="15px"></span>
                        <b>Editar</b>
                      </button>
                    }

                    {!this.state.readOnly &&
                      <div>
                        <button className="btn btn-dark" onClick={this.guardarEdicionOp}>
                          <span className="iconify mr-2 mb-1" data-icon="entypo:save" data-inline="false" width="15px"></span>
                          <b>Guardar</b>
                        </button>
                      </div>
                    }

                    <button className="btn btn-dark ml-3" onClick={this.cancelarEdicion} data-dismiss="modal">
                      <span className="iconify mr-2 mb-1" data-icon="topcoat:cancel" data-inline="false" width="15px"></span>
                      <b>Cancelar</b>
                    </button>
                    
                  </div>

                </div>
              </div>
           </div>
          



           <div className="modal fade" id="nuevoOpModal" tabIndex="-1" role="dialog" aria-labelledby="nuevoOpModal" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header bg-dark text-light">
                    <h5 className="modal-title" id="nuevoOpModal">Alta Nuevo Operador</h5>
                    <button type="button"className="text-light close" data-dismiss="modal" aria-label="Close"> 
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body" style={{height:"65vh", overflowY:"scroll"}}>
                    <div className="row">

                      <Form style={{margin:"auto"}} formData={this.state.nuevoOp} onFieldDataChanged={this.handleNuevosDatos}>
                        <GroupItem cssClass="first-group" colCount={4}>

                          <GroupItem colSpan={4}>
                            <SimpleItem dataField="username" editorOptions= {{readOnly: false }}>
                              <Label text="Usuario" />
                            </SimpleItem>
                           
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="nombre" editorOptions= {{readOnly: false }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="apellido" editorOptions= {{readOnly: false }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="password" editorOptions= {{readOnly: false }}>
                              <Label text="Contraseña" />
                            </SimpleItem>
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="matchingPassword" editorOptions= {{readOnly: false }}>
                              <Label text="Repetir Contraseña"/>
                            </SimpleItem>
                          </GroupItem>


                        </GroupItem>

                        <GroupItem cssClass="second-group" colCount={4}>
                            <GroupItem colSpan={4}>

                            <div className="position-relative">
                                <h4 className="text-center mt-3 mb-3">Roles</h4>

                                <div onClick={this.addRol} style={{top:"-5%",right:"36%", cursor:"pointer"}} className="position-absolute">
                                  <span className="iconify" data-icon="carbon:add-filled" data-inline="false" data-width="25px"></span>
                                </div>

                            </div>

                            <table className="table text-center">
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripcion</th>
                                  </tr>
                                    
                                </thead>
                                
                                <tbody>
                                    {this.state.nuevoOp.roles !== undefined &&
                                    this.state.nuevoOp.roles.map(
                                        (roles) => 

                                        <tr>
                                            <td>{roles.id}</td>
                                            <td>{roles.nombre}</td>
                                            <td>{roles.descripcion}</td>
                                            <td onClick={this.borrarRolSeleccionado} style={{ cursor:"pointer"}}>
                                                <span className="iconify" data-icon="carbon:close-filled" data-inline="false" data-width="25px"></span>
                                            </td>
                                        </tr>

                                    )}
                                </tbody>

                            </table>
                            
                          </GroupItem>

                        </GroupItem>

                        <GroupItem cssClass="third-group" colCount={4}>
                            <GroupItem colSpan={4}>

                            <div className="position-relative">
                                <h4 className="text-center mt-3 mb-3">Organizaciones</h4>

                                <div onClick={this.addOrg} style={{top:"-5%",right:"30%", cursor:"pointer"}} className="position-absolute">
                                  <span className="iconify" data-icon="carbon:add-filled" data-inline="false" data-width="25px"></span>
                                </div>
                            </div>

                            <table className="table text-center">
                                <thead>
                                  <tr>
                                    <th>Codigo</th>
                                    <th>Descripcion</th>
                                  </tr>
                                    
                                </thead>
                                
                                <tbody>
                                    {this.state.nuevoOp.organizaciones !== undefined &&
                                    this.state.nuevoOp.organizaciones.map(
                                        (org) => 

                                        <tr>
                                            <td>{org.codigo}</td>
                                            <td>{org.descripcion}</td>
                                            <td onClick={this.borrarOrgSeleccionada} style={{ cursor:"pointer"}}>
                                                <span className="iconify" data-icon="carbon:close-filled" data-inline="false" data-width="25px"></span>
                                            </td>
                                        </tr>

                                    )}
                                </tbody>

                            </table>
                            
                          </GroupItem>

                        </GroupItem>

                      </Form>

                    </div>
                  </div>

                  <div className="modal-footer">

                    <div>
                      <button className="btn btn-dark" onClick={this.guardarNuevoOp}>
                        <span className="iconify mr-2 mb-1" data-icon="entypo:save" data-inline="false" width="15px"></span>
                        <b>Guardar</b>
                      </button>
                    </div>
                  

                    <button className="btn btn-dark ml-3" data-dismiss="modal">
                      <span className="iconify mr-2 mb-1" data-icon="topcoat:cancel" data-inline="false" width="15px"></span>
                      <b>Cancelar</b>
                    </button>
                    
                  </div>

                </div>
              </div>
           </div>




           <div className="modal fade" style={{marginTop:"10%"}} id="rolesModal" tabIndex="-1" role="dialog" aria-labelledby="rolesModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="rolesModallLabel">Agregar Rol</h5>
                  <button type="button"className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" style={{maxHeight: "40vh", overflowY:"scroll"}}>
                      <table className="table text-center">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Nombre</th>
                              <th>Descripcion</th>
                            </tr>
                              
                              
                          </thead>
                          
                          <tbody>
                              {this.props.roles !== undefined &&
                              this.props.roles.roles.map(
                                  (roles) => 

                                  <tr className="privRow">
                                      <td className="rolId">{roles.id}</td>
                                      <td>{roles.nombre}</td>
                                      <td>{roles.descripcion}</td>
                                      <td onClick={this.hanldeRolSeleccionado} style={{ cursor:"pointer"}}>
                                        <span className="iconify" data-icon="carbon:add-filled" data-inline="false" data-width="25px"></span>
                                      </td>
                                  </tr>

                              )}
                          </tbody>

                      </table>
                </div>
                <div className="modal-footer">

                </div>
              </div>
            </div>
          </div>


          <div className="modal fade" style={{marginTop:"10%"}} id="orgModal" tabIndex="-1" role="dialog" aria-labelledby="orgModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="orgModallLabel">Agregar Organizacion</h5>
                  <button type="button"className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" style={{maxHeight: "40vh", overflowY:"scroll"}}>
                      <table className="table text-center">
                          <thead>
                            <tr>
                              <th>Codigo</th>
                              <th>Descripcion</th>
                            </tr>
                              
                              
                          </thead>
                          
                          <tbody>
                              {this.props.getOrganizaciones() !== undefined &&
                              this.props.getOrganizaciones().map(
                                  (org) => 

                                  <tr className="privRow">
                                      <td className="orgCod">{org.codigo}</td>
                                      <td>{org.descripcion}</td>
                                      <td onClick={this.hanldeOrgSeleccionado} style={{ cursor:"pointer"}}>
                                        <span className="iconify" data-icon="carbon:add-filled" data-inline="false" data-width="25px"></span>
                                      </td>
                                  </tr>

                              )}
                          </tbody>

                      </table>
                </div>
                <div className="modal-footer">

                </div>
              </div>
            </div>
          </div>


          <div className="modal fade" style={{marginTop:"10%"}} id="passModal" tabIndex="-1" role="dialog" aria-labelledby="passModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="passModallLabel">Cambio de Contraseña: {this.state.detalleOp.username}</h5>
                  <button type="button"className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <div className="modal-body">
                      <form className="pl-4 pr-4">

                        <div className="mt-2">
                            <label>Ingresar Nueva contraseña</label>
                            <br/>
                            <input className="customInput w-100" type="password" id="pass"/>
                        </div>

                        <div className="mt-4 mb-4">
                            <label>Repetir Nueva contraseña</label>
                            <br/>
                            <input className="customInput w-100" type="password" id="matchPass"/>
                        </div>

                      </form>
                </div>
                <div className="modal-footer">

                    <div>
                        <button className="btn btn-dark" onClick={this.guardarNuevaContraseña}>
                            <span className="iconify mr-2 mb-1" data-icon="entypo:save" data-inline="false" width="15px"></span>
                            <b>Guardar</b>
                        </button>
                    </div>
                

                    <button className="btn btn-dark ml-3" data-dismiss="modal">
                      <span className="iconify mr-2 mb-1" data-icon="topcoat:cancel" data-inline="false" width="15px"></span>
                      <b>Cancelar</b>
                    </button>
                    
        
                </div>

              </div>
            </div>
          </div>

        </div>
      );
    }
  }

export default Operadores;

