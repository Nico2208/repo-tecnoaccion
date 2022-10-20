import React from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import $ from 'jquery';
import 'jquery-confirm';
import "./scss/login.css"
import { Animated } from 'react-animated-css';
import { withRouter, Link } from 'react-router-dom';



/*


function Login ( props ) {

	const[ estado, setEstado ] = useState( {
		inputFocus: true,
		valueInputEmail: ''
	} )


	const navigate = useNavigate()

	const showPassword = () => {
		if(document.querySelector("#clave").type == 'password'){
			document.querySelector("#clave").type = 'text'
		}else{
			document.querySelector("#clave").type = 'password'
		}
	}

	const handleChange = ( event, pos ) => {

		//HTML DOM Element classList devuelve los atributos de clase de 
		// un elemento html. Permite agregar o quitar clases a un elemento html.

		value = event.target.value
		setEstado( { ...estado, [ estado.valueInputEmail ]: value } )

		const labels = document.querySelectorAll( ".label_g" )

		labels.forEach( label => {
			if ( value.lenght === 0 ) {
				label.classList.remove( "focus" )
			} else {
				label.classList.add( "focus" )
			}
		} )
	}


	const intentarLogin = () => {

		//EncodeURIComponent: codifica una URI a una secuencia utf-8
		// encodeURIComponent(uriComponent)
		//uriComponent puede ser un string, booleano, null, undefined que va a ser codificado a su equivalente utf-8
		// encodeURIComponent toma una variable que es convertida a string para luego ser codificado a un componente URI
		// encodeURIComponent devuelve un string


		formBody = []

		var campoUserName = encodeURIComponent("username");

		var valorUserName = encodeURIComponent($("#nroDocu").val());

		formBody.push(campoUserName + "=" + valorUserName);

		var valorClave = encodeURIComponent($("#clave").val());

		formBody.push(campoClave + "=" + valorClave);

		formBody = formBody.join("&");

		//El método join() une todos los elementos de un array en una cadena y devuelve esta cadena.
		//arr.join([separator]) separator se coloca entre todos los elementos del array

		let url = process.env.REACT_APP_WS_LOGIN;



		//The process.env property is an inbuilt application programming interface of the process module which is used to get the user environment. 
		//Entonces process.env es una interface del modulo process de node.js que sirve para traer info del environment del usuario.

		//According to MDN, The WebSocket API is an advanced technology that makes it possible to open a two-way interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply, Simply WebSocket helps you maintain two-way communication between the client(in my case React app) and the Server.

		let cerrarSesion = false;
		let statusCode = "";

		const enviar =  async () => {
			try {
				const data = await fetch ( 
					url, { 
						method: 'POST', 
						headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
						body: formBody  
					} 
				)
				.then( respPromise => {

					statusCode = respPromise.status;

					if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION) {
						cerrarSesion = true }

					return respPromise.json();
				} )
				.then(json => {
					if (json.status === "ok") {
						props.logueado(json.key, json.nombre, json.apellido, json.organizaciones)
						//Aca isLogueado pasa a True
						navigate('/');
					} else {
						props.mensajeErrorWS('Login', json.errores, cerrarSesion);
					}

				})
			} catch((error) {
				props.mensajeErrorGeneral();
			}
		}
	}

	const afterSubmission = event => {
		event.preventDefault();
		intentarLogin();
	}

	return (

		<div>

			<Animated className="change-p" animationIn="fadeIn" isVisible={true}>
				<Form onSubmit={afterSubmission} className="bg-light w-50 mx-auto rounded shadow p-3 mt-4" id="loginComp" >

					<h1>Ingresar</h1>

					<FormGroup className="mt-4 input_group">

						<Label htmlFor="nroDocu" className="label_g"><span className="iconify mr-2" data-icon="bx:bxs-user" data-inline="false"></span>Usuario</Label>

						<Input type="text" className="input_g" name="nroDocu" id="nroDocu" placeholder="" onChange={handleChange} onClick={() => this.saludar()} />

					</FormGroup>

					//{<span className="text-danger text-small" style={{position:"relative",top:"-15px"}}>//{this.state.errors.nroDocu}</span>}

					<FormGroup className='input_group'>

						<Label htmlFor="clave" className="label_g">
							<span className="iconify mr-2" data-icon="bx:bxs-key" data-inline="false"></span>Clave
						</Label>
						
						<Input type="password" className="input_g" name="clave" id="clave" placeholder="" onChange={handleChange} onClick={() => this.saludar()} />

						<div className='btn_pwd' onClick={() => this.showPassword()}><span className="iconify mr-2 eye-pwd" data-icon="akar-icons:eye" data-inline="false"></span></div>

					</FormGroup>

					//{<span className="text-danger text-small" style={{position:"relative",top:"-15px"}}>{this.state.errors.clave}</span>}

					<br></br>

					<div className="row text-center pb-2">

						//{<div className="col sm-4 text-center"><Button outline color="info"><Link className="text-info" to="#">Olvide Clave</Link></Button></div>}

						<div className="col sm-4" >
							<Button className="btn_ingresar w-100">Ingresar</Button>
						</div>

					</div>
					
				</Form>

			</Animated>

		</div>

	)

}

export default Login

*/


