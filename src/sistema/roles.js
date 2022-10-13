import React from 'react';

import DataGrid, { Column, Paging, Button, Sorting } from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import { Animated } from "react-animated-css";

import $ from 'jquery';
import fetchTimeout from 'fetch-timeout';

import Form, { SimpleItem, GroupItem, Label } from 'devextreme-react/form';
import 'devextreme-react/text-area';



class Roles extends React.Component {

  constructor(props) {		
    super(props);

    this.state = {
      readOnly: true,
      nuevoRol:{
        nombre:"",
        descripcion:""
      }

    }

    this.handleDetalleRol       = this.handleDetalleRol.bind(this)
    this.toggleEdicion          = this.toggleEdicion.bind(this)
    this.cancelarEdicion        = this.cancelarEdicion.bind(this)
    this.handleNuevosDatos      = this.handleNuevosDatos.bind(this)
    this.guardarEdicionRol      = this.guardarEdicionRol.bind(this)
    this.addPriv                = this.addPriv.bind(this)
    this.ejecutarConsultaPriv   = this.ejecutarConsultaPriv.bind(this)
    this.hanldePrivSeleccionado = this.hanldePrivSeleccionado.bind(this)
    this.borrarPrivSeleccionado = this.borrarPrivSeleccionado.bind(this)
    this.handleNuevoRol         = this.handleNuevoRol.bind(this)
    this.guardarNuevoRol        = this.guardarNuevoRol.bind(this)

  }

