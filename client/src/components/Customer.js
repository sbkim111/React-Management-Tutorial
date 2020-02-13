import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class Customer extends React.Component {
    render() {
        return(
            <TableRow>
                <TableCell>{this.props.ID}</TableCell>
                <TableCell><img src={this.props.IMAGE} alt="profile"/></TableCell>
                <TableCell>{this.props.NAME}</TableCell>
                <TableCell>{this.props.BIRTHDAY}</TableCell>
                <TableCell>{this.props.GENDER}</TableCell>
                <TableCell>{this.props.JOB}</TableCell>
            </TableRow>
        );
    }
}

export default Customer;