class Login extends React.Component {


	constructor(props) {

		super(props);

		this.state = {
			inputFocus: true,
			valueInputEmail: ''
		};

		this.intentarLogin = this.intentarLogin.bind(this);
		this.afterSubmission = this.afterSubmission.bind(this);
		this.showPassword = this.showPassword.bind(this)
		this.saludar = this.saludar.bind(this);
	}
	showPassword() {
		if(document.querySelector("#clave").type == 'password'){
			document.querySelector("#clave").type = 'text'
		}else{
			document.querySelector("#clave").type = 'password'
		}
	} //Listo


	saludar() {
	}
	handleChange(event, pos) {
		this.setState({
			valueInputEmail: event.target.value
		})
		const labels = document.querySelectorAll(".label_g")

		labels.forEach(label => {
			if (event.target.value.length === 0) {
				label.classList.remove("focus")
			} else {
				label.classList.add("focus")
			}
		})
	}  //Listo


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

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: formBody
		}
		)
			.then(respPromise => {
				statusCode = respPromise.status;
				if (respPromise.status == process.env.REACT_APP_CODIGO_CERRO_SESION)
					cerrarSesion = true;
				return respPromise.json();
			})
			.then(json => {

				if (json.status === "ok") {
					this.props.logueado(json.key, json.nombre, json.apellido, json.organizaciones);
					//Aca isLogueado pasa a True
					this.props.history.push('/');
				} else {
					this.props.mensajeErrorWS('Login', json.errores, cerrarSesion);
				}

			})
			.catch((error) => {
				this.props.mensajeErrorGeneral();
			})
			;


	} //Listo

	afterSubmission(event) {
		event.preventDefault();
		this.intentarLogin();
	} //Listo

	render() {
		return (

			<div>
				<Animated className="change-p" animationIn="fadeIn" isVisible={true}>
					<Form onSubmit={this.afterSubmission} className="bg-light w-50 mx-auto rounded shadow p-3 mt-4" id="loginComp" >

						<h1>Ingresar</h1>

						<FormGroup className="mt-4 input_group">
							<Label htmlFor="nroDocu" className="label_g"><span className="iconify mr-2" data-icon="bx:bxs-user" data-inline="false"></span>Usuario</Label>
							<Input type="text" className="input_g" name="nroDocu" id="nroDocu" placeholder="" onChange={this.handleChange.bind(this)} onClick={() => this.saludar()} />
						</FormGroup>

						{/*<span className="text-danger text-small" style={{position:"relative",top:"-15px"}}>{this.state.errors.nroDocu}</span> */}

						<FormGroup className='input_group'>
							<Label htmlFor="clave" className="label_g"><span className="iconify mr-2" data-icon="bx:bxs-key" data-inline="false"></span>Clave</Label>
							<Input type="password" className="input_g" name="clave" id="clave" placeholder="" onChange={this.handleChange.bind(this)} onClick={() => this.saludar()} />
							<div className='btn_pwd' onClick={() => this.showPassword()}><span className="iconify mr-2 eye-pwd" data-icon="akar-icons:eye" data-inline="false"></span></div>
						</FormGroup>
						{/*<span className="text-danger text-small" style={{position:"relative",top:"-15px"}}>{this.state.errors.clave}</span>*/}

						<br></br>

						<div className="row text-center pb-2">
							{/*<div className="col sm-4 text-center"><Button outline color="info"><Link className="text-info" to="#">Olvide Clave</Link></Button></div>*/}
							<div className="col sm-4" >
								<Button className="btn_ingresar w-100">Ingresar</Button>
							</div>
						</div>



					</Form>
				</Animated>
			</div>
		)
	}
}


export default withRouter(Login)