  guardarNuevoRol(){

    let nombreRol = ""
    let descripcionRol = ""

    if (this.state.nuevoRol===undefined) {
      return
    }else{
      nombreRol = this.state.nuevoRol.nombre
      descripcionRol = this.state.nuevoRol.descripcion
    };

    let url = process.env.REACT_APP_WS_CREAR_ROL
    
    let cerrarSesion = false;
    let statusCode = "";
    
    let parametros = {
      nombre: nombreRol,
      descripcion: descripcionRol,
      privilegios : this.state.arrayIdPriv
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

            $('#nuevoRolModal').modal('toggle');
           
            this.setState({readOnly: true})
            this.props.ejecutarConsultaRoles();

        } else if (json.status==="error") {	
                if (cerrarSesion) {					
                  this.props.mensajeErrorWS('Nuevo Rol',json.errores,cerrarSesion);
                } else {
                  this.props.mensajeErrorWS('Nuevo Rol',json.errores);	
                }
              }
      })
      .catch((error) => {
        this.props.mensajeErrorGeneral();
      })		
      ;
  }

  borrarPrivSeleccionado(e){
    let id = e.target.closest("tr").cells[1].innerHTML
    let currentPriv = "";
    let arrayIdPriv = []  


    if(!this.state.editandoNuevo){
      currentPriv = this.state.currentRole.privilegios
      var removeIndex = currentPriv.map(function(item) { return item.id; }).indexOf(id);
      currentPriv.splice(removeIndex, 1)

      this.setState({
        currentRole:{ nombre:this.state.currentRole.nombre,
                      descripcion: this.state.currentRole.descripcion,
                      id: this.state.currentRole.id,
                      privilegios:currentPriv
                    }
      })

      this.state.currentRole.privilegios.forEach(element => {
        arrayIdPriv.push(element.id)
      });
      
      this.setState({arrayIdPriv : arrayIdPriv})

    }else{

      if(this.state.nuevoRol.privilegios === undefined){
        currentPriv = []
      }else{
        currentPriv = this.state.nuevoRol.privilegios
      }
      var removeIndex = currentPriv.map(function(item) { return item.id; }).indexOf(id);
      currentPriv.splice(removeIndex, 1)

      this.setState({
           nuevoRol:{ nombre:this.state.nuevoRol.nombre,
                      descripcion: this.state.nuevoRol.descripcion,
                      privilegios:currentPriv
                    }
      })

    } 
    
  }

  hanldePrivSeleccionado(e){
    let id = e.target.closest("tr").cells[1].innerHTML
    let name = e.target.closest("tr").cells[0].innerHTML
    let newPriv ={id:id, nombre:name}
    let currentPriv = "";
    let arrayIdPriv = []

    if(!this.state.editandoNuevo){
      currentPriv = this.state.currentRole.privilegios
      currentPriv.push(newPriv)

      this.setState({
                      currentRole:{ nombre:this.state.currentRole.nombre,
                                    descripcion: this.state.currentRole.descripcion,
                                    id: this.state.currentRole.id,
                                    privilegios:currentPriv
                                  }
                    })

      this.state.currentRole.privilegios.forEach(element => {
        arrayIdPriv.push(element.id)
      });

      this.setState({arrayIdPriv : arrayIdPriv})

    }else{

      if(this.state.nuevoRol.privilegios === undefined){
        currentPriv = []
      }else{
        currentPriv = this.state.nuevoRol.privilegios
      }
      
      currentPriv.push(newPriv)

      this.setState({
        nuevoRol:{ nombre:this.state.nuevoRol.nombre,
                      descripcion: this.state.nuevoRol.descripcion,
                      privilegios:currentPriv
                    }
      })
      
    }
    
    $("#privModal").modal("toggle")
  }

  addPriv(){
    this.ejecutarConsultaPriv()
    $("#privModal").modal("toggle")
  }

  ejecutarConsultaPriv(){
    let url = process.env.REACT_APP_WS_LISTADO_PRIVILEGIOS;

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

                this.setState({privilegios:json})

              } else { 
                this.props.mensajeErrorWS('Consulta Privilegios',json.errores,cerrarSesion);                     
              }
            })
        .catch((error) => {
            this.props.mensajeErrorGeneral();
            })	
  }

  handleNuevosDatos(e){

    if(!this.state.editandoNuevo){
      this.setState({nuevosDatosRol: e.component.option("formData")})
    }else{
      this.setState({DatosNuevoRol: e.component.option("formData")})
    }
    
  }

  guardarEdicionRol() {

    let nombreRol = ""
    let descripcionRol = ""

    if (this.state.nuevosDatosRol==null) {
      nombreRol = this.state.currentRole.nombre;
      descripcionRol = this.state.currentRole.descripcion
    }else{
      nombreRol = this.state.nuevosDatosRol.nombre
      descripcionRol = this.state.nuevosDatosRol.descripcion
    };

    let id = this.state.currentRole.id;

    let url = process.env.REACT_APP_WS_GUARDAR_ROL;
    url = url.replace(":idRol", id)
    
    let cerrarSesion = false;
    let statusCode = "";
    
    let parametros = {
      nombre: nombreRol,
      descripcion: descripcionRol,
      privilegios : this.state.arrayIdPriv
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

            $('#detalleRolModal').modal('toggle');
            this.setState({readOnly: true})
            this.props.ejecutarConsultaRoles();

        } else if (json.status==="error") {	
                if (cerrarSesion) {					
                  this.props.mensajeErrorWS('Actualizar Rol',json.errores,cerrarSesion);
                } else {
                  this.props.mensajeErrorWS('Actualizar Rol',json.errores);	
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
    this.props.ejecutarConsultaRoles()
  }

  handleDetalleRol(e){
    $('#detalleRolModal').modal('toggle');

    this.setState({
                    currentRole: e.row.data,
                    editandoNuevo: false
                })
  }

  handleNuevoRol(){
    $('#nuevoRolModal').modal('toggle');
    this.setState({
                    editandoNuevo: true,
                    nuevoRol:{
                      nombre:"",
                      descripcion:"",
                      privilegios:undefined
                    }
                  })
  }

  render() {


      return (

      <div className="bg-light p-4 border" style={{maxHeight: $("#panelResultados").height() - 45}}>
        
            <DataGrid
              dataSource={this.props.roles.roles}
              showBorders={true}
              keyExpr='id'
              focusedRowEnabled={true}
            >
              <Paging enabled={false} />
              <Sorting mode="none" />
              
              <Column dataField="nombre"/>
              <Column dataField="descripcion"/>
              <Column type="buttons" caption="Detalle">
                    <Button
                        icon="edit"
                        text="Detalle"
                        hint="Detalle"
                        onClick={this.handleDetalleRol}
                    />
              </Column>
            </DataGrid>

            <div className="text-center mt-3">
              <button className="btn btn-dark" onClick={this.handleNuevoRol}>Nuevo Rol</button>
            </div>


            <div className="modal fade" id="detalleRolModal" tabIndex="-1" role="dialog" aria-labelledby="detalleRolModal" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header bg-dark text-light">
                    <h5 className="modal-title" id="detalleRolModal">Detalle del Rol</h5>
                    <button type="button" className="text-light close" data-dismiss="modal" aria-label="Close" onClick={this.cancelarEdicion}> 
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="row">

                      <Form formData={this.state.currentRole} style={{margin:"auto"}} onFieldDataChanged={this.handleNuevosDatos}>
                        <GroupItem cssClass="first-group" colCount={4}>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="nombre" editorOptions= {{readOnly: this.state.readOnly }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="descripcion" editorOptions= {{readOnly: this.state.readOnly }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="id" editorOptions= {{readOnly: true }} />
                          </GroupItem>

                        </GroupItem>

                        <GroupItem cssClass="second-group" colCount={4}>
                            <GroupItem colSpan={4}>

                            <div style={{maxHeight:"40vh", overflowY:"scroll"}} className="privList">
                              <div className="position-relative">
                                  <h4 className="text-center mt-3 mb-3">Privilegios</h4>
  
                                  {!this.state.readOnly && 
                                    <Animated animationIn="fadeIn">
                                      <div onClick={this.addPriv} style={{top:"-5%",right:"36%", cursor:"pointer"}} className="position-absolute">
                                        <span className="iconify" data-icon="carbon:add-filled" data-inline="false" data-width="25px"></span>
                                      </div>
                                    </Animated>
                                  } 
                              </div>
  
                              <table className="table text-center">
                                  <thead>
                                  <tr>
                                    <th>Nombre</th>
                                    <th>ID</th>
                                  </tr>
                                    
                                </thead>
                                
                                <tbody>
                                    {this.state.currentRole !== undefined &&
                                    this.state.currentRole.privilegios.map(
                                        (privilegios) => 

                                        <tr>
                                            <td>{privilegios.nombre}</td>
                                            <td>{privilegios.id}</td>
                                            {!this.state.readOnly &&
                                              <Animated animationIn="fadeIn">
                                                <td onClick={this.borrarPrivSeleccionado} style={{ cursor:"pointer"}}>
                                                  <span className="iconify" data-icon="carbon:close-filled" data-inline="false" data-width="25px"></span>
                                                </td>
                                              </Animated>
                                            }
                                        </tr>

                                    )}
                                </tbody>

                            </table>
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
                        <button className="btn btn-dark" onClick={this.guardarEdicionRol}>
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

          
          <div className="modal fade" id="nuevoRolModal" tabIndex="-1" role="dialog" aria-labelledby="nuevoRolModal" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header bg-dark text-light">
                    <h5 className="modal-title" id="nuevoRolModal">Crear Nuevo Rol</h5>
                    <button type="button" className="text-light close" data-dismiss="modal" aria-label="Close" onClick={this.cancelarEdicion}> 
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="row">

                      <Form style={{margin:"auto"}} formData={this.state.nuevoRol} onFieldDataChanged={this.handleNuevosDatos}>
                        <GroupItem cssClass="first-group" colCount={4}>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="nombre" editorOptions= {{readOnly: false }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="descripcion" editorOptions= {{readOnly: false }} />
                          </GroupItem>

                        </GroupItem>

                        <GroupItem cssClass="second-group" colCount={4}>
                            <GroupItem colSpan={4}>

                            <div style={{maxHeight:"40vh", overflowY:"scroll"}} className="privList">
                              <div className="position-relative">
                                  <h4 className="text-center mt-3 mb-3">Privilegios</h4>
  
                                  <div onClick={this.addPriv} style={{top:"-5%",right:"36%", cursor:"pointer"}} className="position-absolute">
                                    <span className="iconify" data-icon="carbon:add-filled" data-inline="false" data-width="25px"></span>
                                  </div>
                                   
                              </div>
                            

                            <table className="table text-center">
                                <thead>
                                  <tr>
                                    <th>Nombre</th>
                                    <th>ID</th>
                                  </tr>
                                    
                                </thead>
                                
                                <tbody>
                                    {this.state.nuevoRol.privilegios !== undefined &&
                                    this.state.nuevoRol.privilegios.map(
                                        (privilegios) => 

                                        <tr>
                                            <td>{privilegios.nombre}</td>
                                            <td>{privilegios.id}</td>
                                            <td onClick={this.borrarPrivSeleccionado} style={{ cursor:"pointer"}}>
                                              <span className="iconify" data-icon="carbon:close-filled" data-inline="false" data-width="25px"></span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                            </div>
                          </GroupItem>

                        </GroupItem>

                      </Form>
                        
                    </div>
                  </div>

                  <div className="modal-footer">

                    <div>
                      <button className="btn btn-dark" onClick={this.guardarNuevoRol}>
                        <span className="iconify mr-2 mb-1" data-icon="entypo:save" data-inline="false" width="15px"></span>
                        <b>Guardar</b>
                      </button>
                    </div>
                  

                    <button className="btn btn-dark ml-3" onClick={this.cancelarEdicion} data-dismiss="modal">
                      <span className="iconify mr-2 mb-1" data-icon="topcoat:cancel" data-inline="false" width="15px"></span>
                      <b>Cancelar</b>
                    </button>
                    
                  </div>

                </div>
              </div>
           </div>



           <div className="modal fade" style={{marginTop:"10%"}} id="privModal" tabIndex="-1" role="dialog" aria-labelledby="privModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="privModallLabel">Agregar Privilegio</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" style={{maxHeight: "40vh", overflowY:"scroll"}}>
                      <table className="table text-center">
                          <thead>
                            <tr>
                              <th>Nombre</th>
                              <th>ID</th>
                            </tr>
                              
                          </thead>
                          
                          <tbody>
                              {this.state.privilegios !== undefined &&
                              this.state.privilegios.privilegios.map(
                                  (privilegios) => 

                                  <tr className="privRow">
                                      <td>{privilegios.nombre}</td>
                                      <td className="privId">{privilegios.id}</td>
                                      <td onClick={this.hanldePrivSeleccionado} style={{ cursor:"pointer"}}>
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

        </div>
      );
    }
  }


export default Roles;

