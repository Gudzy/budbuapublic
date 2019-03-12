import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import firebase from 'firebase/app';
import ReactFilestack from 'filestack-react';
import filestackConfig from '../../../filestackConfig';
import Image from 'material-ui-image';
import BudImage from './../../../eksempel-bilde-300x300.png';

import firebase from 'firebase/app';

import IconLabelButtons from './../Buttons/IconLabelButtons';
import { authenticate } from "./../../../store/actions/auth";
import CLOUD_URL from './../../../url';

import Spinner from './../Spinner/Spinner';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import TextField from '@material-ui/core/TextField';
import { Divider } from '@material-ui/core';

class Market extends Component {
    state = {
        title: '',
        startPrice: '',
        finishDate: '',
        finishTime: '20:00',
        searchKey: '',
        add: false,
        fetching: false,
        error: false,
        products: [],
        currentDate: '',
        currentTime: '',
        image: [],
        imageConverted: 'https://imgur.com/GkODyEp.jpg'
    }

    componentDidMount = async () => {
        this.fetchProducts();
        this.handleTime();
    }

    handleTime = async () => {
        var date = await new Date()
        var currentDate = date.toJSON().slice(0,10);
        var currentTime = date.toLocaleTimeString();

        //Two hours later than current time.
        var suggestedTime = await new Date(date.getTime() + 2*60*60*1000).toLocaleTimeString();

        this.setState({
            finishDate: currentDate,
            finishTime: suggestedTime,
            currentDate,
            currentTime
        });
    }

