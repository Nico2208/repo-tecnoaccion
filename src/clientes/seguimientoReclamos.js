/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import DataGrid, { Column, Pager, Paging, Sorting , Button} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';

import $ from 'jquery';
import fetchTimeout from 'fetch-timeout';

import Form, {
    SimpleItem,
    GroupItem,
    Label
} from 'devextreme-react/form';
import 'devextreme-react/text-area';
import moment from 'moment';


class SeguimientoReclamo extends React.Component {

    constructor(props) {
        super(props);

        this.dataGridRef = React.createRef();
        this.state = {
            idrow:null,
            reclamos: null,
            verReclamo: []
        }
        this.dateOptions = {
            displayFormat: 'dd/MM/yyyy',
            pickerType: "calendar",
            format: "date",
        };
        this.addPage = this.addPage.bind(this);
        this.removePage = this.removePage.bind(this);
        this.firstPage = this.firstPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
        this.formFieldDataChanged = this.formFieldDataChanged.bind(this);
        this.handleVerReclamo = this.handleVerReclamo.bind(this);
        this.handleEditarReclamo = this.handleEditarReclamo.bind(this);
        this.onFocusedRowChanged = this.onFocusedRowChanged.bind(this);
        this.nuevoReclamo=this.nuevoReclamo.bind(this);
        this.inicializarConsultaReclamos=this.inicializarConsultaReclamos.bind(this);
        this.traerFallas=this.traerFallas.bind(this);
        this.ClickNuevoTicket = this.ClickNuevoTicket.bind(this);
        this.ClickEditarReclamo=this.ClickEditarReclamo.bind(this);
        this.ejecutarConsultaReclamos = this.ejecutarConsultaReclamos.bind(this);
        this.inicializarReclamos=this.inicializarReclamos.bind(this);
    }


    componentDidMount(){
        this.traerFallas();
        this.inicializarReclamos();
    }

