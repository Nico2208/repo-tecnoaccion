import React from 'react';
import TreeView from 'devextreme-react/tree-view';
import $ from 'jquery';

import { Animated } from 'react-animated-css';
import Moment from 'moment';
import fetchTimeout from 'fetch-timeout';

import Form, {
  ButtonItem,
  SimpleItem,
  GroupItem,
  Label,
  RequiredRule
} from 'devextreme-react/form';


class ReportesMedida extends React.Component {
  
  constructor(props) {
    super(props);

    this.buttonOptions = {
      text: 'Generar Reporte',
      type: 'black',
      useSubmitBehavior: true
    };

    this.dateOptions = { 
      displayFormat: 'dd/MM/yyyy',
      pickerType: "calendar",
      format: "date",
    };

    this.formatImporte = {
      displayFormat: '###,###,###,##0.00'
    }

   
    this.state = {
      filtros: {
        codOrganizacion: null,
        out : 'pdf'
      },
      salidas : [{codigo:'pdf',descripcion : 'PDF'}, {codigo:'xls',descripcion : 'Excel'} ],
      dataSource : [],
      fecha : null,
      reportes : [],
      //reportes: itemsReportes.getReportes(),
      selectedTreeItem: null,
      tituloSelected : null,
      tipoSalida : "Excel"
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.ejecutarConsulta = this.ejecutarConsulta.bind(this);
    this.consultaPremiosMayoresA = this.consultaPremiosMayoresA.bind(this);
    this.consultaMovCtasCtesAgencias = this.consultaMovCtasCtesAgencias.bind(this);
    this.getOrganizacionSel = this.getOrganizacionSel.bind(this);
    this.cambioFecha = this.cambioFecha.bind(this);
    this.handleTipoSalida = this.handleTipoSalida.bind(this);
    this.traerGruposDeReportes = this.traerGruposDeReportes.bind(this);
    this.traerReportesDelGrupo = this.traerReportesDelGrupo.bind(this);
    this.createChildren = this.createChildren.bind(this);
    this.paramArmadoCampo = this.paramArmadoCampo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showPDF      = this.showPDF.bind(this)
    this.showXLS      = this.showXLS.bind(this)
  }

  showPDF(blob, name){

    var newBlob = new Blob([blob], {type: "application/pdf"})
  
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    } 
  
    // For other browsers: 
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download= name + ".pdf";
    link.click();
    window.open(link.href,"_blank")
    setTimeout(function(){
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 100);
  }

  showXLS(blob, name){
    var newBlob = new Blob([blob], {type: "application/vnd.ms-excel"})

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    } 
    
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download= name + ".xls";
    link.click();

    setTimeout(function(){

      window.URL.revokeObjectURL(data);
    }, 100);
  }

  handleSubmit(e) {

    e.preventDefault();
    let i = 0;
    let paramsURL = "";
    for(i=0;i<this.state.selectedTreeItem.argumentos.length;++i) {

      let dato = "";
      if (this.state.selectedTreeItem.argumentos[i].tipo=='java.util.Date') {
          dato = encodeURIComponent(Moment(this.state.filtros[this.state.selectedTreeItem.keyReporte+"_"+this.state.selectedTreeItem.argumentos[i].nombre]).format('YYYYMMDD'));
      } else
      dato = this.state.filtros[this.state.selectedTreeItem.keyReporte+"_"+this.state.selectedTreeItem.argumentos[i].nombre];

      if (paramsURL.length>0)
          paramsURL = paramsURL + "&"; 
      paramsURL = paramsURL + this.state.selectedTreeItem.argumentos[i].nombre+"="+encodeURIComponent(dato);

    }

  
    let key = this.state.selectedTreeItem.keyReporte;

    let url = process.env.REACT_APP_WS_REPORTES_DINAMICOS;
    url = url.replace(":key", key);
    url = url.replace(":codOrganizacion", this.state.filtros.codOrganizacion);
    url = url.replace(":out", this.state.filtros.out);

    let reportTag = key.charAt(0).toUpperCase() + key.slice(1)
 
    if (paramsURL.length>0)
        url = url + "&" + paramsURL;

    if(this.state.filtros.out === "pdf"){

      fetch(url, {
        method: 'GET',
        headers:{
              'Accept': 'application/pdf',
              'Content-Type': 'application/pdf',
              'Authorization': 'Bearer ' + this.props.getKeyLogin()
              },
        }
      )
      .then(r => r.blob())
      .then(r => this.showPDF(r, "Reporte a Medida" + reportTag))
      .catch((error) => this.props.mensajeErrorGeneral())	

    }else if(this.state.filtros.out === "xls"){
      
      fetch(url, {
        method: 'GET',
        headers:{
              'Accept': 'application/pdf',
              'Content-Type': 'application/pdf',
              'Authorization': 'Bearer ' + this.props.getKeyLogin()
              },
        }
      )
      .then(r => r.blob())
      .then(r => this.showXLS(r, "Reporte a Medida " + reportTag))
      .catch((error) => this.props.mensajeErrorGeneral())	
    }
  
    

  }

