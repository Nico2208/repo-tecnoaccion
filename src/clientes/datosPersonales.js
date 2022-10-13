import React from 'react';
import DataGrid, {Column,Pager, Paging,} from 'devextreme-react/data-grid';
import $ from 'jquery';
import fetchTimeout from 'fetch-timeout';

import Form, { SimpleItem,  GroupItem, Label } from 'devextreme-react/form';
import 'devextreme-react/text-area';


class DatosPersonales extends React.Component {

  constructor(props) {		
    super(props);


    this.state = {readOnly: true,  
                  habModifDatosSensibles : false,
                  cambioLocalidad: false
                };

    this.birthDate = { width: '100%' };
    this.toggleEdicion = this.toggleEdicion.bind(this);
    this.guardarEdicion = this.guardarEdicion.bind(this);
    this.cancelarEdicion = this.cancelarEdicion.bind(this);
    this.handleNuevosDatos = this.handleNuevosDatos.bind(this);
    this.handlerReenviarCorreo = this.handlerReenviarCorreo.bind(this);
    this.guardarDatosCliente = this.guardarDatosCliente.bind(this);
    this.isEditaDatosSensibles = this.isEditaDatosSensibles.bind(this); 
    this.grabarDatosSensibles = this.grabarDatosSensibles.bind(this);
    this.traerLocalidades     = this.traerLocalidades.bind(this)
    this.handleNuevaLocalidad = this.handleNuevaLocalidad.bind(this)

    this.dateOptions = { 
      displayFormat: 'dd/MM/yyyy HH:mm:ss',
      pickerType: "calendar",
      format: "date",
      readOnly: this.state.readOnly
    };

    this.dateOptionsFecNac = { 
      displayFormat: 'dd/MM/yyyy',
      pickerType: "calendar",
      format: "date",
      readOnly: this.state.readOnly
    };
    


  }


