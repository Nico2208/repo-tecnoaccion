import React from 'react'

export default function Row({usuario = []}) {
    return (
        <tr>
            <th scope="row">{usuario.id}</th>
            <td>{usuario.nombre + " " + usuario.apellido}</td>
            <td>{usuario.tipoDocumento}</td>
            <td>{usuario.documento}</td>
        </tr>
    )
}