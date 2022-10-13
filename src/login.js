import React from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import $ from 'jquery';
import 'jquery-confirm';

import { Animated } from 'react-animated-css';
import { withRouter, Link } from 'react-router-dom';


class Login extends React.Component {
	
	
	constructor(props) {

		super(props);

		this.state = {};

		this.intentarLogin = this.intentarLogin.bind(this);
		this.afterSubmission = this.afterSubmission.bind(this);
			
	}

	intentarLogin() {
		
		var formBody = [];

		//$("#nroDocu").val()
		
		

		var campoUserName = encodeURIComponent("username");
		var valorUserName = encodeURIComponent($("#nroDocu").val());

		formBody.push(campoUserName + "=" + valorUserName);
		  
		var campoClave = encodeURIComponent("password");
		var valorClave = encodeURIComponent($("#clave").val());
		
		formBody.push(campoClave + "=" + valorClave);
		  
		formBody = formBody.join("&");

		let url = process.env.REACT_APP_WS_LOGIN;

		let cerrarSesion = false;
		let statusCode = "";

		fetch(url,{ 
			method: 'POST',
			headers:{
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: formBody
			}
			)
			.then(respPromise => {
				statusCode = respPromise.status;
				if (respPromise.status==process.env.REACT_APP_CODIGO_CERRO_SESION) 
					cerrarSesion = true;
				return respPromise.json();
			})
			.then(json => {

				if (json.status==="ok") {
					this.props.logueado(json.key, json.nombre, json.apellido , json.organizaciones);
					this.props.history.push('/');
				} else {
					this.props.mensajeErrorWS('Login',json.errores,cerrarSesion);
				}
				
			})
			.catch((error) => {
				this.props.mensajeErrorGeneral();
			})		
			;

	
	}

	afterSubmission(event) {
		event.preventDefault();
		this.intentarLogin();
	}
	
	render(){	
        return (
    
            <div>
                <Animated className="change-p" animationIn="fadeIn" isVisible={true}>
				<Form onSubmit = {this.afterSubmission} className="bg-light w-50 mx-auto rounded shadow p-3 mt-4" id="loginComp" >
	
					<div  className="bg-dark p-2 text-light"><legend className="text-center font-weight-bold"><span className="iconify mr-2" data-icon="eva:log-in-fill" data-inline="false"></span>Ingresar</legend></div>
	
					<FormGroup className="mt-4">
						<Label htmlFor="nroDocu"><span className="iconify mr-2" data-icon="bx:bxs-user" data-inline="false"></span>Usuario</Label>
						<Input type="text" name="nroDocu" id="nroDocu" placeholder="" onChange={this.handleChange} />
					</FormGroup>
			
					{/*<span className="text-danger text-small" style={{position:"relative",top:"-15px"}}>{this.state.errors.nroDocu}</span> */}
	
					<FormGroup>
							<Label htmlFor="clave"><span className="iconify mr-2" data-icon="bx:bxs-key" data-inline="false"></span>Clave</Label>
							<Input type="password" name="clave" id="clave" placeholder="" onChange={this.handleChange} />
					</FormGroup>
					{/*<span className="text-danger text-small" style={{position:"relative",top:"-15px"}}>{this.state.errors.clave}</span>*/}

					<br></br>
					
					<div className="row text-center pb-2">
						{/*<div className="col sm-4 text-center"><Button outline color="info"><Link className="text-info" to="#">Olvide Clave</Link></Button></div>*/}
						<div className="col sm-4" ><Button color="dark">Ingresar</Button></div>
					</div>
					
					
					
				</Form>	
			</Animated>	
            </div>
        )
	}
}    


export default withRouter(Login)
