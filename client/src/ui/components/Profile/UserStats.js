import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Spinner from './../Spinner/Spinner';
import IconLabelButtons from './../Buttons/IconLabelButtons';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';
import config from '../../../config';

const modalStyles = theme => ({
    paper: {
      position: 'absolute',
      width: theme.spacing.unit * 50,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing.unit * 4,
      outline: 'none',
    },
  });


const styles = theme => ({
});

const style = {
    inputcard: {
        maxWidth: 400,
        margin: 'auto',
        maxHeight: 400,
        textAlign: 'center'
        },
        media: {
          height: 90,
          width: 200,
          margin: 'auto',
      },
}


class UserStats extends Component {
    state = {
        handleUser: false,
        admin: false,
        active: false,
        user: "",
        fetching: false
    }

    getModalStyle() {
        const top = 10 ;
      
        return {
          margin: '0 auto',
          maxWidth: 340,
          position: 'relative',
          marginTop: 100
        };
      }


    renderEditClaims() {
        const { user, active, admin, handleUser, fetching } = this.state;
        return(
            <Modal 
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={handleUser}
              onClose={()=> this.setState({handleUser: false, user: "", fetching: false})}>
              <div className={modalStyles.paper} style={this.getModalStyle()}>
            <Card style={style.inputcard} raised>
              <CardContent>
                  <h1>Brukerrettigheter</h1>
                <FormControl component="fieldset">
                <FormLabel component="legend">Angi rettigheter</FormLabel>
                <FormGroup>
                    <FormControlLabel
                    control={<Switch checked={active} onChange={()=>this.setState({ active: !active})} value="active" />}
                    label="Aktiv"
                    />
                    <FormControlLabel
                    control={<Switch checked={admin} onChange={()=> this.setState({ admin: !admin})} value="admin" />}
                    label="Admin"
                    />
                </FormGroup>
                <FormHelperText>Bruker: {user}</FormHelperText>
            </FormControl>

              

              </CardContent>
              {fetching ? <Spinner/> :
                <div>
                    <IconLabelButtons type="Send" action={this.handleEditUserClaims} disabled={user.length < 1}/>
                    <IconLabelButtons type="Avbryt" action={() => this.setState({ handleUser: false, user: ""})} />
              </div> }
                
                <CardActionArea style={style.actionArea}>
                        <CardMedia style={style.media} image="https://imgur.com/Lr3KJIl.jpg" title="Budbua"/>
                </CardActionArea>
                </Card>
                </div>
            </Modal>
        )
      }
    handleEditUserClaims = async () => {
        const { user, active, admin } = this.state;
        const { phone } = this.props;
        console.log({ phone, sellerUid: user, active, admin });
        if(user) {
            this.setState({fetching: true});
            try {
                await axios.post(config.CLOUD_URL + 'editUserClaims', { phone, sellerUid: user, active, admin });
                this.setState({ fetching: false, handleUser: false});
            } catch(err) {
                console.log(err);
            }   
        }
    }

    render() {
        const { handleUser } = this.state;
        return (
            <div>
            <div style={{maxHeight: 400, overflowY: "scroll"}}>
                <Paper >
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>
                                Telefonnummer
                            </TableCell>
                            <TableCell align="right">ID</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.props.data.map(row => (
                            <TableRow key={row.id} onClick={() => {this.setState({user: row.id, handleUser: true})}}>
                            <TableCell component="th" scope="row" >
                                {row.id}
                            </TableCell>
                            <TableCell align="right">{row.id}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </Paper>
                </div>
            {handleUser ? this.renderEditClaims() : ""}
            </div>
            
        );
    }
}

export default withStyles(styles)(UserStats);