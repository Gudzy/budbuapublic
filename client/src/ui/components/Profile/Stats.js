import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      minWidth: 300,
    },
  });

class Stats extends Component {

    render() {
        return (
            <Paper>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>
                        Statistikk
                    </TableCell>
                    <TableCell align="right">Antall</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {this.props.data.map(row => (
                    <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                        {row.name}
                    </TableCell>
                    <TableCell align="right">{row.number}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </Paper>
        );
    }
}

export default withStyles(styles)(Stats);