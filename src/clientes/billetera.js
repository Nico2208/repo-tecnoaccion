import React from 'react';

import DataGrid, { Column, Pager, Paging, Export, Sorting } from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';

import $ from 'jquery';
import Moment from 'moment';
import fetchTimeout from 'fetch-timeout';
import NumberFormat from 'react-number-format';


import Form, {
  SimpleItem,
  GroupItem,
  Label
} from 'devextreme-react/form';
import 'devextreme-react/text-area';
import M from 'minimatch';


class Billetera extends React.Component {

  constructor(props) {		
    super(props);

    /*

    this.state = {
      totalPages: "",
      totalItems:"",
      currentPage:"",
      paginado:false,
      filtros: {
        fechaDesde : null,
        fechaHasta : null
      },
      billetera : []
    }*/

    this.dateOptions = { 
        displayFormat: 'dd/MM/yyyy',
        pickerType: "calendar",
        format: "date",
    };

    this.formatImporte = {
      displayFormat: '###,###,###,##0.00'
    };


    this.handleMovimientos              = this.handleMovimientos.bind(this);
    this.addPage                        = this.addPage.bind(this);
    this.removePage                     = this.removePage.bind(this);
    this.firstPage                     = this.firstPage.bind(this);
    this.lastPage                      = this.lastPage.bind(this);
    this.formFieldDataChanged           = this.formFieldDataChanged.bind(this);
    this.inicializarBilletera           = this.inicializarBilletera.bind(this);

    this.props.traerTiposMovBilletera();

  }

  inicializarBilletera() {
    this.props.inicializarBilletera();
  }

  formFieldDataChanged(e) {

    this.inicializarBilletera();

    if(e.dataField==="fechaDesde") {
      this.props.cambioFechaDesdeBilletera(e.value);
    }
  }

  firstPage(){
    $("#pagConsCupon").val(1); 
    this.ejecutarConsultarBilletera(Number($("#pagConsCupon").val()));
  }

  lastPage(){

    $("#pagConsCupon").val(this.props.billetera.totalPages); 
    this.ejecutarConsultarBilletera(Number($("#pagConsCupon").val()));
    
  }

  addPage(){
    if (Number($("#pagConsCupon").val())<this.props.billetera.totalPages) 
      $("#pagConsCupon").val(Number($("#pagConsCupon").val())+1);
    else
      $("#pagConsCupon").val(this.props.billetera.totalPages);
    this.ejecutarConsultarBilletera(Number($("#pagConsCupon").val()));
  }

  removePage(){
    if (Number($("#pagConsCupon").val())>1)
        $("#pagConsCupon").val(Number($("#pagConsCupon").val())-1);
    else
        $("#pagConsCupon").val(1); 

    this.ejecutarConsultarBilletera(Number($("#pagConsCupon").val()));
  }

  handleChangePagina(e) {
    if (e.target.value.length==0) return;
    if (!((Number($("#pagConsCupon").val())>=1) && 
       (Number($("#pagConsCupon").val())<=this.props.billetera.totalPages))) 
        this.ejecutarConsultarBilletera(1);
    else
      this.ejecutarConsultarBilletera(Number(e.target.value));
  }

  ejecutarConsultarBilletera(pagina) {
     this.props.ejecutarConsultarBilletera(pagina);          
  }

  handleMovimientos() {

    this.ejecutarConsultarBilletera(1);   

  }


  render() {
      return (
        <div className="bg-light p-3 border" style={{maxHeight: $("#panelResultados").height() - 45}}>

        <div className="mb-3">
          <Form formData={this.props.billetera.filtros} onFieldDataChanged={this.formFieldDataChanged}>
              <GroupItem cssClass="first-group" colCount={9}>
                <GroupItem colSpan={2}>
                <SimpleItem 
                    dataField="fechaDesde"
                    editorType="dxDateBox"
                    editorOptions={this.dateOptions}
                    value={this.props.billetera.filtros.fechaDesde}
                  >
                  <Label text="Desde"></Label>
                </SimpleItem>
                </GroupItem>
  
                <GroupItem colSpan={2}>
                <SimpleItem
                    dataField="fechaHasta"
                    editorType="dxDateBox"
                    editorOptions={this.dateOptions}
                    value={this.props.billetera.filtros.fechaHasta}
                  >
                    <Label text="Hasta"></Label>
                </SimpleItem>
                </GroupItem>

                <GroupItem colSpan={3}>  
                  <SimpleItem
                    dataField="tipo"
                    editorType="dxSelectBox"
                    editorOptions={
                      this.props.billetera.filtros.tiposOptions
                    }
                     />
                </GroupItem>
  
                  
  
                <GroupItem colSpan={2}>
                
                  <button type="button"className="btn btn-dark" onClick={this.handleMovimientos}>
                                  <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                  <b>Billetera</b>
                  </button>
                 </GroupItem>
              </GroupItem>
              
  
          </Form>
        </div>
        <div className="row w-100 mx-auto">
         
            <div className="col-sm-6 p-1 border">
              <b>Saldo: <NumberFormat value={this.props.billetera.billetera.saldo} displayType={'text'} thousandSeparator={"."} decimalSeparator={","} prefix={' $ '} decimalScale={2} fixedDecimalScale={true} isNumericString={true} /></b>
            </div>
         

            
            <div className="col-sm-6 p-1 border">
              <b>Retirable: <NumberFormat value={this.props.billetera.billetera.saldoRetirable} displayType={'text'} thousandSeparator={"."} decimalSeparator={","} prefix={' $ '} decimalScale={2} fixedDecimalScale={true} isNumericString={true} /></b>
            </div>
          
        </div>

            <DataGrid
              dataSource={this.props.billetera.billetera.items}
              showBorders={true}
              keyExpr='id'
              focusedRowEnabled={true}
            >
              <Paging enabled={false} />
              <Sorting mode="none" />
      
              <Column dataField="fecha" dataType="date" format="dd/MM/yyyy HH:mm:ss" />
              <Column dataField="importe" format={this.formatImporte} />
              <Column dataField="concepto" />
              <Column dataField="tipoMovimiento" />
            </DataGrid>

            {this.props.billetera.paginado === true &&
            <div className="mt-2">
              <label htmlFor="paginador">Pagina</label>

              <a  onClick={this.firstPage} style={{cursor:"pointer"}} className="ml-1">
                <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false" style={{marginRight:"-9px"}}></span>
                <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span>
              </a>

              <a onClick={this.removePage} ><span style={{cursor:"pointer"}}className="iconify ml-1" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span></a>

              <input 
                  className="mr-1 ml-1 text-center" 
                  type="number" 
                  id="pagConsCupon" 
                  style={{width:"30px"}}
                  placeholder={this.props.billetera.currentPage+1} 
                  onBlur={(e) => {this.handleChangePagina(e)}}
              />

              <a onClick={this.addPage}><span style={{cursor:"pointer"}}className="iconify mr-1" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span></a>

              <a  onClick={this.lastPage} style={{cursor:"pointer"}} className="mr-1">
                <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span>
                <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false" style={{marginLeft:"-9px"}}></span>
              </a>
              
              <span>de {this.props.billetera.billetera.totalPages} ({this.props.billetera.billetera.totalItems} registros) </span>
            </div>
            }
        </div>
      );
    }
  }

export default Billetera;

