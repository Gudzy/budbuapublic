import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactFilestack from 'filestack-react';
import Geocode from 'react-geocode';
//import firebase from 'firebase/app';

import config from '../../../config';
import BudImage from './../../../assets/img/eksempel-bilde-300x300.png';
import IconLabelButtons from './../Buttons/IconLabelButtons';
import { authenticate } from "./../../../store/actions/auth";
import CLOUD_URL from './../../../url';
import Spinner from './../Spinner/Spinner';
import Album from '../Album/Album';
import Modal from '@material-ui/core/Modal';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Image from 'material-ui-image';

export class Market extends Component {
    state = {
        title: '',
        startPrice: '',
        finishDate: '',
        finishTime: '20:00',
        searchKey: '',
        add: false,
        fetching: false,
        fetchingproducts: false,
        error: false,
        products: [],
        currentDate: '',
        currentTime: '',
        location: '',
        image: [],
        imageConverted: 'https://imgur.com/GkODyEp.jpg',
        lat: '',
        lng: ''
    }

    componentDidMount () {
        this.fetchProducts();
        this.handleTime();
        Geocode.setApiKey(config.geoCoderOptions.apiKey);
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
            this.setState({fetchingproducts: true});
            let res = await axios.post(CLOUD_URL + 'getProducts',{
                searchKey
            });
            let products = res.data;
            products['id'] = res.id;
            this.setState({ products, fetchingproducts: false});
        } catch(err) {
            this.setState({error: true, fetchingproducts: false})
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

    handleAdress = async () => {
        console.log("Hei");
        const res = await Geocode.fromAddress(this.state.location);
        const { lat, lng } = res.results[0].geometry.location;
        await this.setState({ lat, lng});
    }



    handleAddProduct = async () => {
        const { title, startPrice, finishDate, finishTime, imageConverted, location} = this.state;
        const { uid, email } = this.props.user;
        if( title && startPrice && finishDate && finishTime) {
            try {
                this.setState({fetching: true});
                try {
                    await this.handleAdress();
                    const { lat, lng } = this.state;
                    await axios.post(CLOUD_URL + 'addProduct', { title, startPrice: Math.abs(startPrice), uid, email, finishDate, finishTime, imageConverted, location, lat, lng });
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

    getModalStyle() {
        const top = 10 ;
      
        return {
          margin: '0 auto',
          maxWidth: 340,
          position: 'relative',
          marginTop: 20
        };
      }

    renderAddProduct() {
        const { title, startPrice, location, finishDate, finishTime, fetching, imageConverted } = this.state;
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
            <Modal 
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.add}
                disableAutoFocus={true}
                onClose={() => this.setState({ add: false, fetching: false})}>
                <div className={modalStyles.paper} style={this.getModalStyle()}>
                        <Card style={styles.inputcard} raised>
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
                                    helperText={"Kroner 💰"}
                                />
                            </div>
                            <div style={styles.inputField}>
                                <TextField
                                    required
                                    id="location"
                                    variant="outlined"
                                    label="Adresse, husnummer"
                                    type="String"
                                    value={location}
                                    onChange={this.handleChange}
                                    helperText={"Varelokasjon 📍"}
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
                                    apikey={config.fileStackApiKey}
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
            </Modal>
        )
    }

    getFiles(file){
        //this.setState({ convertedImage: base64Image });
        var imageConverted = file.filesUploaded[0].url;
        this.setState({ imageConverted });
    }
   

    disabled = () => {
        const { title, startPrice, finishDate, finishTime, currentDate, currentTime, lat, lng, location } = this.state;
        var dateSet = new Date(finishDate + 'T' + finishTime);
        var dateNow = new Date (currentDate + 'T' + currentTime);
        return  title.length < 1                ||
                title.length > 25               ||
                startPrice.length < 1           ||
                startPrice < 0                  ||
                finishDate.length < 1           ||
                dateSet - dateNow <= 0          ||
                location.length < 3             ||
                finishTime.length < 1;
    }

    add = () => {
        this.setState({add: !this.state.add})
    }

    renderProductList() {
    let { searchKey, products, fetchingproducts } = this.state;
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
                    <IconLabelButtons id="addButton" type="Legg ut vare" action={this.add} />
                    :
                    <Link to='/login' style={{color: 'white', textDecoration: 'none'}}>
                        <IconLabelButtons type="Sign in" action={this.add} />
                    </Link>
                }
                <div >
                {fetchingproducts ? <Spinner/> :
                <Album products={products}/>
                /**
                <List component="nav">
                    {products.map(product =>
                        <Link key={product.id} to={{pathname: `/market/${product.id}`, search: product.id}} style={{color: 'white'}}>
                            <Card style={styles.cardMarket}>
                            <Grid container wrap="nowrap">
                              <Grid style={styles.grid1}>
                                  <img style={styles.image} src={product.imageConverted} alt={BudImage}/>
                              </Grid>
                              <Grid>
                              <br />
                                <div style={styles.grid3}> {product.title} </div>
                                <div style={styles.grid2}>Pris: {product.startPrice} kr </div>
                                <div style={styles.grid2}> Frem til:  {(new Date(refTime+product.finishTimeInt)).toDateString()} </div>
                              </Grid>
                            </Grid>
                            </Card>
                        </Link>
                    )}
                </List>*/}
                </div>
            </div>
        );
    }

    render() {
        return(
            <div>
                {this.renderProductList()}
                {this.state.add ? this.renderAddProduct() : ""}
            </div>
        )
    }
 }


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
        maxHeight: 1200
    },
    cardMarket: {
        width: 350,
        margin: 'auto',
        height: 120,
        marginBottom:20,
    },
    inputcard: {
        maxWidth: 400,
        margin: 'auto',
        maxHeight: 550,
        textAlign: 'center',  
        overflowY: 'scroll'      
    },
    grid1: {
      height: 115,
      width: 100,
      border: '3px solid green',
    },
    grid2: {
      textAlign: "left",
      color: 'black'
    },
    grid3: {
      textAlign: "left",
      color: 'black',
      textWidth: 'bold',
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
    text: {
        padding: 0,
    },
    text2: {
        padding: 24,
        bottom: 0,
        marginBottom: 50,
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
    image: {
      marginTop:'15%',
      justifyItem: 'center',
      border: '3px solid blue',
      maxWidth: 80,
      maxHight: 80,
      borderRadius: 4,
    }
}

 const mapStateToProps = state => ({
    isAuthenticated: !_.isEmpty(state.auth.user),
    user: state.auth.user
})

export default connect( mapStateToProps, { authenticate } )( Market );