  componentDidMount() {
    this.traerGruposDeReportes();  
  }

  traerGruposDeReportes() {

    let statusCode     = "";
    let cerrarSesion   = false;
    let url            = process.env.REACT_APP_WS_GRUPOS_REPORTES;
   
   
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

                let nuevoReportes = [];
                let i = 0;
                for(i=0;i<json.grupos.length;++i) {
                  let nodoReporte = {};
                  nodoReporte.id = 'KEY_GRUPO_'+json.grupos[i].id;
                  nodoReporte.text = json.grupos[i].descripcion;
                  nodoReporte.esGrupo = true;
                  nodoReporte.idGrupo = json.grupos[i].id;
                  
                 // nodoReporte.items.push({id:22323,text:'assas'});
                  nuevoReportes.push(nodoReporte);
                  

                  // Agregar los reportes
                  
                  //this.traerReportesDelGrupo(nodoReporte.id,nodoReporte);
                }

                //console.log();

                this.setState({reportes : nuevoReportes});              
                
   
              } else { 
                this.props.mensajeErrorWS('Grupos de reportes',json.errores,cerrarSesion);                     
              }
            })
        .catch((error) => {
          this.props.mensajeErrorGeneral();
        })		
        ;

  }

  traerReportesDelGrupo(Key , aParentId) {

    
    let statusCode     = "";
    let cerrarSesion   = false;
    let url            = process.env.REACT_APP_WS_REPORTES_DEL_GRUPO;
    url = url.replace(":idGrupo", Key);
   
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
                //nodoReporte.items = [{id:nroGrupo+"_1",text:'assas'}];
                return [{id: aParentId+"_1",text:'Sebastian',parentId: aParentId,hasItems: false}] ;

              } else { 
                this.props.mensajeErrorWS('Reportes del grupo',json.errores,cerrarSesion);                     
              }
            })
        .catch((error) => {
          this.props.mensajeErrorGeneral();
        })		
        ;

  }
  
  handleTipoSalida(){
    
    this.setState({tipoSalida : $("#fieldFormatSeleccionadaRep").val()})

  }

  consultaMovCtasCtesAgencias() {
  
    if (this.state.fecha==null) return;
    let formatFecDesde = encodeURIComponent(Moment(this.state.fecha).format('YYYYMMDD'));
    let organizacion   = this.getOrganizacionSel();

		let url = process.env.REACT_APP_WS_MOV_CTA_CTE_AGENCIAS;    
    url = url.replace(":codOrganizacion",organizacion);
    url = url.replace(":fecha",formatFecDesde); 

    let cerrarSesion = false;
    let statusCode = "";
    
    let parametros = {};


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
              if (this.state.tipoSalida === "PDF"){
              }else if (this.state.tipoSalida === "Excel"){
              }
              this.setState({dataSource : json.pedidos}); 
            } else { 
              this.props.mensajeErrorWS('Consulta de Movimientos Cta. Cte.',json.errores,cerrarSesion);                     
            }
          })
      .catch((error) => {
        this.props.mensajeErrorGeneral();
      })		
      ;


  }

  consultaPremiosMayoresA() {

    if (this.state.fecha==null) return;
    let formatFecDesde = encodeURIComponent(Moment(this.state.fecha).format('YYYYMMDD'));
    let organizacion   = this.getOrganizacionSel();

		let url = process.env.REACT_APP_WS_PREMIOS_MAYORES_A;    
    url = url.replace(":codOrganizacion",organizacion);
    url = url.replace(":fecha",formatFecDesde); 

    let cerrarSesion = false;
    let statusCode = "";
    
    let parametros = {};


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
          if (json.status=="ok") {

              if(this.state.tipoSalida === "Pantalla"){
                this.setState({dataSource : json.premios}); 
              }else if (this.state.tipoSalida === "PDF"){
              }else if (this.state.tipoSalida === "Excel"){
              }
              
            } else { 
              this.props.mensajeErrorWS('Consulta de premios Mayores',json.errores,cerrarSesion);                     
            }
          })
      .catch((error) => {
        this.props.mensajeErrorGeneral();
      })		
      ;

	
  }

  handleItemClick(e){
    
    this.state.selectedTreeItem = e.itemData; 

    this.setState({dataSource : []});
    this.setState({
      selectedTreeItem: e.itemData,
      tituloSelected : e.itemData.text
    });

    let j=1;

    for(j=1;j<=2;++j) {

          if (e.itemData.esReporte==true) {
          
            let i = 0;
            if (this.state.selectedTreeItem==null) return;
            if (this.state.selectedTreeItem.argumentos==null) return;
          
            let nuevoFiltro = {};
            let returnedTargetFiltros = Object.assign(nuevoFiltro, this.state.filtros);  

            for(i=0;i<this.state.selectedTreeItem.argumentos.length;++i) {
        
              let dato = null;
              if (this.state.selectedTreeItem.argumentos[i].tipo=='java.util.Date') {
                  if (this.state.selectedTreeItem.argumentos[i].defecto!=null) {
                    let dateMomentObject = Moment(this.state.selectedTreeItem.argumentos[i].defecto, "DD/MM/YYYY"); // 1st argument - string, 2nd argument - format
                    let dateObject = dateMomentObject.toDate(); // convert moment.js object to Date object
                    dato = dateObject;
                  }
          
              } else
                dato = this.state.selectedTreeItem.argumentos[i].defecto;

              let nombreCampo = this.state.selectedTreeItem.keyReporte+"_"+this.state.selectedTreeItem.argumentos[i].nombre;
        
              if (returnedTargetFiltros[nombreCampo]==null)
                  if (dato!=null)
                      returnedTargetFiltros[nombreCampo] = dato;

              this.setState({filtros : returnedTargetFiltros});
              this.setState({ state: this.state });

            }
          }
  
        

      //  Inicializar las variables del setState 

       /*let nuevoReporte = [];
       let i = 0;
       for(i=0;i<this.state.reportes.length;++i) {
         let grupoActual = this.state.reportes[i];
         grupoActual.items.push({id : grupoActual+"_1",test:"seas"});
         nuevoReporte.push(grupoActual);
         this.setState({reportes : nuevoReporte});
       }*/

    }

    //console.log(e.itemData.text)
    
  }

  getOrganizacionSel() {
    return $("#fieldorgSeleccionadaRep").val();
  }

  ejecutarConsulta() {

    if (this.state.selectedTreeItem=="1_1")
        this.consultaPremiosMayoresA();
    else
    if (this.state.selectedTreeItem=="2_1")
        this.consultaMovCtasCtesAgencias();
    
  }

  cambioFecha = function(e) { 
    this.setState({ fecha: e.value });
  } 

  createChildren(parent) {

    if (parent==null) return;

    if ((parent!=null) && (parent.itemData.esGrupo==false)) return;

    let aParentId = parent ? parent.itemData.id : '';
    let aIdGrupo = parent ? parent.itemData.idGrupo : '';

    let statusCode     = "";
    let cerrarSesion   = false;
    let url            = process.env.REACT_APP_WS_REPORTES_DEL_GRUPO;
    url = url.replace(":idGrupo", aIdGrupo);
   
    return fetch(url,{ 
        method: 'GET',
        headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
                },
        })
        .then(respPromise => {
            statusCode = respPromise.status;
            if (respPromise.status==process.env.REACT_APP_CODIGO_CERRO_SESION) {
                cerrarSesion = true;
            }
            return respPromise.json();
        })
        .then(json => {
            if (json.status==="ok") {
                //nodoReporte.items = [{id:nroGrupo+"_1",text:'assas'}];
                let reportes = json.reportes;
                let listaReportes = [];
                let j = 0;
                for(j=0;j<reportes.length;++j) {

                  let nodoReporte = {};

                  nodoReporte.id = "Rep_"+reportes[j].id;
                  nodoReporte.keyReporte = reportes[j].key;
                  nodoReporte.parentId = aParentId;
                  nodoReporte.text = reportes[j].titulo;
                  nodoReporte.hasItems = false;
                  nodoReporte.esReporte = true;
                  nodoReporte.argumentos = reportes[j].argumentos;
             

                  listaReportes.push(nodoReporte);
                }
                return listaReportes; //[{id: aParentId+"_1",text:'Sebastian',parentId: aParentId,hasItems: false}] ;

              } else { 
                this.props.mensajeErrorWS('Reportes del grupo',json.errores,cerrarSesion);                     
              }
            })
        .catch((error) => {
          this.props.mensajeErrorGeneral();
        })		
        ;

  
  }

  paramArmadoCampo(parametro) {

    let filtro = null;

    if ((parametro.tipo == 'java.util.Date') && (parametro.obligatorio)) {
      filtro = (
        <GroupItem>
          <SimpleItem
            dataField={this.state.selectedTreeItem.keyReporte+"_"+parametro.nombre}
            editorType="dxDateBox"
            editorOptions={this.dateOptions}
          >
              <RequiredRule message={parametro.descripcion+' requerido.'} />
            <Label text={parametro.descripcion}></Label>
          </SimpleItem>
        </GroupItem>
      );
    } else
    if ((parametro.tipo == 'java.util.Date') && (!parametro.obligatorio)) {
      filtro = (
        <GroupItem>
          <SimpleItem
            dataField={this.state.selectedTreeItem.keyReporte+"_"+parametro.nombre}
            editorType="dxDateBox"
            editorOptions={this.dateOptions}
          >
            <Label text={parametro.descripcion}></Label>
          </SimpleItem>
        </GroupItem>
      );
    } else
      if ((parametro.tipo == 'java.lang.String') && parametro.obligatorio) {
        filtro = (
          <GroupItem>
            <SimpleItem
              dataField={this.state.selectedTreeItem.keyReporte+"_"+parametro.nombre}
            >
              <RequiredRule message={parametro.descripcion+' requerido.'} />
              
              <Label text={parametro.descripcion}></Label>
            </SimpleItem>
          </GroupItem>
        )
      } else 
      if ((parametro.tipo == 'java.lang.String') && !parametro.obligatorio) {
        filtro = (
          <GroupItem>
            <SimpleItem
              dataField={this.state.selectedTreeItem.keyReporte+"_"+parametro.nombre}
            >
              <Label text={parametro.descripcion}></Label>
            </SimpleItem>
          </GroupItem>
        )
      } else
        if (((parametro.tipo == 'java.lang.Integer') || (parametro.tipo == 'java.math.BigDecimal')) && (parametro.obligatorio)) {
          filtro = (
            <GroupItem>
              <SimpleItem
                dataField={this.state.selectedTreeItem.keyReporte+"_"+parametro.nombre}
                editorType="dxNumberBox"
                val={2}
              >
                <RequiredRule message={parametro.descripcion+' requerido.'} /> 
                <Label text={parametro.descripcion}></Label>
              </SimpleItem>
            </GroupItem>
          );
        } else
        if (((parametro.tipo == 'java.lang.Integer') || (parametro.tipo == 'java.math.BigDecimal')) && (!parametro.obligatorio)) {
          filtro = (
            <GroupItem>
              <SimpleItem
                dataField={this.state.selectedTreeItem.keyReporte+"_"+parametro.nombre}
                editorType="dxNumberBox"
              >
                <Label text={parametro.descripcion}></Label>
              </SimpleItem>
            </GroupItem>
          );
        } else        
          if ((parametro.tipo == 'java.lang.Boolean')) {
            filtro = (
              <GroupItem>
                <SimpleItem
                  dataField={this.state.selectedTreeItem.keyReporte+"_"+parametro.nombre}
                  editorType="dxCheckBox"
                >
                   
                  <Label text={parametro.descripcion}></Label>
                </SimpleItem>
              </GroupItem>
            );
          }

    return filtro;
  }

  render() {
 
    let jsxOrganizacionesHabilitadas = null;

      
    if (this.props.getOrganizaciones() !== undefined) {
        jsxOrganizacionesHabilitadas = this.props.getOrganizaciones().map(
        (organizacion) => 
        <option value={organizacion.codigo}>{organizacion.descripcion}</option>
        );
    }

    let armadoFiltrosArgumentosDinamicos = null;
    if ((this.state.selectedTreeItem!=null) && (this.state.selectedTreeItem.esReporte==true))
      armadoFiltrosArgumentosDinamicos = this.state.selectedTreeItem.argumentos.map(
        (parametro, index) =>
          <GroupItem>
            {1 == 1 && this.paramArmadoCampo(parametro)}
          </GroupItem>
    );

    let formFiltroDinamico = (
      <Animated animationIn="fadeIn" className="log-container col-sm-9 mt-3 w-90 mx-auto" > 
      <form action="your-action" onSubmit={this.handleSubmit} id="reportesMedida">
      <Form formData={this.state.filtros} >

        <GroupItem cssClass="first-group">

          <GroupItem>
            <SimpleItem
              dataField="codOrganizacion"
              editorType="dxSelectBox"
              editorOptions={{
                items: this.props.getOrganizaciones(),
                displayExpr: 'descripcion',
                valueExpr: 'codigo'
              }}
            >
              
              <RequiredRule message={'Organización requerida.'} />
              
              <Label text="Organización"></Label>
            </SimpleItem>
          </GroupItem>

          {1 == 1 && armadoFiltrosArgumentosDinamicos}

          <GroupItem>
            <SimpleItem
              dataField="out"
              editorType="dxSelectBox"
              editorOptions={{
                items: this.state.salidas,
                displayExpr: 'descripcion',
                valueExpr: 'codigo'
              }}
            >
              
              <RequiredRule message={'Debe seleccionar una salida.'} />
              
              <Label text="Salida"></Label>
            </SimpleItem>
          </GroupItem>


        </GroupItem>

        <ButtonItem horizontalAlignment="left"
          buttonOptions={this.buttonOptions} 
        />

       
      </Form>
      </form>
      </Animated>
    );

    let jsxTipoSalida = (
                          <div>
                              <label htmlFor="fieldFormatSeleccionadaRep" className="mb-0"><b>Tipo de Salida</b></label> 
                              <br/>                          
                              <select name="org" id="fieldFormatSeleccionadaRep" onChange={this.handleTipoSalida} className="select w-100">
                                <option>Excel</option>
                                <option>PDF</option>
                              </select>
                          </div>
                        )

 
    return (
      <Animated animationIn="fadeIn">
          <div className="p-2 bg-light mt-2">
              <h4 className="bg-dark p-2 text-center text-light mx-auto mb-2">

                Panel de Reportes a Medida

                {this.state.tituloSelected!= null && <span>  -  {this.state.tituloSelected}</span>}
              </h4>    
              <div className="form row pr-4 pl-4  pb-4 pt-2">
    
                <div className="col sm-3">
                    <TreeView id="treeview"
                      items={this.state.reportes}
                      dataStructure="plain"
                      width={300}
                      height={500}
                      onItemClick={this.handleItemClick}
                      createChildren={this.createChildren}/>
                </div>
    
                {this.state.selectedTreeItem!=null && this.state.selectedTreeItem.esReporte === true && formFiltroDinamico}
              </div>
          </div>
      </Animated>
    );
  }
}

export default ReportesMedida;
