import React from 'react';

import DataGrid, { Column, Paging, Button, Sorting } from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';

import $ from 'jquery';
import fetchTimeout from 'fetch-timeout';

import Form, { SimpleItem, GroupItem, Label } from 'devextreme-react/form';
import 'devextreme-react/text-area';



class Agencias extends React.Component {

  constructor(props) {		
    super(props);

    this.state = {
      
      detalleAg: {},
      readOnly: true,
      agId: null,
      nuevosDatosAg: null,

    }

    this.addPage                        = this.addPage.bind(this);
    this.removePage                     = this.removePage.bind(this);
    this.firstPage                     = this.firstPage.bind(this);
    this.lastPage                      = this.lastPage.bind(this);
    this.formFieldDataChanged           = this.formFieldDataChanged.bind(this);
    this.handleDetalleAg                = this.handleDetalleAg.bind(this);
  

    this.consultaDetalleAg = this.consultaDetalleAg.bind(this);
    this.toggleEdicion = this.toggleEdicion.bind(this);
    this.cancelarEdicion = this.cancelarEdicion.bind(this)
    this.guardarEdicionAg = this.guardarEdicionAg.bind(this)
    this.handleNuevosDatos = this.handleNuevosDatos.bind(this)
    this.consultaBtn = this.consultaBtn.bind(this)
    this.sincronizarAg = this.sincronizarAg.bind(this)
  }