  traerLocalidades(){
                 
    let statusCode     = "";
    let cerrarSesion   = false;

    let url            = process.env.REACT_APP_WS_LISTADO_LOCALIDADES;
    url = url.replace(":idOrganizacion", this.props.getOrganizacionSel());
    //let url = "http://billetera.tecnoaccion.com.ar:8704/api-operador/admin/organizacion/"+this.props.getOrganizacionSel()+ "/localidades";

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
            if (respPromise.status==process.env.REACT_APP_CODIGO_CERRO_SESION) {
                cerrarSesion = true;
            }
            return respPromise.json();
        })
        .then(json => {
            if (json.status==="ok") {
                  this.setState({localidades: json.localidades})
              } else {
                this.props.mensajeErrorWS('Consulta de Solicitudes',json.errores,cerrarSesion);  
              }
            })
        .catch((error) => {
          this.props.mensajeErrorGeneral();
        })		
        ;
        
  }

  isEditaDatosSensibles() {
    return !this.state.readOnly && (this.state.habModifDatosSensibles);
  }

  handlerReenviarCorreo() {
    this.props.reenvioMailCuentaActivacion();
  }

  cancelarEdicion(e){
    this.props.refresh(true)
    this.props.handleBuscarCliente(e)
    this.toggleEdicion()
  }

  handleNuevosDatos(e){
    this.setState({nuevosDatos: e.component.option("formData")})
  }

  handleNuevaLocalidad(){
    this.setState({cambioLocalidad: true})
  }

  toggleEdicion(){
    this.traerLocalidades()
    this.setState({readOnly: !this.state.readOnly})
    
  }

  cambiarSolRetiroConAgenciaAmiga(idSolicitudRetiro) {

    if (idSolicitudRetiro==null) return;
	
		let url = process.env.REACT_APP_WS_REASIG_SOLRET_AGENCIA_AMIGA;
    
        url = url.replace(":idSolicitudRetiro",idSolicitudRetiro);
        
		let cerrarSesion = false;
    let statusCode = "";
        
    let parametros = {};

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
				if (respPromise.status==process.env.REACT_APP_CODIGO_CERRO_SESION) {
					cerrarSesion = true;
				}
				return respPromise.json();
			})
			.then(json => {
				if (json.status==="ok") {
                        // Aceptar solicitud
                        this.ejecutarConsultarSolRetiros(1);                        
					} else if (json.status==="error") {	
								if (cerrarSesion) {					
									this.props.mensajeErrorWS('Cambiar Solicitud a la agencia amiga',json.errores,cerrarSesion);
								} else {
									this.props.mensajeErrorWS('Cambiar Solicitud a la agencia amiga',json.errores);	
								}
							}
			})
			.catch((error) => {
				this.props.mensajeErrorGeneral();
			})		
			;	

  }
  
  guardarDatosCliente(e) {

      let localidadActual = this.props.datosPersonales.cliente.localidad

      let curretnLoc = this.state.localidades.find(function(localidad, index){
        if(localidad.nombre == localidadActual){
          return true
        }
      })


      let nuevaLocalidad = ""

      if(this.state.cambioLocalidad){
        nuevaLocalidad = $("#localidadSelect").val()
      }else{
        nuevaLocalidad = curretnLoc.id
      }

      if (this.state.nuevosDatos==null && !this.state.cambioLocalidad) return;

      

      let url = process.env.REACT_APP_WS_ACTU_DATOS_USUARIO;
      url = url.replace(":idUsuario",this.props.datosPersonales.cliente.id);
      
      let cerrarSesion = false;
      let statusCode = "";
      let parametros = {}

      if(this.state.nuevosDatos==null){
        parametros = {
          nombre : this.props.datosPersonales.cliente.nombre,
          apellido : this.props.datosPersonales.cliente.apellido,
          direccion : this.props.datosPersonales.cliente.direccion,
          localidadId : nuevaLocalidad,
          nroTelefono : this.props.datosPersonales.cliente.nroTelefono,
          recibeMsjEmail : this.props.datosPersonales.cliente.recibeMsjEmail,
          activo         : this.props.datosPersonales.cliente.active,
          bloqueado      : this.props.datosPersonales.cliente.bloqueado,
          genero  : this.props.datosPersonales.cliente.genero,
          enableDeposito: this.props.datosPersonales.cliente.enableDeposito,
          enableRetiro: this.props.datosPersonales.cliente.enableRetiro,
          enableApuesta: this.props.datosPersonales.cliente.enableApuesta,
          cuil: this.props.datoPersonales.cliente.cuil
        };
      }else{
        parametros = {
          nombre : this.state.nuevosDatos.nombre,
          apellido : this.state.nuevosDatos.apellido,
          direccion : this.state.nuevosDatos.direccion,
          localidadId : nuevaLocalidad,
          nroTelefono : this.state.nuevosDatos.nroTelefono,
          recibeMsjEmail : this.state.nuevosDatos.recibeMsjEmail,
          activo         : this.state.nuevosDatos.active,
          bloqueado      : this.state.nuevosDatos.bloqueado,
          genero  : this.state.nuevosDatos.genero,
          enableDeposito: this.state.nuevosDatos.enableDeposito,
          enableRetiro: this.state.nuevosDatos.enableRetiro,
          enableApuesta: this.state.nuevosDatos.enableApuesta,
          cuil: this.state.nuevosDatos.cuil
        };
      }

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
          if (respPromise.status==process.env.REACT_APP_CODIGO_CERRO_SESION) {
            cerrarSesion = true;
          }
          return respPromise.json();
        })
        .then(json => {
          if (json.status==="ok") {
            this.toggleEdicion();
            this.props.handleBuscarCliente(e);
            //TODO: revisar por seguridad 7/09/21
              //if (this.state.habModifDatosSensibles) 
                  //this.grabarDatosSensibles();
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

  grabarDatosSensibles() {

    let parametros2 = null;
  
    parametros2 =
      {
        email : this.state.nuevosDatos.email,
        documento : this.state.nuevosDatos.documento
      };

    let url2 = process.env.REACT_APP_WS_ACTU_DATOS_SENSIBLES_USUARIO;
    url2 = url2.replace(":idUsuario",this.props.datosPersonales.cliente.id);
  
    let cerrarSesion2 = false;
    let statusCode2 = "";
  
    fetch(url2,{ 
      method: 'POST',
      headers:{
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this.props.getKeyLogin()
      },
      body: JSON.stringify(parametros2)
      }
      )
      .then(respPromise => {
        statusCode2 = respPromise.status; 
        if (respPromise.status==process.env.REACT_APP_CODIGO_CERRO_SESION) {
          cerrarSesion2 = true;
        }
        return respPromise.json();
      })
      .then(json => {
        if (json.status==="ok") {
          
        } else if (json.status==="error") {	
                if (cerrarSesion2) {					
                  this.props.mensajeErrorWS('Guardar datos sensibles del cliente',json.errores,cerrarSesion2);
                } else {
                  this.props.mensajeErrorWS('Guardar datos sensibles del cliente',json.errores);	
                }
              }
      })
      .catch((error) => {
        this.props.mensajeErrorGeneral();
      })		
      ;

  }
  
  guardarEdicion(e){
    this.guardarDatosCliente(e);
    //this.toggleEdicion();
    //this.props.handleBuscarCliente(e);
  }
  
  render() {

    let jsxLocalidades = "";
      
        if (this.state.localidades !== undefined) {
            jsxLocalidades = this.state.localidades.map(
            (localidad) => 
            <option key={localidad.id} value={localidad.id}>{localidad.nombre}</option>
            );
        }

    return (
      <div id="data-grid-demo" className="bg-light p-3 border" style={{maxHeight:"28rem", overflowY:""}}>
          <Form formData={this.props.datosPersonales.cliente} onFieldDataChanged={this.handleNuevosDatos}>
            <GroupItem cssClass="first-group" colCount={4}>
              <GroupItem colSpan={2}>
                <SimpleItem dataField="tipoDocumento" editorOptions= {{readOnly: true }}>
                <Label text="Tipo Docu." />
                </SimpleItem>
              </GroupItem>
              <GroupItem colSpan={1}>
                <SimpleItem dataField="documento" editorOptions= {{readOnly: !this.isEditaDatosSensibles() }} />
              </GroupItem>
              <GroupItem colSpan={1}>
                
                  {this.state.readOnly &&
                    <button className="btn btn-dark" onClick={this.toggleEdicion}>
                      <span className="iconify mr-2 mb-1" data-icon="clarity:edit-solid" data-inline="false" width="15px"></span>
                      <b>Editar</b>
                    </button>
                  }

                  {!this.state.readOnly &&
                    <div>
                      <button className="btn btn-dark" onClick={this.guardarEdicion}>
                        <span className="iconify mr-2 mb-1" data-icon="entypo:save" data-inline="false" width="15px"></span>
                        <b>Guardar</b>
                      </button>
                      
                      <button className="btn btn-dark ml-3" onClick={this.cancelarEdicion}>
                        <span className="iconify mr-2 mb-1" data-icon="topcoat:cancel" data-inline="false" width="15px"></span>
                        <b>Cancelar</b>
                      </button>
                    </div>
                  }
                  
              </GroupItem>
            </GroupItem>
            
            <GroupItem cssClass="second-group" colCount={4}>
              <GroupItem colSpan={2}>
                <SimpleItem dataField="nombre" editorOptions= {{readOnly: this.state.readOnly }} />
                <SimpleItem dataField="provincia" editorOptions= {{readOnly: true }} />
                <GroupItem colSpan={2}>

                  {this.state.readOnly && 
                    <div>
                    <label style={{marginLeft:"12px"}} htmlFor="localidadSelect">Localidad: </label>
                    
                    <select name="localidad" id="localidadSelect" disabled>
                        <option value="selected">{this.props.datosPersonales.cliente.localidad}</option>
                    </select>
                </div>
                  
                  }

                  {!this.state.readOnly && 
                    <div>
                        <label style={{marginLeft:"12px"}} htmlFor="localidadSelect">Localidad: </label>
                        
                        <select onChange={this.handleNuevaLocalidad} name="localidad" id="localidadSelect">
                            {jsxLocalidades}
                        </select>
                    </div>
                  }
                </GroupItem>
                

                <SimpleItem dataField="genero" editorOptions= {{readOnly: this.state.readOnly }} />                 
              </GroupItem>
              

              <GroupItem colSpan={2}>
                <SimpleItem dataField="apellido" editorOptions= {{readOnly: this.state.readOnly }} />
                <SimpleItem dataField="direccion" editorOptions= {{readOnly: this.state.readOnly }} />
                <SimpleItem dataField="email" editorOptions= {{readOnly: !this.isEditaDatosSensibles()}}> 
                  <Label text="Correo" />
                </SimpleItem>  
                
                <SimpleItem
                  dataField="nroTelefono" editorOptions= {{readOnly: this.state.readOnly }}>
                  <Label text="Teléfono" />
                </SimpleItem>

                <GroupItem colSpan={4}>
                  <SimpleItem dataField="cuil" dataType="number" format="currency" editorOptions= {{readOnly: this.state.readOnly , placeholder: "XX-XXXXXXX-X"}}/>

                </GroupItem>

              </GroupItem>
            </GroupItem>

            <GroupItem cssClass="third-group" colCount={4}>

              <GroupItem colSpan={2}>
                <SimpleItem 
                  dataField="fechaAlta" editorType="dxDateBox"
                  editorOptions={this.dateOptions}>
                  <Label text="Fecha Alta" />
                </SimpleItem>
              </GroupItem>
              <GroupItem colSpan={2}>
                <SimpleItem
                  dataField="fechaBaja" editorType="dxDateBox" editorOptions={this.dateOptions}>
                  <Label text="Fecha Baja" />
                </SimpleItem>
              </GroupItem>
              
            </GroupItem>

            <GroupItem cssClass="fourth-group" colCount={4}>

            {
            /*
            <GroupItem colSpan={1}>
                <SimpleItem editorType='dxDateBox' dataField="fechaNacimiento" editorOptions={this.dateOptionsFecNac}>
                  <Label text="Fec. Nacimiento" />
                </SimpleItem>
            </GroupItem>
            */
            }

              <GroupItem colSpan={1}>
                <SimpleItem editorType='dxCheckBox' dataField="recibeMsjEmail" editorOptions= {{readOnly: this.state.readOnly }}>
                  <Label text="Notif. Correo" />
                </SimpleItem>
              </GroupItem>

              <GroupItem colSpan={1}>
                <SimpleItem editorType='dxCheckBox' dataField="active" editorOptions= {{readOnly: this.state.readOnly }}>
                  <Label text="Activo" />
                </SimpleItem>   
              </GroupItem>

              <GroupItem colSpan={1}>
                <SimpleItem editorType='dxCheckBox' dataField="bloqueado" editorOptions= {{readOnly: this.state.readOnly }}>
                  <Label text="Bloqueado" />
                </SimpleItem>
              </GroupItem>

              <GroupItem colSpan={1}>
                <SimpleItem editorType='dxCheckBox' dataField="enableApuesta" editorOptions= {{readOnly: this.state.readOnly }}>
                  <Label text="Apuestas" />
                </SimpleItem>
              </GroupItem>

              <GroupItem colSpan={1}>
                <SimpleItem editorType='dxCheckBox' dataField="enableDeposito" editorOptions= {{readOnly: this.state.readOnly }}>
                  <Label text="Depositos" />
                </SimpleItem>
              </GroupItem>

              <GroupItem colSpan={1}>
                <SimpleItem editorType='dxCheckBox' dataField="enableRetiro" editorOptions= {{readOnly: this.state.readOnly }}>
                  <Label text="Retiros" />
                </SimpleItem>
              </GroupItem>

              <GroupItem colSpan={2}>
                <button type="button"className="btn btn-outline-dark pt-1 pb-1 mb-2" onClick={this.handlerReenviarCorreo}>
                    <span>Reenviar Correo de Activación</span>
                </button>
              </GroupItem>

            </GroupItem>

            
          </Form>

          <form>
          <DataGrid
              dataSource={this.props.datosPersonales.cliente.dataBilletera}
              showBorders={true}
            >
              <Paging defaultPageSize={8} />
              <Pager
                showPageSizeSelector={false}
                allowedPageSizes={[5, 10, 15]}
                showInfo={true} />
      
              <Column dataField="nombreOrganizacion" />
              <Column dataField="principal" />
              <Column dataField="agAmiga" />
              
            </DataGrid>
          </form>
      </div>
    );
  }
}

export default DatosPersonales;
