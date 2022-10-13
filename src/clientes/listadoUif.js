import React from 'react';
import DataGrid, { Column, Paging, Button , Sorting} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import Form,  {SimpleItem, Label, GroupItem} from 'devextreme-react/form';
import 'devextreme-react/text-area';
import $ from 'jquery';
import Moment from 'moment';


class ListadoUif extends React.Component { 

  constructor(props) {		
    super(props); 

    this.dataGridRef = React.createRef();

    this.handleListado                 = this.handleListado.bind(this);
    this.handleResolver               = this.handleResolver.bind(this); 
    this.addPage                       = this.addPage.bind(this);
    this.firstPage                     = this.firstPage.bind(this);
    this.lastPage                      = this.lastPage.bind(this);
    this.removePage                    = this.removePage.bind(this);
    this.ejecutarConsultaListadoUif    = this.ejecutarConsultaListadoUif.bind(this);
    this.formFieldDataChanged          = this.formFieldDataChanged.bind(this);
    this.inicializarListadoUif         = this.inicializarListadoUif.bind(this); 
    this.envioResolucionUif            = this.envioResolucionUif.bind(this)
    this.isMostrarResolver             = this.isMostrarResolver.bind(this)

    this.state = {
      idrow: "",
      
    }
   
    this.dateOptions = { 
      displayFormat: 'dd/MM/yyyy',
      pickerType: "calendar",
      format: "date",
    };

    this.dateOptionsView = { 
      displayFormat: "dd/MM/yyyy - HH:mm:ss",
      pickerType: "calendar",
      format: "date",
      readOnly: true
    };

    this.formatImporte = {
      displayFormat: '###,###,###,##0.00'
    }

  }

  get dataGrid() {
    return this.dataGridRef.current.instance;
  }

  isMostrarResolver(e) {
    return e.row.data.estado==="PENDIENTE";
  }