    traerFallas(){
        let cerrarSesion = false;
        let statusCode = "";
        let url= process.env.REACT_APP_WS_LISTADO_FALLAS;
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
                    this.setState({fallas: json.fallas})
                } else if (json.status==="error") {
                    if (cerrarSesion) {
                        this.props.mensajeErrorWS('Traer fallas',json.errores,cerrarSesion);
                    } else {
                        this.props.mensajeErrorWS('Traer fallas',json.errores);
                    }
                }
            }
            )
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
    }


    nuevoReclamo(falla,observaciones){
        this.props.nuevoReclamo(falla,observaciones);
    }

    inicializarReclamos(){
        this.setState({reclamos: this.props.reclamos})
    }

    get dataGrid() {
        return this.dataGridRef.current.instance;
      }

    ClickNuevoTicket(){
        let objThis = this;
        let jsxFallas = "";
        if (this.state.fallas !== undefined) {
            this.state.fallas.map(
            (falla) =>
            jsxFallas = jsxFallas+ '<option key="'+falla.id+ '" value="' + falla.id+'">'+falla.nombre+'</option>'
            );
        }
        $.confirm({
         title: 'Abrir Reclamo',
         content: '' +
         '<form action="" class="nuevoReclamo">' +
         '<div className="form-group col-sm-5 mt-2">' +
         '<label htmlFor="fieldFallaSeleccionada" className="mr-2"><b>Seleccione Falla</b></label>' +
         '<select name="falla" id="fieldFallaSeleccionada" > ' +
         jsxFallas +
         '</select>' +
         '<br/>' +
         '<label>Observaciones</label>' +
         '<textarea type="text" id="fallaObservaciones" placeholder="Observaciones" class="observaciones form-control" required></textarea>' +
         '</div>' +
         '</form>',
         buttons: {
             formSubmit: {
                 text: 'submit',
                 btnClass: 'btn-blue',
                 action : ()=>{
                    var fallaSeleccionada = $("#fieldFallaSeleccionada option:selected").val();
                    let observaciones = $("#fallaObservaciones").val();
                    objThis.nuevoReclamo(fallaSeleccionada,observaciones)
                 }
             },
             cancel: function () {
             },
         },
    });
    }
    verificarFalla(reclamoSeleccionado, falla, jsxFallas){
        if(reclamoSeleccionado.nombreFalla === falla.nombre){
            jsxFallas = jsxFallas+ '<option key="'+falla.id+ '" value="'+falla.id+'" selected="'+falla.id+'">'+falla.nombre+'</option>'
        }else{
            jsxFallas = jsxFallas+ '<option key="'+falla.id+ '" value="' +falla.id+'">'+falla.nombre+'</option>'
        }
        return jsxFallas
    }
    ClickEditarReclamo(){
        let objThis = this;
        let jsxFallas = "";
        let reclamoAseleccionar = this.state.reclamos.reclamos.filter((reclamo => reclamo.id === this.state.idrow));
        let reclamoSeleccionado = reclamoAseleccionar[0];
        if (this.state.fallas !== undefined) {
            this.state.fallas.map(
            (falla) => 
             jsxFallas = this.verificarFalla(reclamoSeleccionado, falla, jsxFallas)
            );
        }
        $.confirm({
         title: 'Editar Reclamo',
         content: '' +
         '<form action="" class="nuevoReclamo">' +
         '<div className="form-group col-sm-5 mt-2">' +
         '<label htmlFor="fieldFallaSeleccionada" className="mr-2"><b>Seleccione Falla</b></label>' +
         '<select name="falla" id="fieldFallaSeleccionada">' +
         jsxFallas +
         '</select>' +
         '<br/>' +
         '<label>Observaciones</label>' +
         '<textarea type="text" id="fallaObservaciones" placeholder="Observaciones" class="observaciones form-control" required></textarea>' +
         '<label htmlFor="fieldEstadoSeleccionado" className="mr-2"><b>Seleccione Estado</b></label>' +
         '<select name="abierto" id="fieldEstadoSeleccionado" > ' +
         '<option key="abierto" value="true">Abierto</option>' +
         '<option key="cerrado" value="false">Cerrado</option>' +
         '</select>' +
         '</div>' +
         '</form>',
         buttons: {
             formSubmit: {
                 text: 'submit',
                 btnClass: 'btn-blue',
                 action : ()=>{
                    let fallaSeleccionada = $("#fieldFallaSeleccionada option:selected").val();
                    let observaciones = $("#fallaObservaciones").val();
                    let estado = $("#fieldEstadoSeleccionado").val();
                    objThis.handleEditarReclamo(estado,fallaSeleccionada, observaciones)
                 }
             },
             cancel: function () {
             },
         }
    });
    }

     ejecutarConsultaReclamos(pagina){
         this.props.ejecutarConsultaReclamos(pagina);
     }

     handleVerReclamo() {
        this.dataGrid.getSelectedRowsData();
        this.props.handleVerReclamo();
        $('#reclamoView').modal('toggle');
    }

    handleEditarReclamo(abierto, fallaId, observaciones) {
        this.dataGrid.getSelectedRowsData();
        this.props.handleEditarReclamo(abierto, fallaId, observaciones);
    }

    inicializarConsultaReclamos(){
        this.props.inicializarConsultaReclamos();
    }

    formFieldDataChanged(e) {
        this.inicializarConsultaReclamos();
        if (e.dataField === "fechaDesde") {
            this.props.cambioFechaDesdeReclamos(e.value);
        }
    }

    firstPage() {
        $("#pagConsReclamos").val(1);
        this.ejecutarConsultaReclamos(Number($("#pagConsReclamos").val()));
    }

    lastPage() {

        $("#pagConsReclamos").val(this.props.reclamos.totalPages);
        this.ejecutarConsultaReclamos(Number($("#pagConsReclamos").val()));

    }

    addPage() {
        if (Number($("#pagConsReclamos").val()) < this.props.reclamos.totalPages)
            $("#pagConsReclamos").val(Number($("#pagConsReclamos").val()) + 1);
        else
            $("#pagConsReclamos").val(this.props.reclamos.totalPages);
        this.ejecutarConsultaReclamos(Number($("#pagConsReclamos").val()));
    }

    removePage() {
        if (Number($("#pagConsReclamos").val()) > 1)
            $("#pagConsReclamos").val(Number($("#pagConsReclamos").val()) - 1);
        else
            $("#pagConsReclamos").val(1);

        this.ejecutarConsultaReclamos(Number($("#pagConsReclamos").val()));
    }

    handleChangePagina(e) {
        if (e.target.value.length == 0) return;
        if (!((Number($("#pagConsReclamos").val()) >= 1) &&
            (Number($("#pagConsReclamos").val()) <= this.props.reclamos.totalPages)))
            this.ejecutarConsultaReclamos(1);
        else
            this.ejecutarConsultaReclamos(Number(e.target.value));
    }

    onFocusedRowChanged(e) {

        const dataRow = e.row && e.row.data;
        this.setState({idrow: e.component.option('focusedRowKey')})
        if (dataRow) {
          this.props.setIdReclamoSeleccionado(dataRow.id);
        } else {
          this.props.setIdReclamoSeleccionado(null);
        }
      }

    render() {
        return (
            <div className="bg-light p-3 border" style={{ maxHeight: $("#panelResultados").height() - 45 }}>

                <div className="mb-3">
                    <Form formData={this.props.reclamos.filtros} onFieldDataChanged={this.formFieldDataChanged}>
                        <GroupItem cssClass="first-group" colCount={9}>
                            <GroupItem colSpan={2}>
                                <SimpleItem
                                    dataField="fechaDesde"
                                    editorType="dxDateBox"
                                    editorOptions={this.dateOptions}
                                    value={this.props.reclamos.filtros.fechaDesde}
                                >
                                    <Label text="Desde"></Label>
                                </SimpleItem>
                            </GroupItem>

                            <GroupItem colSpan={2}>
                                <SimpleItem
                                    dataField="fechaHasta"
                                    editorType="dxDateBox"
                                    editorOptions={this.dateOptions}
                                    value={this.props.reclamos.filtros.fechaHasta}
                                >
                                    <Label text="Hasta"></Label>
                                </SimpleItem>
                            </GroupItem>


                        </GroupItem>
                        <GroupItem colCount={9}>
                        <GroupItem colSpan={4}>
                                <button type="button"className="btn btn-dark" onClick={this.ejecutarConsultaReclamos}>
                                    <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                    <b>CONSULTA</b>
                                </button>
                            </GroupItem>
                            <GroupItem colSpan={2}>
                            <SimpleItem
                                dataField="estado"
                                editorType="dxSelectBox"
                                editorOptions={
                                {items:["Abiertos", "Cerrados", "Todos"]}
                                }
                                />
                            </GroupItem>
                            <GroupItem colSpan={3}>
                                <button type="button"className="btn btn-dark" onClick={this.ClickNuevoTicket}>
                                    <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                    <b>NUEVO</b>
                                </button>
                            </GroupItem>
                        </GroupItem>


                    </Form>
                </div>


                <DataGrid
                    dataSource={this.props.reclamos.reclamos}
                    showBorders={true}
                    ref={this.dataGridRef}
                    focusedRowKey={this.state.idrow}
                    keyExpr='id'
                    focusedRowEnabled={true}
                    onFocusedRowChanged={this.onFocusedRowChanged}>
                    <Paging enabled={false} />
                    <Sorting mode="none" />
                    <Column dataField="fechaApertura" dataType="date" format="dd/MM/yyyy HH:mm" />
                    <Column dataField="fechaModificacion" dataType="date" format="dd/MM/yyyy HH:mm" />
                    <Column dataField="abierto" dataType="boolean"/>
                    <Column dataField="nombreFalla" />
                    <Column type="buttons" caption="Ver Reclamo">
                    <Button
                        icon="search"
                        text="Ver Reclamo"
                        hint="Ver Reclamo"
                        onClick={this.handleVerReclamo}
                    />
                    </Column>
                    <Column type="buttons" caption="Editar Reclamo">
                    <Button
                        icon="edit"
                        text="Editar reclamo"
                        hint="Editar reclamo"
                        onClick={this.ClickEditarReclamo}
                    />
                    </Column>
                </DataGrid>

                {this.props.reclamos.paginado === true &&
                    <div className="mt-2">
                        <label htmlFor="paginador">Pagina</label>

                        <a onClick={this.firstPage} style={{ cursor: "pointer" }} className="ml-1">
                            <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false" style={{ marginRight: "-9px" }}></span>
                            <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span>
                        </a>

                        <a onClick={this.removePage} ><span style={{ cursor: "pointer" }}className="iconify ml-1" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span></a>

                        <input
                            className="mr-1 ml-1 text-center"
                            type="number"
                            id="pagConsReclamos"
                            style={{ width: "30px" }}
                            placeholder={this.props.reclamos.currentPage + 1}
                            onBlur={(e) => { this.handleChangePagina(e) }}
                        />

                        <a onClick={this.addPage}><span style={{ cursor: "pointer" }}className="iconify mr-1" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span></a>
                        <a onClick={this.lastPage} style={{ cursor: "pointer" }} className="mr-1">
                            <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span>
                            <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false" style={{ marginLeft: "-9px" }}></span>
                        </a>
                        {
                            <span>de {this.props.reclamos.totalPages} ({this.props.reclamos.totalItems} registros) </span>
                        }
                    </div>
                } 
                <div className="modal fade" style={{marginTop: "2.5%"}} id="reclamoView" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog shadow" role="document" style={{maxWidth:"75%", height:"85%", backgroundColor:"white"}}>
                    <div className="modal-content" style={{overflowY:"scroll", overflowX:"hidden", height:"100%", border:"none"}}>
                        <div style={{position:"sticky", top:"0", zIndex:"2"}}className="modal-header bg-dark">

                        <h5 className="modal-title text-light" id="exampleModalLabel">Reclamo</h5>
                        <button type="button"className="close text-light" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>

                        </div>

                    <div className="modal-body row">
                        <div className="col-sm-12">
                        <h3 className="text-center mb-">Detalles</h3>
                        <div className="row p-3 mt-3">
                            <table className="col-12 w-75 mx-auto table-fixed">
                                <thead>
                                    <th>Observaciones</th>
                                    <th>Fecha</th>
                                    <th>Operador</th>
                                </thead>
                                <tbody>
                                    {this.props.reclamos.verReclamo!=null && this.props.reclamos.verReclamo!== undefined && this.props.reclamos.verReclamo.map(
                                    (reclamo,index) =>
                                        <tr key={index}>
                                            <td>{reclamo.observaciones}</td>
                                            <td>{moment(reclamo.fecha).format('DD/MM/YYYY')}</td>
                                            <td>{reclamo.operador.username}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
)}
}

export default SeguimientoReclamo;