  sincronizarAg(){
    
    let codOrg = $("#fieldorgSeleccionadaAg").val()

    let url = process.env.REACT_APP_WS_SINCRONIZAR_AGENCIAS + "?codigoOrganizacion=" + codOrg;

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

              console.log(json)  
              this.props.ejecutarConsultaAgencias(1)

              } else { 
                this.props.mensajeErrorWS('Consulta Operadores',json.errores,cerrarSesion);                     
              }
            })
        .catch((error) => {
            this.props.mensajeErrorGeneral();
            })	
  }

  consultaBtn(){
    
    this.props.ejecutarConsultaAgencias(1)
    $("#pagConsAg").val(1)
    $("#contenedorPag").removeClass("hidden")

  }

  guardarEdicionAg() {
    
    if (this.state.nuevosDatosAg==null) return;

    let id = this.state.agId;

    let url = process.env.REACT_APP_WS_GUARDAR_DETALLE_AGENCIAS;
    url = url.replace(":idAgencia", id)
    
    let cerrarSesion = false;
    let statusCode = "";
    
    let parametros = {
      activa: this.state.nuevosDatosAg.active,
      descripcion: this.state.nuevosDatosAg.descripcion
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

            $('#detalleAgModal').modal('toggle');
            this.setState({readOnly: true})
            this.props.ejecutarConsultaAgencias(Number($("#pagConsAg").val()));

        } else if (json.status==="error") {	
                if (cerrarSesion) {					
                  this.props.mensajeErrorWS('Guardar datos del cliente',json.errores,cerrarSesion);
                } else {
                  this.props.mensajeErrorWS('Guardar datos del cliente',json.errores);	
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

    let codAg = undefined
    let localidad = undefined
    let estado = undefined

    if(e.dataField==="codAg") {
     codAg = e.value
    }

    if(e.dataField==="localidad") {
      localidad = e.value
     }

     if(e.dataField==="estado") {
      estado = e.value
     }

    this.props.cambioFiltroAg(codAg, localidad, estado)

  }

  firstPage(){
    $("#pagConsAg").val(1); 
    this.props.ejecutarConsultaAgencias(Number($("#pagConsAg").val()));
  }

  lastPage(){

    $("#pagConsAg").val(this.props.agencias.totalPages); 
    this.props.ejecutarConsultaAgencias(Number($("#pagConsAg").val()));
    
  }

  addPage(){
    if (Number($("#pagConsAg").val())<this.props.agencias.totalPages) 
      $("#pagConsAg").val(Number($("#pagConsAg").val())+1);
    else
      $("#pagConsAg").val(this.props.agencias.totalPages);
    this.props.ejecutarConsultaAgencias(Number($("#pagConsAg").val()));
  }

  removePage(){
    if (Number($("#pagConsAg").val())>1)
        $("#pagConsAg").val(Number($("#pagConsAg").val())-1);
    else
        $("#pagConsAg").val(1); 

    this.props.ejecutarConsultaAgencias(Number($("#pagConsAg").val()));
  }

  handleChangePagina(e) {
    if (e.target.value.length===0) return;
    if (!((Number($("#pagConsAg").val())>=1) && 
       (Number($("#pagConsAg").val())<=this.props.agencias.totalPages))) 
        this.props.ejecutarConsultaAgencias(1);
    else
      this.props.ejecutarConsultaAgencias(Number(e.target.value));
  }

  handleDetalleAg(e){
    $('#detalleAgModal').modal('toggle');

    this.setState({agId: e.row.data.id})


    this.consultaDetalleAg(this.state.agId)
    
  }

  consultaDetalleAg(id){

        let url = process.env.REACT_APP_WS_DETALLE_AGENCIAS;
        url = url.replace(":idAgencia", id)

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

                    this.setState({detalleAg : json})

                  } else { 
                    this.props.mensajeErrorWS('Consulta Agencia',json.errores,cerrarSesion);                     
                  }
                })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
                })	

  }

  handleNuevosDatos(e){
    this.setState({nuevosDatosAg: e.component.option("formData")})
  }

  render() {

      let jsxOrganizacionesHabilitadas = null;

        
      if (this.props.getOrganizaciones() !== undefined) {
          jsxOrganizacionesHabilitadas = this.props.getOrganizaciones().map(
          (organizacion) => 
          <option key={organizacion.codigo} value={organizacion.codigo}>{organizacion.descripcion}</option>
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
                    id="codAg"
                    dataField="codAg"

                  
                  >
                    <Label text="Agencia"></Label>
                </SimpleItem>
                </GroupItem>
                
                <GroupItem colSpan={2}>
                <SimpleItem
                    dataField="localidad"
                  
                    
                  
                  >
                    <Label text="Localidad"></Label>
                </SimpleItem>
                </GroupItem>

                <GroupItem colSpan={2}>
                <SimpleItem
                    dataField="estado"
                    editorType="dxSelectBox"
                    editorOptions={{width: '100%', items: ["Habilitada", "Deshabilitada"]}}
                  
                  >
                    <Label text="Estado"></Label>
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
              dataSource={this.props.agencias.items}
              showBorders={true}
              keyExpr='id'
              focusedRowEnabled={true}
            >
              <Paging enabled={false} />
              <Sorting mode="none" />
      
              <Column dataField="codigo"/>
              <Column dataField="descripcion"/>
              <Column dataField="localidad"/>
              <Column dataField="habilitada" />
              <Column dataField="active"  caption="Activa"/>

              <Column type="buttons" caption="Detalle">
                    <Button
                        icon="search"
                        text="Detalle"
                        hint="Detalle"
                        onClick={this.handleDetalleAg}
                    />
              </Column>
            </DataGrid>


          
        

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
                  id="pagConsAg" 
                  style={{width:"30px"}}
                  placeholder={this.props.agencias.currentPage+1} 
                  onBlur={(e) => {this.handleChangePagina(e)}}
                  //placeholder={this.props.agencias.currentPage+1}
              />

              <a onClick={this.addPage}><span style={{cursor:"pointer"}}className="iconify mr-1" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span></a>

              <a  onClick={this.lastPage} style={{cursor:"pointer"}} className="mr-1">
                <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span>
                <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false" style={{marginLeft:"-9px"}}></span>
              </a>
              
              <span>de {this.props.agencias.totalPages} ({this.props.agencias.totalItems} registros) </span>
            </div>
            

            <div className="text-center mt-3">
              <button className="btn btn-dark" onClick={this.sincronizarAg}>Sincronizar Agencias</button>
            </div>

            <div className="modal fade" id="detalleAgModal" tabIndex="-1" role="dialog" aria-labelledby="detalleAgModal" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header bg-dark text-light">
                    <h5 className="modal-title" id="detalleAgModal">Detalle de Agencia</h5>
                    <button type="button"className="text-light close" data-dismiss="modal" aria-label="Close" onClick={this.cancelarEdicion}> 
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="row">

                      <Form formData={this.state.detalleAg} style={{margin:"auto"}} onFieldDataChanged={this.handleNuevosDatos}>
                        <GroupItem cssClass="first-group" colCount={4}>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="codigo" editorOptions= {{readOnly: true }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="descripcion" editorOptions= {{readOnly: this.state.readOnly }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="direccion" editorOptions= {{readOnly: true }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="localidad" editorOptions= {{readOnly: true }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="habilitada" editorType='dxCheckBox' editorOptions= {{readOnly: true }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="active" editorType='dxCheckBox' editorOptions= {{readOnly: this.state.readOnly }} />
                          </GroupItem>

                          <GroupItem colSpan={2}>
                            <SimpleItem dataField="subAgencia" editorOptions= {{readOnly: true }} />
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
                        <button className="btn btn-dark" onClick={this.guardarEdicionAg}>
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

        </div>
      );
    }
  }

export default Agencias;

