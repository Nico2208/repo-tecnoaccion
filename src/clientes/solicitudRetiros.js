import React from 'react';

import DataGrid, { Column, Pager, Paging , Sorting} from 'devextreme-react/data-grid';
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


class SolicitudRetiros extends React.Component {

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
    }

    this.handleMovimientos              = this.handleMovimientos.bind(this);
    this.addPage                        = this.addPage.bind(this);
    this.removePage                     = this.removePage.bind(this);
    this.firstPage                      = this.firstPage.bind(this); 
    this.lastPage                       = this.lastPage.bind(this);
    this.formFieldDataChanged           = this.formFieldDataChanged.bind(this);
    this.inicializarSolicitudRetiros    = this.inicializarSolicitudRetiros.bind(this);
    this.ClickCambiarAgenciaAmiga       = this.ClickCambiarAgenciaAmiga.bind(this);
    this.isMostrarIconoCambioAgencia    = this.isMostrarIconoCambioAgencia.bind(this);


  }

  isMostrarIconoCambioAgencia(e) {
      return e.row.data.estado==="RETIRABLE" && e.row.data.agRetiroPagadora===true;
  }

  ClickCambiarAgenciaAmiga(e) {


    let objThis = this;
    let aId = e.row.data.id;

		$.confirm({
			title: "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>",
			backgroundDismiss: true,
			columnClass: 'medium',
			animation: 'zoom',
			closeIcon: true,
			closeAnimation: 'scale',
			content: `<h3 class="text-center mb-4">
						¿Retirar en la agencia amiga?  
					 </h3>`,
			buttons: {				
				No: {
					text: "No",
					action : function () {}
				} 
				,
				Si: {
					text : "Si",	
					action: function () {
            objThis.props.cambiarSolRetiroConAgenciaAmiga(aId);
					}
				}

			}
		});

      

  }

  inicializarSolicitudRetiros() {
    this.props.inicializarSolicitudRetiros();
  }

  formFieldDataChanged(e) {

    this.inicializarSolicitudRetiros();

    if(e.dataField==="fechaDesde") {
      this.props.cambioFechaDesdeSolicitudRetiro(e.value);
    }
  }

  firstPage(){
    $("#pagConsCupon").val(1); 
    this.ejecutarConsultar(Number($("#pagConsCupon").val()));
  }

  lastPage(){

    $("#pagConsCupon").val(this.props.solicitudRetiros.totalPages); 
    this.ejecutarConsultar(Number($("#pagConsCupon").val()));
    
  }

  addPage(){
    if (Number($("#pagConsCupon").val())<this.props.solicitudRetiros.totalPages) 
      $("#pagConsCupon").val(Number($("#pagConsCupon").val())+1);
    else
      $("#pagConsCupon").val(this.props.solicitudRetiros.totalPages);
    this.ejecutarConsultar(Number($("#pagConsCupon").val()));
  }

  removePage(){
    if (Number($("#pagConsCupon").val())>1)
        $("#pagConsCupon").val(Number($("#pagConsCupon").val())-1);
    else
        $("#pagConsCupon").val(1); 

    this.ejecutarConsultar(Number($("#pagConsCupon").val()));
  }

  handleChangePagina(e) {
    if (e.target.value.length==0) return;
    if (!((Number($("#pagConsCupon").val())>=1) && 
       (Number($("#pagConsCupon").val())<=this.props.solicitudRetiros.totalPages))) 
        this.ejecutarConsultar(1);
    else
      this.ejecutarConsultar(Number(e.target.value));
  }

  ejecutarConsultar(pagina) {
     this.props.ejecutarConsultarSolRetiros(pagina);          
  }


  handleMovimientos() {

    this.ejecutarConsultar(1);   

  }


  render() {
      return (
        <div className="bg-light p-3 border" style={{maxHeight: $("#panelResultados").height() - 45}}>

        <div className="mb-3">
          <Form formData={this.props.solicitudRetiros.filtros} onFieldDataChanged={this.formFieldDataChanged}>
              <GroupItem cssClass="first-group" colCount={9}>
                <GroupItem colSpan={2}>
                <SimpleItem 
                    dataField="fechaDesde"
                    editorType="dxDateBox"
                    editorOptions={this.dateOptions}
                    value={this.props.solicitudRetiros.filtros.fechaDesde}
                  >
                  <Label text="Desde"></Label>
                </SimpleItem>
                </GroupItem>
  
                <GroupItem colSpan={2}>
                <SimpleItem
                    dataField="fechaHasta"
                    editorType="dxDateBox"
                    editorOptions={this.dateOptions}
                    value={this.props.solicitudRetiros.filtros.fechaHasta}
                  >
                    <Label text="Hasta"></Label>
                </SimpleItem>
                </GroupItem>

         
                <GroupItem colSpan={2}>
                
                  <button type="button"className="btn btn-dark" onClick={this.handleMovimientos}>
                                  <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                  <b>Sol. Retiros</b>
                  </button>
                 </GroupItem>
              </GroupItem>
              
  
          </Form>
        </div>
      

            <DataGrid
              dataSource={this.props.solicitudRetiros.solicitudRetiros}
              showBorders={true}
              keyExpr='id'
              focusedRowEnabled={true}
            >
        
              <Paging enabled={false} />
              <Sorting mode="none" />

              <Column dataField="fechaPedido" dataType="date" format="dd/MM/yyyy HH:mm:ss" />
              <Column dataField="importe" format={this.formatImporte} />
              <Column dataField="estado" />
              <Column dataField="fechaEstado" dataType="date" format="dd/MM/yyyy HH:mm:ss" />
              <Column dataField="agRetiro"/>
              <Column dataField="agAmiga"/>

              <Column type="buttons" width={110}
                buttons={['edit', {
                    hint: 'Retira en agencia amiga',
                    icon: 'repeat',
                    visible: this.isMostrarIconoCambioAgencia,
                    onClick: this.ClickCambiarAgenciaAmiga
                }]} />

            </DataGrid>

            {this.props.solicitudRetiros.paginado === true &&
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
                  placeholder={this.props.solicitudRetiros.currentPage+1} 
                  onBlur={(e) => {this.handleChangePagina(e)}}
              />

              <a onClick={this.addPage}><span style={{cursor:"pointer"}}className="iconify mr-1" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span></a>

              <a  onClick={this.lastPage} style={{cursor:"pointer"}} className="mr-1">
                <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span>
                <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false" style={{marginLeft:"-9px"}}></span>
              </a>
              {
              <span>de {this.props.solicitudRetiros.totalPages} ({this.props.solicitudRetiros.totalItems} registros) </span>
              
                } 
              </div>
            }
        </div>
      );
    }
  }

export default SolicitudRetiros;

