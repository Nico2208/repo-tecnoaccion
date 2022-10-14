import React from 'react'
import { withRouter, Link } from 'react-router-dom';
import logoNav from './img/tiplotblanco.png';
import $ from "jquery"

class NavBar extends React.Component {

    constructor(props) {

        super(props);

        this.state = {};

        this.onClickCerrarSesion = this.onClickCerrarSesion.bind(this);
        this.guardarNuevaContraseñaUsr = this.guardarNuevaContraseñaUsr.bind(this)

    }

    onClickCerrarSesion() {
        this.props.cerrarSesion();
    }

    guardarNuevaContraseñaUsr() {
        let oldPass = $("#oldUsrPass").val()
        let pass = $("#usrPass").val()
        let matchPass = $("#matchUsrPass").val()

        let url = process.env.REACT_APP_WS_CAMBIAR_CLAVE_OPERADOR_LOGUEADO;

        let cerrarSesion = false;
        let statusCode = "";

        let parametros = {
            password: oldPass,
            newPassword: pass,
            matchingPassword: matchPass
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + this.props.getKeyLogin()
            },
            body: JSON.stringify(parametros)
        }
        )
            .then(respPromise => {
                statusCode = respPromise.status;
                if (respPromise.status === process.env.REACT_APP_CODIGO_CERRO_SESION) {
                    cerrarSesion = true;
                }
                return respPromise.json();
            })
            .then(json => {
                if (json.status === "ok") {

                    $('#usrPassModal').modal('toggle');

                } else if (json.status === "error") {
                    if (cerrarSesion) {
                        this.props.mensajeErrorWS('Actualizar Contraseña', json.errores, cerrarSesion);
                    } else {
                        this.props.mensajeErrorWS('Actualizar Contraseña', json.errores);
                    }
                }
            })
            .catch((error) => {
                this.props.mensajeErrorGeneral();
            })
            ;


    }

    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark pr-4 pl-4 shadow">
                <Link className="navbar-brand text-light" to="/">
                    <img src={logoNav} alt="logo" width="90px" />
                    <span className="ml-2 text-center text-small text-white mb-1 pt-0"> Ver: {this.props.version}</span>
                </Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse ml-4" id="navbarNavDropdown">
                    <ul className="navbar-nav">

                        {this.props.isLogueado() &&
                            <li className="nav-item">
                                <Link to="/clientes">Clientes</Link>
                            </li>
                        }

                        {/* this.props.isLogueado() &&
                        <li className="nav-item">
                            <Link to="/reportes">Reportes estándar</Link>
                        </li> */
                        }

                        {this.props.isLogueado() &&
                            <li className="nav-item">
                                <Link to="/reportesMedida">Reportes a Medida</Link>
                            </li>
                        }

                        {this.props.isLogueado() &&
                            <li className="nav-item">
                                <Link to="/cambioMasivoAg">Cambio masivo agencias</Link>
                            </li>
                        }

                        {/*this.props.isLogueado() &&
                        <li className="nav-item">
                            <Link to="/tablero">Tablero</Link>
                        </li>
                        */}

                        {this.props.isLogueado() &&
                            <li className="nav-item">
                                <Link to="/sistema">Sistema</Link>
                            </li>
                        }
                        {this.props.isLogueado() &&
                            <li className="nav-item">
                                <Link to="/test">test</Link>
                            </li>
                        }
                        {1 == 2 &&
                            <li className="nav-item">
                                <Link to="#">Listados</Link>
                            </li>
                        }

                        {1 == 2 &&
                            <li className="nav-item">
                                <Link to="#">Medios de Pago</Link>
                            </li>
                        }

                        {1 == 2 &&
                            <li className="nav-item">
                                <Link to="#">Reclamos</Link>
                            </li>
                        }

                        {this.props.isLogueado() &&
                            <li className="nav-item">
                                <Link to="#" onClick={this.onClickCerrarSesion}>Cerrar Sesión</Link>
                            </li>
                        }

                    </ul>
                </div>

                <div className="login">

                    {!this.props.isLogueado() &&
                        <Link to="/login">
                            <span>Ingresar</span>
                            <span className="iconify ml-2" data-icon="carbon:user-avatar-filled" data-inline="false" data-width='22px'></span>
                        </Link>
                    }

                    {this.props.isLogueado() &&

                        <div className="text-light" style={{ cursor: "pointer" }} onClick={() => $("#usrModal").modal("toggle")}>
                            <span>Hola, {this.props.nombreUsuario}</span>
                            <span className="iconify ml-2" data-icon="carbon:user-avatar-filled" data-inline="false" data-width='22px'></span>
                        </div>
                    }
                </div>

                <div className="modal fade" style={{ marginTop: "10%" }} id="usrModal" tabIndex="-1" role="dialog" aria-labelledby="usrModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="usrModallLabel">Detalle de usuario</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body p-4">
                                <h4><b>Nombre</b> {this.props.nombreUsuario}</h4>
                                <br></br>
                                <h4><b>Apellido</b> {this.props.apellidoUsuario}</h4>
                            </div>

                            <div className="modal-footer">
                                <div>
                                    <button className="btn btn-dark" onClick={() => $("#usrPassModal").modal("toggle")}>
                                        <span className="iconify mr-2 mb-1" data-icon="carbon:password" data-inline="false" width="15px"></span>
                                        <b>Cambiar Contraseña</b>
                                    </button>
                                </div>


                                <button className="btn btn-dark ml-3" onClick={this.onClickCerrarSesion} data-dismiss="modal">
                                    <span className="iconify mr-2 mb-1" data-icon="topcoat:cancel" data-inline="false" width="15px"></span>
                                    <b>Cerrar Sesion</b>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade" style={{ marginTop: "10%" }} id="usrPassModal" tabIndex="-1" role="dialog" aria-labelledby="usrPassModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="usrPassModallLabel">Cambiar Contraseña</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <form className="pl-4 pr-4">

                                    <div className="mt-2">
                                        <label>Contraseña</label>
                                        <br />
                                        <input className="customInput w-100" type="password" id="oldUsrPass" />
                                    </div>

                                    <div className="mt-2">
                                        <label>Nueva contraseña</label>
                                        <br />
                                        <input className="customInput w-100" type="password" id="usrPass" />
                                    </div>

                                    <div className="mt-4 mb-4">
                                        <label>Repetir Nueva contraseña</label>
                                        <br />
                                        <input className="customInput w-100" type="password" id="matchUsrPass" />
                                    </div>

                                </form>
                            </div>
                            <div className="modal-footer">

                                <div>
                                    <button className="btn btn-dark" onClick={this.guardarNuevaContraseñaUsr}>
                                        <span className="iconify mr-2 mb-1" data-icon="entypo:save" data-inline="false" width="15px"></span>
                                        <b>Guardar</b>
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
            </nav>
        )
    }

}



export default withRouter(NavBar)