    fetchProducts = async () => {
        let { searchKey } = this.state;
        try {
            this.setState({fetching: true});
            let res = await axios.post(CLOUD_URL + 'getProducts',{
                searchKey
            });
            let products = res.data;
            products['id'] = res.id;
            this.setState({ products, fetching: false});
        } catch(err) {
            this.setState({error: true, fetching: false})
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const key = target.id;
        this.setState({
            [key]: value
        });
    }

    

    handleAddProduct = async () => {
        const { title, startPrice, finishDate, finishTime, imageConverted } = this.state;
        const { uid, email } = this.props.user;
        if( title && startPrice && finishDate && finishTime) {
            try {
                this.setState({fetching: true});
                try {
                    await axios.post(CLOUD_URL + 'addProduct', { title, startPrice: Math.abs(startPrice), uid, email, finishDate, finishTime, imageConverted });
                    this.setState({ fetching: false, add: false});
                    this.fetchProducts();
                } catch(err) {
                    this.setState({ restitle: 'Galt med vareregistrering', fetching: false});
                }
            } catch(err) {
                this.setState({ fetching: false, resprice: "Unvalid price"});
            }
        }
    }

    renderAddProduct() {
        const { title, startPrice, finishDate, finishTime, fetching, imageConverted } = this.state;
        /** 
        //Check users custom claims (persmissions).
        firebase.auth().currentUser.getIdTokenResult()
            .then((idTokenResult) => {
                //If active is false, user is banned
                var active = idTokenResult.claims.active;
                //If admin is true, the user has admin priveleges.
                var admin = idTokenResult.claims.admin;
            });
        */

        return(
            <div style={styles.container}>
            <Card style={styles.card} raised>
                    <h1>Varedetaljer</h1>
                <div style={styles.inputField}>
                    <TextField
                        required
                        id="title"
                        variant="outlined"
                        label="Varenavn"
                        type="String"
                        value={title}
                        onChange={this.handleChange}
                        helperText={"Maks 25 tegn"}
                    />
                </div>
                <div style={styles.inputField}>
                    <TextField
                        required
                        id="startPrice"
                        variant="outlined"
                        label="Startpris"
                        type="Number"
                        value={startPrice}
                        onChange={this.handleChange}
                        helperText={"Kroner"}
                    />
                </div>
                <div style={styles.dateField}>
                    <TextField
                        required
                        id="finishDate"
                        variant="outlined"
                        type="date"
                        value={finishDate}
                        onChange={this.handleChange}
                        helperText={"Sluttdato 📅"}
                    />
                    <TextField
                        required
                        id="finishTime"
                        variant="outlined"
                        type="time"
                        value={finishTime}
                        onChange={this.handleChange}
                        helperText={"Sluttidspunkt ⌚"}
                    />
                    </div>
                    <div style={styles.inputField}>
                        <ReactFilestack
                            apikey={filestackConfig.apiKey}
                            buttonText="Last opp bilde"
                            buttonClass="classname"
                            options={options}
                            onSuccess={this.getFiles.bind(this)}
                            preload={true}
                        />
                        <Image src={imageConverted} imageStyle={{paddingTop: 10, display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%'}} alt={BudImage}></Image>
                    </div>
                {fetching ? <Spinner/> :
                <div>
                    <IconLabelButtons type="Legg ut" action={this.handleAddProduct} disabled={this.disabled()}/>
                    <IconLabelButtons type="Avbryt" action={this.add} />
                </div>
                }
                <CardActionArea style={styles.actionArea}>
                        <CardMedia style={styles.media} image="https://imgur.com/Lr3KJIl.jpg" title="Budbua"/>
                </CardActionArea>
                </Card>
            </div>
        )
    }

    getFiles(file){
        //this.setState({ convertedImage: base64Image });
        var imageConverted = file.filesUploaded[0].url;
        this.setState({ imageConverted });
    }

    disabled = () => {
        const { title, startPrice, finishDate, finishTime, currentDate, currentTime } = this.state;
        var dateSet = new Date(finishDate + 'T' + finishTime);
        var dateNow = new Date (currentDate + 'T' + currentTime);
        return  title.length < 1                ||
                title.length > 25               ||
                startPrice.length < 1           ||
                startPrice < 0                  ||
                finishDate.length < 1           ||
                dateSet - dateNow <= 0          ||
                finishTime.length < 1;
    }

    add = () => {
        this.setState({add: !this.state.add})
    }

    renderProductList() {
    let { searchKey, products, fetching } = this.state;
    let { isAuthenticated } = this.props;
    const refTime = new Date(2018,1,1).getTime();
       return(
            <div style={styles.text2}>
                <div style={styles.inputField}>
                    <TextField
                        id="searchKey"
                        variant="outlined"
                        label="Søkeord"
                        type="String"
                        value={searchKey}
                        onChange={this.handleChange}
                    />
                    <IconLabelButtons type="Søk" action={this.fetchProducts}/>
                </div>
                {isAuthenticated ?
                    <IconLabelButtons type="Legg ut vare" action={this.add} />
                    :
                    <Link to='/login' style={{color: 'white', textDecoration: 'none'}}>
                        <IconLabelButtons type="Sign in" action={this.add} />
                    </Link>
                }
                <div style={styles.list}>
                {fetching ? <Spinner/> :
                <List component="nav">
                    {products.map(product =>
                        <Link key={product.id} to={{pathname: `/market/${product.id}`, search: product.id}} style={{color: 'white'}}>
                            <ListItem button >
                                <ListItemIcon>
                                    <StarIcon style={styles.StarIcon} />
                                </ListItemIcon>
                                <ListItemText inset primary={product.title} secondary={"Pris: " + product.startPrice + " kr, Frem til: " 
                            + (new Date(refTime+product.finishTimeInt)).toDateString()} />
                            </ListItem>
                            <Divider light />
                        </Link>
                    )}
                </List>}
                </div>
            </div>
        );
    }

    render() {
        return(
            <div>
                {this.state.add ? this.renderAddProduct() : this.renderProductList()}
            </div>
        )
    }
 }

 const options = {
    accept: 'image/*',
    maxFiles: 1,
    storeTo: {
      location: 's3',
    },
  };

 const styles = {
    StarIcon: {
        color: 'gold'
    },
    card: {
        maxWidth: 400,
        margin: 'auto',
        maxHeight: 860
    },
    container: {
        padding: 10
    },
    inputField: {
        width: '80%',
        margin: 'auto',
        padding: 6,
    },
    dateField: {
        widt: '80%',
        margin: 'auto',
        padding: 6,
    },
    link: {
        color: 'dodgerblue',
        textDecoration: 'none'
    },
    list: {
        width: '50%',
        margin: 'auto',
        color: 'paper',
        ListItem: { color: 'paper'},
    },
    text: {
        padding: 0,
    },
    text2: {
        padding: 24,
    },
    media: {
        height: 90,
        width: 200,
        margin: 'auto',
    },
    media2: {
        height: 150,
        width: 200,
        margin: 'auto',

    },
}

 const mapStateToProps = state => ({
    isAuthenticated: !_.isEmpty(state.auth.user),
    user: state.auth.user
})

export default connect( mapStateToProps, { authenticate } )( Market );
