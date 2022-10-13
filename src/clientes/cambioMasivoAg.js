import React from 'react';
import { Animated } from 'react-animated-css';
import { withRouter} from 'react-router-dom';
import $ from 'jquery';



class CambioMasivoAg extends React.Component{
    
    constructor(props) {

		super(props);
 
        this.getOrganizaciones = this.props.getOrganizaciones.bind(this);
        this.getKeyLogin = this.props.getKeyLogin.bind(this);

    }

    getAgenciaVieja() {
        return $("#agenciaVieja").val();
    }
    
    getAgenciaNueva() {
        return $("#agenciaNueva").val();
    }
    
    getOrgSeleccionada() {
        return $("#fieldorgSeleccionada").val();
    }

    handleCambioMasivoAgencia(objThis){
        
      
            let url = process.env.REACT_APP_WS_CAMBIO_MASIVO_AGENCIAS;
            let cerrarSesion = false;
            let statusCode = "";
            
            let parametros = {codigoOrganizacion: objThis.getOrgSeleccionada(),
                agenciaAntigua: objThis.getAgenciaVieja(),
                agenciaNueva: objThis.getAgenciaNueva()};
    
            fetch(url,{ 
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Bearer ' + this.props.getKeyLogin()
                },
                body:JSON.stringify(parametros)
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
                        objThis.props.mensajeErrorWS('Correcto', json.errores);
                        } else if (json.status==="error") {	
                            objThis.props.mensajeErrorWS('Error',json.errores);  
                        }
                })
                .catch((error) => {
                    this.props.mensajeErrorGeneral("Error", error);
                })		
                ;		
    
    }

    render(){
        let jsxOrganizacionesHabCliente = null;
        if (this.props.getOrganizaciones() !== undefined) {
            jsxOrganizacionesHabCliente = this.props.getOrganizaciones().map(
            (organizacion) => 
            <option  key={organizacion.codigo} value={organizacion.codigo}>{organizacion.descripcion}</option>
            );
        };

        return(
            <Animated animationIn="fadeIn">
            <div className=" bg-light pr-3 pl-3 pt-2 mt-1 shadow mx-auto">    
                    <div className="row pb-2 w-75 mx-auto">

                    <div className="col-sm-5 mt-2">
                            <label htmlFor="fieldorgSeleccionada" className="mr-2"><b>Seleccione Organización</b></label>
                            <select name="org" id="fieldorgSeleccionada" >
                                {jsxOrganizacionesHabCliente}
                            </select>
                        </div>

                        <div className="col-sm-3 mt-2">
                            <label htmlFor="agenciaVieja" className="mr-2"><b>Agencia vieja</b></label>
                            <input type='text' id='agenciaVieja' style={{width:'20%'}}></input>
                        </div>

                        <div className="col-sm-3 mt-2">
                            <label htmlFor="agenciaNueva" className="mr-2"><b>Agencia nueva</b></label>
                            <input type='text' id='agenciaNueva' style={{width:'20%'}}></input>
                        </div>
                        
                    </div>

                    <button type="button" className="btn btn-dark" onClick={() => this.handleCambioMasivoAgencia(this)}>
                            <b>Ejecutar cambio agencia</b>
                    </button>
                </div>
            </Animated>
        );
    }
}
export default withRouter(CambioMasivoAg);