  envioResolucionUif(){

    var obsVal = $('#obsUif').val(); 
    var billeteraId = this.props.getIDBilletera(this.props.getOrganizacionSel())
    var fecha = encodeURIComponent(Moment(this.state.currentUif.fecha).format('YYYYMMDD'))


    let cerrarSesion = false;
    let statusCode = "";
    
    let url = process.env.REACT_APP_WS_RESOLVER_UIF;
    url = url.replace(":idBilletera", billeteraId)
    
    url= url + "?" + "fecha=" + fecha + "&comprobante=" + obsVal
   

    fetch(url,{ 
      method: 'POST',
      headers:{
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this.props.getKeyLogin()
      },
      body: {}
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

            $('#resolverModal').modal('toggle');
            this.props.ejecutarConsultaListadoUif();

        } else if (json.status==="error") {	
                if (cerrarSesion) {					
                  this.props.mensajeErrorWS('Resolver UIF',json.errores,cerrarSesion);
                } else {
                  this.props.mensajeErrorWS('Resolver UIF',json.errores);	
                }
              }
      })
      .catch((error) => {
        this.props.mensajeErrorGeneral();
        console.log(error)
      })		
      ;

  }

  formFieldDataChanged(e) {
    
    this.inicializarListadoUif();

    if(e.dataField==="fechaDesde") {

      this.props.cambioFechaDesdeUif(e.value);
    }

  

  }

  inicializarListadoUif() {
  
    this.props.inicializarListadoUif();

  }
 
  addPage(){

    if (Number($("#pagConsListadoUif").val())<this.props.listadoUif.totalPages) 
       $("#pagConsListadoUif").val(Number($("#pagConsListadoUif").val())+1);
    else
       $("#pagConsListadoUif").val(this.props.listadoUif.totalPages);

    this.ejecutarConsultaListadoUif(Number($("#pagConsListadoUif").val()));

  }

  firstPage(){
    $("#pagConsListadoUif").val(1); 
    this.ejecutarConsultaListadoUif(Number($("#pagConsListadoUif").val()));
  }

  lastPage(){
    $("#pagConsListadoUif").val(this.props.listadoUif.totalPages); 
    this.ejecutarConsultaListadoUif(Number($("#pagConsListadoUif").val()));
  }

  removePage(){
   
    if (Number($("#pagConsListadoUif").val())>1)
       $("#pagConsListadoUif").val(Number($("#pagConsListadoUif").val())-1);
    else
       $("#pagConsListadoUif").val(1); 

    this.ejecutarConsultaListadoUif(Number($("#pagConsListadoUif").val()));
 
  }

  handleResolver(e) {          
    let currentUif = e.row.data
    this.setState({
                    currentUif: currentUif
    })

    $("#obsUif").val("")
    $('#resolverModal').modal('toggle');
    
  }

  handleChangePagina(e) {

    if (e.target.value.length==0) return;
    if (!((Number($("#pagConsListadoUif").val())>=1) && 
       (Number($("#pagConsListadoUif").val())<=this.props.listadoUif.totalPages))) 
        this.ejecutarConsultaListadoUif(1);
    else
      this.ejecutarConsultaListadoUif(Number(e.target.value));

  }

  handleListado() {
    this.ejecutarConsultaListadoUif(1);
  }

  ejecutarConsultaListadoUif(pagina) {

    this.props.ejecutarConsultaListadoUif(pagina);

  }

  render() {

    return (

      <div id="data-grid-demo" className="bg-light p-3 border" style={{maxHeight: $("#panelResultados").height() - 45}}>
      
      <div className="mb-3">
        <Form formData={this.props.listadoUif.filtros} onFieldDataChanged={this.formFieldDataChanged} >
              <GroupItem cssClass="first-group" colCount={5}>
                <GroupItem colSpan={1}>
                <SimpleItem 
                    dataField="fechaDesde"
                    editorType="dxDateBox"
                    editorOptions={this.dateOptions}
                    >
                  <Label text="Desde"></Label>
                </SimpleItem>
                  
                </GroupItem>
  
                <GroupItem colSpan={1}>
                <SimpleItem//localhost:8704/api-operador/admin/reclamos
                    dataField="fechaHasta"
                    editorType="dxDateBox"
                    editorOptions={this.dateOptions}
                    value={this.props.listadoUif.filtros.fechaHasta}
                  >
                    <Label text="Hasta"></Label>
                </SimpleItem>
                </GroupItem>
  
                <GroupItem colSpan={1}>  
                  <SimpleItem
                    dataField="estado"
                    editorType="dxSelectBox"
                    editorOptions={
                      {items:["Pendientes", "Resueltos", "Todos"]}
                    }
                     />
                </GroupItem>

                <GroupItem colSpan={1}>
                
                  <button type="button"className="btn btn-dark" onClick={this.handleListado}>
                                  <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                  <b>Listado Uif</b>
                  </button>

                </GroupItem>
              </GroupItem>  
          </Form>
      </div>

      
        <DataGrid
          dataSource={this.props.listadoUif.items}
          showBorders={true}
          ref={this.dataGridRef}
          focusedRowKey={this.state.idrow}  
          keyExpr='id' 
          focusedRowEnabled={true}
        >

          <Paging enabled={false} />
          <Sorting mode="none" />

          <Column dataField="nombre" />
          <Column dataField="documento" />
          <Column dataField="estado" />
          <Column dataField="fecha" dataType="date" format="dd/MM/yyyy HH:mm:ss"/>
          <Column dataField="importe" format={this.formatImporte}/>

          <Column type="buttons" caption="Resolver">
                    <Button
                        icon="edit"
                        text="Resolver"
                        hint="Resolver"
                        visible={this.isMostrarResolver}
                        onClick={this.handleResolver}
                    />
          </Column>
        </DataGrid>

        {this.props.listadoUif.paginado === true &&
            <div className="mt-2">
              <label htmlFor="paginador">Pagina</label>

              <a  onClick={this.firstPage} style={{cursor:"pointer"}} className="ml-1">
                <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false" style={{marginRight:"-9px"}}></span>
                <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span>
              </a>

              <a onClick={this.removePage} ><span style={{cursor:"pointer"}}className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span></a>

              <input 
                  className="mr-1 ml-1 text-center" 
                  type="number" 
                  id="pagConsListadoUif" 
                  style={{width:"30px"}} 
                  placeholder={this.props.listadoUif.currentPage+1}
                  onBlur={(e) => {this.handleChangePagina(e)}}
              />

              <a onClick={this.addPage}><span style={{cursor:"pointer"}}className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span></a>

              <a  onClick={this.lastPage} style={{cursor:"pointer"}} className="mr-1">
                <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span>
                <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false" style={{marginLeft:"-9px"}}></span>
              </a>
              
              <span>de {this.props.listadoUif.totalPages} ({this.props.listadoUif.totalItems} registros) </span>
            </div>
            }

            <div className="modal fade" id="resolverModal" tabIndex="-1" role="dialog" aria-labelledby="resolverModal" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content mx-auto" style={{width:"60%"}}>
                  <div className="modal-header bg-dark text-light">
                    <h5 className="modal-title" id="resolverModal">Resolver UIF</h5>
                    <button type="button"className="text-light close" data-dismiss="modal" aria-label="Close"> 
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                     <Form formData={this.state.currentUif}>
                        <GroupItem cssClass="first-group" colCount={4}>

                            <GroupItem colSpan={4}>
                                <SimpleItem dataField="usuarioId" editorOptions= {{readOnly: true }} />
                            </GroupItem>

                            <GroupItem colSpan={4}>
                                <SimpleItem dataField="fecha" editorType="dxDateBox" editorOptions={this.dateOptionsView} />
                            </GroupItem>

                            <GroupItem colSpan={4}>
                                <div className="dx-field">
                                    <div className="dx-field-label" style={{width:"24%"}}>Comprobante:</div>
                                    <div className="dx-field-value" style={{width:"75%"}}>
                                        <textarea id="obsUif"></textarea>
                                    </div>
                                </div>
                            </GroupItem>

                        </GroupItem>
                     </Form>
                  </div>

                  <div className="modal-footer">


                    <div>
                    <button className="btn btn-dark" onClick={this.envioResolucionUif}>
                        <span className="iconify mr-2 mb-1" data-icon="ic:twotone-done-outline" data-inline="false" width="15px"></span>
                        <b>Resolver</b>
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

export default ListadoUif;
