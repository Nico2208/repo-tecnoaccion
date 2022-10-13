import React from 'react';
import TreeView from 'devextreme-react/tree-view';
import $ from 'jquery';

import { Animated } from 'react-animated-css';
import itemsReportes from './data.js';
import Moment from 'moment';
import fetchTimeout from 'fetch-timeout';
  
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import esMessages from "devextreme/localization/messages/es.json";
import { locale, loadMessages } from "devextreme/localization";

import { NumberBox } from 'devextreme-react/number-box';
import DataGrid, { Column, Export , Summary, TotalItem } from 'devextreme-react/data-grid';

import DateBox from 'devextreme-react/date-box';




class Reportes extends React.Component {
  constructor(props) {
    super(props);

    loadMessages(esMessages);
    locale(navigator.language);

    this.dateOptions = { 
      displayFormat: 'dd/MM/yyyy',
      pickerType: "calendar",
      format: "date",
    };

    this.formatImporte = {
      displayFormat: '###,###,###,##0.00'
    }

   
    this.state = {
      dataSource : [],
      fecha : null,
      fechaDesde: null,
      fechaHasta: null,
      reportes: itemsReportes.getReportes(),
      selectedTreeItem: undefined,
      tituloSelected : null,
      tipoSalida : "Pantalla",
      importe: null

    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.ejecutarConsulta = this.ejecutarConsulta.bind(this);
    this.consultaPremiosMayoresA = this.consultaPremiosMayoresA.bind(this);
    this.consultaMovCtasCtesAgencias = this.consultaMovCtasCtesAgencias.bind(this);
    this.getOrganizacionSel = this.getOrganizacionSel.bind(this);
    this.cambioFecha = this.cambioFecha.bind(this);
    this.handleTipoSalida = this.handleTipoSalida.bind(this);
    this.cambioFechaDesde = this.cambioFechaDesde.bind(this);
    this.cambioFechaHasta = this.cambioFechaHasta.bind(this);
    this.handleImporte = this.handleImporte.bind(this);
    this.showPDF     = this.showPDF.bind(this);
    this.showXLS     = this.showXLS.bind(this);
    //console.log(this.props.getOrganizaciones());
    this.formatDate = this.formatDate.bind(this);
    
    this.reportes = itemsReportes.getReportes();
    //this.initMessages();
    locale(this.state.locale);
    
  }


  handleImporte(e){
    this.setState({importe: e.value});
    console.log(e.value);
  }  
  
  handleTipoSalida(){
    
    this.setState({tipoSalida : $("#fieldFormatSeleccionadaRep").val()})

  }

  consultaMovCtasCtesAgencias() {

    if (this.state.fechaDesde==null) {
      $.confirm({
        title: "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>",
        backgroundDismiss: true,
        columnClass: 'medium',
        animation: 'zoom',
        closeIcon: true,
        closeAnimation: 'scale',
        content: `<h4 class="text-center mb-4">
                    Debe ingresar fecha desde
                  </h4>`,
        buttons: {
            No: {
                text: "Aceptar",
                action: function () { }
            }
        }
    });
      return
    };
    if (this.state.fechaHasta==null) {
      $.confirm({
        title: "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>",
        backgroundDismiss: true,
        columnClass: 'medium',
        animation: 'zoom',
        closeIcon: true,
        closeAnimation: 'scale',
        content: `<h4 class="text-center mb-4">
                    Debe ingresar fecha hasta
                  </h4>`,
        buttons: {
            No: {
                text: "Aceptar",
                action: function () { }
            }
        }
    });
      return
    };

    let formatFecDesde = encodeURIComponent(Moment(this.state.fechaDesde).format('YYYYMMDD'));
    let formatFecHasta = encodeURIComponent(Moment(this.state.fechaHasta).format('YYYYMMDD'));
    let organizacion   = this.getOrganizacionSel();
    let out = this.state.tipoSalida

		let url = process.env.REACT_APP_WS_MOV_CTA_CTE_AGENCIAS;    
    url = url.replace(":codOrganizacion",organizacion);
    url = url.replace(":desde",formatFecDesde);
    url = url.replace(":hasta",formatFecHasta);


    let cerrarSesion = false;
    let statusCode = "";
    
    let parametros = {};

    if(this.state.tipoSalida === "pdf" || this.state.tipoSalida === "xls"){
      let urlArchivo = process.env.REACT_APP_WS_REPORTE_MOV_CTA_CTE_AGENCIAS;
      urlArchivo = urlArchivo.replace(":key","movage");
      urlArchivo = urlArchivo.replace(":codOrganizacion",organizacion);
      urlArchivo = urlArchivo.replace(":out",out);
      urlArchivo = urlArchivo.replace(":desde",formatFecDesde);
      urlArchivo = urlArchivo.replace(":hasta",formatFecHasta);

      if(this.state.tipoSalida === "pdf"){

        fetch(urlArchivo, {
          method: 'GET',
          headers:{
                'Accept': 'application/pdf',
                'Content-Type': 'application/pdf',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
                },
          }
        )
        .then(r => r.blob())
        .then(r => this.showPDF(r, "Totales por Agencias" + formatFecDesde + " - " + formatFecHasta))
        .catch((error) => this.props.mensajeErrorGeneral())	

      }else if(this.state.tipoSalida === "xls"){

        fetchTimeout(urlArchivo, {
          method: 'GET',
          headers:{
                
                'Content-Type': 'application/vnd.ms-excel',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
                },
          }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
          
        .then(r => r.blob())
        .then(r =>  this.showXLS(r, "Totales por Agencias" + formatFecDesde + " - " + formatFecHasta))
        .catch((error) => this.props.mensajeErrorGeneral())		
    
      }
    }

    if(this.state.tipoSalida === "Pantalla"){
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

                this.setState({dataSource : json.premios}); 
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
  }

  consultaPremiosMayoresA() {

    if (this.state.fechaDesde==null) {
      $.confirm({
        title: "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>",
        backgroundDismiss: true,
        columnClass: 'medium',
        animation: 'zoom',
        closeIcon: true,
        closeAnimation: 'scale',
        content: `<h4 class="text-center mb-4">
                    Debe ingresar fecha desde
                  </h4>`,
        buttons: {
            No: {
                text: "Aceptar",
                action: function () { }
            }
        }
    });
      return
    };
    if (this.state.fechaHasta==null) {
      $.confirm({
        title: "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>",
        backgroundDismiss: true,
        columnClass: 'medium',
        animation: 'zoom',
        closeIcon: true,
        closeAnimation: 'scale',
        content: `<h4 class="text-center mb-4">
                    Debe ingresar fecha hasta
                  </h4>`,
        buttons: {
            No: {
                text: "Aceptar",
                action: function () { }
            }
        }
    });
      return
    };
    if (this.state.importe==null){
          $.confirm({
            title: "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>",
            backgroundDismiss: true,
            columnClass: 'medium',
            animation: 'zoom',
            closeIcon: true,
            closeAnimation: 'scale',
            content: `<h4 class="text-center mb-4">
                        Debe ingresar importe
                      </h4>`,
            buttons: {
                No: {
                    text: "Aceptar",
                    action: function () { }
                }
            }
        });
        return
    };

    let formatFecDesde = encodeURIComponent(Moment(this.state.fechaDesde).format('YYYYMMDD'));
    let formatFecHasta = encodeURIComponent(Moment(this.state.fechaHasta).format('YYYYMMDD'));
    let organizacion   = this.getOrganizacionSel();
    let importe        = this.state.importe;
    let out            = this.state.tipoSalida;

		let url = process.env.REACT_APP_WS_PREMIOS_MAYORES_A;    
    url = url.replace(":codOrganizacion",organizacion);

    url = url.replace(":desde",formatFecDesde);
    url = url.replace(":hasta",formatFecHasta);
    url = url.replace(":importe",this.state.importe);
    
    let cerrarSesion = false;
    let statusCode = "";
    
    let parametros = {};

    if(this.state.tipoSalida === "pdf" || this.state.tipoSalida === "xls"){
      
      let urlArchivo = process.env.REACT_APP_WS_REPORTE_PREMIOS_MAYORES;
      
      
      urlArchivo = urlArchivo.replace(":key","uif");
      urlArchivo = urlArchivo.replace(":codOrganizacion", organizacion);
      urlArchivo = urlArchivo.replace(":out",out);
      urlArchivo = urlArchivo.replace(":importe",importe);
      urlArchivo = urlArchivo.replace(":desde",formatFecDesde);
      urlArchivo = urlArchivo.replace(":hasta",formatFecHasta);

      if(this.state.tipoSalida === "pdf"){

        fetch(urlArchivo, {
          method: 'GET',
          headers:{
                'Accept': 'application/pdf',
                'Content-Type': 'application/pdf',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
                },
          }
        )
        .then(r => r.blob())
        .then(r => this.showPDF(r, "Premios Mayores Uif" + formatFecDesde + " - " + formatFecHasta))
        .catch((error) => this.props.mensajeErrorGeneral())	

      }else if(this.state.tipoSalida === "xls"){

        fetchTimeout(urlArchivo, {
          method: 'GET',
          headers:{
                
                'Content-Type': 'application/vnd.ms-excel',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
                },
          }, process.env.REACT_APP_FETCH_TIMEOUT, 'Error de timeout')
          
        .then(r => r.blob())
        .then(r =>  this.showXLS(r, "Premios Mayores Uif " + formatFecDesde + " - " + formatFecHasta))
        .catch((error) => this.props.mensajeErrorGeneral())		
    
      }
    }

    if(this.state.tipoSalida === "Pantalla"){
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
          if (json.status=="ok") {
                this.setState({dataSource : json.premios}); 
            } else { 
              this.props.mensajeErrorWS('Consulta de premios Mayores',json.errores,cerrarSesion);                     
            }
          })
      .catch((error) => {
        this.props.mensajeErrorGeneral();
      })		
      ;
    }
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

  handleItemClick(e){
    this.setState({dataSource : []});
    this.setState({
      selectedTreeItem: e.itemData.id,
      tituloSelected : e.itemData.text
    });
    this.handleTipoSalida();

    console.log(e.itemData.text)
    
  }

  getOrganizacionSel() {
    return $("#fieldorgSeleccionadaRep").val();
  }

  ejecutarConsulta() {

    if (this.state.selectedTreeItem==="1_1")
        this.consultaPremiosMayoresA();
    else
    if (this.state.selectedTreeItem==="2_1")
        this.consultaMovCtasCtesAgencias();
    
  }

  cambioFecha = function(e) { 
    this.setState({ fecha: e.value });
  } 

  cambioFechaDesde = function(e) { 
    this.setState({ fechaDesde: e.value });
  } 

  cambioFechaHasta = function(e) { 
    this.setState({ fechaHasta: e.value });
  } 

  //  format fecha listado
  fechaFormat = {  day: 'numeric', month: 'numeric', year: 'numeric'};

  
  formatDate(string){
		var date = new Date();
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(string).toLocaleDateString(["es-ES"],options);
  }
  
  formatDates(string){
		var date = new Date();
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(string).toLocaleDateString(["es-ES"],options);
  }

  render() {
 
    let jsxOrganizacionesHabilitadas = null;

      
    if (this.props.getOrganizaciones() !== undefined) {
        jsxOrganizacionesHabilitadas = this.props.getOrganizaciones().map(
        (organizacion) => 
        <option key={organizacion.codigo} value={organizacion.codigo}>{organizacion.descripcion}</option>
        );
    }

    let jsxTipoSalida = (
                          <div>
                              <label htmlFor="fieldFormatSeleccionadaRep" className="mb-0"><b>Tipo de Salida</b></label> 
                              <br/>                          
                              <select name="org" id="fieldFormatSeleccionadaRep" onChange={this.handleTipoSalida} className="select w-100">
                                <option>Pantalla</option>
                                <option>xls</option>
                                <option>pdf</option>
                              </select>
                          </div>
                        )

    let jsxPremiosMayoresA = (
    <Animated animationIn="fadeIn" className="log-container col-sm-9">                    
      <div className="row">

        <div className="col-sm-6">
          <label htmlFor="fieldorgSeleccionadaRep" className="mb-0"><b>Seleccione Organización</b></label>
          <br/>                         
          <select name="org" id="fieldorgSeleccionadaRep" className="select w-100">{jsxOrganizacionesHabilitadas}</select>
        </div>

        <div className="col-sm-6">
          {jsxTipoSalida}
        </div>       

      </div>

      <div className="row mt-2">

        <div className="col-sm-3">
            <span><b>Fecha Desde</b></span>    
            <DateBox id="fechaDesde" defaultValue={this.state.fechaDesde} type="date" displayFormat="dd/MM/yyyy"  onValueChanged={this.cambioFechaDesde} />
        </div>

        <div className="col-sm-3">
            <span><b>Fecha Hasta</b></span>    
            <DateBox id="fechaHasta" defaultValue={this.state.fechaHasta} type="date" displayFormat="dd/MM/yyyy"  onValueChanged={this.cambioFechaHasta} />
        </div>

          <div className="col-sm-3">
              <span><b>Importe</b></span>    
              <NumberBox defaultValue={""} onValueChanged={this.handleImporte}/>
        </div>

        <div className="col-sm-3 mt-3 text-center">
              <button type="button"className="btn btn-dark w-90" onClick={this.ejecutarConsulta} >
                <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                <b>Generar</b>
              </button>
        </div>

      </div> 
        {/*<div className="offset-sm-1 col-sm-2">
          
        </div>*/}
  
      <hr className="mb-0"/>
  
      <div>
        <DataGrid
          id="gridContainer"
          dataSource={this.state.dataSource}
          showBorders={true}>
          <Export enabled={true} fileName="PremiosMayoresA" allowExportSelectedData={true} />
          <Column dataField="fecha" 
                  caption="Fecha" 
                  dateSerializationFormat="dd-MM-yyyy" 
                  format={this.fechaFormat} 
                  onValueChanged={this.formatDates} />
          <Column dataField="documento" />
          <Column dataField="usuario" />
          <Column dataField="agencia" />
          <Column dataField="premios" format={this.formatImporte}  />
          

          <Summary>
            <TotalItem
              column="premios"
              summaryType="sum"
              valueFormat="currency"
              caption="" />
          </Summary>

        </DataGrid>
      </div>
    </Animated>
    );

    let jsxMovCtaCteAgencias = (
      <Animated animationIn="fadeIn" className="log-container col-sm-9">                    
      <div className="row">
        <div className="col-sm-6">

            <label htmlFor="fieldorgSeleccionadaRep" className="mb-0"><b>Seleccione Organización</b></label>
            <br/>                     
            <select name="org" id="fieldorgSeleccionadaRep" className="select w-100">{jsxOrganizacionesHabilitadas}</select>

        </div>

        <div className="col-sm-6">
              <div className="col-sm-12">

              {jsxTipoSalida}
              </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-sm-3">
          <span><b>Fecha Desde</b></span> 
          <DateBox defaultValue={this.state.fechaDesde} type="date" displayFormat="dd/MM/yyyy"  onValueChanged={this.cambioFechaDesde} />
        </div>

        <div className="col-sm-3">
          <span><b>Fecha Hasta</b></span> 
          <DateBox defaultValue={this.state.fechaHasta} type="date" displayFormat="dd/MM/yyyy"  onValueChanged={this.cambioFechaHasta} />
        </div>
  
        <div className="col-sm-3 offset-sm-2 mt-3 text-right">
          <button type="button"className="btn btn-dark w-90" onClick={this.ejecutarConsulta} >
            <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
            <b>Generar</b>
          </button>
        </div>
  
      </div>
  
      <hr className="mb-0"/>
  
      <div>
        <DataGrid
          id="gridContainer"
          dataSource={this.state.dataSource}
          showBorders={true}>
          <Export enabled={true} fileName="MovCtaCte" allowExportSelectedData={true} />

          <Column dataField="fecha" caption="Fecha" dateSerializationFormat="dd-MM-yyyy" format={this.fechaFormat} onValueChanged={this.formatDate} />
          <Column dataField="documento" />
          <Column dataField="usuario" />
          <Column dataField="age" />
          <Column dataField="sub" />
          <Column dataField="depositos" format={this.formatImporte} caption="Depósitos" />
          <Column dataField="pedidos" format={this.formatImporte} caption="Sol. Retiros" />
          <Column dataField="anulaciones" format={this.formatImporte} caption="Anul. Sol. Ret." />

          <Summary>
            <TotalItem
              column="depositos"
              summaryType="sum"
              valueFormat="currency"
              caption="" />
              <TotalItem
              column="pedidos"
              summaryType="sum"
              valueFormat="currency" />
                  <TotalItem
              column="anulaciones"
              summaryType="sum"
              valueFormat="currency" />
          </Summary>

        </DataGrid>
      </div>
    </Animated>
    );
  
    return (
      <Animated animationIn="fadeIn">
          <div className="p-2 bg-light mt-2">
              <h4 className="bg-dark p-2 text-center text-light mx-auto mb-2">

                Panel de Reportes Estándar

                {this.state.tituloSelected!= null && <span>  -  {this.state.tituloSelected}</span>}
              </h4>    
              <div className="form row pr-4 pl-4  pb-4 pt-2">
    
                <div className="col sm-3">
                    <TreeView id="treeview"
                      items={this.state.reportes}
                      width={300}
                      height={500}
                      onItemClick={this.handleItemClick}/>
                </div>
    
                {/* Reportes premios mayores */}
                {this.state.selectedTreeItem === "1_1" && jsxPremiosMayoresA}
                {this.state.selectedTreeItem === "2_1" && jsxMovCtaCteAgencias}
   
              </div>
          </div>
      </Animated>
    );
  }
}

export default Reportes;
